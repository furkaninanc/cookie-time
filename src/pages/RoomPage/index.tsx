import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';
import socketIOClient, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import Input from '../../components/Input';
import Player from '../../components/Player';
import { useAuthContext } from '../../contexts/AuthContext';
import logo from '../../logo.svg';
import styles from './RoomPage.module.scss';

let preventEmit = false;

interface IMessage {
  content: string;
  id: string;
  owner: string;
}

const RoomPage: React.FC = () => {
  const { room }: { room: string } = useParams();
  const history = useHistory();
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const { auth } = useAuthContext();
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [sources, setSources] = useState<string>(
    JSON.stringify([
      {
        src: 'https://cdn.plyr.io/static/blank.mp4',
        type: 'video/mp4',
        size: 720,
      },
    ])
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [initialTime, setInitialTime] = useState<number>(0);

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
  };

  const addSystemMessage = useCallback((content: string) => {
    addMessage({ content, id: uuidv4(), owner: '' });
  }, []);

  useEffect(() => {
    setSocket(
      socketIOClient('wss://cookie-time-test.herokuapp.com', {
        transports: ['websocket'],
        upgrade: false,
        query: {
          room,
          username: auth.username,
        },
      })
    );
  }, [auth, room]);

  useEffect(() => {
    if (playing && initialTime && ref?.current?.plyr?.currentTime) {
      ref.current.plyr.currentTime = initialTime;
      setInitialTime(0);
    }
  }, [initialTime, playing]);

  useEffect(() => {
    socket?.on('join', ({ time, video }) => {
      setSources(
        JSON.stringify([
          {
            src: video,
            type: 'video/mp4',
            size: 720,
          },
        ])
      );

      setInitialTime(time);
    });

    socket?.on('disconnect', () => {
      history.push('/');
    });

    socket?.on('message:receive', ({ content, id, owner }) => {
      addMessage({ content, id, owner });
    });

    socket?.on('member:join', ({ username }) => {
      addSystemMessage(`${username} odaya katıldı`);
    });

    socket?.on('member:leave', ({ username }) => {
      addSystemMessage(`${username} odadan ayrıldı`);
    });

    socket?.on('player:state', ({ state, username }) => {
      preventEmit = true;

      if (state === 1) {
        ref?.current?.plyr?.play();
        addSystemMessage(`${username} videoyu başlattı`);
      } else {
        ref?.current?.plyr?.pause();
        addSystemMessage(`${username} videoyu durdurdu`);
      }
    });

    socket?.on('player:seek', ({ time, username }) => {
      addSystemMessage(`${username} video zamanını değiştirdi`);

      if (
        ref?.current?.plyr?.currentTime &&
        Math.abs(ref.current.plyr.currentTime - time) > 2
      ) {
        ref.current.plyr.currentTime = time;
      }
    });

    socket?.on('player:video', ({ video, username }) => {
      addSystemMessage(`${username} videoyu değiştirdi`);

      setSources(
        JSON.stringify([
          {
            src: video,
            type: 'video/mp4',
            size: 720,
          },
        ])
      );
    });
  }, [addSystemMessage, history, socket]);

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
  const onPause: PlyrCallback = useCallback(() => {
    setPlaying(false);

    if (!preventEmit) {
      socket?.emit('player:state', { state: 0 });
    }

    preventEmit = false;
  }, [socket]);
  const onPlay: PlyrCallback = useCallback(() => {
    setPlaying(true);

    if (!preventEmit) {
      socket?.emit('player:state', { state: 1 });
    }

    preventEmit = false;
  }, [socket]);
  const onSeeked: PlyrCallback = useCallback(
    (event) => {
      socket?.emit('player:seek', { time: event.detail.plyr.currentTime });
    },
    [socket]
  );
  const onTimeUpdate: PlyrCallback = useCallback(
    (event) => {
      socket?.emit('player:time', { time: event.detail.plyr.currentTime });
    },
    [socket]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.playerContainer}>
        <Player
          onPause={onPause}
          onPlay={onPlay}
          onSeeked={onSeeked}
          onTimeUpdate={onTimeUpdate}
          ref={ref}
          sources={sources}
        />
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.brandContainer}>
          <div className={styles.logoContainer}>
            <img alt={"It's cookie o'clock somewhere!"} src={logo} />
          </div>
          <div className={styles.titleContainer}>Cookie Time</div>
        </div>
        <div className={styles.messagesContainer}>
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
    </div>
  );
};

export default RoomPage;
