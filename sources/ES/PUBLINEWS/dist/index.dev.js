'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../function/SendToServer'),
    SendToServer = _require2.SendToServer;

var _require3 = require('../../../function/FormatImage'),
    FormatImage = _require3.FormatImage; //block ads


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
var Categories = ['Guatemala', 'internacional', 'celebridad'];

var SCRAP = function SCRAP() {
  (function _callee3() {
    var browser, page, AllData, i, Category, url, PageData;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: true,
              args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb']
            }));

          case 2:
            browser = _context3.sent;
            _context3.next = 5;
            return regeneratorRuntime.awrap(browser.newPage());

          case 5:
            page = _context3.sent;
            AllData = [];
            _context3.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context3.next = 37;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.publinews.gt/gt/guatemala";
            if (Category === "internacional") url = "https://www.publinews.gt/gt/mundo";
            if (Category === "celebridad") url = "https://www.publinews.gt/gt/espectaculos";
            page.on('dialog', function _callee(dialog) {
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return regeneratorRuntime.awrap(dialog.dismiss());

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
            _context3.prev = 15;
            _context3.next = 18;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 18:
            _context3.next = 20;
            return regeneratorRuntime.awrap(page.click('.sub-dialog-btn'));

          case 20:
            _context3.next = 26;
            break;

          case 22:
            _context3.prev = 22;
            _context3.t0 = _context3["catch"](15);
            _context3.next = 26;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 26:
            _context3.next = 28;
            return regeneratorRuntime.awrap(page.evaluate(function () {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(function _callee2() {
                var scrollHeight;
                return regeneratorRuntime.async(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= 1000) {
                          clearInterval(timer);
                          resolve();
                        }

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                });
              }, 100);
            }));

          case 28:
            _context3.next = 30;
            return regeneratorRuntime.awrap(page.waitFor(2000));

          case 30:
            _context3.next = 32;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('article');
              var images = "img";
              var links = "a";
              var titles = "h2";
              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof articles[j].querySelector(titles) != "undefined" && articles[j].querySelector(links) != null) {
                  var img = articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).src;
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: img,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "PubliNews " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.publinews.gt",
                    sourceLogo: "https://a.calameoassets.com/691806/picture.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 32:
            PageData = _context3.sent;
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 34:
            i++;
            _context3.next = 9;
            break;

          case 37:
            _context3.next = 44;
            break;

          case 39:
            _context3.prev = 39;
            _context3.t1 = _context3["catch"](7);
            console.log(_context3.t1);
            _context3.next = 44;
            return regeneratorRuntime.awrap(browser.close());

          case 44:
            _context3.prev = 44;
            _context3.next = 47;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 47:
            _context3.next = 54;
            break;

          case 49:
            _context3.prev = 49;
            _context3.t2 = _context3["catch"](44);
            console.log(_context3.t2);
            _context3.next = 54;
            return regeneratorRuntime.awrap(browser.close());

          case 54:
            _context3.next = 56;
            return regeneratorRuntime.awrap(browser.close());

          case 56:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[7, 39], [15, 22], [44, 49]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, ContentHtml, author;
  return regeneratorRuntime.async(function GetContent$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context4.next = 20;
            break;
          }

          item = data[i];
          url = item.link;
          _context4.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.entry-content p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content + ".. .";
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context4.sent;
          _context4.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.entry-content').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          ContentHtml = _context4.sent;
          _context4.next = 15;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.author').textContent.trim();
            } catch (_unused4) {
              return null;
            }
          }));

        case 15:
          author = _context4.sent;

          if (Content != null && Content != "" && Content.length > 255) {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: item.images === "" ? null : item.images,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              author: author,
              content: Content,
              contentHTML: ContentHtml
            });
          }

        case 17:
          i++;
          _context4.next = 2;
          break;

        case 20:
          _context4.next = 22;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports = SCRAP;