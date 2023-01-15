const logger = {
  info: (message) => {
    if (typeof message === 'object') {
      console.info(message);
    } else {
      console.info(`%c EccDS: ${message}`, 'color: #0a95ff');
    }
  },
  debug: (message) => {
    if (typeof message === 'object') {
      console.log(message);
    } else {
      console.log(`%c EccDS: ${message}`, 'color: #bada55');
    }
  },
  error: (message) => {
    if (typeof message === 'object') {
      console.warn(message);
    } else {
      console.warn(`EccDS: ${message}`);
    }
  },
};

export default logger;
