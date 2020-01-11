import React from 'react';
import { connect } from 'react-redux';
import { updateSubTask } from '../../redux/actions';
import { SubTask, State } from '../../types';
import { useApolloClient } from '@apollo/react-hooks';
import { CHANGE_SUBTASK_STATUS } from '../../graphql';
import { logInfo, logError } from '../../utils';

/**
 * Subtask item
 * @visibleName Subtask Item
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, setLoading, updateSubTask, taskId, workspaceId }) => {
  const client = useApolloClient();

  const changeStatus = async () => {
    setLoading(true);
    const result = await client.mutate<EditPayload, EditVars>({ mutation: CHANGE_SUBTASK_STATUS, errorPolicy: 'all', fetchPolicy: 'no-cache',
      variables: { status: !subtask.status, subTaskId: subtask.id } })
      .finally(() => setLoading(false));
    if(result.data && result.data.setSubTaskStatus) {
      logInfo('Subtask updated');
      updateSubTask(result.data.setSubTaskStatus, workspaceId, taskId);
    }
    if(result.errors) result.errors.forEach((e) => logError(e.message));
  };
  
  return (
    <div className='st-item' key={subtask.id}>
      <img src={!subtask.status ? require('../../assets/images/not-checked.png') : require('../../assets/images/checked.png')} alt='checked' 
      onClick={() => changeStatus()}/>
      <p>{subtask.description}</p>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    workspaceId: userReducer.selectedWorkspace.id
  };
};

export default connect(mapStateToProps, { updateSubTask })(SubtaskItem);

interface SubtaskItemProps {
  /** Subtask to be shown */
  subtask: SubTask
  /** Toggle loading in parent view */
  setLoading: Function
  /** Method to update subtask */
  updateSubTask: Function
  /** Task id */
  taskId: number
  /** Id of the workspace */
  workspaceId: number
}

interface EditPayload {
  /** Result of the mutation */
  setSubTaskStatus: SubTask
}

interface EditVars {
  /** Status that will be set */
  status: boolean
  /** Subtask id */
  subTaskId: number
}