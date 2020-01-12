const initialState = {
  user: null,
  loggedIn: false,
  workspaces: [],
  selectedWorkspace: null,
  selectedSprint: null,
  isAdmin: false
};

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

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
      delete _workspace.backlog;
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
        workspaces: _workspaces
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

    case 'ADD_SUBTASK': {
      const { subtask, workspaceId, taskId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const wIndex = _workspaces.findIndex((w) => workspaceId === w.id);
      const sprint = Object.assign({}, _workspaces[wIndex].sprint);
      const _tasks = clone([..._workspaces[wIndex].sprint.tasks]);
      const tIndex = _tasks.findIndex((t) => taskId === t.id);
      const newTasks = clone([..._tasks]);
      newTasks[tIndex].subtasks = [...newTasks[tIndex].subtasks, subtask]
      const newWorkspace = {
        ..._workspaces[wIndex],
        sprint: {
          ...sprint,
          tasks: newTasks
        }
      }
      _workspaces[wIndex] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: state.selectedWorkspace.id === workspaceId ? ({
          ...sprint,
          tasks: newTasks
        }) : state.selectedSprint
      };
    };

    case 'UPDATE_SUBTASK': {
      const { subtask, workspaceId, taskId } = action.payload;
      const _workspaces = clone([...state.workspaces]);
      const wIndex = _workspaces.findIndex((w) => workspaceId === w.id);
      const sprint = Object.assign({}, _workspaces[wIndex].sprint);
      const _tasks = _workspaces[wIndex].sprint.tasks;
      const tIndex = _tasks.findIndex((t) => taskId === t.id);
      const sIndex = _tasks[tIndex].subtasks.findIndex((s) => s.id === subtask.id);
      const _subtasks = clone([..._tasks[tIndex].subtasks]);
      _subtasks[sIndex] = subtask;
      const newTasks = [..._tasks];
      newTasks[tIndex].subtasks = _subtasks;
      const newWorkspace = {
        ..._workspaces[wIndex],
        sprint: {
          ..._workspaces[wIndex].sprint,
          tasks: newTasks
        }
      }
      _workspaces[wIndex] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: state.selectedWorkspace.id === workspaceId ? ({
          ...sprint,
          tasks: newTasks
        }) : state.selectedSprint
      };
    };

    case 'LOGOUT': return initialState;
      

    default: return { ...state };
  }
};