const initialState = {
  user: null,
  loggedIn: false,
  workspaces: [],
  selectedWorkspace: null
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
      };
    };

    case 'SELECT_WORKSPACE': {
      const { id } = action.payload;
      return {
        ...state,
        selectedWorkspace: state.workspaces.find(w => w.id === id)
      };
    };

    case 'ADD_WORKSPACE': {
      const { workspace } = action.payload;
      const _workspaces = [...state.workspaces];
      _workspaces.push(workspace);
      _workspaces.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
      return {
        ...state,
        workspaces: _workspaces
      };
    };

    case 'LOGOUT': return initialState;
      

    default: return { ...state };
  }
};