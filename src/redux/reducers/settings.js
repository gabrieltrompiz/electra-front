import { cloneDeep as clone } from 'lodash';

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
    createSubtask: false,
    completeSprint: false,
    inviteUsers: false,
    selectedChat: null
  }
};

export default (state = initialState, action) => {
  switch(action.type) {

    case 'SET_SHOWN_PROFILE': {
      const { profile } = action.payload;
      const _profile = Object.assign({}, profile);
      return {
        ...state,
        show: {
          ...state.show,
          profile: profile ? _profile : null,
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
      const _task = Object.assign({}, task);
      return {
        ...state,
        show: {
          ...state.show,
          task: _task,
          taskView: !!task
        }
      };
    };

    case 'SHOW_INVITE_USERS': {
      const { visible } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          inviteUsers: visible
        }
      };
    };

    case 'ADD_SUBTASK': {
      const { subtask, taskId } = action.payload;
      if(state.show.task && state.show.task.id === taskId) {
        const _subtask = Object.assign({}, subtask);
        const _task = Object.assign({}, state.show.task);
        const subtasks = clone([..._task.subtasks, _subtask]);
        return {
          ...state,
          show: {
            ...state.show,
            task: {
              ..._task,
              subtasks
            }
          }
        }
      } else {
        return state;
      }
    };

    case 'ADD_COMMENT': {
      const { comment, taskId } = action.payload;
      if(state.show.task && state.show.task.id === taskId) {
        const _comment = Object.assign({}, comment);
        const _task = Object.assign({}, state.show.task);
        const comments = clone([..._task.comments, _comment]);
        return {
          ...state,
          show: {
            ...state.show,
            task: {
              ..._task,
              comments
            }
          }
        }
      } else {
        return state;
      }
    }

    case 'UPDATE_SUBTASK': {
      const { subtask, taskId } = action.payload;
      if(state.show.task && state.show.task.id === taskId) {
        const _task = Object.assign({}, state.show.task);
        const sIndex = state.show.task.subtasks.findIndex((st) => st.id === subtask.id);
        const _subtasks = clone([..._task.subtasks]);
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

    case 'UPDATE_TASK': {
      const { task } = action.payload;
      if(state.show.task && state.show.task.id === task.id) {
        return {
          ...state,
          show: {
            ...state.show,
            task
          }
        }
      } else {
        return state;
      }
    };

    case 'SHOW_COMPLETE_SPRINT': {
      const { visible } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          completeSprint: visible
        }
      };
    };

    case 'SET_CHAT': {
      const { chat } = action.payload;
      return {
        ...state,
        show: {
          ...state.show,
          selectedChat: chat ? Object.assign({}, chat) : null
        }
      };
    };

    case 'LOGOUT': return initialState;
    

    default: return { ...state };
  }
};