"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker'); //block ads


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

            i = 0;

          case 8:
            if (!(i < Categories.length)) {
              _context.next = 21;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category); //navigate to category sub route

            _context.next = 13;
            return regeneratorRuntime.awrap(page["goto"](['https://www.bbc.com/news/', '', Category].join('')));

          case 13:
            _context.next = 15;
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
                categoryName = "Health";
              } else {
                if (categoryName === "world") {
                  categoryName = "International";
                } else {
                  if (categoryName === "science_and_environment") {
                    categoryName = "Science,Environment";
                  } else {
                    if (categoryName === "entertainment_and_arts") {
                      categoryName = "Entertainment,Art&Design";
                    }
                  }
                }
              }

              var data = [];

              for (var j = 0; j < 4; j++) {
                if (
                /*(WordExist(typeof(time[j])=="undefined" ? "nothing" : time[j].textContent)==true)  &&*/
                typeof titles[j] != "undefined" && images[j].src.indexOf('http') == 0 && typeof link[j] != "undefined") {
                  data.push({
                    time: new Date.now(),
                    title: titles[j].textContent,
                    link: link[j].href,
                    images: typeof images[j] != "undefined" ? images[j].src : null,
                    Category: categoryName,
                    source: "BBC NEWS",
                    sourceLink: "https://bbc.com",
                    sourceLogo: "logo",
                    type: "article",
                    author: null
                  });
                }
              }

              return data;
            }, Category));

          case 15:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 18:
            i++;
            _context.next = 8;
            break;

          case 21:
            console.log(AllData);
            _context.next = 24;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 24:
            _context.next = 26;
            return regeneratorRuntime.awrap(browser.close());

          case 26:
          case "end":
            return _context.stop();
        }
      }
    });
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
            _context2.next = 14;
            break;
          }

          item = data[i];
          url = item.link; // console.log(url);

          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelector('.ssrcss-5h7eao-ArticleWrapper') == null ? null : document.querySelector('.ssrcss-5h7eao-ArticleWrapper').innerText.replace('Related Topics', '').replace('IMAGE COPYRIGHT', '').replace('Share', '');
            return text;
          }));

        case 9:
          Content = _context2.sent;

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
              content: Content
            });
          }

        case 11:
          i++;
          _context2.next = 2;
          break;

        case 14:
          console.log(AllData_WithConetent);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = BBC;