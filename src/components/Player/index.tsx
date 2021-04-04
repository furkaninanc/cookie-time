import { forwardRef, memo, RefObject, useEffect } from 'react';

import Plyr, { HTMLPlyrVideoElement, PlyrCallback } from 'plyr-react';
import 'plyr-react/dist/plyr.css';

interface IPlayer {
  onPause: PlyrCallback;
  onPlay: PlyrCallback;
  onSeeked: PlyrCallback;
  onTimeUpdate: PlyrCallback;
  sources: string;
  ref: RefObject<HTMLPlyrVideoElement>;
}

const Player: React.FC<IPlayer> = memo(
  forwardRef(({ onPause, onPlay, onSeeked, onTimeUpdate, sources }, ref) => {
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
            muted: true,
          }}
          ref={ref}
          source={{
            type: 'video',
            sources: JSON.parse(sources),
          }}
        />
      </>
    );
  })
);

export default Player;
