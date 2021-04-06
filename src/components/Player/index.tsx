import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';

import { useSocketContext } from '../../contexts/SocketContext';
import { getVideoId } from '../../utils/youtube';
import PlyrWrapper from '../PlyrWrapper';
import styles from './Player.module.scss';

let initialized = false;
let preventSeekEmit = false;
let preventSpeedEmit = false;
let preventStateEmit = false;

const Player: React.FC = () => {
  const history = useHistory();
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const { socket } = useSocketContext();

  const setSpeed = (speed: number) => {
    if (ref?.current?.plyr && ref.current.plyr.speed !== speed) {
      preventSpeedEmit = true;
      ref.current.plyr.speed = speed;
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

  const setTime = (time: number) => {
    if (
      ref?.current?.plyr &&
      Math.abs(ref.current.plyr.currentTime - time) > 2
    ) {
      preventSeekEmit = true;
      ref.current.plyr.currentTime = time;
    }
  };

  const setVideo = (video: string) => {
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

  useEffect(() => {
    socket?.on('join', ({ speed, state, time, video }) => {
      setVideo(video);

      const timer = setInterval(() => {
        if (ref?.current?.plyr && ref.current.plyr.duration > 0) {
          initialized = true;
          setState(state);
          setTime(time);
          setSpeed(speed);
          clearInterval(timer);
        }
      }, 100);
    });

    socket?.on('disconnect', () => history.push('/'));
    socket?.on('player:state', ({ state }) => setState(state));
    socket?.on('player:seek', ({ time }) => setTime(time));
    socket?.on('player:speed', ({ speed }) => setSpeed(speed));
    socket?.on('player:video', ({ video }) => setVideo(video));
  }, [history, socket]);

  const onPause: PlyrCallback = useCallback(
    (event) => {
      if (!preventStateEmit && !event.detail.plyr.seeking) {
        socket?.emit('player:state', { state: 0 });
      }

      preventStateEmit = false;
    },
    [socket]
  );

  const onPlay: PlyrCallback = useCallback(
    (event) => {
      if (!preventStateEmit && !event.detail.plyr.seeking) {
        socket?.emit('player:state', { state: 1 });
      }

      preventStateEmit = false;
    },
    [socket]
  );

  const onRateChange: PlyrCallback = useCallback(
    (event) => {
      if (initialized && !preventSpeedEmit) {
        socket?.emit('player:speed', { speed: event.detail.plyr.speed });
      }

      preventSpeedEmit = false;
    },
    [socket]
  );

  const onReady: PlyrCallback = useCallback(() => {
    if (ref?.current?.plyr) {
      ref.current.plyr.muted = true;
    }
  }, []);

  const onSeeked: PlyrCallback = useCallback(
    (event) => {
      if (initialized && !preventSeekEmit) {
        socket?.emit('player:seek', { time: event.detail.plyr.currentTime });
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
        onRateChange={onRateChange}
        onReady={onReady}
        onSeeked={onSeeked}
        onTimeUpdate={onTimeUpdate}
        ref={ref}
      />
    </div>
  );
};

export default Player;
