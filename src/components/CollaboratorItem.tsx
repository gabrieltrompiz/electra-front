import React from 'react';
import { Profile } from '../types';

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