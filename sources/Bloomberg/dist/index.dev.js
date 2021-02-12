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
var Categories = ['markets', 'technology', 'opinion', 'businessweek', 'new-economy-forum'];

var Bloomberg = function Bloomberg() {
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
            AllData = []; // boucle on categories started 

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
                      return regeneratorRuntime.awrap(page["goto"](['https://www.bloomberg.com/', '', Category].join('')));

                    case 5:
                      _context.next = 24;
                      break;

                    case 7:
                      _context.prev = 7;
                      _context.t0 = _context["catch"](2);
                      _context.next = 11;
                      return regeneratorRuntime.awrap(page["goto"](['https://www.bloomberg.com/', '', Category].join('')));

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
                        }; // bloomberg serction one
                        // change the source logo to http 


                        var titles = document.querySelector('.single-story-module__headline-link');
                        var images = document.querySelector('.single-story-module img');
                        var time = document.querySelector('.single-story-module time');
                        var link = document.querySelector('.single-story-module a');

                        if (i == 2 || i == 3 || i == 4) {
                          time.textContent = "minute";
                        } //change category name


                        var cateogryName = "";

                        switch (Category) {
                          case "businessweek":
                            cateogryName = "Business";
                            break;

                          case "new-economy-forum":
                            cateogryName = "Economy";
                            break;

                          default:
                            cateogryName = Category;
                            break;
                        } //////////////////////////////


                        var data = [];

                        for (var j = 0; j < 1; j++) {
                          if (WordExist(time == null ? "nothing" : time.textContent) == true && titles != null) {
                            data.push({
                              time: Date.now(),
                              title: titles.textContent.trim(),
                              link: link.href,
                              images: typeof images != "undefined" ? images.src : null,
                              Category: cateogryName,
                              source: "Bloomberg",
                              sourceLink: "https://www.bloomberg.com/",
                              sourceLogo: "bloomberg logo"
                            });
                          }
                        }

                        return data;
                      }, Category));

                    case 26:
                      PageData = _context.sent;
                      console.log(PageData);
                      PageData.map(function (item) {
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

          case 9:
            if (!(i < Categories.length)) {
              _context2.next = 15;
              break;
            }

            _context2.next = 12;
            return regeneratorRuntime.awrap(_loop(i));

          case 12:
            i++;
            _context2.next = 9;
            break;

          case 15:
            console.log(AllData);
            _context2.next = 18;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 18:
            _context2.next = 20;
            return regeneratorRuntime.awrap(page.waitFor(20000));

          case 20:
            _context2.next = 22;
            return regeneratorRuntime.awrap(browser.close());

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    });
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, author;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 17;
            break;
          }

          item = data[i];
          url = item.link; // console.log(url);

          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelectorAll('div.body-copy-v2.fence-body p');
            var textArray = [];

            for (var _i = 0; _i < text.length; _i++) {
              textArray.push(text[_i].textContent);
              textArray.push('   ');
            }

            return textArray.join('\n');
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.lede-text-v2__byline').textContent.split('\n')[1].trim();
            } catch (_unused) {
              return null;
            }
          }));

        case 12:
          author = _context3.sent;

          if (item.images != null && Content != null && Content != "") {
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
              content: Content != null ? Content : null
            });
          }

        case 14:
          i++;
          _context3.next = 2;
          break;

        case 17:
          console.log(AllData_WithConetent);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = Bloomberg;