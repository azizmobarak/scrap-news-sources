"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../function/formatimage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../../function/sendtoserver'),
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
var Categories = ['uk/commentisfree', 'football', 'sport/rugby-union', 'sport/cricket', 'sport/tennis', 'sport/golf', 'sport/formulaone', 'uk/culture', 'uk/lifeandstyle', 'world', 'uk-news', 'uk/environment', 'science', 'global-development', 'uk/technology', 'uk/business', 'books', 'artanddesign', 'fashion', 'food', 'lifeandstyle/love-and-sex', 'lifeandstyle/health-and-wellbeing', 'lifeandstyle/home-and-garden', 'lifeandstyle/women', 'lifeandstyle/men', 'lifeandstyle/family', 'uk/travel', 'uk/money'];

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
            AllData = [];
            _context.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context.next = 49;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 12;
            _context.next = 15;
            return regeneratorRuntime.awrap(page["goto"](['https://www.theguardian.com/', '', Category].join('')));

          case 15:
            _context.prev = 15;
            _context.next = 18;
            return regeneratorRuntime.awrap(page.click('.ncm-not-interested-button'));

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](15);
            console.log('passed');

          case 23:
            _context.next = 42;
            break;

          case 25:
            _context.prev = 25;
            _context.t1 = _context["catch"](12);
            _context.next = 29;
            return regeneratorRuntime.awrap(page["goto"](['https://www.theguardian.com/', '', Category].join('')));

          case 29:
            _context.next = 31;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 31:
            _context.t2 = regeneratorRuntime;
            _context.t3 = Promise;
            _context.t4 = page.waitForNavigation();
            _context.t5 = page.click(".g-recaptcha");
            _context.next = 37;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 37:
            _context.t6 = _context.sent;
            _context.t7 = [_context.t4, _context.t5, _context.t6];
            _context.t8 = _context.t3.all.call(_context.t3, _context.t7);
            _context.next = 42;
            return _context.t2.awrap.call(_context.t2, _context.t8);

          case 42:
            _context.next = 44;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('.fc-item__container');
              var titleClassName = "h3";
              var linkClassName = "a";
              var imageClassName = "img"; //change category name

              var cateogryName = "";

              if (Category.indexOf('/') != -1 && Category.indexOf('uk') != -1) {
                if (Category.indexOf('commentisfree') != -1) {
                  cateogryName = "opinion";
                } else {
                  if (Category.indexOf('lifeandstyle') != -1) {
                    cateogryName = "life&style";
                  } else {
                    cateogryName = "UK";
                  }
                }
              } else {
                if (Category.indexOf('/') != -1 && Category.indexOf('sport') != -1) {
                  if (Category.indexOf('golf') != -1) {
                    cateogryName = "golf";
                  } else {
                    if (Category.indexOf('rugby') != -1) {
                      cateogryName = "rugby";
                    } else {
                      if (Category.indexOf('tennis') != -1) {
                        cateogryName = "tennis";
                      } else {
                        if (Category.indexOf('formulaone') != -1) {
                          cateogryName = "formul 1";
                        } else {
                          if (Category.indexOf('cricket') != -1) {
                            cateogryName = "cricket";
                          }
                        }
                      }
                    }
                  }
                } else {
                  if (Category.indexOf('uk-news') != -1) {
                    cateogryName = "UK";
                  } else {
                    if (Category.indexOf('global-development') != -1) {
                      cateogryName = "international";
                    } else {
                      if (Category.indexOf('artanddesign') != -1) {
                        cateogryName = "art & Design";
                      } else {
                        if (Category.indexOf('/') != -1 && Category.indexOf('lifeandstyle/') != -1) {
                          if (Category.indexOf('home-and-garden') != -1) {
                            cateogryName = "life & Style";
                          } else {
                            if (Category.indexOf('health-and-wellbeing') != -1) {
                              cateogryName = "health";
                            } else {
                              if (cateogryName.indexOf('love-and-sex') != -1) {
                                cateogryName = "life & Style";
                              } else {
                                cateogryName = "life & Style";
                              }
                            }
                          }
                        } else {
                          if (Category === "football") {
                            cateogryName = "football";
                          } else {
                            if (Category === "world") cateogryName = "international";else {
                              cateogryName = Category;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } //////////////////////////////


              var data = [];

              for (var j = 0; j < 3; j++) {
                if (articles[j].querySelector(titleClassName) != null && articles[j].querySelector(linkClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titleClassName).textContent.trim().replaceAll('\n', ' '),
                    link: articles[j].querySelector(linkClassName).href,
                    images: articles[j].querySelector(imageClassName) != null ? articles[j].querySelector(imageClassName).src : null,
                    Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    source: "The Gardian - " + cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    sourceLink: "https://www.theguardian.com/",
                    sourceLogo: "https://www.youthalive.org/wp-content/uploads/2020/07/the-guardian-logo.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 44:
            PageData = _context.sent;
            // console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 46:
            i++;
            _context.next = 9;
            break;

          case 49:
            _context.next = 55;
            break;

          case 51:
            _context.prev = 51;
            _context.t9 = _context["catch"](7);
            _context.next = 55;
            return regeneratorRuntime.awrap(browser.close());

          case 55:
            _context.prev = 55;
            _context.next = 58;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 58:
            _context.next = 64;
            break;

          case 60:
            _context.prev = 60;
            _context.t10 = _context["catch"](55);
            _context.next = 64;
            return regeneratorRuntime.awrap(browser.close());

          case 64:
            _context.next = 66;
            return regeneratorRuntime.awrap(browser.close());

          case 66:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 51], [12, 25], [15, 20], [55, 60]]);
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
            _context2.next = 29;
            break;
          }

          item = data[i];
          url = item.link; //  console.log(url);

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
              var text = document.querySelector('.article-body-commercial-selector p').textContent + "\n" + document.querySelector('.article-body-commercial-selector p+p').textContent;
              return text;
            } catch (_unused5) {
              try {
                return document.querySelector('.content__standfirst').textContent.trim();
              } catch (_unused6) {
                return null;
              }
            }
          }));

        case 18:
          Content = _context2.sent;
          _context2.next = 21;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article-body-commercial-selector').innerHTML;
              return text;
            } catch (_unused7) {
              try {
                return document.querySelector('.content__standfirst').innerHTML;
              } catch (_unused8) {
                return null;
              }
            }
          }));

        case 21:
          contenthtml = _context2.sent;
          _context2.next = 24;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('address a').textContent.trim();
            } catch (_unused9) {
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
              author: author != "" ? author : null,
              content: Content != null ? Content : null,
              contenthtml: contenthtml
            });
          }

        case 26:
          i++;
          _context2.next = 2;
          break;

        case 29:
          _context2.next = 31;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 31:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 12]]);
};

module.exports = Gardian;