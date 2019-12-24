const initialState = {
  user: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'SET_USER': {
      const { user } = action.payload;
      return { 
        ...state,
        user
       }
    }

    default: return { ...state }
  }
};