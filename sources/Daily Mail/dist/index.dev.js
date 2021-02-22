'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../model/Category'),
    category = _require2.category; //block ads


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
var Categories = ['worldnews', 'israel', 'china', 'nigeria', 'turkey', 'coronavirus', 'royals', 'crime', 'ushome', 'us-economy', 'sport/football', 'sport/fa_cup', 'sport/champions_league', 'sport/transfernews', 'sport/boxing', 'sport/rugbyunion', 'sport/golf', 'sport/cricket', 'sport/formulaone', 'sport/tennis', 'sport/mma', 'sport/racing', 'usshowbiz', 'tvshowbiz/the-masked-singer-uk', 'arts', 'auhome', 'breaking_news', 'new_zealand', 'femail', 'femail/food', 'best-buys', 'health', 'news/world-health-organization', 'sciencetech/nasa', 'sciencetech/apple', 'sciencetech/twitter', 'money/markets', 'money/saving', 'money/investing', 'money/bills', 'money/cars', 'money/holidays', 'money/cardsloans', 'money/pensions', 'money/mortgageshome', 'travel/escape', 'travel/destinations', 'tvshowbiz'];

var Daily_News = function Daily_News() {
  (function _callee() {
    var browser, page, AllData, i, Category, URL, PageData;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: false,
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
              _context.next = 30;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category); //navigate to category sub route

            URL = 'https://www.dailymail.co.uk/news/';

            if (Category.indexOf('sport') != -1 || Category === "auhome" || Category === "usshowbiz") {
              URL = 'https://www.dailymail.co.uk/';
            }

            _context.prev = 13;
            _context.next = 16;
            return regeneratorRuntime.awrap(page["goto"]([URL, '', Category, '', '/index.html'].join('')));

          case 16:
            _context.next = 22;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](13);
            _context.next = 22;
            return regeneratorRuntime.awrap(page["goto"]([URL, '', Category, '', '/index.html'].join('')));

          case 22:
            _context.next = 24;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var categoryName = Category;
              var ArticleDom = document.querySelectorAll(".article-tri-headline");
              var titleClassName = "h2>a";
              var linkClassName = "h2>a";
              var imageClassName = "img";

              if (categoryName === "worldnews") {
                categoryName = "international";
              }

              if (categoryName === "israel" || categoryName === "china" || categoryName === "nigeria" || categoryName === "turkey" || categoryName === "coronavirus" || categoryName === "crime" || categoryName === "royals" || categoryName === "us-economy") {
                ArticleDom = document.querySelectorAll('.article-small');
                var cat = categoryName;
                if (categoryName === "crime") cat = "safety";
                if (categoryName === "royals") cat = "UK,international";
                if (categoryName === "china" || categoryName === "israel" || categoryName === "nigeria" || categoryName === "turkey") cat = "international," + categoryName;
                if (categoryName === "us-economy") categoryName = "US,economy";
                categoryName = cat;
              }

              if (categoryName === "ushome") categoryName = "US,international";
              var data = [];

              for (var j = 0; j < ArticleDom.length / 2; j++) {
                if (_typeof(ArticleDom[j]) != undefined && ArticleDom[j].querySelector(titleClassName) != "" && ArticleDom[j].querySelector(titleClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: ArticleDom[j].querySelector(titleClassName).textContent,
                    link: ArticleDom[j].querySelector(linkClassName).href,
                    images: typeof ArticleDom[j].querySelector(imageClassName) === "undefined" || ArticleDom[j].querySelector(imageClassName).src.indexOf('http') == -1 ? null : ArticleDom[j].querySelector(imageClassName).src,
                    Category: categoryName,
                    source: "Daily Mail",
                    sourceLink: "https://www.dailymail.co.uk/",
                    sourceLogo: "daily new log"
                  });
                }
              }

              return data;
            }, Category));

          case 24:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 27:
            i++;
            _context.next = 8;
            break;

          case 30:
            _context.next = 32;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 32:
            _context.next = 34;
            return regeneratorRuntime.awrap(browser.close());

          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[13, 18]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, author;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 18;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          console.log(url);
          _context2.next = 10;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelector('.Article__Wrapper>.Article__Content') == null ? null : document.querySelector('.Article__Wrapper>.Article__Content').textContent;
            return text;
          }));

        case 10:
          Content = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var auth = document.querySelector('.Byline__Author').textContent;
              var upperCaseWords = auth.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g);
              return upperCaseWords[0] + " " + upperCaseWords[1];
            } catch (_unused2) {
              return null;
            }
          }));

        case 13:
          author = _context2.sent;

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
              content: Content
            });
          }

        case 15:
          i++;
          _context2.next = 2;
          break;

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = Daily_News;