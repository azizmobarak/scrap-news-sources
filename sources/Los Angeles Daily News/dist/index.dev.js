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
    capitalizeFirstLetter = _require3.capitalizeFirstLetter;

var _require4 = require('../../function/imageFormat'),
    FormatImage = _require4.FormatImage; //block ads


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
              _context.next = 42;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 12;
            _context.next = 15;
            return regeneratorRuntime.awrap(page["goto"](['https://www.dailynews.com/', '', Category].join('')));

          case 15:
            _context.next = 34;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](12);
            _context.next = 21;
            return regeneratorRuntime.awrap(page["goto"](['https://www.dailynews.com/', '', Category].join('')));

          case 21:
            _context.next = 23;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 23:
            _context.t1 = regeneratorRuntime;
            _context.t2 = Promise;
            _context.t3 = page.waitForNavigation();
            _context.t4 = page.click(".g-recaptcha");
            _context.next = 29;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 29:
            _context.t5 = _context.sent;
            _context.t6 = [_context.t3, _context.t4, _context.t5];
            _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
            _context.next = 34;
            return _context.t1.awrap.call(_context.t1, _context.t7);

          case 34:
            _context.next = 36;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // Los Angelece News classes
              var loop = 3;
              var articles = document.querySelectorAll('article');
              var titleClassName = "h4";
              var linkClassName = "a";
              var imageClassName = "img"; // set conditions on categories 

              if (Category === "business" || Category === "news/politics" || Category === "opinion" || Category === "sports") {
                var titleClassName = "h2";
                loop = 1;
              } //change category name


              var cateogryName = "";

              if (Category === "news/crime-and-public-safety") {
                var titleClassName = "h2";
                loop = 1;
                cateogryName = "Safety";
              } else {
                if (Category.indexOf('/') != -1) {
                  if (Category.indexOf('housing') != -1) {
                    var titleClassName = "h2";
                    loop = 1;
                    cateogryName = "Business";
                  } else {
                    var titleClassName = "h2";
                    loop = 1;
                    cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length);
                  }
                } else {
                  cateogryName = Category;
                }
              }

              if (cateogryName.indexOf("politics") != -1) cateogryName = "Politic"; //////////////////////////////

              var data = [];

              for (var j = 0; j < loop; j++) {
                if (articles[j].querySelector(titleClassName) != null && articles[j].querySelector(linkClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titleClassName).textContent.trim(),
                    link: articles[j].querySelector(linkClassName).href,
                    images: articles[j].querySelector(imageClassName) != null ? articles[j].querySelector(imageClassName).src : null,
                    Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    source: "LosAngeles Daily News - " + cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    sourceLink: "https://www.dailynews.com",
                    sourceLogo: "https://www.brainsway.com/wp-content/uploads/2019/05/img47.png"
                  });
                }
              }

              return data;
            }, Category));

          case 36:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item, j) {
              var category = capitalizeFirstLetter(item.Category);
              item.Category = category;
              item.images = FormatImage(item.images);
              console.log(item.images);
              setTimeout(function () {
                console.log("request here");
                SendToServer("en", item.Category, item.source, item.sourceLogo);
              }, 5000 * j);
              AllData.push(item);
            });

          case 39:
            i++;
            _context.next = 9;
            break;

          case 42:
            _context.next = 49;
            break;

          case 44:
            _context.prev = 44;
            _context.t8 = _context["catch"](7);
            console.log(_context.t8);
            _context.next = 49;
            return regeneratorRuntime.awrap(browser.close());

          case 49:
            _context.prev = 49;
            _context.next = 52;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 52:
            _context.next = 59;
            break;

          case 54:
            _context.prev = 54;
            _context.t9 = _context["catch"](49);
            console.log(_context.t9);
            _context.next = 59;
            return regeneratorRuntime.awrap(browser.close());

          case 59:
            _context.next = 61;
            return regeneratorRuntime.awrap(browser.close());

          case 61:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 44], [12, 17], [49, 54]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, ContentHTML, author;
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
          console.log(url);
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(page.click('span>span>a'));

        case 11:
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](6);
          _context2.next = 17;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 17:
          _context2.next = 19;
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
          Content = _context2.sent;
          _context2.next = 22;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article-body').innerHTML;
              return text;
            } catch (_unused3) {
              return null;
            }
          }));

        case 22:
          ContentHTML = _context2.sent;
          _context2.next = 25;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var auth = document.querySelector('.byline>a');
              return auth.textContent;
            } catch (_unused4) {
              return null;
            }
          }));

        case 25:
          author = _context2.sent;

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
          _context2.next = 2;
          break;

        case 30:
          _context2.next = 32;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 32:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 13]]);
};

module.exports = LosAngelesNews;