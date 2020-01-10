import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setShowCreateSprint, addSprint } from '../redux/actions';
import Loading from '../components/Loading';
import Calendar from 'react-calendar';
import moment from 'moment';
import { useApolloClient } from '@apollo/react-hooks';
import { logError, logInfo } from '../utils';
import { Sprint, State } from '../types';
import { CREATE_SPRINT } from '../graphql';

const CreateSprint: React.FC<CreateSprintProps> = ({ setShowCreateSprint, workspaceId, addSprint }) => {
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(null);
  const [finishDate, setFinishDate] = useState<Date>(null);
  const [showStartCalendar, setShowStartCalendar] = useState<boolean>(false);
  const [showFinishCalendar, setShowFinishCalendar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const client = useApolloClient();

  useEffect(() => {
    if(startDate && finishDate) {
      if(startDate.getTime() > finishDate.getTime()) {
        setFinishDate(startDate);
      }
    }
  }, [startDate, finishDate]);

  const createSprint = async () => {
    if(title.trim() === '') {
      logError('Title must be provided to create a sprint');
    } else if(!startDate) {
      logError('Start date must be provided to create a sprint');
    } else if(!finishDate) {
      logError('Finish date must be provided to create a sprint');
    } else {
      setLoading(true);
      const sprint: CreateVars["sprint"] = {
        workspaceId,
        title,
        startDate,
        finishDate
      };
      const result = await client.mutate<CreatePayload, CreateVars>({ mutation: CREATE_SPRINT, variables: { sprint },
        errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => setLoading(false));
      if(result.data && result.data.createSprint) {
        logInfo(`Created '${title}' sprint.`);
        addSprint(result.data.createSprint);
        setShowCreateSprint(false);
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    }
  };

  return (
    <div id='create-sprint'>
      {loading && <Loading />}
      <div id='container'>
        <div>
          <p>Create Sprint</p>
          <img src={require('../assets/images/close.png')} alt='close' onClick={() => setShowCreateSprint(false)} />
        </div>
        <div>
          <p>Title <span style={{ color: 'red' }}>*</span></p>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <p>Start Date <span style={{ color: 'red' }}>*</span></p>
          <input readOnly placeholder='Click to show calendar...' onClick={() => { setShowStartCalendar(c => !c); setShowFinishCalendar(false); }}
            value={startDate ? moment(startDate).format('MMMM Do, YYYY') : ''} />
          {showStartCalendar && 
            <Calendar maxDetail='month' minDetail='month' minDate={new Date(Date.now())} value={startDate} returnValue='start' 
              onChange={(d) => { setStartDate(d as Date); setShowStartCalendar(false); }} />}
          <p>Finish Date <span style={{ color: 'red' }}>*</span></p>
          <input readOnly placeholder='Click to show calendar...' onClick={() => { setShowFinishCalendar(c => !c); setShowStartCalendar(false); }} 
            value={finishDate ? moment(finishDate).format('MMMM Do, YYYY') : ''}/>
          {showFinishCalendar && 
            <Calendar maxDetail='month' minDetail='month' minDate={startDate || new Date(Date.now())} value={finishDate} returnValue='start' 
              onChange={(d) => { setFinishDate(d as Date); setShowFinishCalendar(false); }}/>}
        </div>
        <div>
          <button onClick={() => createSprint()}>Create Sprint</button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    workspaceId: userReducer.selectedWorkspace.id
  };
};

export default connect(mapStateToProps, { setShowCreateSprint, addSprint })(CreateSprint);

interface CreateSprintProps {
  /** Method to close this view */
  setShowCreateSprint: Function
  /** id of the workspace */
  workspaceId: number
  /** Add sprint to workspace */
  addSprint: Function
}

interface CreatePayload {
  /** Contains the mutation result */
  createSprint: Sprint
}

interface CreateVars {
  /** Contains the data of the sprint that will be created */
  sprint: {
    /** Title of the sprint */
    title: string
    /** Start date of the sprint */
    startDate: Date
    /** Start date of the sprint */
    finishDate: Date
    /** id of the workspace */
    workspaceId: number
  }
}