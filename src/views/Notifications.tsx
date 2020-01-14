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
      Notifications
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