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
var Categories = ['us', 'economy', 'technology', 'opinion', 'realestate', 'world', 'politics', 'business', 'markets', 'life-arts', 'types/asia-news', 'types/china-news', 'types/latin-america-news', 'economy', 'types/africa-news', 'types/canada-news', 'types/middle-east-news'];

var WALLSTREET = function WALLSTREET() {
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
              _context.next = 39;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            _context.prev = 10;
            _context.next = 13;
            return regeneratorRuntime.awrap(page["goto"](['https://www.wsj.com/news/', '', Category].join('')));

          case 13:
            _context.next = 32;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](10);
            _context.next = 19;
            return regeneratorRuntime.awrap(page["goto"](['https://www.wsj.com/news/', '', Category].join('')));

          case 19:
            _context.next = 21;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 21:
            _context.t1 = regeneratorRuntime;
            _context.t2 = Promise;
            _context.t3 = page.waitForNavigation();
            _context.t4 = page.click(".g-recaptcha");
            _context.next = 27;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 27:
            _context.t5 = _context.sent;
            _context.t6 = [_context.t3, _context.t4, _context.t5];
            _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
            _context.next = 32;
            return _context.t1.awrap.call(_context.t1, _context.t7);

          case 32:
            _context.next = 34;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var loop = 1;
              var condition = false; // Los Angelece News classes

              var titleClassName = "#main #top-news article>div>h2";
              var imageClassName = "#main #top-news article>div>a>img";
              var linkClassName = "#main #top-news article>div>a"; // all elements

              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName);
              var links = document.querySelectorAll(linkClassName); //change category name

              var cateogryName = "";

              switch (Category) {
                case 'world':
                  cateogryName = "international";
                  break;

                case 'life-arts':
                  cateogryName = "art&design";
                  break;

                case 'realestate':
                  cateogryName = "business";
                  break;

                default:
                  if (Category.indexOf('asia') != -1) {
                    cateogryName = "international";
                  } else {
                    if (cateogryName.indexOf('africa') != -1) {
                      categoryName = "international";
                    } else {
                      if (categoryName.indexOf('china') != -1) {
                        categoryName = 'international';
                      } else {
                        if (categoryName.indexOf('america')) {
                          categoryName = "us";
                        } else {
                          if (categoryName.indexOf('middle-east') != -1) {
                            categoryName = "international";
                          } else {
                            if (categoryName.indexOf('canada') != -1) {
                              categoryName = "canada";
                            } else {
                              cateogryName = Category;
                            }
                          }
                        }
                      }
                    }
                  }

              } //////////////////////////////
              // change selectors for some categories 


              if (Category === "technology" || Category.indexOf('type') != -1 || Category === "opinion" || Category === "politics" || Category === "business" || Category === "markets") {
                var arr_images = [];
                var arr_titles = [];
                var arr_links = [];
                var inDom = document.querySelectorAll('#main article');

                for (var d = 0; d < 4; d++) {
                  if (inDom[d].querySelector('img') != null) {
                    arr_images.push(inDom[d]);
                    arr_titles.push(inDom[d]);
                    arr_links.push(inDom[d]);
                  }
                }

                titles = arr_titles;
                images = arr_images;
                links = arr_links;
                loop = 3;
                condition = true;
              } else {
                loop = 1;
                condition = false;
              } ////////////////////////////////////


              var data = [];

              for (var j = 0; j < loop; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: condition == true ? titles[j].querySelector('h3').textContent.trim() : titles[j].textContent.trim(),
                    link: condition == true ? links[j].querySelector('a').href : links[j].href,
                    images: condition == true ? typeof images[j] != "undefined" ? images[j].querySelector('img').src : null : typeof images[j] != "undefined" ? images[j].src : null,
                    Category: cateogryName,
                    source: "The WALL STREET JOURNAL",
                    sourceLink: "https://www.wsj.com",
                    sourceLogo: "Wallstreet logo"
                  });
                }
              }

              return data;
            }, Category));

          case 34:
            PageData = _context.sent;
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 36:
            i++;
            _context.next = 8;
            break;

          case 39:
            _context.next = 41;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 41:
            _context.next = 43;
            return regeneratorRuntime.awrap(browser.close());

          case 43:
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
            _context2.next = 23;
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
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](7);
          _context2.next = 16;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelectorAll('.snippet div+div+div+div p');
              var textArray = [];

              for (var _i = 0; _i < text.length - 1; _i++) {
                textArray.push(text[_i].textContent);
                textArray.push('   ');
              }

              return textArray.join('\n');
            } catch (_unused2) {
              return null;
            }
          }));

        case 18:
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
              content: Content != null ? Content : null
            });
          }

        case 20:
          i++;
          _context2.next = 2;
          break;

        case 23:
          _context2.next = 25;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 12]]);
};

module.exports = WALLSTREET;