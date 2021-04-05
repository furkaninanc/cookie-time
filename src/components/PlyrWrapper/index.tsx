import { forwardRef, memo, RefObject, useEffect } from 'react';

import Plyr, { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';
import 'plyr-react/dist/plyr.css';

interface IPlyrWrapper {
  onPause: PlyrCallback;
  onPlay: PlyrCallback;
  onSeeked: PlyrCallback;
  onTimeUpdate: PlyrCallback;
  ref: RefObject<HTMLPlyrVideoElement>;
}

const PlyrWrapper: React.FC<IPlyrWrapper> = memo(
  forwardRef(({ onPause, onPlay, onSeeked, onTimeUpdate }, ref) => {
    useEffect(() => {
      // @ts-ignore
      const plyr = ref?.current?.plyr;

      const pauseEvent: PlyrCallback = onPause;
      const playEvent: PlyrCallback = onPlay;
      const seekedEvent: PlyrCallback = onSeeked;
      const timeUpdateEvent: PlyrCallback = onTimeUpdate;

      plyr?.on('pause', pauseEvent);
      plyr?.on('play', playEvent);
      plyr?.on('seeked', seekedEvent);
      plyr?.on('timeupdate', timeUpdateEvent);

      return () => {
        plyr?.off('pause', pauseEvent);
        plyr?.off('play', playEvent);
        plyr?.off('seeked', seekedEvent);
        plyr?.off('timeupdate', timeUpdateEvent);
      };
    }, [onPause, onPlay, onSeeked, onTimeUpdate, ref]);

    return (
      <>
        <Plyr
          options={{
            autoplay: true,
            muted: true,
          }}
          ref={ref}
          source={{
            type: 'video',
            sources: [
              {
                src: 'https://cdn.plyr.io/static/blank.mp4',
                type: 'video/mp4',
                size: 720,
              },
            ],
          }}
        />
      </>
    );
  })
);

export default PlyrWrapper;
