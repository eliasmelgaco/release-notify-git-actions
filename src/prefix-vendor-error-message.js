'use strict';

module.exports = (error, vendor) => {
  const missingPrefix = !error.message.includes(vendor);

  return missingPrefix ? `${vendor} ${error.message}` : error.message;
}
