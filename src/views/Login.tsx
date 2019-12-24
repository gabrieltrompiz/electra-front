import React, { Fragment, useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { LOGIN } from '../graphql';

interface LoginProps {
  /** Function to change the active view from parent component */
  setView: Function,
  user: object
}

interface LoginPayload {
  /** Result from the mutation */
  login: {
    /** User's unique ID */
    id: number
    /** User's username */
    username: string
    /** User's full name */
    fullName: string
    /** User's email */
    email: string
    /** GitHub token if the account is associated to GitHub */
    gitHubToken?: string
    /** URL to user's picture */
    pictureUrl: string
  }
}

interface LoginVars {
  /** User credentials container */
  user: {
    /** Username or email provided by the user */
    username: string
    /** Password provided by the user */
    password: string
  }
}

/**
 * Login view to give user access to the application
 * @visibleName Login View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Login: React.FC<LoginProps> = ({ user, setView }) => { 
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [login, { data, loading, error }] = useMutation<LoginPayload, LoginVars>(LOGIN, { errorPolicy: 'all' });

  console.log(user)

  useEffect(() => {
    if(data) console.log(data.login) // TODO: dispatch to redux
  }, [data]);

  const submitLogin = () => {
    login({ variables: { user: { password, username } } }).catch(console.log)
  };

  return (
    <Fragment>
      <div>
        a
      </div>
      <div>
        <div id='login-card'>
          <p>Welcome back!</p>
          <p>Please enter your credentials to start using Electra and boost your productivity.</p>
          <p>USERNAME OR EMAIL</p>
          <input maxLength={30} onChange={(e) => setUsername(e.target.value)}></input>
          <p>PASSWORD</p>
          <input maxLength={30} type='password' onChange={(e) => setPassword(e.target.value)}></input>
          <a href='/'>Forgot your password?</a>
          <button onClick={() => submitLogin()}>Log in</button>
          <span>Don't have an account? <a href='/' onClick={() => setView('Register')}> Create one.</a></span>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => {
  const { user } = state.userReducer;
  return { user }
}

export default connect(mapStateToProps)(Login);