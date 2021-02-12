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
var Categories = ['topics/Security', 'topics/tech-industry', 'topics/Internet', 'topics/Culture', 'topics/Mobile', 'topics/sci-tech', 'topics/Computers', 'personal-finance/Investing', 'health/Fitness', 'health/healthy-eating'];

var CNET = function CNET() {
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
                      return regeneratorRuntime.awrap(page["goto"](["https://www.cnet.com/", '', Category].join('')));

                    case 5:
                      _context.next = 24;
                      break;

                    case 7:
                      _context.prev = 7;
                      _context.t0 = _context["catch"](2);
                      _context.next = 11;
                      return regeneratorRuntime.awrap(page["goto"](["https://www.cnet.com/", '', Category].join('')));

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
                        //change category name
                        var cateogryName = "";

                        if (i == 9) {
                          cateogryName = "Health";
                        } else {
                          if (Category.indexOf("tech") != -1) {
                            cateogryName = "Technology";
                          } else {
                            if (Category.indexOf('sci-tech') != -1) {
                              cateogryName = "Science,Technology";
                            } else {
                              cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length);
                            }
                          }
                        } //////////////////////////////
                        // CBC classes by categories 


                        var titleClassName = ".assetBody h2";
                        var linkClassName = ".assetBody a";
                        var imageClassName = ".assetThumb>a>figure>img";

                        if (cateogryName === "Culture") {
                          titleClassName = ".assetText a";
                          linkClassName = ".assetText a";
                          imageClassName = ".assetBody>a>figure>img";
                        } else {
                          if (cateogryName === "Investing" || cateogryName === "Fitness" || cateogryName === "Health") {
                            titleClassName = ".latestScrollItems .c-universalLatest_text h3";
                            linkClassName = ".latestScrollItems .c-universalLatest_text>a";
                            imageClassName = ".c-universalLatest_image>a>span>img";
                          }
                        } // change the source logo to http 


                        var titles = document.querySelectorAll(titleClassName);
                        var images = document.querySelectorAll(imageClassName);
                        var links = document.querySelectorAll(linkClassName);
                        var data = [];

                        for (var j = 0; j < 5; j++) {
                          if (typeof titles[j] != "undefined" && typeof links[j] != "undefined" && images[j].src.indexOf('http') == 0) {
                            data.push({
                              title: titles[j].textContent.trim(),
                              link: links[j].href,
                              images: typeof images[j] != "undefined" ? images[j].src : null,
                              Category: cateogryName,
                              source: "CNET",
                              sourceLink: "https://www.cnet.com",
                              sourceLogo: "cnet logo"
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
            _context2.next = 17;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 17:
            _context2.next = 19;
            return regeneratorRuntime.awrap(browser.close());

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    });
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 14;
            break;
          }

          item = data[i];
          url = item.link; // console.log(url);

          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelectorAll('.article-main-body p');
            var textArray = [];

            for (var _i = 0; _i < text.length; _i++) {
              textArray.push(text[_i].textContent);
              textArray.push('   ');
            }

            return textArray.join('\n');
          }));

        case 9:
          Content = _context3.sent;

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

        case 11:
          i++;
          _context3.next = 2;
          break;

        case 14:
          console.log(AllData_WithConetent);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = CNET;