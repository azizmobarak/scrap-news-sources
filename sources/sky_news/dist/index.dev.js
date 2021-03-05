'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
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
var Categories = ['international'];

var ninenews = function ninenews() {
  (function _callee() {
    var browser, page, AllData, i, Category, PageData;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: true,
              args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb']
            }));

          case 2:
            browser = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap(browser.newPage());

          case 5:
            page = _context.sent;
            AllData = [];
            _context.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context.next = 27;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"]('https://news.sky.com/world'));

          case 14:
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            _context.next = 20;
            return regeneratorRuntime.awrap(page["goto"]('https://news.sky.com/world'));

          case 20:
            _context.next = 22;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('.sdc-site-tile__headline>a');
              var images = document.querySelectorAll('.sdc-site-tile__image-wrap>picture>img');
              var links = document.querySelectorAll('.sdc-site-tile__headline>a');
              var data = [];

              for (var j = 0; j < 6; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j == 0 ? j : j + 2] === "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "Sky News",
                    sourceLink: "https://news.sky.com/",
                    sourceLogo: "https://3dhealthcaresolutions.co.uk/wp-content/uploads/2020/05/unnamed-4.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 22:
            PageData = _context.sent;
            // console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 24:
            i++;
            _context.next = 9;
            break;

          case 27:
            _context.next = 33;
            break;

          case 29:
            _context.prev = 29;
            _context.t1 = _context["catch"](7);
            _context.next = 33;
            return regeneratorRuntime.awrap(browser.close());

          case 33:
            _context.prev = 33;
            _context.next = 36;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 36:
            _context.next = 43;
            break;

          case 38:
            _context.prev = 38;
            _context.t2 = _context["catch"](33);
            console.log(_context.t2);
            _context.next = 43;
            return regeneratorRuntime.awrap(browser.close());

          case 43:
            _context.next = 45;
            return regeneratorRuntime.awrap(browser.close());

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 29], [11, 16], [33, 38]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, author;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 17;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelectorAll(".sdc-article-body>P");
              var cont = "";

              for (var _i = 0; _i < text.length; _i++) {
                cont = cont + "\n" + text[_i].textContent;
              }

              return cont;
            } catch (_unused3) {
              return null;
            }
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector(".sdc-article-author__byline").textContent.replace('By', '').trim();
            } catch (_unused4) {
              return null;
            }
          }));

        case 12:
          author = _context2.sent;

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
              content: Content
            });
          }

        case 14:
          i++;
          _context2.next = 2;
          break;

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = ninenews;