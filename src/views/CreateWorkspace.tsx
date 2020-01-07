import React, { useRef, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { setShowCreateWorkspace } from '../redux/actions';
import SearchUsers from '../components/SearchUsers';
import { State, Profile, Member } from '../types';

/**
 * View to create a new workspace
 * @visibleName Create Workspace
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({ setShowCreateWorkspace, user }) => {
  const [members, setMembers] = useState<Array<Member>>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => {
    containerRef.current.classList.toggle('opacityIn');
    containerRef.current.classList.toggle('opacityOut');
    setTimeout(() => {
      setShowCreateWorkspace(false);
    }, 300);
  };

  return (
    <div id='create-workspace' className='opacityIn' ref={containerRef}>
      <div>
        <div>
          <p>Create a Workspace</p>
          <img src={require('../assets/images/close.png')} alt='close' onClick={() => close()} />
        </div>
        <div>
          <p>Name <span style={{ color: 'red' }}>*</span></p>
          <input />
          <p>Description <span style={{ color: 'red' }}>*</span></p>
          <textarea /> 
          {user.gitHubUser && 
          <Fragment>
            <p>GitHub Repository</p>
            <input />
          </Fragment>}
          <p>Members</p>
          <SearchUsers members={members} setMembers={setMembers} />
          <div id='members'>

          </div>
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

export default connect(mapStateToProps, { setShowCreateWorkspace })(CreateWorkspace);

interface CreateWorkspaceProps {
  /** Function to change wether this view is shown or not */
  setShowCreateWorkspace: Function
  /** Logged in user */
  user: Profile
}