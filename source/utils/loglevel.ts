const logger = {
  info: (message) => {
    if (typeof message === 'object') {
      console.info(message);
    } else {
      console.info(`EccDS: ${message}`);
    }
  },
  debug: (message) => {
    if (typeof message === 'object') {
      console.log(message);
    } else {
      console.log(`EccDS: ${message}`);
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
