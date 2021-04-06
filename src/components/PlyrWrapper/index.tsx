import { forwardRef, memo, RefObject, useEffect } from 'react';

import Plyr, { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';
import 'plyr-react/dist/plyr.css';

interface IPlyrWrapper {
  onPause: PlyrCallback;
  onPlay: PlyrCallback;
  onRateChange: PlyrCallback;
  onReady: PlyrCallback;
  onSeeked: PlyrCallback;
  onTimeUpdate: PlyrCallback;
  ref: RefObject<HTMLPlyrVideoElement>;
}

const PlyrWrapper: React.FC<IPlyrWrapper> = memo(
  forwardRef(
    (
      { onPause, onPlay, onRateChange, onReady, onSeeked, onTimeUpdate },
      ref
    ) => {
      useEffect(() => {
        // @ts-ignore
        const plyr = ref?.current?.plyr;

        const pauseEvent: PlyrCallback = onPause;
        const playEvent: PlyrCallback = onPlay;
        const rateChangeEvent: PlyrCallback = onRateChange;
        const readyEvent: PlyrCallback = onReady;
        const seekedEvent: PlyrCallback = onSeeked;
        const timeUpdateEvent: PlyrCallback = onTimeUpdate;

        plyr?.on('pause', pauseEvent);
        plyr?.on('play', playEvent);
        plyr?.on('ratechange', rateChangeEvent);
        plyr?.on('ready', readyEvent);
        plyr?.on('seeked', seekedEvent);
        plyr?.on('timeupdate', timeUpdateEvent);

        return () => {
          plyr?.off('pause', pauseEvent);
          plyr?.off('play', playEvent);
          plyr?.off('ratechange', rateChangeEvent);
          plyr?.off('ready', readyEvent);
          plyr?.off('seeked', seekedEvent);
          plyr?.off('timeupdate', timeUpdateEvent);
        };
      }, [onPause, onPlay, onRateChange, onReady, onSeeked, onTimeUpdate, ref]);

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
