import React, { useRef, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { setShowCreateWorkspace, addWorkspace } from '../redux/actions';
import SearchUsers from '../components/SearchUsers';
import { State, Profile, Member, WorkspaceRole, Workspace } from '../types';
import { remove } from 'lodash';
import { useApolloClient } from '@apollo/react-hooks';
import { logError } from '../utils';
import { CREATE_WORKSPACE } from '../graphql';

/**
 * View to create a new workspace
 * @visibleName Create Workspace
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({ setShowCreateWorkspace, user, addWorkspace }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [members, setMembers] = useState<Array<Member>>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const client = useApolloClient();

  const close = () => {
    containerRef.current.classList.toggle('opacityIn');
    containerRef.current.classList.toggle('opacityOut');
    setTimeout(() => {
      setShowCreateWorkspace(false);
    }, 300);
  };

  const createWorkspace = async () => {
    if(name.trim() === '') {
      logError('Name must be provided to create a workspace.');
    } else if(description.trim() === '') {
      logError('Description must be provided to create a Workspace.');
    } else {
      const workspace: CreateVars["workspace"] = { // TODO: Add repoOwner and repoName
        name,
        description,
        members: members.map((m) => ({ id: m.user.id, role: m.role }))
      }
      const result = await client.mutate<CreatePayload, CreateVars>({ mutation: CREATE_WORKSPACE, variables: { workspace }, 
        errorPolicy: 'all', fetchPolicy: 'no-cache' });
      if(result.data && result.data.createWorkspace) {
        addWorkspace(result.data.createWorkspace);
        close();
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    }
  }

  return (
    <div id='create-workspace' className='opacityIn' ref={containerRef}>
      <div>
        <div>
          <p>Create a Workspace</p>
          <img src={require('../assets/images/close.png')} alt='close' onClick={() => close()} />
        </div>
        <div>
          <p>Name <span style={{ color: 'red' }}>*</span></p>
          <input value={name} onChange={(e) => setName(e.target.value)}/>
          <p>Description <span style={{ color: 'red' }}>*</span></p>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} /> 
          {user.gitHubUser && 
          <Fragment>
            <p>GitHub Repository</p>
            <input />
          </Fragment>}
          <p>Members</p>
          <SearchUsers members={members} setMembers={setMembers} />
          <div id='members'>
            {members.map((m) => 
              <div id='user-card' key={m.user.id}>
                <img src={m.user.pictureUrl} alt='avatar' />
                <div>
                  <p>{m.user.fullName}</p>
                  <p>{`@${m.user.username}`}</p>
                </div>
                <select onClick={(e) => e.preventDefault()} value={m.role.toString()} onChange={(e) => {
                  const role: WorkspaceRole = e.target.value as unknown as WorkspaceRole;
                  setMembers([...remove(members, (u) => m.user.id !== u.user.id), { user: m.user, role }])
                }}>
                  <option value='MEMBER'>Member</option>
                  <option value='ADMIN'>Admin</option>
                </select>
                <img src={require('../assets/images/close-darker.png')} alt='delete' onClick={() => setMembers(remove(members, (u) => m.user.id !== u.user.id))}
                  style={{ width: '15px', height: '15px', marginRight: '22.5px', marginLeft: '20px' }} />
              </div>
            )}
          </div>
        </div>
        <div>
          <button onClick={() => createWorkspace()}>Create Workspace</button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    user: userReducer.user
  };
};

export default connect(mapStateToProps, { setShowCreateWorkspace, addWorkspace })(CreateWorkspace);

interface CreateWorkspaceProps {
  /** Function to change wether this view is shown or not */
  setShowCreateWorkspace: Function
  /** Logged in user */
  user: Profile
  /** Method to add workspace to redux store */
  addWorkspace: Function
}

interface CreatePayload {
  /** Contains the mutation result */
  createWorkspace: Workspace
}

interface CreateVars {
  /** Contains the data of the workspace that will be created */
  workspace: {
    /** Name of the workspace */
    name: string
    /** Description of the workspace */
    description: string
    /** Members that will be invited to join the workspace */
    members: {
      /** User id */
      id: number
      /** Role of the user */
      role: WorkspaceRole
    }[]
    /** Repository owner */
    repoOwner?: string
    /** Repository name */
    repoName?: string
  }
}