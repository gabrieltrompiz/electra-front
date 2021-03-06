import React from 'react';
import { connect } from 'react-redux';
import { Sprint as SprintI, State, TaskStatus } from 'electra';
import { setShowCreateSprint, setShowCreateTask, setShowCompleteSprint } from '../redux/actions';
import TaskItem from '../components/sprint/TaskItem';
import moment from 'moment';

/**
 * Active sprint view
 * @visibleName Sprint
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Sprint: React.FC<SprintProps> = ({ sprint, isAdmin, setShowCreateSprint, setShowCreateTask, setShowCompleteSprint }) => {
  const todo = sprint ? sprint.tasks.filter((t) => t.status === 'TODO' as unknown as TaskStatus) : [];
  const inProgress = sprint ? sprint.tasks.filter((t) => t.status === 'IN_PROGRESS' as unknown as TaskStatus) : [];
  const done = sprint ? sprint.tasks.filter((t) => t.status === 'DONE' as unknown as TaskStatus) : [];

  return sprint ? (
    <div id='sprint'>
      <div id='header'>
        <img src={require('../assets/images/active-sprint.png')} alt='sprint' />
        <span>Active Sprint &nbsp;&nbsp;—&nbsp;&nbsp; {sprint.title} &nbsp;&nbsp;—&nbsp;&nbsp; 
          Due Date: &nbsp; {moment(sprint.finishDate).format('MMMM Do, YYYY')} </span>
        {isAdmin && <button onClick={() => setShowCompleteSprint(true)}>Complete Sprint</button>}
      </div>
      <div id='cards'>
        <div id='to-do'>
          <p>TO DO</p>
          <p>{`${todo.length} ${todo.length === 1 ? 'task' : 'tasks'}`}</p>
          <div id='container'>
            <div>
              {todo.map((t) => <TaskItem task={t} key={t.id} />)}
              <button onClick={() => setShowCreateTask(true, 'TODO')}>
                <p>Add a new task</p>
                <img src={require('../assets/images/plus.png')} alt='add' />
              </button>
            </div>
          </div>
        </div>
        <div id='in-progress'>
          <p>IN PROGRESS</p>
          <p>{`${inProgress.length} ${inProgress.length === 1 ? 'task' : 'tasks'}`}</p>
          <div id='container'>
            <div>
              {inProgress.map((t) => <TaskItem task={t} key={t.id} />)}
              <button onClick={() => setShowCreateTask(true, 'IN_PROGRESS')}>
                <p>Add a new task</p>
                <img src={require('../assets/images/plus.png')} alt='add' />
              </button>
            </div>
          </div>
        </div>
        <div id='done'>
          <p>DONE</p>
          <p>{`${done.length} ${done.length === 1 ? 'task' : 'tasks'}`}</p>
          <div id='container'>
            <div>
              {done.map((t) => <TaskItem task={t} key={t.id} />)}
              {isAdmin && <button onClick={() => setShowCreateTask(true, 'DONE')}>
                <p>Add a new task</p>
                <img src={require('../assets/images/plus.png')} alt='add' />
              </button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div id='empty-sprint'>
      <p>No active sprint.</p>
      {isAdmin && 
      <button onClick={() => setShowCreateSprint(true)}>Create Sprint</button>}
      {!isAdmin &&
      <p>Ask an administrator to create a new sprint.</p>}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    sprint: userReducer.selectedSprint,
    isAdmin: userReducer.isAdmin
  };  
};

export default connect(mapStateToProps, { setShowCreateSprint, setShowCreateTask, setShowCompleteSprint })(Sprint);

interface SprintProps {
  /** Sprint of the selected workspace */
  sprint: SprintI
  /** Wether the user is admin or not of the selected workspace */
  isAdmin: boolean
  /** Show the create sprint view */
  setShowCreateSprint: Function
  /** Show the create task view */
  setShowCreateTask: Function
  /** Function to show complete sprint view */
  setShowCompleteSprint: Function
}