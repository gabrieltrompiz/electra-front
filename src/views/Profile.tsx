import React, { useState, Fragment, forwardRef, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Profile as ProfileI, State, GitHubUser } from '../types';
import { setShownProfile, setUser } from '../redux/actions';
import { remote } from 'electron';
import { useApolloClient } from '@apollo/react-hooks';
import { logInfo, logError } from '../utils';
import { GENERATE_GITHUB_TOKEN, GET_GITHUB_USER, CHECK_EMAIL, CHECK_USERNAME, EDIT_PROFILE } from '../graphql';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import Loading from '../components/Loading';
import * as EmailValidator from 'email-validator';

/**
 * Profile View to check or modify self profile or see other users profile
 * @visibleName Profile View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Profile: React.RefForwardingComponent<HTMLDivElement, ProfileProps> = ({ loggedUser, user = loggedUser, setShownProfile, setUser }, ref) => {
  const [name, setName] = useState<string>(user.fullName);
  const [username, setUsername] = useState<string>(user.username);
  const [email, setEmail] = useState<string>(user.email);
  const [loadingToken, setLoadingToken] = useState<boolean>(false);
  const [token, setToken] = useState<string>(user.gitHubToken);
  const [gitHubUser, setGitHubUser] = useState<GitHubUser>(user.gitHubUser);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pictureUrl, setPictureUrl] = useState<string>(user.pictureUrl);

  const client = useApolloClient();

  const fileInput = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const own = !!user;

  useEffect(() => {
    if(token) getGitHubUser();
    // eslint-disable-next-line
  }, [token]);
  
  useEffect(() => {
    if(file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        imgRef.current.src = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  }, [file]);

  const close = () => {
    setShownProfile(null);
  };

  /** Creates an Apollo-Link to GitHub API and requires basic user information with token generated before
   * @async
   * @function getGitHubUser */
  const openGitHubWindow = async () => {
    let hasCode = false;
    setLoadingToken(true);
    const { BrowserWindow } = remote;
    const win = new BrowserWindow({
      width: 700,
      height: 500,
      resizable: false,
      webPreferences: {
        nodeIntegration: false, 
        webSecurity: false
      },
      parent: remote.getCurrentWindow()
    });
    win.webContents.session.clearStorageData();
    win.loadURL('https://github.com/login/oauth/authorize?client_id=ea3c96b4c3db26131d73&scope=user');
    win.webContents.on('did-navigate', async (_, url) => {
      if(url.includes('code=')) {
        hasCode = true;
        win.close();
        const result = await client.mutate<TokenPayload, TokenVars>({ variables: { code: url.split('?')[1].replace('code=', '').trim() }, 
          mutation: GENERATE_GITHUB_TOKEN, errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => setLoadingToken(false));
        if(result.data && result.data.generateGitHubToken) {
          setToken(result.data.generateGitHubToken.code);
          logInfo('GitHub authorization token generated')
        } 
        if(result.errors) result.errors.forEach((e) => logError(e.message));
      }
    });
    win.on('close', () => {
      if(!hasCode) {
        logError('Error while linking GitHub account.');
        setLoadingToken(false);
        setToken(null);
      }
    });
    win.show();   
  };

  /** Creates an Apollo-Link to GitHub API and requires basic user information with token generated before
   * @async
   * @function getGitHubUser */
  const getGitHubUser = async () => {
    const link = createHttpLink({
      uri: 'https://api.github.com/graphql'
    });
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      }
    }));
    const ghClient = new ApolloClient({
      link: authLink.concat(link),
      cache: new InMemoryCache()
    });
    const result = await ghClient.query<UserPayload>({ query: GET_GITHUB_USER, errorPolicy: 'all', fetchPolicy: 'no-cache' });
    if(result.data && result.data.viewer) {
      setGitHubUser(result.data.viewer);
    }
    if(result.errors) result.errors.forEach((e) => logError(e.message));
    ghClient.stop();
  };

  /** Resets GitHub user to null and token to an empty string. User will have to login with GitHub again.
   * @function unlinkAccount */
  const unlinkAccount = () => {
    setToken('');
    setGitHubUser(null);
    logInfo('GitHub account unlinked');
    if(imgRef.current.src === gitHubUser.avatarUrl) {
      imgRef.current.src = require('../assets/images/default-pic.png');
    }
  };

  /** Checks that all inputs are valid.
   * @async
   * @function validateInputs
   * @returns {Promise<boolean>} areValid - If all the inputs are valid */
  const validateInputs = async () => {
    let isValid = true;
    if(email !== user.email) {
      if(EmailValidator.validate(email)) {
        setLoading(true);
        const result = await client.query<EmailExistsPayload, EmailExistsVars>({ query: CHECK_EMAIL, variables: { email: email.toLowerCase() }, 
          errorPolicy: 'all', fetchPolicy: 'no-cache' });
        if(result.data && result.data.emailExists) {
          if(result.data.emailExists.exists) {
            logError('Email already in use.')
            isValid = false;
          }
        } 
        if(result.errors) result.errors.forEach((e) => logError(e.message));
      } else {
        logError('Invalid email address.');
        isValid = false;
      }
    }
    if(username !== user.username) {
      if(username !== '' && username.length > 6) {
        setLoading(true);
        const result = await client.query<UserExistsPayload, UserExistsVars>({ query: CHECK_USERNAME, variables: { username: username.toLowerCase() }, 
          errorPolicy: 'all', fetchPolicy: 'no-cache' });
        if(result.data && result.data.usernameExists) {
          if(result.data.usernameExists.exists) {
            logError('Username alredy in use.');
            isValid = false;
          }
        }
        if(result.errors) result.errors.forEach((e) => logError(e.message));
      } else {
        logError('Username must be at least 6 characters long.');
        isValid = false;
      }
    }
    if(name !== user.fullName && name.trim() === '') {
      logError('Full name cannot be empty.');
      isValid = false;
    }
    setLoading(false);
    return isValid;
  };

  const edit = async () => {
    if(name !== user.fullName || username !== user.username || email !== user.email || token !== user.gitHubToken || (pictureUrl !== user.pictureUrl || file)) {
      if(await validateInputs()) {
        let url = pictureUrl;
        setLoading(true);
        if(file) {
          const fd = new FormData();
          fd.append('avatar', file);
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/avatar`, { method: 'POST', body: fd }).then(res => res.json());
          if(response.status === 200) url = `${process.env.REACT_APP_SERVER_URL}/avatar/${response.pictureUrl}`;
        }
        const user: EditVars["user"] = {
          fullName: name,
          gitHubToken: token,
          email,
          username,
          pictureUrl: url
        };
        const result = await client.mutate<EditPayload, EditVars>({ mutation: EDIT_PROFILE, variables: { user },
          errorPolicy: 'all', fetchPolicy: 'no-cache' })
          .finally(() => setLoading(false));
        if(result.data && result.data.editProfile) {
          const _credentials = JSON.parse(await localStorage.getItem('ELECTRA-CREDENTIALS'));
          _credentials.username = username;
          localStorage.setItem('ELECTRA-CREDENTIALS', JSON.stringify(_credentials));
          setUser(result.data.editProfile);
          logInfo('Profile edited successfully.');
          close();
        }
        if(result.errors) result.errors.forEach((e) => logError(e.message));
      }
    } else {
      logError('Changes must be made to edit profile.');
    }
  };

  return (
    <div id='profile' className='opacityIn' ref={ref}>
      <div id='content'>
      {loading && <Loading />}
        <div id='inside'>
          <div>
            <div>Profile</div>
            <div>
              <img src={require('../assets/images/close.png')} alt='profile' onClick={() => close()}></img>
            </div>
          </div>
          <div>
            <p className="label">Profile Photo</p>
            <div>
              <div>
                <input hidden type='file' accept='image/*' ref={fileInput} alt='img' onChange={() => setFile(fileInput.current.files[0])}/>
                <img src={user.pictureUrl} alt='profile' ref={imgRef}></img>
              </div>
              {own &&
              <div>
                <button onClick={() => fileInput.current.click()}>Upload profile photo</button>
                {gitHubUser && 
                <button onClick={() => { imgRef.current.src = gitHubUser.avatarUrl; setPictureUrl(gitHubUser.avatarUrl); setFile(null); }}>
                  Use GitHub Avatar
                </button>}
                <button onClick={() => { imgRef.current.src = user.pictureUrl; setPictureUrl(user.pictureUrl); setFile(null); } }>
                  Reset photo
                </button>
              </div>}
            </div>   
            {own &&
            <Fragment>
              <p className="label">Name</p>
              <input value={name} onChange={(e) => setName(e.target.value)}></input>
              <p className="label">Username</p>
              <input value={username} onChange={(e) => setUsername(e.target.value)}></input>
              <p className="label">Email</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </Fragment>}
            {!own &&
            <Fragment>
              <p className="label">Name</p>
              <p className="user-info">{user.fullName}</p>
              <p className="label">Username</p>
              <p className="user-info">{user.username}</p>
              <p className="label">Email</p>
              <p className="user-info">{user.email}</p>
            </Fragment>} 
            <p className="label">GitHub Account</p>
            {!gitHubUser && token === '' && own &&
            <button id='gh-btn' onClick={() => openGitHubWindow()} disabled={loadingToken}>
              {loadingToken && <Loading />}
              <img src={require('../assets/images/github-color.png')} alt='gh-logo'></img>
              Link GitHub Account
            </button>}
            {!user.gitHubUser && !own &&
            <p className="user-info">This user has no linked GitHub account</p>}
            <div>
              {(gitHubUser || token !== '') &&
              <div id='gh-profile'>
                {!gitHubUser && <Loading />}
                {gitHubUser && <Fragment>
                  <div>
                    <img src={gitHubUser.avatarUrl} alt='github-avatar'></img>
                    <div>
                      <p>{gitHubUser.name}</p>
                      <p>{`@${gitHubUser.login}`}</p>
                      <p>{gitHubUser.email}</p>
                    </div>
                  </div>
                  <p><span>{gitHubUser.followers.totalCount}</span>&ensp;Followers</p>
                  <p><span>{gitHubUser.following.totalCount}</span>&ensp;Following</p>
                  {own && <button onClick={() => unlinkAccount()}>
                    Unlink Account
                  </button>}
                </Fragment>}
              </div>}
            </div>
            {own &&
            <div>
              <button onClick={() => edit()}>Save Changes</button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    loggedUser: userReducer.user
  }
};

export default connect(mapStateToProps, { setShownProfile, setUser }, null, { forwardRef: true })(forwardRef<HTMLDivElement, ProfileProps>(Profile));

interface ProfileProps {
  /** User to be shown, if it's null it will show the logged user */
  user?: ProfileI
  /** Logged user from redux store */
  loggedUser: ProfileI
  /** Function to change the visible status of this view */
  setShownProfile: Function
  /** method to change user */
  setUser: Function
}

interface EditPayload {
  /** Result from the mutation */
  editProfile: ProfileI
}

interface EditVars {
  /** container of the vars */
  user: {
    /** full name of the user */
    fullName: string
    /** username of the user */
    username: string
    /** email of the user */
    email: string
    /** github authorization token */
    gitHubToken?: string
    /** picture url of the user */
    pictureUrl: string
  }
}

interface TokenPayload {
  /** Result from the mutation */
  generateGitHubToken: {
    /** Authorization token generated in server to use GitHub features */
    code: string
  }
}

interface TokenVars {
  /** Contains the code returned from GitHub after app authorization. This will be sended to server to generate bearer token */
  code: string
}

interface UserPayload {
  /** Contains user data */
  viewer: GitHubUser
}

interface UserExistsPayload {
  /** Contains the result of the query */
  usernameExists: {
    /** Wheter the user exists or not */
    exists: boolean
  }
}

interface UserExistsVars {
  /** Username to be checked */
  username: string
}

interface EmailExistsPayload {
  /** Contains the result of the query */
  emailExists: {
    /** Wether the user exists or not */
    exists: boolean
  }
}

interface EmailExistsVars {
  /** Email to be checked */
  email: string
}