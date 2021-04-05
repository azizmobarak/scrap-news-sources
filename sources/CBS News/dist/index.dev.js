"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../function/FormatImage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../function/sendToServer'),
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
var Categories = ['sports', 'news/canada', 'news/politics', 'news/opinion', 'news/business', 'news/health', 'news/entertainment', 'news/technology', 'news/investigates'];

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
            AllData = [];
            _context.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context.next = 29;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 12;
            _context.next = 15;
            return regeneratorRuntime.awrap(page["goto"](["https://www.cbc.ca/", '', Category].join('')));

          case 15:
            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](12);
            _context.next = 21;
            return regeneratorRuntime.awrap(page["goto"](["https://www.cbc.ca/", '', Category].join('')));

          case 21:
            _context.next = 23;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              //change category name
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


              var articles = document.querySelectorAll(".card");
              var titles = "h3";
              var images = "img";
              var links = "a";
              var author = ".authorName";
              var data = [];

              for (var j = 0; j < 4; j++) {
                if (articles[j].querySelector(titles) != null && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) != null ? articles[j].querySelector(images).src : null,
                    Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    source: "CBC NEWS - " + cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                    sourceLink: "https://www.cbc.ca",
                    sourceLogo: "https://ropercenter.cornell.edu/sites/default/files/styles/800x600/public/Images/CBS_News_logo8x6.png",
                    author: articles[j].querySelector(author) == null ? null : articles[j].querySelector(author).textContent
                  });
                }
              }

              return data;
            }, Category));

          case 23:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              console.log(item.images);
              setTimeout(function () {
                console.log("request here");
                SendToServer("en", item.Category, item.source, item.sourceLogo);
              }, 5000 * j);
              AllData.push(item);
            });

          case 26:
            i++;
            _context.next = 9;
            break;

          case 29:
            _context.next = 36;
            break;

          case 31:
            _context.prev = 31;
            _context.t1 = _context["catch"](7);
            console.log(_context.t1);
            _context.next = 36;
            return regeneratorRuntime.awrap(browser.close());

          case 36:
            _context.prev = 36;
            _context.next = 39;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 39:
            _context.next = 46;
            break;

          case 41:
            _context.prev = 41;
            _context.t2 = _context["catch"](36);
            console.log(_context.t2);
            _context.next = 46;
            return regeneratorRuntime.awrap(browser.close());

          case 46:
            _context.next = 48;
            return regeneratorRuntime.awrap(browser.close());

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 31], [12, 17], [36, 41]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, ContentHTML;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 17;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelectorAll('div.story p');
              var textArray = [];

              for (var _i = 2; _i < text.length; _i++) {
                textArray.push(text[_i].textContent);
                textArray.push('   ');
              }

              return textArray.join('\n');
            } catch (_unused) {
              return null;
            }
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('div.story').innerHTML;
            } catch (_unused2) {
              return null;
            }
          }));

        case 12:
          ContentHTML = _context2.sent;

          if (Content != null && Content != "" && ContentHTML != null) {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: item.images,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              content: Content,
              contentHTML: ContentHTML
            });
          }

        case 14:
          i++;
          _context2.next = 2;
          break;

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = CBC;