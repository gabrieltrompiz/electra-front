import React from 'react';
import { connect } from 'react-redux';
import { setShowCreateSubtask } from '../../redux/actions';
import { SubTask, State } from '../../types';
import SubtaskItem from './SubtaskItem';

/**
 * Subtask section in task view
 * @visibleName Subtasks
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Subtasks: React.FC<SubtaskProps> = ({ subtasks, setLoading, taskId, showCreate }) => {
  const completedRatio = parseInt((subtasks.filter((s) => s.status).length / subtasks.length).toString()) * 100;

  return (
    <div id='subtasks'>
      <div>
        <p>{completedRatio}%</p>
        <div id='progress-bar'>
          <div style={{ width: `${completedRatio}%` }} />
        </div>
      </div>
      <div>
        {subtasks.map((st) => <SubtaskItem subtask={st} taskId={taskId} setLoading={setLoading} key={st.id} />)}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { settingsReducer } = state;
  return {
    showCreate: settingsReducer.show.createSubtask,
    subtasks: settingsReducer.show.task.subtasks
  };
};

export default connect(mapStateToProps)(Subtasks);

interface SubtaskProps {
  /** Array of subtasks to be showed */
  subtasks: Array<SubTask>
  /** Toggle loading in parent view */
  setLoading: Function
  /** Task id */
  taskId: number  
  /** show create subtask input or not */
  showCreate: boolean
}