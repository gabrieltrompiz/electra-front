const initialState = {
  shownProfile: null,
  showProfileView: false,
  showCreateWorkspace: false
};

export default (state = initialState, action) => {
  switch(action.type) {

    case 'SET_SHOWN_PROFILE': {
      const { profile } = action.payload;
      return {
        ...state,
        shownProfile: profile,
        showProfileView: !!profile
      };
    };

    case 'SET_VISIBLE_PROFILE': {
      const { visible } = action.payload;
      return {
        ...state,
        showProfileView: visible
      };
    };

    case 'SHOW_CREATE_WORKSPACE': {
      const { visible } = action.payload;
      return {
        ...state,
        showCreateWorkspace: visible
      };
    };

    case 'RESET_SETTINGS': return initialState;
    

    default: return { ...state };
  }
};