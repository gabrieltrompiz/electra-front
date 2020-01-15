import { cloneDeep as clone } from 'lodash';

const initialState = {
  user: null,
  loggedIn: false,
  workspaces: [],
  selectedWorkspace: null,
  selectedSprint: null,
  isAdmin: false
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
        workspaces: user.workspaces,
        selectedWorkspace: state.selectedWorkspace ? user.workspaces.find((w) => w.id === state.selectedWorkspace.id) : null
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
      const workspace = state.workspaces.find(w => w.id === id);
      const _workspace = Object.assign({}, workspace);
      delete _workspace.sprint;
      return {
        ...state,
        selectedWorkspace: id ? _workspace : null,
        selectedSprint: workspace ? workspace.sprint : null,
        isAdmin: workspace ? _workspace.members.find((m) => m.user.id === state.user.id).role === 'ADMIN' : null
      };
    };

    case 'ADD_WORKSPACE': {
      const { workspace } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      _workspaces.push(workspace);
      _workspaces.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
      return {
        ...state,
        workspaces: _workspaces
      };
    };

    case 'ADD_SPRINT': {
      const { sprint, workspaceId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const index = _workspaces.findIndex((w) => w.id === workspaceId);
      const newWorkspace = {
        ..._workspaces[index],
        sprint
      };
      _workspaces[index] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: state.selectedWorkspace ? state.selectedWorkspace.id === workspaceId ? sprint : state.selectedSprint : null
      }
    };

    case 'SEND_TO_BACKLOG': {
      const { workspaceId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const wIndex = _workspaces.findIndex((w) => w.id === workspaceId);
      const _sprint = _workspaces[wIndex].sprint;
      _sprint.status = 'COMPLETED';
      const _backlog = [..._workspaces[wIndex].backlog, _sprint]
      const newWorkspace = {
        ..._workspaces[wIndex],
        sprint: null,
        backlog: _backlog
      }
      _workspaces[wIndex] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: null,
        selectedWorkspace: state.selectedWorkspace.id === workspaceId ? _workspaces[wIndex] : state.selectedWorkspace
      }
    };

    case 'SELECT_SPRINT': {
      const { id } = action.payload;
      const sprint = state.workspaces.find((w) => w.sprint.id === id);
      return {
        ...state,
        selectedSprint: sprint
      };
    };

    case 'ADD_TASK': {
      const { task, workspaceId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const index = _workspaces.findIndex((w) => workspaceId === w.id);
      const newWorkspace = {
        ..._workspaces[index],
        sprint: {
          ..._workspaces[index].sprint,
          tasks: clone([..._workspaces[index].sprint.tasks, task])
        }
      }
      _workspaces[index] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: state.selectedWorkspace.id === workspaceId ? 
        ({
          ...state.selectedSprint,
          tasks: clone([...state.selectedSprint.tasks, task])
        }) : state.selectedSprint,
      };
    };

    case 'UPDATE_TASK': {
      const { task, workspaceId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const wIndex = _workspaces.findIndex((w) => workspaceId === w.id);
      const _tasks = _workspaces[wIndex].sprint.tasks
      const tIndex = _tasks.findIndex((t) => t.id === task.id);
      _tasks[tIndex] = task;
      const newWorkspace = {
        ..._workspaces[wIndex],
        sprint: {
          ..._workspaces[wIndex].sprint,
          tasks: _tasks
        }
      }
      _workspaces[wIndex] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: state.selectedWorkspace.id === workspaceId ? ({
          ..._workspaces[wIndex].sprint,
          tasks: _tasks
        }) : state.selectedSprint
      };
    };

    case 'ADD_SUBTASK': {
      const { subtask, workspaceId, taskId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const wIndex = _workspaces.findIndex((w) => workspaceId === w.id);
      const sprint = _workspaces[wIndex].sprint;
      const _tasks = _workspaces[wIndex].sprint.tasks;
      const tIndex = _tasks.findIndex((t) => taskId === t.id);
      _tasks[tIndex].subtasks = [..._tasks[tIndex].subtasks, subtask]
      const newWorkspace = {
        ..._workspaces[wIndex],
        sprint: {
          ...sprint,
          tasks: _tasks
        }
      }
      _workspaces[wIndex] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: state.selectedWorkspace.id === workspaceId ? ({
          ...sprint,
          tasks: _tasks
        }) : state.selectedSprint
      };
    };

    case 'ADD_COMMENT': {
      const { comment, workspaceId, taskId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const wIndex = _workspaces.findIndex((w) => workspaceId === w.id);
      const sprint = _workspaces[wIndex].sprint;
      const _tasks = _workspaces[wIndex].sprint.tasks;
      const tIndex = _tasks.findIndex((t) => taskId === t.id);
      _tasks[tIndex].comments = [..._tasks[tIndex].comments, comment];
      const newWorkspace = {
        ..._workspaces[wIndex],
        sprint: {
          ...sprint,
          tasks: _tasks
        }
      };
      _workspaces[wIndex] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: state.selectedWorkspace.id === workspaceId ? ({
          ...sprint,
          tasks: _tasks
        }) : state.selectedSprint 
      };
    };

    case 'UPDATE_SUBTASK': {
      const { subtask, workspaceId, taskId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const wIndex = _workspaces.findIndex((w) => workspaceId === w.id);
      const sprint = _workspaces[wIndex].sprint;
      const _tasks = _workspaces[wIndex].sprint.tasks;
      const tIndex = _tasks.findIndex((t) => taskId === t.id);
      const sIndex = _tasks[tIndex].subtasks.findIndex((s) => s.id === subtask.id);
      const _subtasks = _tasks[tIndex].subtasks;
      _subtasks[sIndex] = subtask;
      _tasks[tIndex].subtasks = _subtasks;
      const newWorkspace = {
        ..._workspaces[wIndex],
        sprint: {
          ..._workspaces[wIndex].sprint,
          tasks: _tasks
        }
      }
      _workspaces[wIndex] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: state.selectedWorkspace.id === workspaceId ? ({
          ...sprint,
          tasks: _tasks
        }) : state.selectedSprint
      };
    };

    case 'ADD_MESSAGE': {
      const { message, chatId, workspaceId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const wIndex = _workspaces.findIndex((w) => workspaceId === w.id);
      const _chats = _workspaces[wIndex].chats;
      const cIndex = _chats.findIndex((c) => c.id === chatId);
      _chats[cIndex] = {
        ..._chats[cIndex],
        messages: [..._chats[cIndex].messages, message]
      }
      const newWorkspace = {
        ..._workspaces[wIndex],
        chats: _chats
      };
      _workspaces[wIndex] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedWorkspace: state.selectedWorkspace.id === workspaceId ? _workspaces[wIndex] : state.selectedWorkspace
      };
    };

    case 'LOGOUT': return initialState;
      
    case 'SET_ALL_NOTIFICATIONS_AS_READ': {
      const notifications = clone([...state.user.notifications]);
      return {
        ...state,
        user: {
          ...state.user,
          notifications: notifications.map(n => ({ ...n, read: true }))
        }
      }
    }

    default: return { ...state };
  }
};