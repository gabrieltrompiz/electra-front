import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { setShowCreateSubtask, addSubtask } from '../../redux/actions';
import { SubTask, State } from 'electra';
import SubtaskItem from './SubtaskItem';
import { useApolloClient } from '@apollo/react-hooks';
import { CREATE_SUBTASK } from '../../graphql';
import { logError, logInfo } from '../../utils';

/**
 * Subtask section in task view
 * @visibleName Subtasks
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Subtasks: React.FC<SubtaskProps> = ({ subtasks, setLoading, taskId, showCreate, setShowCreate, addSubtask, workspaceId }) => {
  const [description, setDescription] = useState<string>('');
  const [ratio, setRatio] = useState<number>(Math.floor((subtasks.filter((s) => s.status).length / subtasks.length) * 100));

  const subtaskRef = useRef<HTMLDivElement>(null);

  const client = useApolloClient();

  useEffect(() => {
    setRatio(Math.floor((subtasks.filter((s) => s.status).length / subtasks.length) * 100));
  }, [subtasks]);

  useEffect(() => {
    if(subtaskRef.current) subtaskRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [showCreate])

  const add = async () => {
    if(description.trim() !== '') {
      setLoading(true);
      const subtask: AddVars["subtask"] = {
        description,
        taskId
      };
      const result = await client.mutate<AddPayload, AddVars>({ mutation: CREATE_SUBTASK, variables: { subtask },
        errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => { setLoading(false); setDescription(''); });
      if(result.data && result.data.createSubTask) {
        setLoading(false);
        setShowCreate(false);
        addSubtask(result.data.createSubTask, workspaceId, taskId);
        if(subtaskRef.current) subtaskRef.current.scrollIntoView({ behavior: 'smooth' });
        logInfo('Subtask added.');
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    } else {
      logError('Please enter a description for the subtask.');
    }
  };

  return (
    <div id='subtasks'>
      <div>
        <p>{isNaN(ratio) ? 0 : ratio}%</p>
        <div id='progress-bar'>
          <div style={{ width: `${ratio}%` }} />
        </div>
      </div>
      <div>
        {subtasks.length > 0 && subtasks.map((st) => <SubtaskItem subtask={st} taskId={taskId} setLoading={setLoading} key={st.id} />)}
        {subtasks.length === 0 && <div id='no-subtasks'>No subtasks created in this task.</div>}
        {showCreate && 
        <div id='create-subtask' ref={subtaskRef}>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Subtask description...'></input>
          <button onClick={() => add()}>Add</button>
        </div>}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { settingsReducer, userReducer } = state;
  return {
    showCreate: settingsReducer.show.createSubtask,
    subtasks: settingsReducer.show.task.subtasks,
    workspaceId: userReducer.selectedWorkspace.id
  };
};

export default connect(mapStateToProps, { setShowCreate: setShowCreateSubtask, addSubtask })(Subtasks);

interface SubtaskProps {
  /** Array of subtasks to be showed */
  subtasks: Array<SubTask>
  /** Toggle loading in parent view */
  setLoading: Function
  /** Task id */
  taskId: number  
  /** show create subtask input or not */
  showCreate: boolean
  /** To reset set show create to default */
  setShowCreate: Function
  /** method to add subtask */
  addSubtask: Function
  /** Selected workspace id */
  workspaceId: number
}

interface AddPayload {
  /** result of the mutation */
  createSubTask: SubTask
}

interface AddVars {
  /** container of the vars */
  subtask: {
    /** Description of the subtask */
    description: string
    /** id of the task */
    taskId: number
  }
}