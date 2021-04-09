"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../function/SendToServer'),
    SendToServer = _require2.SendToServer;

var _require3 = require('../../function/formatimage'),
    FormatImage = _require3.FormatImage; //block ads


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
              _context.next = 36;
              break;
            }

            //get the right category by number
            Category = Categories[i];
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
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t1 = _context["catch"](11);
            _context.next = 28;
            return regeneratorRuntime.awrap(page["goto"](['https://www.latimes.com/', '', Category].join('')));

          case 28:
            _context.next = 30;
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
                      cateogryName = "art & design";
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
                        cateogryName = "life & Style";
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

              for (var j = 0; j < 1; j++) {
                if (articles[j].querySelector(titleClassName) != null && articles[j].querySelector(linkClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titleClassName).textContent.trim(),
                    link: articles[j].querySelector(linkClassName).href,
                    images: articles[j].querySelector(imageClassName) != null && articles[j].querySelector(imageClassName).src.indexOf("data:image") == -1 ? articles[j].querySelector(imageClassName).src : null,
                    Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    source: "LosAngelesTimes - " + cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    sourceLink: "https://www.latimes.com/",
                    sourceLogo: "https://www.pngkey.com/png/detail/196-1964217_the-los-angeles-times-los-angeles-times-logo.png"
                  });
                }
              }

              return data;
            }, Category));

          case 30:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 33:
            i++;
            _context.next = 9;
            break;

          case 36:
            _context.next = 43;
            break;

          case 38:
            _context.prev = 38;
            _context.t2 = _context["catch"](7);
            _context.next = 42;
            return regeneratorRuntime.awrap(browser.close());

          case 42:
            console.log(_context.t2);

          case 43:
            _context.prev = 43;
            _context.next = 46;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 46:
            _context.next = 53;
            break;

          case 48:
            _context.prev = 48;
            _context.t3 = _context["catch"](43);
            _context.next = 52;
            return regeneratorRuntime.awrap(browser.close());

          case 52:
            console.log(_context.t3);

          case 53:
            _context.next = 55;
            return regeneratorRuntime.awrap(browser.close());

          case 55:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 38], [11, 24], [14, 19], [43, 48]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, contenthtml, author;
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
          _context2.next = 7;
          return regeneratorRuntime.awrap(page.setJavaScriptEnabled(false));

        case 7:
          _context2.prev = 7;
          _context2.next = 10;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.waitForSelector('.story'));

        case 12:
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](7);
          _context2.next = 18;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 18:
          _context2.next = 20;
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

        case 20:
          Content = _context2.sent;
          _context2.next = 23;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.rich-text-article-body-content');
              return text.innerHTML;
            } catch (_unused4) {
              return null;
            }
          }));

        case 23:
          contenthtml = _context2.sent;
          _context2.next = 26;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.author-name>span+span').textContent;
            } catch (_unused5) {
              return null;
            }
          }));

        case 26:
          author = _context2.sent;

          if (Content != null && Content != "" && contenthtml != null) {
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
              content: Content != null ? Content : null,
              contenthtml: contenthtml
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
  }, null, null, [[7, 14]]);
};

module.exports = LosAngelesTimes;