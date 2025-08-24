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
