"use strict";

module.exports = {
  FormatImage: function FormatImage(img) {
    try {
      if (img.indexOf('.jpg') != -1) {
        return img.substring(0, img.indexOf('.jpg') + 4);
      } else {
        if (img.indexOf('.png') != -1) {
          return img.substring(0, img.indexOf('.png') + 4);
        } else {
          if (img.indexOf('.jpeg') != -1) {
            return img.substring(0, img.indexOf('.jpeg') + 5);
          } else {
            return img;
          }
        }
      }
    } catch (_unused) {
      return null;
    }
  }
};

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
          })["catch"](function (error) {//   console.error(error);
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