'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../function/formatimage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../../function/sendtoserver'),
    SendToServer = _require3.SendToServer; //block ads


puppeteer.use(AdblockerPlugin()); // stealth

puppeteer.use(puppeteer_stealth()); // captcha configuration

puppeteer.use(Recaptcha({
  provider: {
    id: '2captcha',
    token: process.env.KEY
  },
  visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)

}));
puppeteer.use(puppeteer_agent());
var Categories = ['politique', 'économie', 'culture'];

var VRT = function VRT() {
  (function _callee2() {
    var browser, page, AllData, i, Category, url, PageData;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: true,
              args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb']
            }));

          case 2:
            browser = _context2.sent;
            _context2.next = 5;
            return regeneratorRuntime.awrap(browser.newPage());

          case 5:
            page = _context2.sent;
            AllData = [];
            _context2.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context2.next = 34;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.vrt.be/vrtnws/fr/rubriques/politique/";
            if (Category === "économie") url = "https://www.vrt.be/vrtnws/fr/rubriques/economie/";
            if (Category === "culture") url = "https://www.vrt.be/vrtnws/fr/rubriques/culture---media/";
            _context2.prev = 14;
            _context2.next = 17;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 17:
            _context2.next = 23;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](14);
            _context2.next = 23;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 23:
            _context2.next = 25;
            return regeneratorRuntime.awrap(page.evaluate(function () {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(function _callee() {
                var scrollHeight;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= 2000) {
                          clearInterval(timer);
                          resolve();
                        }

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }, 100);
            }));

          case 25:
            _context2.next = 27;
            return regeneratorRuntime.awrap(page.waitFor(2000));

          case 27:
            _context2.next = 29;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var images = document.querySelectorAll('article img');
              var links = document.querySelectorAll('.vrt-teaser-wrapper a');
              var titles = document.querySelectorAll('article h2');
              var data = [];

              for (var j = 0; j < 5; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    images: typeof images[j] != "undefined" ? images[j].src : null,
                    link: typeof links[j] === "undefined" ? null : links[j].href,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "VRT - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.vrt.be",
                    sourceLogo: "https://www.vrt.be/etc.clientlibs/vrtnieuws/clientlibs/clientlib-v2-site/resources/images/og_image.png"
                  });
                }
              }

              return data;
            }, Category));

          case 29:
            PageData = _context2.sent;
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('fr', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 31:
            i++;
            _context2.next = 9;
            break;

          case 34:
            _context2.next = 41;
            break;

          case 36:
            _context2.prev = 36;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 41;
            return regeneratorRuntime.awrap(browser.close());

          case 41:
            _context2.prev = 41;
            _context2.next = 44;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 44:
            _context2.next = 50;
            break;

          case 46:
            _context2.prev = 46;
            _context2.t2 = _context2["catch"](41);
            _context2.next = 50;
            return regeneratorRuntime.awrap(browser.close());

          case 50:
            _context2.next = 52;
            return regeneratorRuntime.awrap(browser.close());

          case 52:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 36], [14, 19], [41, 46]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, contenthtml, author;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 20;
            break;
          }

          item = data[i];
          url = item.link;
          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.article__par p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content;
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.article__par').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          contenthtml = _context3.sent;
          _context3.next = 15;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.author-info__names').textContent.trim();
            } catch (_unused4) {
              return null;
            }
          }));

        case 15:
          author = _context3.sent;

          if (Content != null && Content != "") {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: item.images,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              author: author,
              content: Content,
              contenthtml: contenthtml
            });
          }

        case 17:
          i++;
          _context3.next = 2;
          break;

        case 20:
          _context3.next = 22;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = VRT;