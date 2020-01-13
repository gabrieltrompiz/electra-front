import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setShowCompleteSprint, sendSprintToBacklog } from '../../redux/actions';
import Loading from '../Loading';
import { State } from '../../types';
import { useApolloClient } from '@apollo/react-hooks';
import { logError, logInfo } from '../../utils';
import { COMPLETE_SPRINT } from '../../graphql';

const CompleteSprint: React.FC<CompleteSprintProps> = ({ setShowCompleteSprint, sprintId, sendSprintToBacklog, workspaceId }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const client = useApolloClient();

  const complete = async () => {
    setLoading(true);
    const result = await client.mutate<CompletePayload, CompleteVars>({ mutation: COMPLETE_SPRINT, variables: { id: sprintId },
      errorPolicy: 'all', fetchPolicy: 'no-cache' })
      .finally(() => setLoading(false));
    if(!result.errors) {
      logInfo('Sprint sent to backlog.');
      setShowCompleteSprint(false);
      sendSprintToBacklog(workspaceId);
    } else {
      result.errors.map((e) => logError(e.message))
    }
  };

  return (
    <div id='complete-sprint'>
    {loading && <Loading />}
      <div id='container'>
        <div>
          <p>Complete Sprint</p>
          <img src={require('../../assets/images/close.png')} alt='close' onClick={() => setShowCompleteSprint(false)} />
        </div>
        <div>
          <p>Are you sure you want to complete the current sprint? This action <b>CANNOT</b> be undone.</p>
        </div>
        <div>
          <button onClick={() => complete()}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    sprintId: userReducer.selectedSprint.id,
    workspaceId: userReducer.selectedWorkspace.id
  };
};

export default connect(mapStateToProps, { setShowCompleteSprint, sendSprintToBacklog })(CompleteSprint);

interface CompleteSprintProps {
  /** id of the sprint */
  sprintId: number
  /** Method to close this view */
  setShowCompleteSprint: Function
  /** selected worksapce id */
  workspaceId: number
  /** method to send sprint to backlog */
  sendSprintToBacklog: Function
}

interface CompletePayload {
  /** results of the mutation */
  sendSprintToBacklog?: number
}

interface CompleteVars {
  /** id of the sprint */
  id: number
}