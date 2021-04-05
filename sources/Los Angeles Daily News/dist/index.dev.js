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

var _require3 = require('../../function/toUppearCase'),
    capitalizeFirstLetter = _require3.capitalizeFirstLetter; //block ads


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
var Categories = ['news/crime-and-public-safety', 'news/environment', 'business', 'news/politics', 'tag/health', 'tag/jobs', 'business/housing', 'sports', 'things-to-do/travel', 'things-to-do/movies', 'opinion'];

var LosAngelesNews = function LosAngelesNews() {
  (function _callee() {
    var browser, page, AllData, _loop, i, Category, PageData;

    return regeneratorRuntime.async(function _callee$(_context2) {
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

            _loop = function _loop(i) {
              return regeneratorRuntime.async(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      //get the right category by number
                      Category = Categories[i];
                      console.log(Category);
                      _context.prev = 2;
                      _context.next = 5;
                      return regeneratorRuntime.awrap(page["goto"](['https://www.dailynews.com/', '', Category].join('')));

                    case 5:
                      _context.next = 24;
                      break;

                    case 7:
                      _context.prev = 7;
                      _context.t0 = _context["catch"](2);
                      _context.next = 11;
                      return regeneratorRuntime.awrap(page["goto"](['https://www.dailynews.com/', '', Category].join('')));

                    case 11:
                      _context.next = 13;
                      return regeneratorRuntime.awrap(page.solveRecaptchas());

                    case 13:
                      _context.t1 = regeneratorRuntime;
                      _context.t2 = Promise;
                      _context.t3 = page.waitForNavigation();
                      _context.t4 = page.click(".g-recaptcha");
                      _context.next = 19;
                      return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
                        return el.click();
                      }));

                    case 19:
                      _context.t5 = _context.sent;
                      _context.t6 = [_context.t3, _context.t4, _context.t5];
                      _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
                      _context.next = 24;
                      return _context.t1.awrap.call(_context.t1, _context.t7);

                    case 24:
                      _context.next = 26;
                      return regeneratorRuntime.awrap(page.evaluate(function (Category) {
                        // Los Angelece News classes
                        var loop = 3;
                        var titleClassName = ".feature-primary article .entry-title";
                        var linkClassName = ".feature-primary article .entry-title a";
                        var imageClassName = ".feature-primary article figure div.image-wrapper>img"; // setconditions on categories 

                        if (Category === "news/environment") {
                          titleClassName = "section.landing a.article-title";
                          linkClassName = "section.landing a.article-title";
                          imageClassName = "section.landing .image-wrapper>img";
                          loop = 1;
                        } else {
                          if (Category === "business" || Category === "news/politics" || Category === "opinion") {
                            titleClassName = ".feature-top article h2";
                            linkClassName = ".feature-top article a";
                            imageClassName = ".feature-top article img";
                            loop = 1;
                          }

                          if (Category === "sports") {
                            titleClassName = ".feature-wrapper .article-title .dfm-title";
                            linkClassName = ".feature-wrapper article .entry-title a";
                            imageClassName = ".feature-wrapper article img";
                            loop = 1;
                          }
                        } // change the source logo to http 


                        var titles = document.querySelectorAll(titleClassName);
                        var images = document.querySelectorAll(imageClassName);
                        var links = document.querySelectorAll(linkClassName); //change category name

                        var cateogryName = "";

                        if (Category === "news/crime-and-public-safety") {
                          cateogryName = "Safety";
                        } else {
                          if (Category.indexOf('/') != -1) {
                            if (Category.indexOf('housing') != -1) {
                              cateogryName = "Business";
                            } else {
                              cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length);
                            }
                          } else {
                            cateogryName = Category;
                          }
                        }

                        if (cateogryName.indexOf("politics") != -1) cateogryName = "Politic"; //////////////////////////////

                        var data = [];

                        for (var j = 0; j < loop; j++) {
                          if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                            data.push({
                              time: Date.now(),
                              title: titles[j].textContent.trim(),
                              link: links[j].href,
                              images: typeof images[j] != "undefined" ? images[j].src : null,
                              Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                              source: "LosAngeles Daily News - " + cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                              sourceLink: "https://www.dailynews.com/",
                              sourceLogo: "https://www.brainsway.com/wp-content/uploads/2019/05/img47.png"
                            });
                          }
                        }

                        return data;
                      }, Category));

                    case 26:
                      PageData = _context.sent;
                      console.log(PageData);
                      PageData.map(function (item) {
                        var category = capitalizeFirstLetter(item.Category);
                        item.Category = category;
                        setTimeout(function () {
                          console.log("request here");
                          SendToServer("en", item.Category, item.source, item.sourceLogo);
                        }, 5000 * i);
                        AllData.push(item);
                      });

                    case 29:
                    case "end":
                      return _context.stop();
                  }
                }
              }, null, null, [[2, 7]]);
            };

            i = 0;

          case 10:
            if (!(i < Categories.length)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 13;
            return regeneratorRuntime.awrap(_loop(i));

          case 13:
            i++;
            _context2.next = 10;
            break;

          case 16:
            _context2.next = 23;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](7);
            console.log(_context2.t0);
            _context2.next = 23;
            return regeneratorRuntime.awrap(browser.close());

          case 23:
            _context2.prev = 23;
            _context2.next = 26;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 26:
            _context2.next = 33;
            break;

          case 28:
            _context2.prev = 28;
            _context2.t1 = _context2["catch"](23);
            console.log(_context2.t1);
            _context2.next = 33;
            return regeneratorRuntime.awrap(browser.close());

          case 33:
            _context2.next = 35;
            return regeneratorRuntime.awrap(browser.close());

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 18], [23, 28]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, ContentHTML, author;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 30;
            break;
          }

          item = data[i];
          url = item.link;
          console.log(url);
          _context3.prev = 6;
          _context3.next = 9;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(page.click('span>span>a'));

        case 11:
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](6);
          _context3.next = 17;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelectorAll('.article-body p');
              var textArray = [];

              for (var _i = 0; _i < text.length; _i++) {
                textArray.push(text[_i].textContent);
                textArray.push('   ');
              }

              return textArray.join('\n');
            } catch (_unused2) {
              return null;
            }
          }));

        case 19:
          Content = _context3.sent;
          _context3.next = 22;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article-body').innerHTML;
              return text;
            } catch (_unused3) {
              return null;
            }
          }));

        case 22:
          ContentHTML = _context3.sent;
          _context3.next = 25;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var auth = document.querySelector('.byline>a');
              return auth.textContent;
            } catch (_unused4) {
              return null;
            }
          }));

        case 25:
          author = _context3.sent;

          if (Content != null && Content != "" && ContentHTML != null) {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: item.images === "" ? null : item.images,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              author: author,
              content: Content != null ? Content : null,
              contentHTML: ContentHTML
            });
          }

        case 27:
          i++;
          _context3.next = 2;
          break;

        case 30:
          _context3.next = 32;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 32:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[6, 13]]);
};

module.exports = LosAngelesNews;