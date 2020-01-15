import React from 'react';
import { Profile } from 'electra';

/**
 * Collaborator item in workspace menu
 * @visibleName Collaborator Item
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const CollaboratorItem: React.FC<CollaboratorItemProps> = ({ user, self, setActive, setChat }) => {
  const open = () => {
    if(!self) {
      setChat();
      setActive('Chat');
    }
  };

  return (
    <div className='collaborator-item' onClick={() => open()}>
      <img src={user.pictureUrl} alt='avatar' />
      <div>
        <p>{user.fullName}</p>
        <p>{`@${user.username}`}</p>
      </div>
    </div>
  );
};

export default CollaboratorItem;

interface CollaboratorItemProps {
  /** User that represent this collaborator */
  user: Profile
  /** wether the user is self */
  self: boolean
  /** change active view */
  setActive: Function
  /** Change active chat view */
  setChat: Function
}