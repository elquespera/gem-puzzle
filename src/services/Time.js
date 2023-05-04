const formatElapsed = (elapsed) => {
  const seconds = elapsed % 60;
  const minutes = Math.floor((elapsed / 60) % 100);
  return [minutes, seconds]
    .map((str) => String(str).padStart(2, '0'))
    .join(':');
};

export default formatElapsed;
