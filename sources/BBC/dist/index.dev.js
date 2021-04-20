"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../function/formatImage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../function/sendToserver'),
    SendToServer = _require3.SendToServer; //block ads


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
var Categories = ['coronavirus', 'world', 'UK', 'business', 'technology', 'science_and_environment', 'stories', 'entertainment_and_arts', 'health'];

var BBC = function BBC() {
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

            _context.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context.next = 21;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category); //navigate to category sub route

            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://www.bbc.com/news/', '', Category].join('')));

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // function to look for a word inside other words
              var WordExist = function WordExist(searchIn) {
                if (searchIn.indexOf("second") != -1) {
                  return true;
                } else {
                  if (searchIn.indexOf("seconds") != -1) {
                    return true;
                  } else {
                    if (searchIn.indexOf("minute") != -1) {
                      return true;
                    } else {
                      if (searchIn.indexOf("minutes") != -1) {
                        return true;
                      } else {
                        if (searchIn.startsWith("1 hour") != false || searchIn.startsWith("2 hours") != false || searchIn.startsWith("an hour") != false) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    }
                  }
                }
              };

              var titleClassName = "h3.gs-c-promo-heading__title";
              var linkClassName = ".gs-c-promo-body>div>a.gs-c-promo-heading";
              var imageClassName = "div.gs-c-promo-image>div>div>img";
              var timeClassName = "time.gs-o-bullet__text>span"; // var authorClassName=".vice-card .vice-card-details__byline";

              if (Category === "coronavirus" || Category === "stories" || Category === "UK") {
                titleClassName = "h3.gs-c-promo-heading__title";
                linkClassName = "a.gs-c-promo-heading";
                imageClassName = ".gs-o-media-island img";
                timeClassName = ".gs-c-timestamp";
              }

              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName); //.gs-o-media-island>div>img

              var time = document.querySelectorAll(timeClassName);
              var link = document.querySelectorAll(linkClassName);
              var categoryName = Category;

              if (categoryName === "coronavirus") {
                categoryName = "health";
              } else {
                if (categoryName === "world") {
                  categoryName = "international";
                } else {
                  if (categoryName === "science_and_environment") {
                    categoryName = "science";
                  } else {
                    if (categoryName === "entertainment_and_arts") {
                      categoryName = "entertainment";
                    }
                  }
                }
              }

              var data = [];

              for (var j = 0; j < 4; j++) {
                if (WordExist(typeof time[j] == "undefined" ? "nothing" : time[j].textContent) == true && typeof titles[j] != "undefined" && images[j].src.indexOf('http') == 0 && typeof link[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent,
                    link: link[j].href,
                    images: typeof images[j] != "undefined" ? images[j].src : null,
                    Category: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                    source: "BBC - " + categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                    sourceLink: "https://bbc.com",
                    sourceLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/ff/BBC_News.svg/1200px-BBC_News.svg.png",
                    type: "article",
                    author: null
                  });
                }
              }

              return data;
            }, Category));

          case 16:
            PageData = _context.sent;
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 18:
            i++;
            _context.next = 9;
            break;

          case 21:
            _context.next = 27;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](7);
            _context.next = 27;
            return regeneratorRuntime.awrap(browser.close());

          case 27:
            _context.prev = 27;
            _context.next = 30;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 30:
            _context.next = 37;
            break;

          case 32:
            _context.prev = 32;
            _context.t1 = _context["catch"](27);
            console.log(_context.t1);
            _context.next = 37;
            return regeneratorRuntime.awrap(browser.close());

          case 37:
            _context.next = 39;
            return regeneratorRuntime.awrap(browser.close());

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 23], [27, 32]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, contenthtml;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 18;
            break;
          }

          item = data[i];
          url = item.link;
          console.log(url);
          _context2.next = 8;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelectorAll('.ssrcss-5h7eao-ArticleWrapper p');
              var allcontent = "";

              for (var k = 1; k < text.length; k++) {
                if (text[k].textContent != "") {
                  allcontent = allcontent + "\n" + text[k].textContent;
                }
              }

              return allcontent;
            } catch (_unused2) {
              try {
                return document.querySelector('.ssrcss-5h7eao-ArticleWrapper').textContent.substring(100, 1100);
              } catch (_unused3) {
                return null;
              }
            }
          }));

        case 10:
          Content = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.ssrcss-5h7eao-ArticleWrapper').innerHTML;
            } catch (_unused4) {
              try {
                return document.querySelector('.ssrcss-5h7eao-ArticleWrapper').innerHTML;
              } catch (_unused5) {
                return null;
              }
            }
          }));

        case 13:
          contenthtml = _context2.sent;

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
              content: Content,
              contenthtml: contenthtml
            });
          }

        case 15:
          i++;
          _context2.next = 2;
          break;

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = BBC;