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
            AllData = [];
            _context.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context.next = 40;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 12;
            _context.next = 15;
            return regeneratorRuntime.awrap(page["goto"](['https://www.latimes.com/', '', Category].join('')));

          case 15:
            _context.prev = 15;
            _context.next = 18;
            return regeneratorRuntime.awrap(page.click('.ncm-not-interested-button'));

          case 18:
            _context.next = 24;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](15);
            console.log(_context.t0);
            console.log('passed');

          case 24:
            _context.next = 31;
            break;

          case 26:
            _context.prev = 26;
            _context.t1 = _context["catch"](12);
            console.log(_context.t1); //navigate to category sub route

            _context.next = 31;
            return regeneratorRuntime.awrap(page["goto"](['https://www.latimes.com/', '', Category].join('')));

          case 31:
            // get the data from the page
            console.log(Category);
            _context.next = 34;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // Los Angelece News classes
              var articles = document.querySelectorAll(".promo");
              var titleClassName = "p:nth-child(2)";
              var linkClassName = "p:nth-child(2)>a";
              var imageClassName = "img"; //change category name

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
                        cateogryName = "entertainment";
                      } else {
                        cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length);
                      }
                    }
                  }
                } else {
                  if (Category === "world-nation") {
                    cateogryName = "international";
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
              }

              if (Category === "politics") {
                cateogryName = "politic";
              } //////////////////////////////


              var data = [];

              for (var j = 0; j < 3; j++) {
                if (articles[j].querySelector(titleClassName) != null && articles[j].querySelector(linkClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titleClassName).textContent.trim(),
                    link: articles[j].querySelector(linkClassName).href,
                    images: articles[j].querySelector(imageClassName) != null && articles[j].querySelector(imageClassName).src.indexOf("data:image") == -1 ? articles[j].querySelector(imageClassName).src : null,
                    Category: cateogryName.toLowerCase(),
                    source: "LosAngelesTimes " + cateogryName,
                    sourceLink: "https://www.latimes.com/",
                    sourceLogo: "https://www.pngkey.com/png/detail/196-1964217_the-los-angeles-times-los-angeles-times-logo.png"
                  });
                }
              }

              return data;
            }, Category));

          case 34:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 37:
            i++;
            _context.next = 9;
            break;

          case 40:
            _context.next = 47;
            break;

          case 42:
            _context.prev = 42;
            _context.t2 = _context["catch"](7);
            console.log(_context.t2);
            _context.next = 47;
            return regeneratorRuntime.awrap(browser.close());

          case 47:
            _context.prev = 47;
            _context.next = 50;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 50:
            _context.next = 57;
            break;

          case 52:
            _context.prev = 52;
            _context.t3 = _context["catch"](47);
            console.log(_context.t3);
            _context.next = 57;
            return regeneratorRuntime.awrap(browser.close());

          case 57:
            _context.next = 59;
            return regeneratorRuntime.awrap(browser.close());

          case 59:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 42], [12, 26], [15, 20], [47, 52]]);
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
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.waitForSelector('.story'));

        case 13:
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](8);
          _context2.next = 19;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 19:
          _context2.next = 21;
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

        case 21:
          Content = _context2.sent;
          _context2.next = 24;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.author-name>span+span').textContent;
            } catch (_unused2) {
              return null;
            }
          }));

        case 24:
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

        case 26:
          i++;
          _context2.next = 2;
          break;

        case 29:
          console.log(AllData_WithConetent); // await InsertData(AllData_WithConetent);

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 15]]);
};

module.exports = LosAngelesTimes;