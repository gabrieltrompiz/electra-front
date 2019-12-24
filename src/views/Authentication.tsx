import React, { useState, useEffect } from 'react';
import ToolBar from '../components/ToolBar';
import { useMutation } from '@apollo/react-hooks';
import { remote } from 'electron';
import { GENERATE_GITHUB_TOKEN } from '../graphql';
import Login from './Login';

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

/**
 * Login and register views
 * @visibleName Authentication View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Authentication: React.FC = () => {
  const [view, setView] = useState<string>('Login');
  const [token, setToken] = useState<string>('');

  const [generateGitHubToken, { data }] = useMutation<TokenPayload, TokenVars>(GENERATE_GITHUB_TOKEN, { errorPolicy: 'all' });

  useEffect(() => {
    if(data) setToken(data.generateGitHubToken.code);
  }, [data])

  /** Opens a new BrowserWindow that prompts the user to login with GitHub to generate an authorization token */
  const openGitHubWindow = () => {
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
    win.webContents.on('did-redirect-navigation', (event, url) => {
      if(url.includes('code=')) {
        const code = url.split('?')[1].replace('code=', '').trim();
        win.close();
        generateGitHubToken({ variables: { code } }).catch(err => console.log(err));
      }
    });
    win.show(); 
  };

  /** View that be rendered, either Login or Register. */
  const activeView = view === 'Login' ? <Login setView={setView} /> : <div></div>

  return (
    <div id='authorization'>
      <ToolBar transparent={true} />
      <div id='authorization-content'>
        {activeView}
      </div>
    </div>
  );
};

export default Authentication;