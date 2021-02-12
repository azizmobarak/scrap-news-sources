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
var Categories = ['Sports', 'news/Canada', 'news/Politics', 'news/Opinion', 'news/Business', 'news/Health', 'news/Entertainment', 'news/Technology', 'news/Investigates'];

var CBC = function CBC() {
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
              _context.next = 41;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](["https://www.cbc.ca/", '', Category].join('')));

          case 14:
            _context.next = 33;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            _context.next = 20;
            return regeneratorRuntime.awrap(page["goto"](["https://www.cbc.ca/", '', Category].join('')));

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
                        return false;
                      }
                    }
                  }
                }
              };

              var start = 0;
              var end = 1; //change category name

              var cateogryName = "";

              if (Category.indexOf('/') != -1) {
                if (Category.indexOf('investigates') != -1) {
                  cateogryName = "investing";
                } else {
                  cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length);
                }
              } else {
                cateogryName = Category;
              } //////////////////////////////
              // CBC classes by categories 


              var titleClassName = ".card-content h3.headline";
              var linkClassName = ".featuredArea a";
              var imageClassName = ".cardImageWrap>figure.imageMedia>div>img";
              var timeClassName = "div.card-content-bottom>.metadata>div>time.timeStamp";
              var author = null;

              if (Category === "news/opinion") {
                author = document.querySelectorAll(".authorName");
                end = 3;
              } else {
                if (Category === "sports") {
                  end = 1;
                } else {
                  end = 3;
                }
              } // change the source logo to http 


              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName);
              var time = document.querySelectorAll(timeClassName);
              var links = document.querySelectorAll(linkClassName);
              var data = [];

              for (var j = start; j < end; j++) {
                if (WordExist(typeof time[j] == "undefined" ? "nothing" : time[j].textContent) == true && typeof time[j] != "undefined" && typeof titles[j] != "undefined" && typeof links[j] != "undefined" && images[j].src.indexOf('http') == 0) {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: j == 0 ? typeof images[j] != "undefined" ? images[j].src : null : null,
                    Category: cateogryName,
                    source: "CBC NEWS",
                    sourceLink: "https://www.cbc.ca",
                    sourceLogo: "cbc logo",
                    author: author == null ? null : author[j].textContent
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
            return regeneratorRuntime.awrap(page.waitFor(20000));

          case 45:
            _context.next = 47;
            return regeneratorRuntime.awrap(browser.close());

          case 47:
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
            _context2.next = 14;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelectorAll('div.story p');
            var textArray = [];

            for (var _i = 2; _i < text.length; _i++) {
              textArray.push(text[_i].textContent);
              textArray.push('   ');
            }

            return textArray.join('\n');
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
              content: Content != null ? Content : null
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

module.exports = CBC;