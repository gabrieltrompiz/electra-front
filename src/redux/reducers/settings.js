const initialState = {
  show: {
    profile: null,
    profileView: false,
    createWorkspace: false,
    createSprint: false,
    createTask: false,
    taskType: 'TODO',
    task: null,
    taskView: false,
    createSubtask: false
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

    case 'SHOW_CREATE_SUBTASK': {
      const { visible } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          createSubtask: visible
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

    case 'UPDATE_SUBTASK': {
      const { subtask, taskId } = action.payload;
      if(state.show.task && state.show.task.id === taskId) {
        console.log('sie')
        const _task = Object.assign({}, state.show.task);
        const sIndex = state.show.task.subtasks.findIndex((st) => st.id === subtask.id);
        const _subtasks = [..._task.subtasks];
        _subtasks[sIndex] = subtask;
        return {
          ...state,
          show: {
            ...state.show,
            task: {
              ..._task,
              subtasks: _subtasks
            }
          }
        }
      } else {
        return state;
      }
    };

    case 'LOGOUT': return initialState;
    

    default: return { ...state };
  }
};