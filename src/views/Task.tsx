import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { setShownTask, setShowCreateSubtask, addComment, updateTask } from '../redux/actions';
import { Task as TaskI, State, TaskComment, TaskStatus, Repository, Member, WorkspaceRole } from '../types';
import Loading from '../components/Loading';
import Subtasks from '../components/sprint/Subtasks';
import Comments from '../components/sprint/Comments';
import { useApolloClient } from '@apollo/react-hooks';
import { logError, logInfo } from '../utils';
import { CREATE_COMMENT, CHANGE_TASK_STATUS, CHANGE_TASK_USER } from '../graphql';
import SearchUsers from '../components/SearchUsers';

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
    if(userAssigned) {
      if(!task.user) {
        changeAssigned();
      }
      else if(userAssigned.user.id !== task.user.id) {
        changeAssigned();
      }
    }
  }, [userAssigned])

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
        setLoading(false);
        addComment(result.data.createComment, workspaceId, task.id);
        if(commentsRef.current) commentsRef.current.scrollIntoView({ behavior: 'smooth' });
        logInfo('Comment published.');
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    } else {
      logError('Please enter a comment first.');
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
            </p>
            <p>
              <img src={require('../assets/images/description.png')} alt='desc' />
              Description
            </p>
            <p>{task.description}</p>
            <p>
              <img src={require('../assets/images/task-list.png')} alt='subtasks' />
              Subtasks
            </p>
            <Subtasks setLoading={setLoading} taskId={task.id} />
            <p>
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
            {assigningTask && <SearchUsers members={!!userAssigned ? [userAssigned] : []} setMembers={(u: any) => setUserAssigned(u[0])} toFilter={workspaceUsers} />}
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
            <button disabled={!isAssigned}>Log Hours</button>
            {repo && <p>GITHUB ISSUE</p>}
            {repo && <button disabled={!isAdmin || (!isAdmin && !isAssigned)}>Assign GitHub Issue</button>}
            <p>ASSIGNED TO</p>
            {task.user && <div id='assignees'>
              <div className='task-user-item'>
                <img src={task.user.pictureUrl} alt='avatar' />
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
    userId: number
  }
}