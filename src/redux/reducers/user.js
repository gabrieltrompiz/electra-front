const initialState = {
  user: null,
  loggedIn: false,
  workspaces: []
};

/** User reducer containing states about the user like the user itself, if it is logged in, its workspaces and so on... */
export default (state = initialState, action) => {
  switch(action.type) {

    case 'SET_USER': {
      const { user } = action.payload;
      const _user = Object.assign({}, user);
      delete _user.workspaces;
      return { 
        ...state,
        user: _user,
        loggedIn: !!user,
        workspaces: user.workspaces
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