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
var Categories = ['politics', 'health/coronavirus', 'business', 'think', 'world'];

var MSNBC = function MSNBC() {
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
              _context.next = 26;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            _context.prev = 10;
            _context.next = 13;
            return regeneratorRuntime.awrap(page["goto"](['https://www.nbcnews.com/', '', Category].join('')));

          case 13:
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](10);
            _context.next = 19;
            return regeneratorRuntime.awrap(page["goto"](['https://www.nbcnews.com/', '', Category].join('')));

          case 19:
            _context.next = 21;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('article');
              var titleClassName = "h2:nth-child(1)";
              var linkClassName = "a";
              var imageClassName = "img";
              var loop = 3; //change category name

              var categoryName = "";

              if (Category === "health/coronavirus") {
                categoryName = "health";
              } else {
                if (Category === "think") {
                  categoryName = "opinion";
                } else {
                  if (Category === "politics") {
                    categoryName = "politic";
                  } else {
                    if (Category === "world") {
                      categoryName = "international";
                      loop = 2;
                    } else {
                      categoryName = Category;
                    }
                  }
                }
              } ///////////////////////////////////////


              var data = [];

              for (var j = 0; j < loop; j++) {
                if (articles[j].querySelector(titleClassName) != null && articles[j].querySelector(linkClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titleClassName).textContent.trim(),
                    link: articles[j].querySelector(linkClassName).href,
                    images: articles[j].querySelector(imageClassName) != null ? articles[j].querySelector(imageClassName).src : null,
                    Category: categoryName,
                    source: "MSNBC " + categoryName,
                    sourceLink: "https://www.nbcnews.com/",
                    sourceLogo: "https://png.pngitem.com/pimgs/s/488-4884737_msnbc-news-cnbc-logo-png-transparent-png.png"
                  });
                }
              }

              return data;
            }, Category));

          case 21:
            PageData = _context.sent;
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 23:
            i++;
            _context.next = 8;
            break;

          case 26:
            _context.next = 28;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 28:
            _context.next = 30;
            return regeneratorRuntime.awrap(browser.close());

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[10, 15]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 21;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 8:
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](5);
          _context2.next = 14;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelector('.article-body__content').innerText;
            return text;
          }));

        case 16:
          Content = _context2.sent;

          if (Content != null && Content != "" && item.title != null) {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: item.images,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              content: Content != null ? Content : null
            });
          }

        case 18:
          i++;
          _context2.next = 2;
          break;

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 10]]);
};

module.exports = MSNBC;