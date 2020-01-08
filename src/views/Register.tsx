import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { setUser } from '../redux/actions';
import { GENERATE_GITHUB_TOKEN, GET_GITHUB_USER, CHECK_USERNAME, CHECK_EMAIL, REGISTER } from '../graphql';
import { logInfo, logError } from '../utils';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-boost';
import Loading from '../components/Loading';
import * as EmailValidator from 'email-validator';
import { GitHubUser, Profile } from '../types';

/**
 * Gives user the ability to create a new user in the app
 * @visibleName Register View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Register: React.FC<RegisterProps> = ({ toggleView, setUser }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName,  setFullName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [gitHubUser, setGitHubUser] = useState<UserPayload['viewer'] | null>(null);
  const [loadingToken, setLoadingToken] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [photoChanged, setPhotoChanged] = useState<boolean>(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const client = useApolloClient();

  useEffect(() => {
    if(token) getGitHubUser();
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if(file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        imgRef.current.src = e.target.result;
        setPhotoChanged(true);
      }
      reader.readAsDataURL(file);
    }
  }, [file]);

  /** Opens a new BrowserWindow that prompts the user to login with GitHub to generate an authorization token 
   * @async
   * @function openGitHubWindow */
  const openGitHubWindow = async () => {
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
    win.loadURL('https://github.com/login/oauth/authorize?client_id=ea3c96b4c3db26131d73&scope=user');
    win.webContents.on('did-redirect-navigation', async (_, url) => {
      if(url.includes('code=')) {
        const code = url.split('?')[1].replace('code=', '').trim();
        win.close();
        const result = await client.mutate<TokenPayload, TokenVars>({ variables: { code }, mutation: GENERATE_GITHUB_TOKEN, 
          errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => setLoadingToken(false));
        if(result.data && result.data.generateGitHubToken) {
          setToken(result.data.generateGitHubToken.code);
          logInfo('GitHub authorization token generated')
        } 
        if(result.errors) result.errors.forEach((e) => logError(e.message));
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
    const result = await ghClient.query<UserPayload>({ query: GET_GITHUB_USER, errorPolicy: 'all' });
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
  };

  /** Registers an user and authenticates it.
   * @async 
   * @function register */
  const register = async () => {
    if(await validateInputs()) {
      let pictureUrl: string = '';
      if(photoChanged && file) {
        const fd = new FormData();
        fd.append('avatar', file);
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/avatar`, { method: 'POST', body: fd }).then(res => res.json());
        if(response.status === 200) pictureUrl = `${process.env.REACT_APP_SERVER_URL}/avatar/${response.pictureUrl}`;
      } else if(photoChanged) {
        pictureUrl = gitHubUser.avatarUrl;
      } else {
        pictureUrl = `${process.env.REACT_APP_SERVER_URL}/avatar/default.png`;
      }
      const result = await client.mutate<RegisterPayload, RegisterVars>({ mutation: REGISTER, variables: { 
        user: { fullName, email: email.toLowerCase(), password, username: username.toLowerCase(), pictureUrl, gitHubToken: token }
       }, errorPolicy: 'all', fetchPolicy: 'no-cache' }); 
      if(result.data && result.data.register) {
        localStorage.setItem('ELECTRA-CREDENTIALS', JSON.stringify({ username: username.toLowerCase(), password }));
        setUser(result.data.register);
        logInfo('Signed up successfully');
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    }
  };

  /** Checks that all inputs are valid.
   * @async
   * @function validateInputs
   * @returns {Promise<boolean>} areValid - If all the inputs are valid */
  const validateInputs = async () => {
    const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    let isValid = true;
    if(EmailValidator.validate(email.toLowerCase())) {   
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
    if(fullName.trim() === '') {
      logError('Full name cannot be empty.');
      isValid = false;
    }
    if(!passwordRegex.test(password)) {
      logError('Password must contain at least one uppercase letter, one number and be minimum 8 characters long.');
      isValid = false;
    }
    if(password !== confirmPassword) {
      logError('Passwords don\'t match.');
      isValid = false;
    }
    setLoading(false);
    return isValid;
  };

  return (
    <div>
      <div id='register-card'>
        {loading && <Loading />}
        <img src={require('../assets/images/close.png')} alt='close' onClick={() => toggleView()}></img>
        <p>Register</p>
        <div>
          <div>
            <p>EMAIL</p>
            <input onChange={(e) => setEmail(e.target.value)}></input>
            <p>USERNAME</p>
            <input onChange={(e) => setUsername(e.target.value)}></input>
            <p>FULL NAME</p>
            <input onChange={(e) => setFullName(e.target.value)}></input>
            <p>PASSWORD</p>
            <input type='password' onChange={(e) => setPassword(e.target.value)}></input>
            <p>CONFIRM PASSWORD</p>
            <input type='password' onChange={(e) => setConfirmPassword(e.target.value)}></input>
          </div>
          <div>
            <p>PROFILE PHOTO</p>
            <div>
              <input hidden type='file' accept='image/*' ref={fileInput} alt='img' onChange={() => setFile(fileInput.current.files[0])}/>
              <img src={require('../assets/images/default-pic.png')} alt='profile-pic' ref={imgRef}></img>
              <div>
                <button onClick={() => fileInput.current.click()}>Upload profile photo</button>
                {gitHubUser && 
                <button onClick={() => { imgRef.current.src = gitHubUser.avatarUrl; setPhotoChanged(true); setFile(null); }}>
                  Use GitHub Avatar
                </button>}
                {photoChanged &&
                <button onClick={() => { imgRef.current.src = require('../assets/images/default-pic.png'); setPhotoChanged(false); } }>
                  Reset photo
                </button>}
              </div>
            </div>
            <p>GITHUB ACCOUNT</p>
            {!gitHubUser && token === '' &&
            <button id='gh-btn' onClick={() => openGitHubWindow()} disabled={loadingToken}>
              {loadingToken && <Loading />}
              <img src={require('../assets/images/github-color.png')} alt='gh-logo'></img>
              Link GitHub Account
            </button>}
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
                <button onClick={() => unlinkAccount()}>
                  Unlink Account
                </button>
              </Fragment>}
            </div>}
          </div>
        </div>
        <button disabled={(loadingToken || (!gitHubUser && token !== ''))} onClick={() => register()}>Register</button>
      </div>
    </div>
  );
};

export default connect(null, { setUser })(Register);

interface RegisterProps {
  /** Function to change the active view from parent component */
  toggleView: Function
  /** Action creator to change user in redux */
  setUser: Function
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

interface RegisterPayload {
  /** Contains the result of the mutation */
  register: Profile
}

interface RegisterVars {
  /** Container of the user */
  user: {
    /** Unique email provided by the user */
    email: string
    /** Umique sername provided by the user */
    username: string
    /** Full name provided by the user */
    fullName: string
    /** Unhashed password provided by the user */
    password: string
    /** GitHub authorization token if the user linked their GH account */
    gitHubToken?: string
    /** Profile photo provided by the user */
    pictureUrl: string
  }
}