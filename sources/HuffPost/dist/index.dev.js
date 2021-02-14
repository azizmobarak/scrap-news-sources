"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var fs = require('fs'); //block ads


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
var Categories = ['news/us-news', 'impact/business', 'section/health', 'entertainment/celebrity', 'entertainment/arts', 'life/style', 'life/taste', 'news/media', 'news/world-news', 'entertainment/tv', 'life/Travel', 'voices/women', 'life/relationships', 'news-australia', 'news-canada', 'news-uk'];

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
            if (!(k < 5)) {
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
            i = 0;

          case 23:
            if (!(i < Categories.length)) {
              _context.next = 68;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            url = "https://www.huffpost.com/";

            if (Category === "news-australia") {
              url = "https://www.huffingtonpost.com.au/news";
              Category = "Australia";
            } else {
              if (Category === "news-canada") {
                url = "https://www.huffingtonpost.ca/news/";
                Category = "Canada";
              } else {
                if (Category === "news-uk") {
                  url = "https://www.huffingtonpost.co.uk/news";
                  Category = "UK";
                }
              }
            }

            _context.prev = 28;

            if (!(Category === "Australia" || Category === "UK" || Category === "Canada")) {
              _context.next = 34;
              break;
            }

            _context.next = 32;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 32:
            _context.next = 36;
            break;

          case 34:
            _context.next = 36;
            return regeneratorRuntime.awrap(page["goto"]([url, '', Category].join('')));

          case 36:
            _context.next = 60;
            break;

          case 38:
            _context.prev = 38;
            _context.t1 = _context["catch"](28);

            if (!(Category === "Australia" || Category === "UK" || Category === "Canada")) {
              _context.next = 45;
              break;
            }

            _context.next = 43;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 43:
            _context.next = 47;
            break;

          case 45:
            _context.next = 47;
            return regeneratorRuntime.awrap(page["goto"]([url, '', Category].join('')));

          case 47:
            _context.next = 49;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 49:
            _context.t2 = regeneratorRuntime;
            _context.t3 = Promise;
            _context.t4 = page.waitForNavigation();
            _context.t5 = page.click(".g-recaptcha");
            _context.next = 55;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 55:
            _context.t6 = _context.sent;
            _context.t7 = [_context.t4, _context.t5, _context.t6];
            _context.t8 = _context.t3.all.call(_context.t3, _context.t7);
            _context.next = 60;
            return _context.t2.awrap.call(_context.t2, _context.t8);

          case 60:
            _context.next = 62;
            return regeneratorRuntime.awrap(page.evaluate(function (Category, url) {
              // HuffPost Classes
              var titleClassName = ".zone__content a.card__headline--long>h2";
              var linkClassName = ".zone__content a.card__headline--long";
              var imageClassName = ".zone__content .card__image__src picture img.landscape";

              if (Category.indexOf("life") != -1) {
                titleClassName = ".zone--latest .zone__content h3.card__headline__text";
                linkClassName = ".zone--latest .zone__content a.card__headline";
                imageClassName = ".zone--latest .zone__content .card__image__src picture>img";
              } // get lists


              var titles = document.querySelectorAll(titleClassName);
              var links = document.querySelectorAll(linkClassName);
              var images = document.querySelectorAll(imageClassName); //change category name

              var cateogryName = Category;

              if (Category.indexOf('/') != -1) {
                if (Category.indexOf('arts') != -1 && Category.indexOf('entertainment') != -1) {
                  cateogryName = "art&design,entertainment";
                } else {
                  if (Category.indexOf('life') != -1) {
                    if (Category.indexOf('travel') != -1) {
                      cateogryName = "life&style,travel";
                    } else {
                      cateogryName = "life&style";
                    }
                  }
                }
              }

              if (Category === 'world-news') {
                cateogryName = "International";
              }

              if (Category === "news/us-news") {
                cateogryName = "US";
              } //////////////////////////////


              var data = [];

              for (var j = 0; j < 3; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined" && images[j].src.indexOf('http') == 0) {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] != "undefined" ? images[j].src : null,
                    Category: cateogryName,
                    source: "HuffPost",
                    sourceLink: url,
                    sourceLogo: "HuffPost logo"
                  });
                }
              }

              return data;
            }, Category, url));

          case 62:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 65:
            i++;
            _context.next = 23;
            break;

          case 68:
            _context.next = 70;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 70:
            _context.next = 72;
            return regeneratorRuntime.awrap(browser.close());

          case 72:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[9, 16], [28, 38]]);
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
            _context2.next = 32;
            break;
          }

          item = data[i];
          url = item.link;
          console.log(i);
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(page["goto"](url, {
            waitUntil: 'load',
            timeout: 0
          }));

        case 9:
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](6);
          _context2.next = 15;
          return regeneratorRuntime.awrap(page["goto"](url, {
            waitUntil: 'load',
            timeout: 0
          }));

        case 15:
          _context2.next = 17;
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

        case 17:
          Content = _context2.sent;
          // get the author with content
          author = "";

          if (!(item.Category.indexOf("life&style") != -1)) {
            _context2.next = 25;
            break;
          }

          _context2.next = 22;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var auth = document.querySelector('.entry__byline__author>a>div');

            if (auth != null && typeof auth != "undefined") {
              return auth.textContent;
            } else {
              return null;
            }
          }));

        case 22:
          author = _context2.sent;
          _context2.next = 28;
          break;

        case 25:
          _context2.next = 27;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var auth = document.querySelector('a.author-card__link>span');

            if (auth != null && typeof auth != "undefined") {
              return auth.textContent;
            } else {
              return null;
            }
          }));

        case 27:
          author = _context2.sent;

        case 28:
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

        case 29:
          i++;
          _context2.next = 2;
          break;

        case 32:
          console.log(AllData_WithConetent);

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 11]]);
};

module.exports = HuffPost;