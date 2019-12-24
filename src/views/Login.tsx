import React, { Fragment, useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { setUser } from '../redux/actions';
import { LOGIN } from '../graphql';
import ShowcaseCarousel from '../components/ShowcaseCarousel';
import Loading from '../components/Loading';
import { logError, logInfo } from '../utils';

interface LoginProps {
  /** Function to change the active view from parent component */
  setView: Function,
  /** Logged user from redux */
  user: object,
  /** Action creator to change user */
  setUser: Function
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
const Login: React.FC<LoginProps> = ({ user, setView, setUser }) => { 
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const client = useApolloClient();

  // useEffect(() => {
  //   console.log(data)
  //   if(data && data.login) { 
  //     setUser(data.login);
  //     logInfo(`Logged in as ${data.login.username} successfully.`);
  //   }
  // }, [data, setUser]);

  const submitLogin = async () => {
    if(username !== '' && password !== '') {
      setLoading(true);
      const result = await client.mutate<LoginPayload, LoginVars>({ variables: { user: { username, password } }, mutation: LOGIN, errorPolicy: 'all' })
      .finally(() => setLoading(false));
      if(result.data && result.data.login) {
        setUser(result.data.login);
        logInfo(`Logged in as ${result.data.login.username}`);
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    } else {
      logError('Please provide your credentials first');
    }
  };

  const images = [require('../assets/images/updates.png'), require('../assets/images/powerup.png')]; // TODO: create more images

  return (
    <Fragment>
      <div>
        <ShowcaseCarousel images={images} />
      </div>
      <div>
        <div id='login-card'>
          {loading && <Loading />}
          <p>Welcome back!</p>
          <p>Please enter your credentials to start using Electra and boost your productivity.</p>
          <p>USERNAME OR EMAIL</p>
          <input maxLength={30} onChange={(e) => setUsername(e.target.value)}></input>
          <p>PASSWORD</p>
          <input maxLength={30} type='password' onChange={(e) => setPassword(e.target.value)}></input>
          <a href='/'>Forgot your password?</a>
          <button onClick={() => submitLogin()}>Log in</button>
          <span>Don't have an account? <a href='/' onClick={() => setView("Register")}> Create one.</a></span>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => {
  const { user } = state.userReducer;
  return { user };
};

export default connect(mapStateToProps, { setUser })(Login);