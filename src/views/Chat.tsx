import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addMessage, setChat } from '../redux/actions';
import { Chat as ChatI, State, Message, MessageType, Profile } from 'electra';
import Loading from '../components/Loading';
import { useApolloClient } from '@apollo/react-hooks';
import { logError, logInfo } from '../utils';
import { SEND_MESSAGE } from '../graphql';
import moment from 'moment';

const Chat: React.FC<ChatProps> = ({ chat, workspaceId, addMessage, setChat, user }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const client = useApolloClient();

  const send = async () => {
    if(content.trim() !== '') {
      setLoading(true);
      const message: SendVars["message"] = {
        chatId: chat.id,
        type: 'TEXT' as unknown as MessageType,
        content
      }
      const result = await client.mutate<SendPayload, SendVars>({ mutation: SEND_MESSAGE, variables: { message }, 
        errorPolicy: 'all', fetchPolicy: 'no-cache' })
        .finally(() => setLoading(false));
      if(result.data && result.data.sendMessage) {
        logInfo('Message sent');
        addMessage(result.data.sendMessage, chat.id, workspaceId);
        setChat({ ...chat, messages: [...chat.messages, result.data.sendMessage] });
        setContent('');
      }
      if(result.errors) result.errors.forEach((e) => logError(e.message));
    } else {
      logError('Message cannot be empty.');
    }
  };

  return chat ? (
    <div id='chat-view'>
      <div id='header'>
        <span>{chat.type as unknown as string === 'CHANNEL' ? `#${chat.name}` : 'Chat'}</span>
      </div>
      <div id='content'>
        {chat.messages.length === 0 && <p id='empty'>No messages yet in this {chat.type as unknown as string === 'CHANNEL' ? 'channel.' : 'chat.'}</p>}
        {chat.messages.map((m) => (
          <div className='message' key={m.id}>
            <img src={m.user.pictureUrl} alt='avatar' />
            <div>
              <p>{m.user.fullName}<span>&nbsp;{` ${moment(m.date).format('MM/DD/YYYY hh:mm A')}`}</span></p>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div id='sender'>
        {loading && <Loading />}
        <input placeholder='Send a message...' value={content} onChange={(e) => setContent(e.target.value)} />
        <img src={require('../assets/images/send.png')} alt='send' onClick={() => send()} />
      </div>
    </div>
  ) : <div></div>;
};

const mapStateToProps = (state: State) => {
  const { userReducer, settingsReducer } = state;
  return {
    workspaceId: userReducer.selectedWorkspace ? userReducer.selectedWorkspace.id : 0,
    chat: settingsReducer.show.selectedChat,
    user: userReducer.user
  };
};

export default connect(mapStateToProps, { addMessage, setChat })(Chat);

interface ChatProps {
  /** chat to be shown */
  chat: ChatI
  /** workspace id */
  workspaceId: number
  /** method to add message */
  addMessage: Function
  /** Chagne active chat */
  setChat: Function
  /** logged user */
  user: Profile
}

interface SendPayload {
  /** result of the mutation */
  sendMessage: Message
}

interface SendVars {
  /** container of variables */
  message: {
    /** id of the chat */
    chatId: number
    /** message type */
    type: MessageType
    /** message content */
    content: string
  }
}