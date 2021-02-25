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
var Categories = ['world', 'us', 'politics', 'business', 'opinion', 'technology', 'science', 'health', 'sports', 'arts', 'books', 'style', 'food', 'travel', 'realestate'];

var NEWYORKTIMES = function NEWYORKTIMES() {
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
              _context.next = 39;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            _context.prev = 10;
            _context.next = 13;
            return regeneratorRuntime.awrap(page["goto"](['https://www.nytimes.com/section/', '', Category].join('')));

          case 13:
            _context.next = 32;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](10);
            _context.next = 19;
            return regeneratorRuntime.awrap(page["goto"](['https://www.nytimes.com/section/', '', Category].join('')));

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
            _context.next = 34;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // Los Angelece News classes
              var loop = 3;
              var titleClassName = "#collection-highlights-container ol>li>article h2";
              var imageClassName = "#collection-highlights-container ol>li>article figure img";
              var linkClassName = "#collection-highlights-container ol>li>article figure a"; //change category name

              var cateogryName = "";

              switch (Category) {
                case 'world':
                  cateogryName = "international";
                  break;

                case 'arts':
                  cateogryName = "art&design";
                  break;

                case "food":
                  cateogryName = "food&drink";
                  break;

                case "style":
                  cateogryName = "life&style";
                  break;

                case 'realestate':
                  cateogryName = "business";
                  break;

                default:
                  cateogryName = Category;
              } //////////////////////////////
              // all elements


              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName);
              var links = document.querySelectorAll(linkClassName); ////////////////////////////////////

              var data = [];

              for (var j = 0; j < loop; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] != "undefined" ? images[j].src : null,
                    Category: cateogryName,
                    source: "The NEW YORK TIMES",
                    sourceLink: "https://www.nytimes.com",
                    sourceLogo: "NYTIMES logo"
                  });
                }
              }

              return data;
            }, Category));

          case 34:
            PageData = _context.sent;
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 36:
            i++;
            _context.next = 8;
            break;

          case 39:
            _context.next = 41;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 41:
            _context.next = 43;
            return regeneratorRuntime.awrap(browser.close());

          case 43:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[10, 15]]);
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
            _context2.next = 26;
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
              var text = document.querySelectorAll('.meteredContent p');
              var textArray = [];

              for (var _i = 0; _i < text.length - 1; _i++) {
                textArray.push(text[_i].textContent);
                textArray.push('   ');
              }

              return textArray.join('\n');
            } catch (_unused2) {
              return null;
            }
          }));

        case 18:
          Content = _context2.sent;
          _context2.next = 21;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.last-byline').textContent;
            } catch (_unused3) {
              return null;
            }
          }));

        case 21:
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
              content: Content != null ? Content : null
            });
          }

        case 23:
          i++;
          _context2.next = 2;
          break;

        case 26:
          _context2.next = 28;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 12]]);
};

module.exports = NEWYORKTIMES;