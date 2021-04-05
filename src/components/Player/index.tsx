import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';

import { useSocketContext } from '../../contexts/SocketContext';
import { getVideoId } from '../../utils/youtube';
import PlyrWrapper from '../PlyrWrapper';
import styles from './Player.module.scss';

let initialized = false;
let preventStateEmit = false;
let preventSeekEmit = false;

const Player: React.FC = () => {
  const history = useHistory();
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const { socket } = useSocketContext();

  const setSource = (video: string) => {
    if (ref?.current?.plyr) {
      const youtubeId = getVideoId(video);

      ref.current.plyr.source = {
        type: 'video',
        sources: [
          {
            src: youtubeId || video,
            ...(!youtubeId
              ? { type: 'video/mp4', size: 720 }
              : { provider: 'youtube' }),
          },
        ],
      };
    }
  };

  const setState = (state: number) => {
    if (state === 1 && !ref?.current?.plyr?.playing) {
      preventStateEmit = true;
      ref?.current?.plyr?.play();
    } else if (state === 0 && ref?.current?.plyr?.playing) {
      preventStateEmit = true;
      ref?.current?.plyr?.pause();
    }
  };

  useEffect(() => {
    socket?.on('join', ({ state, time, video }) => {
      setSource(video);
      setState(state);

      const timer = setInterval(() => {
        if (
          ref?.current?.plyr &&
          ref.current.plyr.source === video &&
          ref.current.plyr.buffered > 0
        ) {
          preventSeekEmit = true;
          ref.current.plyr.currentTime = time;
          initialized = true;
          clearInterval(timer);
        }
      }, 100);
    });

    socket?.on('disconnect', () => history.push('/'));

    socket?.on('player:state', ({ state }) => setState(state));

    socket?.on('player:seek', ({ time }) => {
      if (
        ref?.current?.plyr?.currentTime &&
        Math.abs(ref.current.plyr.currentTime - time) > 2
      ) {
        preventSeekEmit = true;
        ref.current.plyr.currentTime = time;
      }
    });

    socket?.on('player:video', ({ video }) => setSource(video));
  }, [history, socket]);

  const onPause: PlyrCallback = useCallback(() => {
    if (!preventStateEmit) {
      socket?.emit('player:state', { state: 0 });
    }

    preventStateEmit = false;
  }, [socket]);

  const onPlay: PlyrCallback = useCallback(() => {
    if (!preventStateEmit) {
      socket?.emit('player:state', { state: 1 });
    }

    preventStateEmit = false;
  }, [socket]);

  const onSeeked: PlyrCallback = useCallback(
    (event) => {
      if (initialized) {
        if (!preventSeekEmit) {
          socket?.emit('player:seek', { time: event.detail.plyr.currentTime });
        }
      }

      preventSeekEmit = false;
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
