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
    SendToServer = _require3.SendToServer;

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
              headless: true,
              ignoreHTTPSErrors: true,
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
              _context.next = 27;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            _context.prev = 10;
            _context.next = 13;
            return regeneratorRuntime.awrap(page["goto"](['https://www.washingtonpost.com/', '', Category].join('')));

          case 13:
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](10);
            _context.next = 19;
            return regeneratorRuntime.awrap(page["goto"](['https://www.washingtonpost.com/', '', Category].join('')));

          case 19:
            _context.next = 21;
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
                  cateogryName = "technology";
                } else {
                  if (Category.indexOf('safety') != -1) {
                    cateogryName = "safety";
                  } else {
                    if (Category === 'world') {
                      cateogryName = "international";
                    } else {
                      if (Category === "entertainment/books") {
                        cateogryName = "entertainment";
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
                                  cateogryName = "life & Style";
                                } else {
                                  if (cateogryName === "poinions") {
                                    cateogryName = "opinion";
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
                    Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    source: "WashingtonPost - " + cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    sourceLink: "https://www.washingtonpost.com/",
                    sourceLogo: "https://pbs.twimg.com/profile_images/1046851302859452416/NOW9bc02_400x400.jpg",
                    author: typeof authors[j] != "undefined" ? authors[j].textContent : null
                  });
                }
              }

              return data;
            }, Category));

          case 21:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 24:
            i++;
            _context.next = 8;
            break;

          case 27:
            _context.prev = 27;
            _context.next = 30;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 30:
            _context.next = 36;
            break;

          case 32:
            _context.prev = 32;
            _context.t1 = _context["catch"](27);
            _context.next = 36;
            return regeneratorRuntime.awrap(browser.close());

          case 36:
            _context.next = 38;
            return regeneratorRuntime.awrap(browser.close());

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[10, 15], [27, 32]]);
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
            _context2.next = 30;
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
          _context2.next = 20;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](7);
          i++;
          item = data[i];
          url = item.link;
          console.log(url);
          _context2.next = 20;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 20:
          _context2.next = 22;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article-body').textContent;
              return text;
            } catch (_unused3) {
              return null;
            }
          }));

        case 22:
          Content = _context2.sent;
          _context2.next = 25;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article-body').innerHtml;
              return text;
            } catch (_unused4) {
              return null;
            }
          }));

        case 25:
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
              author: item.author,
              content: Content,
              contenthtml: contenthtml
            });
          }

        case 27:
          i++;
          _context2.next = 2;
          break;

        case 30:
          console.log(AllData_WithConetent);
          _context2.next = 33;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 33:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 12]]);
};

module.exports = WASHINGTONPOST;