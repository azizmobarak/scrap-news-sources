"use strict";

var axios = require('axios');

function SendToServer(lng, category, mediaName, mediaLogo) {
  return regeneratorRuntime.async(function SendToServer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(axios.post('https://postgoo-final-api.herokuapp.com/api/v1/sources', {
            sourcesLanguage: lng,
            category: category,
            media: [{
              mediaName: mediaName,
              mediaLogo: mediaLogo
            }]
          })["catch"](function (error) {
            console.error(error);
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  SendToServer: SendToServer
};