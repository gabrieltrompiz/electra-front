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
    client.mutate({ mutation: LOGIN, variables: { user: { username, password } }, errorPolicy: 'all', fetchPolicy: 'no-cache' })
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

/** Sets the profile to be shown in the profile view
 * @function setShownProfile
 * @param {object} profile - Profile to be shown
 * @returns Action with type SET_SHOWN_PROFILE
 */
export const setShownProfile = (profile) => {
  return {
    type: 'SET_SHOWN_PROFILE',
    payload: {
      profile
    }
  };
};

/** Sets wether the profile view is shown or not. Can also be changed modifying shown profile directly
 * @function setVisibleProfile
 * @param {boolean} visible - Wether it is visible or not
 * @returns Action with type SET_VISIBLE_PROFILE
 */
export const setVisibleProfile = (visible) => {
  return {
    type: 'SET_VISIBLE_PROFILE',
    payload: {
      visible
    }
  };
};

/** Sets the active workspace that will be shown in workspace view
 * @function selectWorkspace
 * @param {number} id - id of the workspace to be selected
 * @returns Action with type SELECT_WORKSPACE
 */
export const selectWorkspace = (id) => {
  return {
    type: 'SELECT_WORKSPACE',
    payload: {
      id
    }
  };
};

/** Changes wether the 'Create a Workspace' view is visible or not
 * @function showCreateWorkspace
 * @param {boolean} visible - wether it is visible or not
 * @returns Action with type SHOW_CREATE_WORKSPACE  
 */
export const setShowCreateWorkspace = (visible) => {
  return {
    type: 'SHOW_CREATE_WORKSPACE',
    payload: {
      visible
    }
  };
};

/** Adds a workspace to the array of worksapces
 * @function addWorkspace
 * @param {Worksapce} workspace - workspace to be added
 * @returns Action with type ADD_WORKSPACE 
 */
export const addWorkspace = (workspace) => {
  return {
    type: 'ADD_WORKSPACE',
    payload: {
      workspace
    }
  };
};

/** Logouts user and resets user reducer state to initialState
 * @function logout
 * @returns Action with type LOGOUT
 */
export const logout = () => {
  return {
    type: 'LOGOUT'
  };
};

/** resets settings reducer state to initialState
 * @function resetSettings
 * @returns Action with type RESET_SETTINGS
 */
export const resetSettings = () => {
  return {
    type: 'RESET_SETTINGS'
  };
};