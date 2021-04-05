import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import { useSocketContext } from '../../contexts/SocketContext';
import logo from '../../logo.svg';
import Input from '../Input';
import styles from './Chat.module.scss';

interface IMessage {
  content: string;
  id: string;
  owner: string;
}

const Chat: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocketContext();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);

  const addMessage = ({ content, id, owner }: IMessage) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      newMessages.push({
        content,
        id,
        owner,
      });

      return newMessages;
    });

    if (messagesContainerRef?.current) {
      messagesContainerRef.current.scrollTop = Number.MAX_SAFE_INTEGER;
    }
  };

  const addSystemMessage = useCallback((content: string) => {
    addMessage({ content, id: uuidv4(), owner: '' });
  }, []);

  useEffect(() => {
    socket?.on('message:receive', ({ content, id, owner }) =>
      addMessage({ content, id, owner })
    );
    socket?.on('member:join', ({ username }) =>
      addSystemMessage(`${username} odaya katıldı`)
    );
    socket?.on('member:leave', ({ username }) =>
      addSystemMessage(`${username} odadan ayrıldı`)
    );
    socket?.on('player:video', ({ username }) =>
      addSystemMessage(`${username} videoyu değiştirdi`)
    );
    socket?.on('player:seek', ({ username }) =>
      addSystemMessage(`${username} video zamanını değiştirdi`)
    );
    socket?.on('player:state', ({ state, username }) => {
      if (state === 1) {
        addSystemMessage(`${username} videoyu başlattı`);
      } else {
        addSystemMessage(`${username} videoyu durdurdu`);
      }
    });
  }, [addSystemMessage, socket]);

  const onChange = (event: any) => setMessage(event.target.value);
  const onKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      if (message.startsWith('!video ')) {
        const [, video] = message.split('!video ');
        socket?.emit('player:video', { video });
      } else {
        socket?.emit('message:send', { content: message });
      }
      setMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <Link to="/">
        <div className={styles.brandContainer}>
          <div className={styles.logoContainer}>
            <img alt={"It's cookie o'clock somewhere!"} src={logo} />
          </div>
          <div className={styles.titleContainer}>Cookie Time</div>
        </div>
      </Link>
      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        {messages &&
          messages.map(({ content, id, owner }) => (
            <div className={styles.messageContainer} key={id}>
              <div className={styles.messageOwner}>{owner}</div>
              <div className={styles.messageContent}>{content}</div>
            </div>
          ))}
      </div>
      <div className={styles.newMessageContainer}>
        <Input
          className={styles.newMessage}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Bir mesaj gönder..."
          value={message}
        />
      </div>
    </div>
  );
};

export default Chat;
