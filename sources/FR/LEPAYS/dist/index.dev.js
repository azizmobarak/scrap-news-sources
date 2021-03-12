'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData; //block ads


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
var Categories = ['football', 'rugby', 'basketball'];

var LEPAY = function LEPAY() {
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
              _context2.next = 43;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.le-pays.fr/theme/football/";
            if (Category === "rugby") url = "https://www.le-pays.fr/theme/rugby/";
            if (Category === "basketball") url = "https://www.le-pays.fr/theme/basket/";
            _context2.prev = 14;
            _context2.next = 17;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 17:
            _context2.next = 19;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 19:
            if (!(i == 0)) {
              _context2.next = 22;
              break;
            }

            _context2.next = 22;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 22:
            _context2.next = 31;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](14);
            _context2.next = 28;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 28:
            if (!(i == 0)) {
              _context2.next = 31;
              break;
            }

            _context2.next = 31;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 31:
            _context2.next = 33;
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

                        if (totalHeight >= 1000) {
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

          case 33:
            _context2.next = 35;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 35:
            _context2.next = 37;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var images = document.querySelectorAll('.c-photo img');
              var links = document.querySelectorAll('.c-titre h2>a');
              var titles = document.querySelectorAll('.c-titre h2');
              var data = [];

              for (var j = 0; j < 4; j++) {
                var index = 0;

                if (j > 0) {
                  links = document.querySelectorAll('.c-titre h3>a');
                  titles = document.querySelectorAll('.c-titre h3');
                  index = j - 1;
                }

                if (typeof titles[j] != "undefined" && links[j] != null) {
                  data.push({
                    time: Date.now(),
                    title: titles[index].textContent.trim().replaceAll('\t', ' ').substring(20, titles[index].textContent.trim().length).trim(),
                    link: links[index].href,
                    images: typeof images[j] === "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "LE PAYS",
                    sourceLink: "https://www.le-pays.fr/",
                    sourceLogo: "https://www.ffp.asso.fr/wp-content/uploads/2016/08/le-pays-roannais.jpgtps://www.notrevoienews.com/wp-content/uploads/2018/12/logo-retina-400x200-1.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 37:
            PageData = _context2.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 40:
            i++;
            _context2.next = 9;
            break;

          case 43:
            _context2.next = 50;
            break;

          case 45:
            _context2.prev = 45;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 50;
            return regeneratorRuntime.awrap(browser.close());

          case 50:
            _context2.prev = 50;
            _context2.next = 53;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 53:
            _context2.next = 60;
            break;

          case 55:
            _context2.prev = 55;
            _context2.t2 = _context2["catch"](50);
            console.log(_context2.t2);
            _context2.next = 60;
            return regeneratorRuntime.awrap(browser.close());

          case 60:
            _context2.next = 62;
            return regeneratorRuntime.awrap(browser.close());

          case 62:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 45], [14, 24], [50, 55]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, author;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 16;
            break;
          }

          item = data[i];
          url = item.link;
          console.log(url);
          _context3.next = 8;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.contenu p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length - 1; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content;
            } catch (_unused2) {
              return null;
            }
          }));

        case 10:
          Content = _context3.sent;
          author = null;

          if (Content != null && Content != "") {
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
              content: Content
            });
          }

        case 13:
          i++;
          _context3.next = 2;
          break;

        case 16:
          console.log(AllData_WithConetent); //  await InsertData(AllData_WithConetent);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = LEPAY;