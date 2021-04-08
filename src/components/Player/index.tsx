import { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';

import { useSocketContext } from '../../contexts/SocketContext';
import { getVideoId } from '../../utils/youtube';
import PlyrWrapper from '../PlyrWrapper';
import styles from './Player.module.scss';

let firstReady: boolean;
let initialized: boolean;
let lastTime: number;
let preventSeekEmit: boolean;
let preventSpeedEmit: boolean;
let preventStateEmit: boolean;

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

      initialized = false;
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
    firstReady = true;
    initialized = false;
    lastTime = 0;
    preventSeekEmit = false;
    preventSpeedEmit = false;
    preventStateEmit = false;

    socket?.on('join', ({ speed, state, time, video }) => {
      setVideo(video);

      const timer = setInterval(() => {
        if (initialized) {
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
    if (ref?.current?.plyr && firstReady) {
      ref.current.plyr.muted = true;
    }

    const initializeChecker = setInterval(() => {
      if (ref?.current?.plyr) {
        if (
          // @ts-ignore
          ref.current.plyr.source === 'https://cdn.plyr.io/static/blank.mp4'
        ) {
          clearInterval(initializeChecker);
          return;
        }

        if (ref.current.plyr.duration > 0) {
          initialized = true;
          clearInterval(initializeChecker);
        }
      }
    }, 100);

    firstReady = false;
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
      const time = parseInt(`${event.detail.plyr.currentTime}`, 10);

      if (Math.abs(lastTime - time) >= 1) {
        socket?.emit('player:time', { time: event.detail.plyr.currentTime });
        lastTime = time;
      }
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
