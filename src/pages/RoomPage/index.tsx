import { useCallback, useRef, useState } from 'react';

import { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';

import Input from '../../components/Input';
import Player from '../../components/Player';
import logo from '../../logo.svg';
import styles from './RoomPage.module.scss';

interface IMessage {
  owner: string;
  content: string;
}

const RoomPage: React.FC = () => {
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onChange = (event: any) => setMessage(event.target.value);
  const onKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.push({
          owner: 'furkan',
          content: message,
        });

        return newMessages;
      });

      setMessage('');
    }
  };
  const onPause: PlyrCallback = useCallback((event) => {}, []);
  const onPlay: PlyrCallback = useCallback((event) => {}, []);
  const onSeeked: PlyrCallback = useCallback((event) => {}, []);
  const onTimeUpdate: PlyrCallback = useCallback((event) => {}, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.playerContainer}>
        <Player
          onPause={onPause}
          onPlay={onPlay}
          onSeeked={onSeeked}
          onTimeUpdate={onTimeUpdate}
          ref={ref}
          sources={JSON.stringify([
            {
              src: 'https://furkaninanc.com/minisync/lost/3x5.mp4',
              type: 'video/mp4',
              size: 720,
            },
            {
              src: 'https://furkaninanc.com/minisync/lost/3x5.mp4',
              type: 'video/mp4',
              size: 1080,
            },
          ])}
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
            messages.map(({ content, owner }) => (
              <div className={styles.messageContainer}>
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
