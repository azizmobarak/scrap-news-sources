"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var fs = require('fs');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../model/Category'),
    category = _require2.category; //block ads


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
var Categories = ['news/us-news', 'impact/business', 'section/health', 'entertainment/celebrity', 'entertainment/arts', 'life/style', 'life/taste', 'news/media', 'news/world-news', 'entertainment/tv', 'life/travel', 'voices/women', 'life/relationships', 'news-uk'];

var HuffPost = function HuffPost() {
  (function _callee() {
    var browser, page, AllData, k, i, Category, url, PageData;
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
            k = 0;

          case 8:
            if (!(k < 3)) {
              _context.next = 22;
              break;
            }

            _context.prev = 9;
            _context.next = 12;
            return regeneratorRuntime.awrap(page["goto"]('https://www.huffpost.com/'));

          case 12:
            _context.next = 14;
            return regeneratorRuntime.awrap(page.click('button[type=submit]'));

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](9);
            console.log("cookie passed");

          case 19:
            k++;
            _context.next = 8;
            break;

          case 22:
            _context.prev = 22;
            i = 0;

          case 24:
            if (!(i < Categories.length)) {
              _context.next = 55;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            url = "https://www.huffpost.com/";

            if (Category === "news-australia") {
              url = "https://www.huffingtonpost.com.au/news";
              Category = "australia";
            } else {
              if (Category === "news-canada") {
                url = "https://www.huffingtonpost.ca/news/";
                Category = "canada";
              } else {
                if (Category === "news-uk") {
                  url = "https://www.huffingtonpost.co.uk/news";
                  Category = "UK";
                }
              }
            }

            _context.prev = 29;

            if (!(Category === "australia" || Category === "UK" || Category === "canada")) {
              _context.next = 35;
              break;
            }

            _context.next = 33;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 33:
            _context.next = 37;
            break;

          case 35:
            _context.next = 37;
            return regeneratorRuntime.awrap(page["goto"]([url, '', Category].join('')));

          case 37:
            _context.next = 48;
            break;

          case 39:
            _context.prev = 39;
            _context.t1 = _context["catch"](29);

            if (!(Category === "australia" || Category === "UK" || Category === "canada")) {
              _context.next = 46;
              break;
            }

            _context.next = 44;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 44:
            _context.next = 48;
            break;

          case 46:
            _context.next = 48;
            return regeneratorRuntime.awrap(page["goto"]([url, '', Category].join('')));

          case 48:
            _context.next = 50;
            return regeneratorRuntime.awrap(page.evaluate(function (Category, url) {
              // HuffPost Classes
              var articles = document.querySelectorAll('.card--standard');
              var titleClassName = "h2";
              var linkClassName = "a";
              var imageClassName = "img";

              if (Category.indexOf("life") != -1) {
                articles = document.querySelectorAll('.card');
                titleClassName = "h3";
              } //change category name


              var cateogryName = Category;

              if (Category.indexOf('/') != -1) {
                if (Category.indexOf('arts') != -1 && Category.indexOf('entertainment') != -1) {
                  cateogryName = "entertainment";
                } else {
                  if (Category.indexOf('life') != -1) {
                    if (Category.indexOf('travel') != -1) {
                      cateogryName = "travel";
                    } else {
                      cateogryName = "life&style";
                    }
                  } else {
                    if (Category.indexOf('taste') != -1) {
                      cateogryName = "life&style";
                    } else {
                      cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length);
                    }
                  }
                }
              }

              if (Category === 'news/world-news') cateogryName = "international";
              if (Category === "news/us-news") cateogryName = "us"; //////////////////////////////

              var data = [];

              for (var j = 0; j < 3; j++) {
                if (articles[j].querySelector(titleClassName) != null && articles[j].querySelector(linkClassName) != null && articles[j].querySelector(imageClassName).src.indexOf('http') == 0) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titleClassName).textContent.trim(),
                    link: articles[j].querySelector(linkClassName).href,
                    images: typeof articles[j].querySelector(imageClassName) != "undefined" ? articles[j].querySelector(imageClassName).src : null,
                    Category: cateogryName.toLowerCase(),
                    source: "HuffPost " + cateogryName,
                    sourceLink: url,
                    sourceLogo: "http://www.logo-designer.co/wp-content/uploads/2017/04/2017-huffpost-new-logo-design-2.png"
                  });
                }
              }

              return data;
            }, Category, url));

          case 50:
            PageData = _context.sent;
            //  console.log(PageData)
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 52:
            i++;
            _context.next = 24;
            break;

          case 55:
            _context.next = 61;
            break;

          case 57:
            _context.prev = 57;
            _context.t2 = _context["catch"](22);
            _context.next = 61;
            return regeneratorRuntime.awrap(browser.close());

          case 61:
            _context.prev = 61;
            _context.next = 64;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 64:
            _context.next = 70;
            break;

          case 66:
            _context.prev = 66;
            _context.t3 = _context["catch"](61);
            _context.next = 70;
            return regeneratorRuntime.awrap(browser.close());

          case 70:
            _context.next = 72;
            return regeneratorRuntime.awrap(browser.close());

          case 72:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[9, 16], [22, 57], [29, 39], [61, 66]]);
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
            _context2.next = 31;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(page["goto"](url, {
            waitUntil: 'load',
            timeout: 0
          }));

        case 8:
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](5);
          _context2.next = 14;
          return regeneratorRuntime.awrap(page["goto"](url, {
            waitUntil: 'load',
            timeout: 0
          }));

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelector('.entry__text');

            if (typeof text != "undefined") {
              if (text != null) {
                return text.innerText;
              } else {
                return null;
              }
            } else {
              return document.querySelector('.entry__content-list') != null ? document.querySelector('.entry__content-list').textContent.replace('Content loading...', '') : null;
            }
          }));

        case 16:
          Content = _context2.sent;
          // get the author with content
          author = "";

          if (!(item.Category.indexOf("life&style") != -1)) {
            _context2.next = 24;
            break;
          }

          _context2.next = 21;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var auth = document.querySelector('.entry__byline__author>a>div');

            if (auth != null && typeof auth != "undefined") {
              return auth.textContent;
            } else {
              return null;
            }
          }));

        case 21:
          author = _context2.sent;
          _context2.next = 27;
          break;

        case 24:
          _context2.next = 26;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var auth = document.querySelector('a.author-card__link>span');

            if (auth != null && typeof auth != "undefined") {
              return auth.textContent;
            } else {
              return null;
            }
          }));

        case 26:
          author = _context2.sent;

        case 27:
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

        case 28:
          i++;
          _context2.next = 2;
          break;

        case 31:
          _context2.next = 33;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 10]]);
};

module.exports = HuffPost;