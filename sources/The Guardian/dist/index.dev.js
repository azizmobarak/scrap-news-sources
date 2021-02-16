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
var Categories = ['uk/commentisfree', 'uk/sport', 'uk/culture', 'uk/lifeandstyle', 'world', 'uk-news', 'uk/environment', 'science', 'global-development', 'football', 'uk/technology', 'uk/business', 'sport/cricket', 'sport/rugby-union', 'sport/tennis', 'sport/cycling', 'sport/formulaone', 'sport/golf', 'sport/us-sport', 'books', 'artanddesign', 'fashion', 'food', 'lifeandstyle/love-and-sex', 'lifeandstyle/health-and-wellbeing', 'lifeandstyle/home-and-garden', 'lifeandstyle/women', 'lifeandstyle/men', 'lifeandstyle/family', 'uk/travel', 'uk/money'];

var Gardian = function Gardian() {
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
            return regeneratorRuntime.awrap(page["goto"](['https://www.theguardian.com/', '', Category].join('')));

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
            return regeneratorRuntime.awrap(page["goto"](['https://www.theguardian.com/', '', Category].join('')));

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
              var loop = 2;
              var titleClassName = ".fc-container--rolled-up-hide .fc-slice-wrapper .fc-item__container .fc-item__content h3";
              var linkClassName = ".fc-container--rolled-up-hide .fc-slice-wrapper .fc-item__container .fc-item__content a";
              var imageClassName = ".fc-container--rolled-up-hide .fc-slice-wrapper .fc-item__container .fc-item__media-wrapper img"; // all elements

              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName);
              var links = document.querySelectorAll(linkClassName); //change category name

              var cateogryName = "";

              if (Category.indexOf('/') != -1 && Category.indexOf('uk') != -1) {
                if (Category.indexOf('commentisfree') != -1) {
                  cateogryName = "opinion,uk";
                } else {
                  if (Category.indexOf('lifeandstyle') != -1) {
                    cateogryName = "life&style,uk";
                  } else {
                    cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length) + "," + "uk";
                  }
                }
              } else {
                if (Category.indexOf('/') != -1 && Category.indexOf('sport') != -1) {
                  if (Category.indexOf('us') != -1) {
                    cateogryName = "sport,us";
                  } else {
                    if (Category.indexOf('rugby') != -1) {
                      cateogryName = "sport,rugby";
                    } else {
                      cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length) + "," + "sport";
                    }
                  }
                } else {
                  if (Category.indexOf('uk-news') != -1) {
                    cateogryName = "uk";
                  } else {
                    if (Category.indexOf('global-development') != -1) {
                      cateogryName = "International";
                    } else {
                      if (Category.indexOf('artanddesign') != -1) {
                        cateogryName = "art&design";
                      } else {
                        if (Category.indexOf('/') != -1 && Category.indexOf('lifeandstyle/') != -1) {
                          if (Category === 'home-and-garden') {
                            cateogryName = "life&style,house";
                          } else {
                            if (Category === 'health-and-wellbeing') {
                              cateogryName = "health,life&style";
                            } else {
                              if (cateogryName.indexOf('love-and-sex') != -1) {
                                cateogryName = "love&next,life&style";
                              } else {
                                if (Category === "world") {
                                  cateogryName = "International";
                                } else {
                                  cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length) + "," + "life&style";
                                }
                              }
                            }
                          }
                        } else {
                          if (Category === "football") {
                            cateogryName = "sport,football";
                          } else {
                            cateogryName = Category;
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
                    source: "The Gardian",
                    sourceLink: "https://www.theguardian.com/",
                    sourceLogo: "The Gardian logo"
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
              var text = document.querySelector('.article-body-commercial-selector p').textContent + "\n" + document.querySelector('.article-body-commercial-selector p+p').textContent;
              return text;
            } catch (_unused3) {
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

module.exports = Gardian;