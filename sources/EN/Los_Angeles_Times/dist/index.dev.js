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
var Categories = ['business', 'business/technology', 'business/real-estate', 'entertainment-arts/business', 'topic/arts', 'food', 'lifestyle', 'topic/fashion', 'opinion', 'politics', 'science', 'travel', 'world-nation', 'environment', 'entertainment-arts', 'entertainment-arts/movies', 'entertainment-arts/books', 'homeless-housing'];

var LosAngelesTimes = function LosAngelesTimes() {
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
              _context.next = 49;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://www.latimes.com/', '', Category].join('')));

          case 14:
            _context.prev = 14;
            _context.next = 17;
            return regeneratorRuntime.awrap(page.click('.ncm-not-interested-button'));

          case 17:
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](14);
            console.log('passed');

          case 22:
            _context.next = 41;
            break;

          case 24:
            _context.prev = 24;
            _context.t1 = _context["catch"](11);
            _context.next = 28;
            return regeneratorRuntime.awrap(page["goto"](['https://www.latimes.com/', '', Category].join('')));

          case 28:
            _context.next = 30;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 30:
            _context.t2 = regeneratorRuntime;
            _context.t3 = Promise;
            _context.t4 = page.waitForNavigation();
            _context.t5 = page.click(".g-recaptcha");
            _context.next = 36;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 36:
            _context.t6 = _context.sent;
            _context.t7 = [_context.t4, _context.t5, _context.t6];
            _context.t8 = _context.t3.all.call(_context.t3, _context.t7);
            _context.next = 41;
            return _context.t2.awrap.call(_context.t2, _context.t8);

          case 41:
            _context.next = 43;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // Los Angelece News classes
              var loop = 1;
              var titleClassName = ".promo-content .promo-title";
              var linkClassName = ".promo-content .promo-title a";
              var imageClassName = "ps-promo a img"; // all elements

              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName);
              var links = document.querySelectorAll(linkClassName); //change category name

              var cateogryName = "";

              if (Category === "homeless-housing") {
                cateogryName = "house";
              } else {
                if (Category.indexOf('/') != -1) {
                  if (Category.indexOf('real-estate') != -1) {
                    cateogryName = "business";
                  } else {
                    if (Category.indexOf('arts') != -1) {
                      cateogryName = "art&design";
                    } else {
                      if (Category.indexOf('entertainment-arts') != -1) {
                        cateogryName = "entertainment," + Category.substring(Category.indexOf('/') + 1, Category.length);
                      } else {
                        cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length);
                      }
                    }
                  }
                } else {
                  if (Category === "world-nation") {
                    cateogryName = "International";
                  } else {
                    if (Category === "entertainment-arts") {
                      cateogryName = "entertainment";
                    } else {
                      if (Category === "lifestyle") {
                        cateogryName = "life&style";
                      } else {
                        cateogryName = Category;
                      }
                    }
                  }
                }
              } //////////////////////////////


              var data = [];

              for (var j = 0; j < loop; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] != "undefined" ? images[j].src : null,
                    Category: cateogryName,
                    source: "Los Angeles Times",
                    sourceLink: "https://www.latimes.com/",
                    sourceLogo: "https://www.pngkey.com/png/detail/196-1964217_the-los-angeles-times-los-angeles-times-logo.png"
                  });
                }
              }

              return data;
            }, Category));

          case 43:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 46:
            i++;
            _context.next = 8;
            break;

          case 49:
            console.log(AllData);
            _context.next = 52;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 52:
            _context.next = 54;
            return regeneratorRuntime.awrap(browser.close());

          case 54:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[11, 24], [14, 19]]);
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
          console.log(url);
          _context2.next = 8;
          return regeneratorRuntime.awrap(page.setJavaScriptEnabled(false));

        case 8:
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.waitForSelector('.story'));

        case 13:
          _context2.next = 21;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](8);
          _context2.next = 19;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(page.waitForSelector('.story'));

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelector('.rich-text-article-body-content');

            if (text == null || typeof text === "undefined") {
              text = document.querySelectorAll('p');
              var allcontent = "";

              for (var k = 0; k < text.length / 2; k++) {
                if (text[k].textContent != "" && text[k].textContent.length > 150) {
                  allcontent = k != 0 ? allcontent + "\n" + text[k].textContent : text[k].textContent;
                }
              }

              return allcontent.substring(0, 1200).replaceAll("\n", ' ') + " ...";
            } else {
              return text.textContent.replaceAll('Advertisement', '').replaceAll("\n", ' ').substring(0, 1200) + " ...";
            }
          }));

        case 23:
          Content = _context2.sent;
          _context2.next = 26;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.author-name>span+span').textContent;
            } catch (_unused3) {
              return null;
            }
          }));

        case 26:
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
  }, null, null, [[8, 15]]);
};

module.exports = LosAngelesTimes;