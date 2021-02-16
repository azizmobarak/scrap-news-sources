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
var Categories = ['politics', 'opinions', 'national/investigations', 'business/technology', 'local/public-safety', 'world', 'sports', 'entertainment/books', 'goingoutguide/movies', 'economy', 'health-care', 'markets', 'climate-environment', 'education', 'food', 'health', 'lifestyle', 'science'];

var WASHINGTONPOST = function WASHINGTONPOST() {
  (function _callee() {
    var browser, page, AllData, i, Category, PageData;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: false,
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
              _context.next = 41;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://www.washingtonpost.com/', '', Category].join('')));

          case 14:
            _context.next = 33;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            _context.next = 20;
            return regeneratorRuntime.awrap(page["goto"](['https://www.washingtonpost.com/', '', Category].join('')));

          case 20:
            _context.next = 22;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 22:
            _context.t1 = regeneratorRuntime;
            _context.t2 = Promise;
            _context.t3 = page.waitForNavigation();
            _context.t4 = page.click(".g-recaptcha");
            _context.next = 28;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 28:
            _context.t5 = _context.sent;
            _context.t6 = [_context.t3, _context.t4, _context.t5];
            _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
            _context.next = 33;
            return _context.t1.awrap.call(_context.t1, _context.t7);

          case 33:
            _context.next = 35;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // Los Angelece News classes
              var loop = 3;
              var start = 0;
              var titleClassName = ".story-list .story-body .story-headline h2";
              var linkClassName = ".story-list .story-body .story-headline h2>a";
              var imageClassName = ".story-list .story-image img";
              var authorClassName = ".story-list .story-list-meta span.author";

              if (Category === "opinions" || Category === "world" || Category === "sports") {
                titleClassName = "#main-content .top-table h2>a";
                linkClassName = "#main-content .top-table h2>a";
                imageClassName = "#main-content .top-table .photo-wrapper img";
                authorClassName = "#main-content .top-table .author";
              } else {
                if (Category.indexOf("books") != -1 || Category.indexOf("movies") != -1 || Category.indexOf("food") != -1) {
                  titleClassName = "#main-content .moat-trackable h2.headline";
                  linkClassName = "#main-content .moat-trackable h2.headline>a";
                  imageClassName = "#main-content .moat-trackable .photo-wrapper img";
                  authorClassName = "#main-content .moat-trackable span.author";
                  start = 1;
                }
              } // all elements


              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName);
              var links = document.querySelectorAll(linkClassName);
              var authors = document.querySelectorAll(authorClassName); //change category name

              var cateogryName = "";

              if (Category.indexOf('investigations') != -1) {
                cateogryName = "investing";
              } else {
                if (Category === 'business/technology') {
                  cateogryName = "business,technology";
                } else {
                  if (Category.indexOf('safety') != -1) {
                    cateogryName = "safety";
                  } else {
                    if (Category === 'world') {
                      cateogryName = "International";
                    } else {
                      if (Category === "entertainment/books") {
                        cateogryName = "entertainment,books";
                      } else {
                        if (Category.indexOf("movies") != -1) {
                          cateogryName = "movies";
                        } else {
                          if (Category.indexOf('health-care') != -1) {
                            cateogryName = "health";
                          } else {
                            if (Category === 'climate-environment') {
                              cateogryName = "environement";
                            } else {
                              if (Category === "education") {
                                cateogryName = "education";
                              } else {
                                if (Category === "lifestyle") {
                                  cateogryName = "life&style";
                                } else {
                                  if (cateogryName === "poinions") {
                                    cateogryName = "poinion";
                                  } else {
                                    cateogryName = Category;
                                  }
                                }
                              }
                            }
                          }
                        }
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
                    source: "The Washington Post",
                    sourceLink: "https://www.washingtonpost.com/",
                    sourceLogo: "The Washingtonpost logo",
                    author: typeof authors[j] != "undefined" ? authors[j].textContent : null
                  });
                }
              }

              return data;
            }, Category));

          case 35:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 38:
            i++;
            _context.next = 8;
            break;

          case 41:
            _context.next = 43;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 43:
            _context.next = 45;
            return regeneratorRuntime.awrap(browser.close());

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[11, 16]]);
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
            _context2.next = 24;
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
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](8);
          _context2.next = 17;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article-body').textContent;
              return text;
            } catch (_unused2) {
              return null;
            }
          }));

        case 19:
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
              author: item.author,
              content: Content != null ? Content : null
            });
          }

        case 21:
          i++;
          _context2.next = 2;
          break;

        case 24:
          _context2.next = 26;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 13]]);
};

module.exports = WASHINGTONPOST;