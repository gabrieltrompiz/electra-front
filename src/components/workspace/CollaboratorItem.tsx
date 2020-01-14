import React from 'react';
import { Profile } from 'electra';

/**
 * Collaborator item in workspace menu
 * @visibleName Collaborator Item
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const CollaboratorItem: React.FC<CollaboratorItemProps> = ({ user }) => {
  return (
    <div className='collaborator-item'>
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
}