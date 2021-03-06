"use strict";

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
var Categories = ['world', 'health', 'entertainment', 'travel', 'sex', 'tech', 'food', 'money', 'environment'];

var VICENEWS = function VICENEWS() {
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
            AllData = []; // boucle on categories started 

            i = 0;

          case 8:
            if (!(i < Categories.length)) {
              _context.next = 45;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            _context.prev = 10;
            _context.next = 13;
            return regeneratorRuntime.awrap(page["goto"](['https://www.vice.com/en/section/', '', Category].join('')));

          case 13:
            _context.next = 32;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](10);
            _context.next = 19;
            return regeneratorRuntime.awrap(page["goto"](['https://www.vice.com/en/section/', '', Category].join('')));

          case 19:
            _context.next = 21;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 21:
            _context.t1 = regeneratorRuntime;
            _context.t2 = Promise;
            _context.t3 = page.waitForNavigation();
            _context.t4 = page.click(".g-recaptcha");
            _context.next = 27;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 27:
            _context.t5 = _context.sent;
            _context.t6 = [_context.t3, _context.t4, _context.t5];
            _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
            _context.next = 32;
            return _context.t1.awrap.call(_context.t1, _context.t7);

          case 32:
            _context.prev = 32;
            _context.next = 35;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // Los Angelece News classes
              var loop = 3;
              var start = 0;
              var titleClassName = ".vice-card h3.vice-card-hed";
              var linkClassName = ".vice-card h3.vice-card-hed a";
              var imageClassName = ".vice-card .vice-card-image__placeholder-image picture>source+source+source";
              var authorClassName = ".vice-card .vice-card-details__byline"; // all elements

              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName);
              var links = document.querySelectorAll(linkClassName);
              var authors = document.querySelectorAll(authorClassName); //change category name

              var cateogryName = Category;

              if (Category === "world") {
                cateogryName = "international";
              } else {
                if (Category === "sex") {
                  cateogryName = "health,love";
                }
              } //////////////////////////////


              var data = [];

              for (var j = start; j < loop; j++) {
                var type = "article";

                if (links[j].href.indexOf('video') != -1) {
                  type = "video";
                }

                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: type === "article" ? typeof images[j] != "undefined" ? images[j].srcset.substring(0, images[j].srcset.indexOf('*') - 1) : null : links[j].href,
                    Category: cateogryName,
                    source: "VICE news",
                    sourceLink: "https://www.vice.com/",
                    sourceLogo: "vice news logo",
                    author: typeof authors[j] != "undefined" ? authors[j].textContent : null,
                    type: type
                  });
                }
              }

              return data;
            }, Category));

          case 35:
            PageData = _context.sent;
            PageData.map(function (item) {
              AllData.push(item);
            });
            _context.next = 42;
            break;

          case 39:
            _context.prev = 39;
            _context.t8 = _context["catch"](32);
            i = i - 1;

          case 42:
            i++;
            _context.next = 8;
            break;

          case 45:
            _context.next = 47;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 47:
            _context.next = 49;
            return regeneratorRuntime.awrap(browser.close());

          case 49:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[10, 15], [32, 39]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, imageItem;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 28;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page.setJavaScriptEnabled(false));

        case 7:
          _context2.prev = 7;
          _context2.next = 10;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 10:
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](7);
          _context2.next = 16;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article__body-components').textContent;
              return text;
            } catch (_unused3) {
              return null;
            }
          }));

        case 18:
          Content = _context2.sent;
          imageItem = "";

          if (!(item.images === "" || item.images.length == 0)) {
            _context2.next = 24;
            break;
          }

          _context2.next = 23;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var img = document.querySelector('picture source').srcset;
              return img.substring(0, img.indexOf('*') - 1);
            } catch (_unused4) {
              return null;
            }
          }));

        case 23:
          imageItem = _context2.sent;

        case 24:
          if (Content != null && Content != "" && item.type === "article") {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: imageItem,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              author: item.author,
              type: item.type,
              content: Content != null ? Content : null
            });
          }

        case 25:
          i++;
          _context2.next = 2;
          break;

        case 28:
          _context2.next = 30;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 12]]);
};

module.exports = VICENEWS;