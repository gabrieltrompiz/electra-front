import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setShowCreateTask, addTask } from '../redux/actions';
import { State, TaskStatus, Member, Task } from '../types';
import Loading from '../components/Loading';
import SearchUsers from '../components/SearchUsers';
import { remove } from 'lodash';
import { useApolloClient } from '@apollo/react-hooks';
import { logError, logInfo } from '../utils';
import { CREATE_TASK } from '../graphql';

const CreateTask: React.FC<CreateTaskProps> = ({ defaultType, setShowCreateTask, sprintId, workspaceId, addTask }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [estimatedHours, setEstimatedHours] = useState<number>(0);
  const [members, setMembers] = useState<Array<Member>>([]);
  const [status, setStatus] = useState<TaskStatus>(defaultType);
  const [loading, setLoading] = useState<boolean>(false);

  const client = useApolloClient();

  const createTask = async () => {
    if(name.trim() === '') {
      logError('Name must be provided to create a task.');
    } else if(description.trim() === '') {
      logError('Description must be provided to create a task.');
    } else if(estimatedHours <= 0) {
      logError('Estimated hours must be greater than 0.')
    } else {
      setLoading(true);
      const task: CreateVars["task"] = {
        sprintId,
        name,
        description,
        status,
        estimatedHours,
        users: members.map((m) => m.user.id)
      }
      const result = await client.mutate<CreatePayload, CreateVars>({ mutation: CREATE_TASK, variables: { task }, 
        errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => setLoading(false));
      if(result.data && result.data.createTask) {
        logInfo(`Created '${name}' task.`);
        addTask(result.data.createTask, workspaceId);
        setShowCreateTask(false);
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    }
  };

  return (
    <div id='create-task'>
      {loading && <Loading />}
      <div id='container'>
        <div>
          <p>Create Task</p>
          <img src={require('../assets/images/close.png')} alt='close' onClick={() => setShowCreateTask(false)} />
        </div>
        <div>
          <p>Name <span style={{ color: 'red' }}>*</span></p>
          <input value={name} onChange={(e) => setName(e.target.value)}/>
          <p>Description <span style={{ color: 'red' }}>*</span></p>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <div>
            <div>
              <p>Estimated Hours <span style={{ color: 'red' }}>*</span></p>
              <input value={estimatedHours} onChange={(e) => setEstimatedHours(parseInt(e.target.value))} />
            </div>
            <div>
              <p>Status <span style={{ color: 'red' }}>*</span></p>
              <select value={status as unknown as string} onChange={(e) => {
                const status: TaskStatus = e.target.value as unknown as TaskStatus;
                setStatus(status);
              }}>
                <option value='TODO'>To Do</option>
                <option value='IN_PROGRESS'>In Progress</option>
                <option value='DONE'>Done</option>
              </select>
            </div>
          </div>
          <p>Assigned To</p>
          <SearchUsers members={members} setMembers={setMembers} />
          <div id='members'>
            {members.map((m) => 
              <div id='user-card' key={m.user.id}>
                <img src={m.user.pictureUrl} alt='avatar' />
                <div>
                  <p>{m.user.fullName}</p>
                  <p>{`@${m.user.username}`}</p>
                </div>
                <img src={require('../assets/images/close-darker.png')} alt='delete' onClick={() => setMembers(remove(members, (u) => m.user.id !== u.user.id))}
                  style={{ width: '15px', height: '15px', marginRight: '22.5px', marginLeft: '20px' }} />
              </div>
            )}
          </div>
        </div>
        <div>
          <button onClick={() => createTask()}>Create Task</button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { settingsReducer, userReducer } = state;
  return {
    defaultType: settingsReducer.show.taskType,
    sprintId: userReducer.selectedSprint.id,
    workspaceId: userReducer.selectedWorkspace.id
  };
};

export default connect(mapStateToProps, { setShowCreateTask, addTask })(CreateTask);

interface CreateTaskProps {
  /** Default task type */
  defaultType: TaskStatus
  /** Method to close this view */
  setShowCreateTask: Function
  /** id of the sprint */
  sprintId: number
  /** id of the workspace */
  workspaceId: number
  /** method to add task to current sprint */
  addTask: Function
}


interface CreatePayload {
  /** Contains the mutation result */
  createTask: Task
}

interface CreateVars {
  /** Contains the data of the task that will be created */
  task: {
    /** id of the sprint */
    sprintId: number
    /** status of the task */
    status: TaskStatus
    /** name of the task */
    name: string
    /** description of the task */
    description: string
    /** estimated hours that the task will take */
    estimatedHours: number
    /** users that will be assignet to this task */
    users: Array<number>
  }
}