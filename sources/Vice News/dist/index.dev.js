"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker'); //
//block ads


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
              _context.next = 48;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://www.vice.com/en/section/', '', Category].join('')));

          case 14:
            _context.next = 33;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            _context.next = 20;
            return regeneratorRuntime.awrap(page["goto"](['https://www.vice.com/en/section/', '', Category].join('')));

          case 20:
            _context.next = 22;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 22:
            _context.t1 = regeneratorRuntime;
            _context.t2 = Promise;
            _context.t3 = page.waitForNavigation();
            _context.t4 = page.click(".g-recaptcha");
            _context.next = 28;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 28:
            _context.t5 = _context.sent;
            _context.t6 = [_context.t3, _context.t4, _context.t5];
            _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
            _context.next = 33;
            return _context.t1.awrap.call(_context.t1, _context.t7);

          case 33:
            _context.prev = 33;
            _context.next = 36;
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
                cateogryName = "International";
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

          case 36:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });
            _context.next = 45;
            break;

          case 41:
            _context.prev = 41;
            _context.t8 = _context["catch"](33);
            i = i - 1;
            console.log('try again');

          case 45:
            i++;
            _context.next = 8;
            break;

          case 48:
            _context.next = 50;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 50:
            _context.next = 52;
            return regeneratorRuntime.awrap(browser.close());

          case 52:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[11, 16], [33, 41]]);
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
            _context2.next = 29;
            break;
          }

          item = data[i];
          url = item.link;
          console.log(url);
          _context2.next = 8;
          return regeneratorRuntime.awrap(page.setJavaScriptEnabled(false));

        case 8:
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 11:
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](8);
          _context2.next = 17;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article__body-components').textContent;
              return text;
            } catch (_unused3) {
              return null;
            }
          }));

        case 19:
          Content = _context2.sent;
          imageItem = "";

          if (!(item.images === "" || item.images.length == 0)) {
            _context2.next = 25;
            break;
          }

          _context2.next = 24;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var img = document.querySelector('picture source').srcset;
              return img.substring(0, img.indexOf('*') - 1);
            } catch (_unused4) {
              return null;
            }
          }));

        case 24:
          imageItem = _context2.sent;

        case 25:
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

        case 26:
          i++;
          _context2.next = 2;
          break;

        case 29:
          console.log(AllData_WithConetent);

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 13]]);
};

module.exports = VICENEWS;