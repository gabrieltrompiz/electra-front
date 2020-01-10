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
      const _workspaces = [...state.workspaces];
      _workspaces.push(workspace);
      _workspaces.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
      return {
        ...state,
        workspaces: _workspaces
      };
    };

    case 'ADD_SPRINT': {
      const { sprint, workspaceId } = action.payload;
      const _workspaces = [...state.workspaces];
      const index = _workspaces.findIndex((w) => w.id === workspaceId);
      const newWorkspace = {
        ..._workspaces[index],
        sprint
      };
      _workspaces[index] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: sprint
      }
    };

    case 'ADD_TASK': {
      const { task, workspaceId } = action.payload;
      const _workspaces = [...state.workspaces];
      const index = _workspaces.findIndex((w) => workspaceId === w.id);
      const newWorkspace = {
        ..._workspaces[index],
        sprint: {
          ..._workspaces[index].sprint,
          tasks: [..._workspaces[index].sprint.tasks, task]
        }
      }
      _workspaces[index] = newWorkspace;
      return {
        ...state,
        workspaces: _workspaces,
        selectedSprint: {
          ...state.selectedSprint,
          tasks: [...state.selectedSprint.tasks, task]
        },

      };
    };

    case 'LOGOUT': return initialState;
      

    default: return { ...state };
  }
};