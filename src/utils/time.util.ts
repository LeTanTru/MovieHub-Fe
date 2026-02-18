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
    minutes >= 60 ||
    seconds < 0 ||
    seconds >= 60
  ) {
    throw new Error('Giá trị giờ, phút, giây không hợp lệ');
  }

  return hours * 3600 + minutes * 60 + seconds;
};

export const formatSecondsToHMS = (totalSeconds: number): string => {
  if (!totalSeconds || isNaN(totalSeconds)) return '00:00:00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours === 0) {
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export const formatDuration = (second: number): string => {
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second % 3600) / 60);
  const seconds = Math.floor((second % 3600) % 60);

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

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
};
