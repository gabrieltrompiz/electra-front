import React from 'react';
import { connect } from 'react-redux';
import { Sprint as SprintI, State } from '../types';
import { setShowCreateSprint } from '../redux/actions';

/**
 * Active sprint view
 * @visibleName Sprint
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Sprint: React.FC<SprintProps> = ({ sprint, isAdmin, setShowCreateSprint }) => {
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

          </div>
        </div>
        <div id='in-progress'>
          <p>In Progress</p>
          <div>

          </div>
        </div>
        <div id='done'>
          <p>Done</p>
          <div>
            
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

export default connect(mapStateToProps, { setShowCreateSprint })(Sprint);

interface SprintProps {
  /** Sprint of the selected workspace */
  sprint: SprintI
  /** Wether the user is admin or not of the selected workspace */
  isAdmin: boolean
  /** Show the create sprint view */
  setShowCreateSprint: Function
}