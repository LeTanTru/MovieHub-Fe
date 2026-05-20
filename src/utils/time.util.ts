const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const PAD_LENGTH = 2;
const PAD_CHAR = '0';

export const timeToSeconds = (time: string): number => {
  if (typeof time === 'number') return time;

  const parts = time.split(':');

  if (parts.length !== 3) {
    throw new Error('Định dạng thời gian phải là HH:mm:ss');
  }

  const [hours, minutes, seconds] = parts.map((p) => parseInt(p, 10));

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(seconds) ||
    hours < 0 ||
    minutes < 0 ||
    minutes >= SECONDS_PER_MINUTE ||
    seconds < 0 ||
    seconds >= SECONDS_PER_MINUTE
  ) {
    throw new Error('Giá trị giờ, phút, giây không hợp lệ');
  }

  return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
};

export const formatSecondsToHMS = (totalSeconds: number): string => {
  if (!totalSeconds || isNaN(totalSeconds)) return '00:00:00';

  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE
  );
  const seconds = totalSeconds % SECONDS_PER_MINUTE;

  if (hours === 0) {
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

function pad(n: number): string {
  return String(n).padStart(PAD_LENGTH, PAD_CHAR);
}

export const formatDuration = (second: number): string => {
  const hours = Math.floor(second / SECONDS_PER_HOUR);
  const minutes = Math.floor((second % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = Math.floor((second % SECONDS_PER_HOUR) % SECONDS_PER_MINUTE);

  let time = '';

  if (hours > 0) {
    time += hours + 'h ';
  }

  if (minutes > 0) {
    time += minutes + 'm ';
  }

  if (seconds > 0) {
    time += seconds + 's';
  }

  return time;
};

export const formatSecondsToMinutes = (totalSeconds: number): string => {
  if (!totalSeconds || isNaN(totalSeconds)) return '0m';

  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;

  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
};
