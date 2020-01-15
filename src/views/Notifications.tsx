import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setAllNotificationsAsRead, deleteNotification, addWorkspace } from '../redux/actions';
import { State, Notification, NotificationType, Profile, Sprint, Workspace, Task, WorkspaceRole } from 'electra';
import { useApolloClient } from '@apollo/react-hooks';
import { READ_ALL_NOTIFICATIONS, DELETE_NOTIFICATION, JOIN_WORKSPACE, GET_WORKSPACE_BY_ID } from '../graphql';
import { logError, logInfo } from '../utils';
import Loading from '../components/Loading';

/**
 * Notifications View
 * @visibleName Notification View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
*/
const Notifications: React.FC<NotificationProps> = ({ notifications, userId, setAllNotificationsAsRead, deleteNotification, addWorkspace }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const client = useApolloClient();

  const getNotificationText = (type: NotificationType, sender: Profile, obj: Sprint | Workspace | Task ) => {
    switch(type as unknown as String) {
      case 'INVITED_TO_WORKSPACE': return `${sender.fullName} invited you to join to his workspace: ${(obj as Workspace).name}`;
      case 'KICKED_FROM_WORKSPACE': return `You have been kicked from ${(obj as Workspace).name} by ${sender.fullName}`;
      case 'CHANGED_WORKSPACE_ROLE': return `Your role within ${(obj as Workspace).name} has been changed by ${sender.fullName}`
      case 'WORKSPACE_DELETED': return `${sender.fullName} has deleted a workspace from where you were participant: ${(obj as Workspace).name}`
      case 'CREATED_SPRINT': return `${sender.fullName} created a sprint in ${(obj as Workspace).name}`;
      case 'SPRINT_TO_BACKLOG': return `${sender.fullName} sent a sprint to backlog in ${(obj as Workspace).name}`
      case 'ASSIGNED_TASK': return `${sender.fullName} assigned you a task in ${(obj as Sprint).title}`
      case 'CHANGED_TASK_STATUS': return `${sender.fullName} changed the status of ${(obj as Task).name}`;
      case 'CREATED_TASK_COMMENT': return `${sender.fullName} commented on ${(obj as Task).name}`
      case 'CREATED_TASK_SUBTASK': return `${sender.fullName} created a subtask in ${(obj as Task).name}`;
      default: return ''
    }
  }

  const markAllAsRead = async () => {
    setLoading(true);
    const result = await client.mutate<MarkAllPayload>({ mutation: READ_ALL_NOTIFICATIONS, errorPolicy: 'all', fetchPolicy: 'no-cache' })
      .finally(() => setLoading(false));
    if(result.data && result.data.markAllNotificationsAsRead) {
      setAllNotificationsAsRead();
      logInfo(`All notifications have been marked as read.`);
    }
    if(result.errors) result.errors.forEach((e) => logError(e.message));
  }

  const accept = async (n: Notification) => {
    setLoading(true);
    const result = await client.mutate<AddPayload, AddVars>({ mutation: JOIN_WORKSPACE, 
      variables: { input: { userId, workspaceId: (n.target as Workspace).id, role: 'MEMBER' as unknown as WorkspaceRole } },
      errorPolicy: 'all', fetchPolicy: 'no-cache' }).finally(() => setLoading(false));
    if(result.data && result.data.addUserToWorkspace) {
      deleteNotification(n.id);
      // FIXME:
      const ws = await client.query({ query: GET_WORKSPACE_BY_ID, variables: { id: n.target.id }, errorPolicy: 'all', fetchPolicy: 'no-cache' });
      console.log(ws.data)
      addWorkspace(ws.data.workspace);
      logInfo(`You have joined to ${(n.target as Workspace).name}!`);
    }
    if(result.errors) result.errors.forEach((e) => logError(e.message));
  }

  const decline = async (n: Notification) => {
    setLoading(true);
    const id: DeleteVars["id"] = n.id;
    const result = await client.mutate<DeletePayload, DeleteVars>({ mutation: DELETE_NOTIFICATION,
      variables: { id }, fetchPolicy: 'no-cache', errorPolicy: 'ignore' }).finally(() => setLoading(false));
    if(result.data && result.data.deleteNotification) {
      deleteNotification((n.target as Workspace).id);
      logInfo(`Notification Deleted`);
    }
    if(result.errors) result.errors.forEach((e) => logError(e.message));
  }

  console.log(notifications);
  return (
    <div id='notifications'>
      {loading && <Loading />}
      <div id='header'>
        <img src={require('../assets/images/notifications-icon.png')} alt='notifications' />
        <span>Notifications</span>
        <button onClick={() => markAllAsRead()}>Mark All as Read</button>
      </div>
      <div id='content'>
        {notifications.map((n) => 
        <div key={n.id} className='card'>
          <img src={n.sender.pictureUrl} alt='avatar' />
          <span>{getNotificationText(n.type, n.sender, n.target)}</span>
          {n.type as unknown as String === 'INVITED_TO_WORKSPACE' &&
          <div id="buttons">
            <button onClick={() => decline(n)}>Decline Invitation</button>
            <button onClick={() => accept(n)}>Join to Workspace</button>
          </div>}
          {!n.read && <div id="pop"></div>}
        </div>)}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    notifications: userReducer.user ? userReducer.user.notifications : [],
    userId: userReducer.user ? userReducer.user.id : 0
  };
};

export default connect(mapStateToProps, { setAllNotificationsAsRead, deleteNotification, addWorkspace })(Notifications);

interface NotificationProps {
  /** user notifications */
  notifications: Notification[]
  /** logged user id */
  userId: number
  /** method to mark all nots as read */
  setAllNotificationsAsRead: Function
  /** method to delete notification */
  deleteNotification: Function
  /** method to add workspace  */
  addWorkspace: Function
}

interface MarkAllPayload {
  /** Contains the mutation result */
  markAllNotificationsAsRead?: boolean
}

interface DeletePayload {
  /** Contains the mutation result */
  deleteNotification: number
}

interface AddPayload {
  /** Contains the mutation result */
  addUserToWorkspace: number
}

interface DeleteVars {
  id: number
}

interface AddVars {
  input: {
    userId: number
    workspaceId: number
    role: WorkspaceRole
  }
}