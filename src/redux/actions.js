import { LOGIN } from '../graphql';
import { logError, logInfo } from '../utils';


/** Sets and user in the store
 * @function setUser
 * @param {Object} user - User that will be saved in the store
 * @returns Action with type SET_USER
 */
export const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: {
      user
    }
  };
};

/** Sets wether the user is logged in or not
 * @function setLoggedIn
 * @param {Boolean} loggedIn - Boolean value to be set as logged in state
 * @returns Action with type SET_LOGGED_IN
 */
export const setLoggedIn = (loggedIn) => {
  return {
    type: 'SET_LOGGED_IN',
    payload: {
      loggedIn
    }
  };
};

/** Login with credentials saved in localStorage
 * @function loginWithCredentials
 * @param {ApolloClient} client - Apollo Client
 * @param {Object} credentials - Username and password
 * @returns {Function} dispatch
 */
export const loginWithCredentials = (client, { username, password }, setLoading) => {
  return (dispatch) => {
    client.mutate({ mutation: LOGIN, variables: { user: { username, password } }, errorPolicy: 'all' })
    .then(result => {
      if(result.data && result.data.login) {
        logInfo(`Welcome back, ${result.data.login.username}`)
        dispatch(setUser(result.data.login));
      } else {
        logError('You need to login again.')
        localStorage.removeItem('ELECTRA-CREDENTIALS');
      }
      if(result.errors) result.errors.forEach((e) => {
        if(!e.message.includes('Credentials')) logError(e.message)
      })
    })
    .finally(() => {
      setLoading(false);
    })
  }
};