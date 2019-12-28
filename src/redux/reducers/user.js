const initialState = {
  user: null,
  loggedIn: false
};

/** User reducer containing states about the user like the user itself, if it is logged in, its workspaces and so on... */
export default (state = initialState, action) => {
  switch(action.type) {

    case 'SET_USER': {
      const { user } = action.payload;
      localStorage.setItem('ELECTRA-USER', JSON.stringify(user));
      return { 
        ...state,
        user,
        loggedIn: !!user
       };
    };

    case 'SET_LOGGED_IN': {
      const { loggedIn } = action.payload;
      return {
        ...state,
        loggedIn
      }
    }

    default: return { ...state }
  }
};