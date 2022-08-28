const responseFormat = (statusText, messageText, data) => (
  {
    status: statusText,
    message: messageText,
    data,
  }
);

const responseFormatFail = (statusText, messageText) => (
  {
    status: statusText,
    message: messageText,
  }
);

module.exports = {responseFormat, responseFormatFail };
