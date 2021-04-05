import { createContext, useContext } from 'react';

import { Socket } from 'socket.io-client';

export interface ISocketContext {
  socket: Socket | undefined;
  setSocket: (
    socket:
      | Socket
      | undefined
      | ((prevSocket: Socket | undefined) => Socket | undefined)
  ) => void;
}

export const SocketContext = createContext<ISocketContext>({
  socket: undefined,
  setSocket: () => {},
});

export const useSocketContext = (): ISocketContext => useContext(SocketContext);
