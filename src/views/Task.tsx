import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setShownTask, setShowCreateSubtask } from '../redux/actions';
import { Task as TaskI, State } from '../types';
import Loading from '../components/Loading';
import Subtasks from '../components/sprint/Subtasks';

/**
 * Active task view
 * @visibleName Task View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Task: React.FC<TaskProps> = ({ task, setShownTask, isAdmin, userId, setShowCreateSubtask }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const isAssigned = task.users.findIndex((u) => u.id === userId) !== -1;

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
            
          </div>
          <div>
            <p>ADD TO TASK</p>
            <button disabled={!isAdmin || (!isAdmin && !isAssigned)} onClick={() => setShowCreateSubtask(true)}>Subtask</button>
            <p>ACTIONS</p>
            <button disabled={!isAdmin}>Assign Task</button>
            <button disabled={!isAdmin || (!isAdmin && !isAssigned)}>Change Status</button>
            <button disabled={!isAdmin}>Delete Task</button>
            <p>GITHUB ISSUE</p>
            <button disabled={!isAdmin || (!isAdmin && !isAssigned)}>Assign GitHub Issue</button>
            <p>ASSIGNED TO</p>
            <div id='assignees'>
              {task.users.map((u) => (
                <div className='task-user-item' key={u.id}>
                  <img src={u.pictureUrl} alt='avatar' />
                  <div>
                    <p>{u.fullName}</p>
                    <p>{`@${u.username}`}</p>
                  </div>
                </div>
              ))}
              {task.users.length === 0 && <p>No users assigned.</p>}
            </div>
          </div>
        </div>
        <div id='comment-bar'>
          <input placeholder='Add a comment...' />
          <img src={require('../assets/images/send.png')} alt='send' />
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
    task: settingsReducer.show.task
  };
};

export default connect(mapStateToProps, { setShownTask, setShowCreateSubtask })(Task);

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
}