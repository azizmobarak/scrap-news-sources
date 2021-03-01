'use strict';

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
var Categories = ['football'];

var MARCA = function MARCA() {
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
              _context.next = 28;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"]('https://www.marca.com/en/football/international-football.html?intcmp=MENUPROD&s_kw=english-international-football'));

          case 14:
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            _context.next = 20;
            return regeneratorRuntime.awrap(page["goto"]('https://www.marca.com/en/football/international-football.html?intcmp=MENUPROD&s_kw=english-international-football'));

          case 20:
            _context.next = 22;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('.auto-items>li>article>header>h3');
              var images = document.querySelectorAll('.auto-items>li>article>figure>a>img');
              var links = document.querySelectorAll('.auto-items>li>article>figure>a');
              var data = [];

              for (var j = 0; j < titles.length / 2; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent,
                    link: links[j].href,
                    images: typeof images[j] === "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "MARCA",
                    sourceLink: "https://www.marca.com",
                    sourceLogo: "https://e00-marca.uecdn.es/assets/v16/img/destacadas/marca__logo-generica.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 22:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 25:
            i++;
            _context.next = 9;
            break;

          case 28:
            _context.next = 34;
            break;

          case 30:
            _context.prev = 30;
            _context.t1 = _context["catch"](7);
            _context.next = 34;
            return regeneratorRuntime.awrap(browser.close());

          case 34:
            _context.prev = 34;
            _context.next = 37;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 37:
            _context.next = 43;
            break;

          case 39:
            _context.prev = 39;
            _context.t2 = _context["catch"](34);
            _context.next = 43;
            return regeneratorRuntime.awrap(browser.close());

          case 43:
            _context.next = 45;
            return regeneratorRuntime.awrap(browser.close());

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 30], [11, 16], [34, 39]]);
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
            try {
              var text = document.querySelectorAll(".content>p");
              var cont = "";

              for (var _i = 0; _i < text.length; _i++) {
                cont = cont + "\n" + text[_i].textContent;
              }

              return cont;
            } catch (_unused4) {
              return null;
            }
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
              author: null,
              content: Content
            });
          }

        case 11:
          i++;
          _context2.next = 2;
          break;

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = MARCA;