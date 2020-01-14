import React from 'react';
import { connect } from 'react-redux';
import { State, Sprint, Task } from '../types';
import moment from 'moment';
import { sum } from 'lodash';

/**
 * Sprint backlog view
 * @visibleName Backlog
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Backlog: React.FC<BacklogProps> = ({ backlog }) => {
  return (
    <div id='backlog'>
      <div id='header'>
        <img src={require('../assets/images/backlog.png')} alt='sprint' />
        <span>Sprint Backlog &nbsp;&nbsp;—&nbsp;&nbsp; {backlog.length} {backlog.length === 1 && 'Sprint'} {backlog.length !== 1 && 'Sprints'}</span>
      </div>
      <div id="table-container">
        <table>
          <tr>
            <th>Title</th>
            <th>Start Date</th>
            <th>Finish Date</th>
            <th>Completion Date</th>
            <th>Estimated Hrs.</th>
            <th>Total Logged Hrs.</th>
            <th># of Tasks</th>
          </tr>
          <tbody>
            {backlog.map((s) =>
            <tr>
              <td>{s.title}</td>
              <td>{moment(s.startDate).format('MMMM Do, YYYY')}</td>
              <td>{moment(s.finishDate).format('MMMM Do, YYYY')}</td>
              <td>{moment(s.endDate).format('MMMM Do, YYYY')}</td>
              <td>{sum(s.tasks.map((t) => t.estimatedHours)) + 'Hrs'}</td>
              <td>{sum(s.tasks.map((t) => t.loggedHours)) + 'Hrs'}</td>
              <td>{s.tasks.length}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    backlog: userReducer.selectedWorkspace.backlog
  }
}

export default connect(mapStateToProps)(Backlog);

interface BacklogProps {
  /** Backlog */
  backlog: Sprint[];
}