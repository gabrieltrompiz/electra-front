import React, { useState, useRef, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { setShownTask, setShowCreateSubtask, addComment, updateTask } from '../redux/actions';
import { Task as TaskI, State, TaskComment, TaskStatus, Repository, Member, WorkspaceRole, Issue } from 'electra';
import Loading from '../components/Loading';
import Subtasks from '../components/sprint/Subtasks';
import Comments from '../components/sprint/Comments';
import { useApolloClient } from '@apollo/react-hooks';
import { logError, logInfo } from '../utils';
import { CREATE_COMMENT, CHANGE_TASK_STATUS, CHANGE_TASK_USER, CHANGE_TASK_DESCRIPTION, UPDATE_TASK_HOURS, CHANGE_TASK_ISSUE } from '../graphql';
import SearchUsers from '../components/SearchUsers';
import SearchIssues from '../components/SearchIssues';

/**
 * Active task view
 * @visibleName Task View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Task: React.FC<TaskProps> = ({ task, setShownTask, isAdmin, userId, setShowCreateSubtask, addComment, workspaceId, updateTask, repo, workspaceUsers }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [commentDescription, setCommentDescription] = useState<string>('');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [settingStatus, setSettingStatus] = useState<boolean>(false);
  const [taskDescription, setTaskDescription] = useState<string>(task.description);
  const [editingTaskDesc, setEditingTaskDesc] = useState<boolean>(false);
  const [assigningTask, setAssigningTask] = useState<boolean>(false);
  const [userAssigned, setUserAssigned] = useState<Member>(task.user ? { user: task.user, role: 'MEMBER' as unknown as WorkspaceRole } : null);
  const [isLoggingHours, setIsLoggingHours] = useState<boolean>(false);
  const [hoursToAdd, setHoursToAdd] = useState<number>(0);
  const [assigningIssue, setAssigningIssue] = useState<boolean>(false);
  const [issue, setIssue] = useState<Issue>(task.issue);

  const commentsRef = useRef<HTMLDivElement>(null);

  const client = useApolloClient();

  const isAssigned = task.user ? task.user.id === userId : false;

  useEffect(() => {
    if(task.comments.length > 0) {
      if(task.comments[task.comments.length - 1].user.id === userId) {
        setCommentDescription('');
        if(commentsRef.current) commentsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // eslint-disable-next-line
  }, [task.comments]);

  useEffect(() => {
    changeStatus();
    // eslint-disable-next-line
  }, [status]);

  useEffect(() => {
    if(issue) {
      if(task.issue) {
        if(issue.id !== task.issue.id) {
          assignIssue(true);
        }
      } else {
        assignIssue(true);
      }
    }
    // eslint-disable-next-line
  }, [issue]);

  useEffect(() => {
    if(userAssigned) {
      if(!task.user) {
        changeAssigned();
      }
      else if(userAssigned.user.id !== task.user.id) {
        changeAssigned();
      }
    }
    // eslint-disable-next-line
  }, [userAssigned]);

  const changeStatus = async () => {
    if(status !== task.status) {
      setLoading(true);
      const result = await client.mutate<ChangeStatusPayload, ChangeStatusVars>({ mutation: CHANGE_TASK_STATUS, variables: { status, taskId: task.id },
        errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => setLoading(false));
      if(!result.errors) {
        logInfo('Task status updated.');
        updateTask({ ...task, status: status as unknown as string }, workspaceId);
        setSettingStatus(false);
      } else {
        result.errors.forEach((e) =>  logError(e.message))
      }
    }
  };

  const updateDescription = async () => {
    if(taskDescription.trim() !== '') {
      if(taskDescription.trim() === task.description) {
        logInfo('Task description updated.');
        setEditingTaskDesc(false);
      } else {
        setLoading(true);
        const result = await client.mutate<ChangeDescriptionPayload, ChangeDescriptionVars>({ mutation: CHANGE_TASK_DESCRIPTION, 
          variables: { taskId: task.id, description: taskDescription }, errorPolicy: 'all', fetchPolicy: 'no-cache' })
          .finally(() => setLoading(false));
        if(!result.errors) {
          logInfo('Task description updated.');
          updateTask({ ...task, description: taskDescription }, workspaceId);
          setEditingTaskDesc(false);
        } else {
          result.errors.forEach((e) => logError(e.message));
        }
      }
    } else {
      logError('Task description cannot be empty.');
    }
  };

  const logHours = async () => {
    if(hoursToAdd > 0) {
      setLoading(true);
      const result = await client.mutate<AddHoursPayload, AddHoursVars>({ mutation: UPDATE_TASK_HOURS, 
        variables: { taskId: task.id, hours: hoursToAdd }, errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => setLoading(false));
      if(!result.errors) {
        logInfo('Hours logged to the task.');
        updateTask({ ...task, loggedHours: task.loggedHours + hoursToAdd }, workspaceId);
        setHoursToAdd(0);
        setIsLoggingHours(false);
      }
    } else if(hoursToAdd < 0) {
      logError('Logged hours must be positive.')
    } else {
      logInfo('Hours logged to the task.');
      setHoursToAdd(0);
      setIsLoggingHours(false);
    }
  };

  const changeAssigned = async () => {
    setLoading(true);
    const input: ChangeUserVars["input"] = {
      taskId: task.id,
      userId: userAssigned.user.id
    }
    const result = await client.mutate<ChangeUserPayload, ChangeUserVars>({ mutation: CHANGE_TASK_USER, variables: { input },
      errorPolicy: 'all', fetchPolicy: 'no-cache' })
      .finally(() => setLoading(false));
    if(!result.errors) {
      logInfo('User assigned to task.');
      updateTask({ ...task, user: workspaceUsers.find((m) => m.user.id === userAssigned.user.id).user }, workspaceId);
      setAssigningTask(false);
    } else {
      result.errors.map((e) => logError(e.message));
    }
  };

  const unassignUser = async () => {
    setLoading(true);
    const input: ChangeUserVars["input"] = {
      taskId: task.id,
      userId: null
    }
    const result = await client.mutate<ChangeUserPayload, ChangeUserVars>({ mutation: CHANGE_TASK_USER, variables: { input },
      errorPolicy: 'all', fetchPolicy: 'no-cache' })
      .finally(() => setLoading(false));
    if(!result.errors) {
      logInfo('Unassigned user from task.');
      updateTask({ ...task, user: null }, workspaceId);
      setAssigningTask(false);
    } else {
      result.errors.map((e) => logError(e.message));
    }
  };

  const sendComment = async () => {
    if(commentDescription.trim() !== '') {
      setLoading(true);
      const comment: AddVars["comment"] = {
        description: commentDescription,
        taskId: task.id
      };
      const result = await client.mutate<AddPayload, AddVars>({ mutation: CREATE_COMMENT, variables: { comment },
        errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => setLoading(false));
      if(result.data && result.data.createComment) {
        addComment(result.data.createComment, workspaceId, task.id);
        if(commentsRef.current) commentsRef.current.scrollIntoView({ behavior: 'smooth' });
        logInfo('Comment published.');
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    } else {
      logError('Please enter a comment first.');
    }
  };

  const assignIssue = async (assign: boolean) => {
    setLoading(true);
    const result = await client.mutate<IssuePayload, IssueVars>({ mutation: CHANGE_TASK_ISSUE, 
      variables: { taskId: task.id, issueId: assign ? issue.id : null }, errorPolicy: 'all', fetchPolicy: 'no-cache' })
      .finally(() => setLoading(false));
    if(!result.errors) {
      logInfo('Issue assigned to task.');
      updateTask({ ...task, issue: assign ? issue : null }, workspaceId);
      if(!assign) setIssue(null);
      setAssigningIssue(false);
    }
  };

  return (
    <div id='task'>
      {loading && <Loading />}
      <div id='container'>
        <img src={require('../assets/images/close.png')} alt='close' onClick={() => { setShownTask(null); setShowCreateSubtask(false); }} />
        <div id='content'>
          <div>
            <p>{task.name.toUpperCase()}</p>
            <p>Current Status: &nbsp;
              {task.status as unknown as string === 'TODO' ? 'To Do' : task.status as unknown as string === 'IN_PROGRESS' ? "In Progress" : "Done"}
              <br />
              <p>{`Estimated Time: ${task.estimatedHours}h — Logged Time: ${task.loggedHours}h`}</p>
            </p>
            <p className='subtitles'>
              <img src={require('../assets/images/description.png')} alt='desc' />
              Description
            </p>
            {!editingTaskDesc && <p>{task.description}</p>}
            {editingTaskDesc &&
              <Fragment>
                <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
                <div id='edit-desc'>
                  <button onClick={() => updateDescription()}>Update Description</button>
                </div>
              </Fragment>
            }
            <p className='subtitles'>
              <img src={require('../assets/images/task-list.png')} alt='subtasks' />
              Subtasks
            </p>
            <Subtasks setLoading={setLoading} taskId={task.id} />
            <p className='subtitles'>
              <img src={require('../assets/images/comments.png')} alt='comments' />
              Comments
            </p>
            <Comments ref={commentsRef} />
          </div>
          <div>
            <p>ADD TO TASK</p>
            <button disabled={!isAdmin || (!isAdmin && !isAssigned)} onClick={() => setShowCreateSubtask(true)}>Subtask</button>
            <p>ACTIONS</p>
            {!assigningTask && <button disabled={!isAdmin} onClick={() => setAssigningTask(true)}>Assign Task</button>}
            {assigningTask && <SearchUsers members={!!userAssigned ? [userAssigned] : []} setMembers={(u: any) => setUserAssigned(u[0])} 
              toFilter={workspaceUsers} showSelf={true} />}
            {!settingStatus && <button disabled={!isAdmin || (!isAdmin && !isAssigned)} onClick={() => setSettingStatus(true)}>Change Status</button>}
            {settingStatus && 
            <select value={status as unknown as string} onChange={(e) => {
              const status: TaskStatus = e.target.value as unknown as TaskStatus;
              setStatus(status);
            }}>
              <option value='TODO'>To Do</option>
              <option value='IN_PROGRESS'>In Progress</option>
              <option value='DONE'>Done</option>
            </select>}
            <button onClick={() => setEditingTaskDesc(t => !t)}>Edit task description</button>
            {!isLoggingHours && <button disabled={!isAssigned} onClick={() => setIsLoggingHours(true)}>Log Hours</button>}
            {isLoggingHours && 
            <div id='hours-logger'>
              <input type='numeric' value={hoursToAdd} onChange={(e) => 
                setHoursToAdd(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))} />
              <button onClick={() => logHours()}>Add</button>
            </div>}
            {repo && <p>GITHUB ISSUE</p>}
            {repo && !assigningIssue && !issue &&
              <button disabled={!isAdmin || (!isAdmin && !isAssigned)} onClick={() => setAssigningIssue(true)}>Assign GitHub Issue</button>}
            {repo && issue && 
            <div id='issue'>
              <p>{issue.title}</p>
              <p>State: <span style={{ color: issue.state as unknown as string === 'OPEN' ? 'green' : 'red' }}>
                {issue.state as unknown as string}
              </span></p>
              <img src={require('../assets/images/close.png')} alt='close' onClick={() => assignIssue(false)}/>
            </div>}
            {repo && assigningIssue && !issue &&
            <SearchIssues issues={repo.issues.nodes} setSelectedIssue={setIssue}/>}
            <p>ASSIGNED TO</p>
            {task.user && <div id='assignees'>
              <div className='task-user-item'>
                <img src={task.user.pictureUrl} alt='avatar' />
                <img src={require('../assets/images/close.png')} alt='delete' onClick={() => unassignUser()}/>
                <div>
                  <p>{task.user.fullName}</p>
                  <p>{`@${task.user.username}`}</p>
                </div>
              </div>
            </div>}
            {!task.user && <p id='no-user'>No user assigned.</p>}
          </div>
        </div>
        <div id='comment-bar'>
          <input placeholder='Add a comment...' value={commentDescription} onChange={(e) => setCommentDescription(e.target.value)}/>
          <img src={require('../assets/images/send.png')} alt='send' onClick={() => sendComment()} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer, settingsReducer } = state;
  return {
    isAdmin: userReducer.isAdmin,
    userId: userReducer.user.id,
    task: settingsReducer.show.task,
    workspaceId: userReducer.selectedWorkspace.id,
    repo: userReducer.selectedWorkspace.repo,
    workspaceUsers: userReducer.selectedWorkspace.members
  };
};

export default connect(mapStateToProps, { setShownTask, setShowCreateSubtask, addComment, updateTask })(Task);

interface TaskProps {
  /** task to be displayed */
  task: TaskI
  /** Method to close this view */
  setShownTask: Function
  /** Wether the user is admin of this workspace or not */
  isAdmin: boolean
  /** logged user id */
  userId: number
  /** Function to change wether the create subtask input is shown or not */
  setShowCreateSubtask: Function
  /** Method to add comment */
  addComment: Function
  /** Id of the workspace */
  workspaceId: number
  /** update task method */
  updateTask: Function
  /** Workspace repository */
  repo: Repository
  /** Workspace members */
  workspaceUsers: Member[]
}

