const initialState = {
  shownProfile: null,
  show: false
};

export default (state = initialState, action) => {
  switch(action.type) {

    case 'SET_SHOWN_PROFILE': {
      console.log(action.payload)
      const { profile } = action.payload;
      return {
        ...state,
        shownProfile: profile,
        show: !!profile
      };
    };

    case 'SET_VISIBLE_PROFILE': {
      const { visible } = action.payload;
      return {
        ...state,
        show: visible
      };
    };

    default: return { ...state };
  }
};