import React from 'react';
import { connect } from 'react-redux';
import { State, Notification } from 'electra';

/**
 * Notifications View
 * @visibleName Notification View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Notifications: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div id='notifications'>
      <div id='header'>
        <img src={require('../assets/images/notifications-icon.png')} alt='notifications' />
        <span>Notifications</span>
        <button onClick={() => {}}>Mark All as Read</button>
      </div>
      <div id='content'>
        {notifications.map((n) => 
        <div key={n.id} className='card'>
          <img src={n.sender.pictureUrl} alt='avatar' />
        </div>)}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    notifications: userReducer.user ? userReducer.user.notifications : []
  };
};

export default connect(mapStateToProps)(Notifications);

interface NotificationProps {
  /** user notifications */
  notifications: Notification[]
}