interface AddPayload {
  /** result of the mutation */
  createComment: TaskComment
}

interface AddVars {
  /** container of the vars */
  comment: {
    /** Description of the comment */
    description: string
    /** id of the task */
    taskId: number
  }
}

interface ChangeStatusPayload {
  /** result of the mutation */
  updateTaskStatus?: TaskStatus 
}

interface ChangeStatusVars {
  /** status to be set */
  status: TaskStatus
  /** id of the task */
  taskId: number
}

interface ChangeUserPayload {
  /** result of the mutation */
  changeUserTask?: number
}

interface ChangeUserVars {
  /** container of the vars */
  input: {
    /** id of the task */
    taskId: number
    /** id of the user */
    userId?: number
  }
}

interface ChangeDescriptionPayload {
  /** container of the mutation */
  changeTaskDescription?: TaskI
}

interface ChangeDescriptionVars {
  /** id of the task */
  taskId: number
  /** new description of the task */
  description: string
}

interface AddHoursPayload {
  /** result of the mutation */
  updateTaskHours?: number
}

interface AddHoursVars {
  /** id of the task */
  taskId: number
  /** hours to be added */
  hours: number
}

interface IssuePayload {
  /** result of the mutation */
  changeTaskIssue?: number
}

interface IssueVars {
  /** id of the task */
  taskId: number
  /** id of the issue */
  issueId?: string
}