import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setShowInvite } from '../../redux/actions';
import Loading from '../Loading';
import SearchUsers from '../SearchUsers';
import { Member, WorkspaceRole, State } from 'electra';
import { remove } from 'lodash';
import { useApolloClient } from '@apollo/react-hooks';
import { INVITE_USER } from '../../graphql';
import { logError, logInfo } from '../../utils';

/**
 * Invite users view
 * @visibleName Invite Users
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const InviteUsers: React.FC<InviteUserProps> = ({ close, workspaceMembers, workspaceId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<Array<Member>>([]);

  const client = useApolloClient();

  const invite = async () => {
    setLoading(true);
    const _members = members.map((m) => ({ id: m.user.id, role: m.role }));
    const result = await client.mutate<InvitePayload, InviteVars>({ mutation: INVITE_USER, variables: { workspace: workspaceId, users: _members } })
    .finally(() => setLoading(false));
    if(!result.errors) {
      logInfo('Users invited to workspace.');
      close();
    } else {
      result.errors.forEach((e) => logError(e.message));
    }
  };

  return (
    <div id='inv-users' className='opacityIn'>
    {loading && <Loading />}
      <div id='container'>
        <div>
          <p>Invite Collaborators</p>
          <img src={require('../../assets/images/close-darker.png')} alt='close' onClick={() => close()} />
        </div>
        <div>
          <SearchUsers members={members} setMembers={setMembers} exclude={workspaceMembers.map((m) => m.user.id)} />
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
                <img src={require('../../assets/images/close-darker.png')} alt='delete' onClick={() => setMembers(remove(members, (u) => m.user.id !== u.user.id))}
                  style={{ width: '15px', height: '15px', marginRight: '22.5px', marginLeft: '20px' }} />
              </div>
            )}
          </div>
        </div>
        {members.length > 0 && 
        <div className='opacityIn'>
          <button onClick={() => invite()}>Invite</button>
        </div>}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    workspaceMembers: userReducer.selectedWorkspace ? userReducer.selectedWorkspace.members : [],
    workspaceId: userReducer.selectedWorkspace ? userReducer.selectedWorkspace.id : 0
  };
};

export default connect(mapStateToProps, { close: () => setShowInvite(false) })(InviteUsers);

interface InviteUserProps {
  /** Function to close this view */
  close: Function
  /** Workspace members */
  workspaceMembers: Member[]
  /** id of the selected workspace */
  workspaceId: number
}

interface InvitePayload {
  /** result of the mutatation */
  inviteUserToWorkspace?: number
}

interface InviteVars {
  /** members to be added */
  users:  {
    /** if of the user */
    id: number
    /** role of the user in the workspace */
    role: WorkspaceRole
  }[]
  /** id of the workspace */
  workspace: number
}