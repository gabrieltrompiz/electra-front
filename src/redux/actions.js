import { LOGIN, GET_PROFILE } from '../graphql';
import { logError, logInfo } from '../utils';


/** Sets and user in the store
 * @function setUser
 * @param {Object} user - User that will be saved in the store
 * @returns Action with type SET_USER
 */
export const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: {
      user
    }
  };
};

/** Sets wether the user is logged in or not
 * @function setLoggedIn
 * @param {Boolean} loggedIn - Boolean value to be set as logged in state
 * @returns Action with type SET_LOGGED_IN
 */
export const setLoggedIn = (loggedIn) => {
  return {
    type: 'SET_LOGGED_IN',
    payload: {
      loggedIn
    }
  };
};

/** Login with credentials saved in localStorage
 * @function loginWithCredentials
 * @param {ApolloClient} client - Apollo Client
 * @param {Object} credentials - Username and password
 * @returns {Function} dispatch
 */
export const loginWithCredentials = (client, { username, password }, setLoading) => {
  return (dispatch) => {
    client.mutate({ mutation: LOGIN, variables: { user: { username, password } }, errorPolicy: 'all', fetchPolicy: 'no-cache' })
    .then(result => {
      const alreadyLogged = result.errors ? result.errors.findIndex((err) => err.message.includes('Already logged in')) !== -1 : false;
      if(result.data && result.data.login && !alreadyLogged) {
        logInfo(`Welcome back, ${result.data.login.username}`)
        dispatch(setUser(result.data.login));
        setLoading(false);
      } else if(alreadyLogged) {
        setLoading(true);
        client.query({ query: GET_PROFILE, errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .then(res => {
          if(res.data) {
            logInfo(`Welcome back, ${res.data.profile.username}`);
            dispatch(setUser(res.data.profile));
            setLoading(false);
          }
        })
      }
      else {
        logError('You need to login again.')
        localStorage.removeItem('ELECTRA-CREDENTIALS');
      }
      if(result.errors) result.errors.forEach((e) => {
        if(!e.message.includes('Credentials') && !e.message.includes('Already logged in')) logError(e.message);
      })
    })
  }
};

/** Sets the profile to be shown in the profile view
 * @function setShownProfile
 * @param {object} profile - Profile to be shown
 * @returns Action with type SET_SHOWN_PROFILE
 */
export const setShownProfile = (profile) => {
  return {
    type: 'SET_SHOWN_PROFILE',
    payload: {
      profile
    }
  };
};

/** Sets wether the profile view is shown or not. Can also be changed modifying shown profile directly
 * @function setVisibleProfile
 * @param {boolean} visible - Wether it is visible or not
 * @returns Action with type SET_VISIBLE_PROFILE
 */
export const setVisibleProfile = (visible) => {
  return {
    type: 'SET_VISIBLE_PROFILE',
    payload: {
      visible
    }
  };
};

/** Sets the active workspace that will be shown in workspace view
 * @function selectWorkspace
 * @param {number} id - id of the workspace to be selected
 * @returns Action with type SELECT_WORKSPACE
 */
export const selectWorkspace = (id) => {
  return {
    type: 'SELECT_WORKSPACE',
    payload: {
      id
    }
  };
};

/** Changes wether the 'Create a Workspace' view is visible or not
 * @function showCreateWorkspace
 * @param {boolean} visible - wether it is visible or not
 * @returns Action with type SHOW_CREATE_WORKSPACE  
 */
export const setShowCreateWorkspace = (visible) => {
  return {
    type: 'SHOW_CREATE_WORKSPACE',
    payload: {
      visible
    }
  };
};

/** Adds a workspace to the array of worksapces
 * @function addWorkspace
 * @param {Worksapce} workspace - workspace to be added
 * @returns Action with type ADD_WORKSPACE 
 */
export const addWorkspace = (workspace) => {
  return {
    type: 'ADD_WORKSPACE',
    payload: {
      workspace
    }
  };
};

/** Logouts user and resets user reducer state to initialState
 * @function logout
 * @returns Action with type LOGOUT
 */
export const logout = () => {
  return {
    type: 'LOGOUT'
  };
};

/** Changes wether the 'Create a Sprint' view is visible or not
 * @function setShowCreateSprint
 * @param {boolean} visible - wether it is visible or not
 * @returns Action with type SHOW_CREATE_SPRINT  
 */
export const setShowCreateSprint = (visible) => {
  return {
    type: 'SHOW_CREATE_SPRINT',
    payload: {
      visible
    }
  };
};

/** Adds a sprint to the array of sprints
 * @function addSprint
 * @param {Sprint} sprint - sprint to be added
 * @returns Action with type ADD_SPRINT 
 */
export const addSprint = (sprint, workspaceId) => {
  return {
    type: 'ADD_SPRINT',
    payload: {
      sprint,
      workspaceId
    }
  };
};

/** Sets the active sprint that will be shown in sprint view
 * @function selectSprint
 * @param {number} id - id of the sprint to be selected
 * @returns Action with type SELECT_SPRINT
 */
export const selectSprint = (id) => {
  return {
    type: 'SELECT_SPRINT',
    payload: {
      id
    }
  };
};

/** Changes wether the 'Create a Task' view is visible or not
 * @function setShowCreateTask
 * @param {boolean} visible - wether it is visible or not
 * @param {string} type - enum TaskStatus that defaults in create a task view
 * @returns Action with type SHOW_CREATE_TASK  
 */
export const setShowCreateTask = (visible, type = 'TODO') => {
  return {
    type: 'SHOW_CREATE_TASK',
    payload: {
      visible,
      type
    }
  };
};

/** Changes wether the 'Invite Users' view is visible or not
 * @function setShowInvite
 * @param {boolean} visible - wether it is visible or not
 * @returns Action with type SHOW_INVITE_USERS  
 */
export const setShowInvite = (visible) => {
  return {
    type: 'SHOW_INVITE_USERS',
    payload: {
      visible
    }
  };
};

/** Adds a task to the array of tasks of a sprint
 * @function addTask
 * @param {Task} task - task to be added
 * @returns Action with type ADD_TASK 
 */
export const addTask = (task, workspaceId) => {
  return {
    type: 'ADD_TASK',
    payload: {
      task,
      workspaceId
    }
  };
};

/** Updates a task
 * @function updateTask
 * @param {subtask} task - task to be updated
 * @param {number} workspaceId - id of the workspace
 * @returns Action with type UPDATE_TASK
 */
export const updateTask = (task, workspaceId) => {
  return {
    type: 'UPDATE_TASK',
    payload: {
      task,
      workspaceId
    }
  }
};

/** Sets the task that will be displayed in task view
 * @function setShownTask
 * @param {Task} task - task to be added
 * @returns Action with type SET_SHOWN_TASK
 */
export const setShownTask = (task) => {
  return {
    type: 'SET_SHOWN_TASK',
    payload: {
      task
    }
  }
};

/** Updates a subtask
 * @function updateSubTask
 * @param {subtask} subtask - subtask to be updated
 * @param {number} workspaceId - id of the workspace
 * @param {number} taskId - id of the task
 * @returns Action with type UPDATE_SUBTASK
 */
export const updateSubTask = (subtask, workspaceId, taskId) => {
  return {
    type: 'UPDATE_SUBTASK',
    payload: {
      subtask,
      workspaceId,
      taskId
    } 
  };
};

/** Adds a subtask
 * @function addSubtask
 * @param {subtask} subtask - subtask to be added
 * @param {number} workspaceId - id of the workspace
 * @param {number} taskId - id of the task
 * @returns Action with type ADD_SUBTASK
 */
export const addSubtask = (subtask, workspaceId, taskId) => {
  return {
    type: 'ADD_SUBTASK',
    payload: {
      subtask,
      workspaceId,
      taskId
    }
  }
};

/** Adds a comment
 * @function addComment
 * @param {subtask} comment - comment to be added
 * @param {number} workspaceId - id of the workspace
 * @param {number} taskId - id of the task
 * @returns Action with type ADD_COMMENT
 */
export const addComment = (comment, workspaceId, taskId) => {
  return {
    type: 'ADD_COMMENT',
    payload: {
      comment,
      workspaceId,
      taskId
    }
  };
};

/** Changes wether the 'Create a Subtask' input is visible or not
 * @function setShowCreateSubtask
 * @param {boolean} visible - wether it is visible or not
 * @returns Action with type SHOW_CREATE_SUBTASK 
 */
export const setShowCreateSubtask = (visible) => {
  return {
    type: 'SHOW_CREATE_SUBTASK',
    payload: {
      visible
    }
  };
};

/** Changes wether the 'Complete Sprint' view is visible or not
 * @function setShowCompleteSprint
 * @param {boolean} visible - wether it is visible or not
 * @returns Action with type SHOW_COMPLETE_SPRINT 
 */
export const setShowCompleteSprint = (visible) => {
  return {
    type: 'SHOW_COMPLETE_SPRINT',
    payload: {
      visible
    }
  }
};

/** Sends a sprint to the backlog
 * @function setShowCompleteSprint
 * @param {number} workspaceId - id of the workspace
 * @returns Action with type SEND_TO_BACKLOG
 */
export const sendSprintToBacklog = (workspaceId) => {
  return {
    type: 'SEND_TO_BACKLOG',
    payload: {
      workspaceId
    }
  }
};