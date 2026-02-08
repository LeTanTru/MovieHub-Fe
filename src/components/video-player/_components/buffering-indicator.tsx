import { Spinner } from '@vidstack/react';

export default function BuffringIndicator() {
  return (
    <div className='vds-buffering-indicator'>
      <Spinner.Root className='vds-buffering-spinner'>
        <Spinner.Track className='vds-buffering-track' />
        <Spinner.TrackFill className='vds-buffering-track-fill' />
      </Spinner.Root>
    </div>
  );
}
