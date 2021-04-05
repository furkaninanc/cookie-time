import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import socketIOClient, { Socket } from 'socket.io-client';

import Chat from '../../components/Chat';
import Player from '../../components/Player';
import { useAuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';
import styles from './RoomPage.module.scss';

const RoomPage: React.FC = () => {
  const { auth } = useAuthContext();
  const { room }: { room: string } = useParams();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    setSocket(
      socketIOClient(`${process.env.REACT_APP_SOCKET_ENDPOINT}`, {
        transports: ['websocket'],
        upgrade: false,
        query: {
          room,
          username: auth.username,
        },
      })
    );
  }, [auth, room]);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <div className={styles.wrapper}>
        {socket && <Player />}
        <Chat />
      </div>
    </SocketContext.Provider>
  );
};

export default RoomPage;
