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