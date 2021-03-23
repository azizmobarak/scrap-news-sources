"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData; //block ads


puppeteer.use(AdblockerPlugin()); // stealth

puppeteer.use(puppeteer_stealth());
puppeteer.use(puppeteer_agent());
var Categories = ['entertainment', 'world', 'health', 'travel', 'sex', 'tech', 'food', 'money', 'environment'];

var VICENEWS = function VICENEWS() {
  (function _callee2() {
    var browser, page, AllData, i, Category, PageData;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: true,
              args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb']
            }));

          case 2:
            browser = _context2.sent;
            _context2.next = 5;
            return regeneratorRuntime.awrap(browser.newPage());

          case 5:
            page = _context2.sent;
            AllData = [];
            _context2.prev = 7;
            i = 0;

          case 9:
            if (!(i < 1)) {
              _context2.next = 40;
              break;
            }

            //get the right category by number
            Category = Categories[parseInt(Math.random() * 9)];
            console.log(Category);
            _context2.prev = 12;
            _context2.next = 15;
            return regeneratorRuntime.awrap(page["goto"](['https://www.vice.com/en/section/', '', Category].join('')));

          case 15:
            _context2.next = 21;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](12);
            _context2.next = 21;
            return regeneratorRuntime.awrap(page["goto"](['https://www.vice.com/en/section/', '', Category].join('')));

          case 21:
            _context2.next = 23;
            return regeneratorRuntime.awrap(page.evaluate(function () {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(function _callee() {
                var scrollHeight;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= 4000) {
                          clearInterval(timer);
                          resolve();
                        }

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }, 100);
            }));

          case 23:
            _context2.next = 25;
            return regeneratorRuntime.awrap(page.waitFor(6000));

          case 25:
            _context2.prev = 25;
            _context2.next = 28;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var article = document.querySelectorAll('.vice-card');
              var titleClassName = "h3";
              var linkClassName = "a";
              var imageClassName = "picture>source+source+source";
              var authorClassName = ".vice-card-details__byline"; //change category name

              var cateogryName = Category;

              if (Category === "world") {
                cateogryName = "international";
              } else {
                if (Category === "sex") {
                  cateogryName = "health";
                }
              } //////////////////////////////


              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof article[j] != "undefined" && article[j].querySelector(titleClassName) != null && article[j].querySelector(linkClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: article[j].querySelector(titleClassName).textContent.trim(),
                    link: article[j].querySelector(linkClassName).href,
                    images: article[j].querySelector(imageClassName) != null ? article[j].querySelector(imageClassName).srcset.substring(0, article[j].querySelector(imageClassName).srcset.indexOf('*') - 1) : null,
                    Category: cateogryName,
                    source: "VICE news",
                    sourceLink: "https://www.vice.com",
                    sourceLogo: "vice news logo",
                    author: article[j].querySelector(authorClassName) != null ? article[j].querySelector(authorClassName).textContent : null
                  });
                }
              }

              return data;
            }, Category));

          case 28:
            PageData = _context2.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });
            _context2.next = 37;
            break;

          case 33:
            _context2.prev = 33;
            _context2.t1 = _context2["catch"](25);
            console.log(_context2.t1);
            i = i - 1;

          case 37:
            i++;
            _context2.next = 9;
            break;

          case 40:
            _context2.next = 47;
            break;

          case 42:
            _context2.prev = 42;
            _context2.t2 = _context2["catch"](7);
            console.log(_context2.t2);
            _context2.next = 47;
            return regeneratorRuntime.awrap(browser.close());

          case 47:
            _context2.prev = 47;
            _context2.next = 50;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 50:
            _context2.next = 56;
            break;

          case 52:
            _context2.prev = 52;
            _context2.t3 = _context2["catch"](47);
            _context2.next = 56;
            return regeneratorRuntime.awrap(browser.close());

          case 56:
            _context2.next = 58;
            return regeneratorRuntime.awrap(browser.close());

          case 58:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 42], [12, 17], [25, 33], [47, 52]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, imageItem;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 28;
            break;
          }

          item = data[i];
          url = item.link;
          _context3.next = 7;
          return regeneratorRuntime.awrap(page.setJavaScriptEnabled(false));

        case 7:
          _context3.prev = 7;
          _context3.next = 10;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 10:
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](7);
          _context3.next = 16;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 16:
          _context3.next = 18;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article__body-components').textContent;
              return text;
            } catch (_unused2) {
              return null;
            }
          }));

        case 18:
          Content = _context3.sent;
          imageItem = "";

          if (!(item.images === "" || item.images.length == 0)) {
            _context3.next = 24;
            break;
          }

          _context3.next = 23;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var img = document.querySelector('picture source').srcset;
              return img.substring(0, img.indexOf('*') - 1);
            } catch (_unused3) {
              return null;
            }
          }));

        case 23:
          imageItem = _context3.sent;

        case 24:
          if (Content != null && Content != "") {
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
              type: "Article",
              content: Content != null ? Content : null
            });
          }

        case 25:
          i++;
          _context3.next = 2;
          break;

        case 28:
          _context3.next = 30;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 12]]);
};

module.exports = VICENEWS;