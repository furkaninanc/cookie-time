import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';

import { useSocketContext } from '../../contexts/SocketContext';
import PlyrWrapper from '../PlyrWrapper';
import styles from './Player.module.scss';

let initialized = false;
let preventEmit = false;

const Player: React.FC = () => {
  const history = useHistory();
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const { socket } = useSocketContext();

  const setSource = (video: string) => {
    if (ref?.current?.plyr) {
      ref.current.plyr.source = {
        type: 'video',
        sources: [
          {
            src: video,
            type: 'video/mp4',
            size: 720,
          },
        ],
      };
    }
  };

  useEffect(() => {
    socket?.on('join', ({ time, video }) => {
      setSource(video);

      const timer = setInterval(() => {
        if (
          ref?.current?.plyr &&
          ref.current.plyr.source === video &&
          ref.current.plyr.buffered > 0
        ) {
          ref.current.plyr.currentTime = time;
          initialized = true;
          clearInterval(timer);
        }
      }, 100);
    });

    socket?.on('disconnect', () => {
      history.push('/');
    });

    socket?.on('player:state', async ({ state }) => {
      preventEmit = true;

      if (state === 1) {
        await ref?.current?.plyr?.play();
      } else {
        await ref?.current?.plyr?.pause();
      }

      preventEmit = false;
    });

    socket?.on('player:seek', ({ time }) => {
      if (
        ref?.current?.plyr?.currentTime &&
        Math.abs(ref.current.plyr.currentTime - time) > 2
      ) {
        ref.current.plyr.currentTime = time;
      }
    });

    socket?.on('player:video', ({ video }) => {
      setSource(video);
    });
  }, [history, socket]);

  const onPause: PlyrCallback = useCallback(() => {
    if (!preventEmit) {
      socket?.emit('player:state', { state: 0 });
    }
  }, [socket]);

  const onPlay: PlyrCallback = useCallback(() => {
    if (!preventEmit) {
      socket?.emit('player:state', { state: 1 });
    }
  }, [socket]);

  const onSeeked: PlyrCallback = useCallback(
    (event) => {
      if (initialized) {
        socket?.emit('player:seek', { time: event.detail.plyr.currentTime });
      }
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
    <div className={styles.playerContainer}>
      <PlyrWrapper
        onPause={onPause}
        onPlay={onPlay}
        onSeeked={onSeeked}
        onTimeUpdate={onTimeUpdate}
        ref={ref}
      />
    </div>
  );
};

export default Player;
