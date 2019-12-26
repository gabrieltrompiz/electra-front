import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { remote } from 'electron';
import { GENERATE_GITHUB_TOKEN, GET_GITHUB_USER } from '../graphql';
import { logInfo, logError } from '../utils';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-boost';
import Loading from '../components/Loading';

interface RegisterProps {
  /** Function to change the active view from parent component */
  setView: Function
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
  viewer: {
    /** GitHub username */
    login: string
    /** GitHub email */
    email: string
    /** GitHub avatar url */
    avatarUrl: string
    /** GitHub name */
    name: string
    /** GitHub followers */
    followers: {
      /** Total count of followers */
      totalCount: number
    }
    /** Github following */
    following: {
      /** Total count of following */
      totalCount: number
    }
  }
}

/**
 * Gives user the ability to create a new user in the app
 * @visibleName Register View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Register: React.FC<RegisterProps> = ({ setView }) => {
  const [file, setFile] = useState<File | null>(null);

  const [gitHubUser, setGitHubUser] = useState<UserPayload['viewer'] | null>(null);
  const [loadingToken, setLoadingToken] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

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
      }
      reader.readAsDataURL(file);
    }
  }, [file])

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
    win.webContents.on('did-redirect-navigation', async (event, url) => {
      if(url.includes('code=')) {
        const code = url.split('?')[1].replace('code=', '').trim();
        win.close();
        const result = await client.mutate<TokenPayload, TokenVars>({ variables: { code }, mutation: GENERATE_GITHUB_TOKEN, errorPolicy: 'all' })
        .finally(() => setLoadingToken(false));
        if(result.data && result.data.generateGitHubToken) {
          setToken(result.data.generateGitHubToken.code);
          logInfo('GitHub Authorization token generated')
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
    const result = await ghClient.query<UserPayload>({ query: GET_GITHUB_USER })
    if(result.data && result.data.viewer) {
      setGitHubUser(result.data.viewer);
    }
    if(result.errors) result.errors.forEach((e) => logError(e.message));
    ghClient.stop();
  };

  return (
    <div>
      <div id='register-card'>
        <img src={require('../assets/images/close.png')} alt='close' onClick={() => setView('Login')}></img>
        <p>Register</p>
        <div>
          <div>
            <p>EMAIL</p>
            <input></input>
            <p>USERNAME</p>
            <input></input>
            <p>FULL NAME</p>
            <input></input>
            <p>PASSWORD</p>
            <input></input>
            <p>CONFIRM PASSWORD</p>
            <input></input>
          </div>
          <div>
            <p>PROFILE PHOTO</p>
            <div>
              <input hidden type='file' accept='image/*' ref={fileInput} alt='img' onChange={() => setFile(fileInput.current.files[0])}/>
              <img src={require('../assets/images/default-pic.png')} alt='profile-pic' ref={imgRef}></img>
              <div>
                <button onClick={() => fileInput.current.click()}>Upload profile photo</button>
                {gitHubUser && 
                <button onClick={() => { imgRef.current.src = gitHubUser.avatarUrl }}>Use GitHub Avatar</button>}
              </div>
            </div>
            <p>GITHUB ACCOUNT</p>
            {!gitHubUser && token === '' &&
            <button id='gh-btn' onClick={() => openGitHubWindow()}>
              {loadingToken && <Loading />}
              <img src={require('../assets/images/github-color.png')} alt='gh-logo'></img>
              Link GitHub Account
            </button>}
            {(gitHubUser || token !== '')&&
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
                <button>Unlink Account</button>
              </Fragment>}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;