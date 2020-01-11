const initialState = {
  show: {
    profile: null,
    profileView: false,
    createWorkspace: false,
    createSprint: false,
    createTask: false,
    taskType: 'TODO',
    task: null,
    taskView: false
  }
};

export default (state = initialState, action) => {
  switch(action.type) {

    case 'SET_SHOWN_PROFILE': {
      const { profile } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          profile,
          profileView: !!profile
        }
      };
    };

    case 'SET_VISIBLE_PROFILE': {
      const { visible } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          profileView: visible
        }
      };
    };

    case 'SHOW_CREATE_WORKSPACE': {
      const { visible } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          createWorkspace: visible
        }
      };
    };

    case 'SHOW_CREATE_SPRINT': {
      const { visible } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          createSprint: visible
        }
      };
    };

    case 'SHOW_CREATE_TASK': {
      const { visible, type } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          createTask: visible,
          taskType: type
        }
      };
    };

    case 'SET_SHOWN_TASK': {
      const { task } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          task,
          taskView: !!task
        }
      };
    };

    case 'RESET_SETTINGS': return initialState;
    

    default: return { ...state };
  }
};