import React from 'react';
import { connect } from 'react-redux';
import { Sprint as SprintI, State, TaskStatus } from '../types';
import { setShowCreateSprint, setShowCreateTask } from '../redux/actions';

/**
 * Active sprint view
 * @visibleName Sprint
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Sprint: React.FC<SprintProps> = ({ sprint, isAdmin, setShowCreateSprint, setShowCreateTask }) => {
  return sprint ? (
    <div id='sprint'>
      <div id='header'>
        <img src={require('../assets/images/active-sprint.png')} alt='sprint' />
        <span>Active Sprint &nbsp;&nbsp;—&nbsp;&nbsp; {sprint.title}</span>
      </div>
      <div id='cards'>
        <div id='to-do'>
          <p>To Do</p>
          <div>
            {sprint.tasks.filter((t) => t.status === 'TODO' as unknown as TaskStatus).map((t) =>
              <div key={t.id}>
                {t.name}
              </div>
            )}
            <button onClick={() => setShowCreateTask(true, 'TODO')}>
              <p>Add a new task</p>
              <img src={require('../assets/images/plus.png')} alt='add' />
            </button>
          </div>
        </div>
        <div id='in-progress'>
          <p>In Progress</p>
          <div>
            {sprint.tasks.filter((t) => t.status === 'IN_PROGRESS' as unknown as TaskStatus).map((t) =>
              <div key={t.id}>
                {t.name}
              </div>
            )}
            <button onClick={() => setShowCreateTask(true, 'IN_PROGRESS')}>
              <p>Add a new task</p>
              <img src={require('../assets/images/plus.png')} alt='add' />
            </button>
          </div>
        </div>
        <div id='done'>
          <p>Done</p>
          <div>
            {sprint.tasks.filter((t) => t.status === 'DONE' as unknown as TaskStatus).map((t) =>
              <div key={t.id}>
                {t.name}
              </div>
            )}
            <button onClick={() => setShowCreateTask(true, 'DONE')}>
              <p>Add a new task</p>
              <img src={require('../assets/images/plus.png')} alt='add' />
            </button>
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

export default connect(mapStateToProps, { setShowCreateSprint, setShowCreateTask })(Sprint);

interface SprintProps {
  /** Sprint of the selected workspace */
  sprint: SprintI
  /** Wether the user is admin or not of the selected workspace */
  isAdmin: boolean
  /** Show the create sprint view */
  setShowCreateSprint: Function
  /** Show the create task view */
  setShowCreateTask: Function
}