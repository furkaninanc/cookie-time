import { forwardRef, memo, RefObject, useEffect } from 'react';

import Plyr, { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';
import 'plyr-react/dist/plyr.css';

interface IPlyrWrapper {
  onPause: PlyrCallback;
  onPlay: PlyrCallback;
  onPlaying: PlyrCallback;
  onRateChange: PlyrCallback;
  onReady: PlyrCallback;
  onSeeked: PlyrCallback;
  onTimeUpdate: PlyrCallback;
  onWaiting: PlyrCallback;
  ref: RefObject<HTMLPlyrVideoElement>;
}

const PlyrWrapper: React.FC<IPlyrWrapper> = memo(
  forwardRef(
    (
      {
        onPause,
        onPlay,
        onPlaying,
        onRateChange,
        onReady,
        onSeeked,
        onTimeUpdate,
        onWaiting,
      },
      ref
    ) => {
      useEffect(() => {
        // @ts-ignore
        const plyr = ref?.current?.plyr;

        const pauseEvent: PlyrCallback = onPause;
        const playEvent: PlyrCallback = onPlay;
        const playingEvent: PlyrCallback = onPlaying;
        const rateChangeEvent: PlyrCallback = onRateChange;
        const readyEvent: PlyrCallback = onReady;
        const seekedEvent: PlyrCallback = onSeeked;
        const timeUpdateEvent: PlyrCallback = onTimeUpdate;
        const waitingEvent: PlyrCallback = onWaiting;

        plyr?.on('pause', pauseEvent);
        plyr?.on('play', playEvent);
        plyr?.on('playing', playingEvent);
        plyr?.on('ratechange', rateChangeEvent);
        plyr?.on('ready', readyEvent);
        plyr?.on('seeked', seekedEvent);
        plyr?.on('timeupdate', timeUpdateEvent);
        plyr?.on('waiting', waitingEvent);

        return () => {
          plyr?.off('pause', pauseEvent);
          plyr?.off('play', playEvent);
          plyr?.off('playing', playingEvent);
          plyr?.off('ratechange', rateChangeEvent);
          plyr?.off('ready', readyEvent);
          plyr?.off('seeked', seekedEvent);
          plyr?.off('timeupdate', timeUpdateEvent);
          plyr?.off('waiting', waitingEvent);
        };
      }, [
        onPause,
        onPlay,
        onPlaying,
        onRateChange,
        onReady,
        onSeeked,
        onTimeUpdate,
        onWaiting,
        ref,
      ]);

      return (
        <>
          <Plyr
            options={{
              muted: true,
            }}
            ref={ref}
          />
        </>
      );
    }
  )
);

export default PlyrWrapper;
