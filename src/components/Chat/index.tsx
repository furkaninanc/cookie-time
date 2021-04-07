import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import cs from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { useSocketContext } from '../../contexts/SocketContext';
import eye from '../../images/eye.svg';
import logo from '../../images/logo.svg';
import send from '../../images/send.svg';
import Button from '../Button';
import Input from '../Input';
import styles from './Chat.module.scss';

interface IMember {
  time: number;
  username: string;
}

interface IMessage {
  content: string;
  id: string;
  owner: string;
}

const Chat: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocketContext();
  const [members, setMembers] = useState<IMember[]>([]);
  const [memberList, setMemberList] = useState<boolean>(false);
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

  const addMember = (username: string) =>
    setMembers((prevMembers) => {
      const newMembers = [...prevMembers];
      newMembers.push({
        time: 0,
        username,
      });

      return newMembers;
    });

  const removeMember = (username: string) =>
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.username !== username)
    );

  const updateMemberTime = (username: string, time: number) =>
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.username !== username) return member;

        const newMember = { ...member };
        newMember.time = time;
        return newMember;
      })
    );

  useEffect(() => {
    socket?.on('join', ({ members: membersOnJoin }: { members: IMember[] }) => {
      addSystemMessage(`Odaya katıldın`);
      addSystemMessage(
        `!video komutu ile videoyu değiştirebilirsin (!video video-url)`
      );
      setMembers(membersOnJoin);
    });
    socket?.on('message:receive', ({ content, id, owner }) =>
      addMessage({ content, id, owner })
    );
    socket?.on('member:join', ({ username }) => addMember(username));
    socket?.on('member:leave', ({ username }) => removeMember(username));
    socket?.on('member:time', ({ time, username }) => {
      updateMemberTime(username, time);
    });
    socket?.on('player:video', ({ username }) =>
      addSystemMessage(`${username} videoyu değiştirdi`)
    );
    socket?.on('player:seek', ({ username }) =>
      addSystemMessage(`${username} video zamanını değiştirdi`)
    );
    socket?.on('player:speed', ({ speed, username }) =>
      addSystemMessage(`${username} video hızını ${speed}x olarak değiştirdi`)
    );
    socket?.on('player:state', ({ state, username }) => {
      if (state === 1) {
        addSystemMessage(`${username} videoyu başlattı`);
      } else {
        addSystemMessage(`${username} videoyu durdurdu`);
      }
    });
  }, [addSystemMessage, socket]);

  const handleMessageSubmit = () => {
    if (message.startsWith('!video ')) {
      const [, video] = message.split('!video ');
      socket?.emit('player:video', { video });
    } else {
      socket?.emit('message:send', { content: message });
    }
    setMessage('');
  };

  const onChange = (event: any) => setMessage(event.target.value);
  const onKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      handleMessageSubmit();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.headerSideContainer} />
        <div className={styles.brandContainer}>
          <div className={styles.logoContainer}>
            <img alt={"It's cookie o'clock somewhere!"} src={logo} />
          </div>
          <Link to="/">
            <div className={styles.titleContainer}>Cookie Time</div>
          </Link>
        </div>
        <div className={styles.headerSideContainer}>
          <Button
            className={styles.membersButton}
            onClick={() => setMemberList(!memberList)}
          >
            <img
              alt="İzleyici sayısı"
              className={styles.membersButtonIcon}
              src={eye}
            />{' '}
            {members.length}
          </Button>
        </div>
      </div>
      <div className={cs(styles.membersWrapper, memberList && styles.active)}>
        <div className={styles.membersContainer}>
          {members &&
            members.map((member) => (
              <div className={styles.memberContainer}>
                <div className={styles.memberUsername}>{member.username}</div>
                <div className={styles.memberTime}>
                  {new Date(member.time * 1000).toISOString().substr(11, 8)}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        {messages &&
          messages.map(({ content, id, owner }) => (
            <div className={styles.messageContainer} key={id}>
              <div className={styles.messageOwner}>{owner}</div>
              <div className={styles.messageContent}>{content}</div>
            </div>
          ))}
      </div>
      <div className={styles.footerContainer}>
        <div className={styles.newMessageContainer}>
          <Input
            className={styles.newMessage}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Bir mesaj gönder..."
            value={message}
          />
        </div>
        <div className={styles.sendButtonContainer}>
          <Button className={styles.sendButton} onClick={handleMessageSubmit}>
            <img
              alt="Mesajı gönder"
              className={styles.sendButtonIcon}
              src={send}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
