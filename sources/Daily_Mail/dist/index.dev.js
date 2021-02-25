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
var Categories = ['worldnews', 'israel', 'china', 'nigeria', 'turkey', 'coronavirus', 'royals', 'crime', 'ushome', 'us-economy', 'sport/football', 'sport/fa_cup', 'sport/champions_league', 'sport/transfernews', 'sport/boxing', 'sport/rugbyunion', 'sport/golf', 'sport/cricket', 'sport/formulaone', 'sport/tennis', 'sport/mma', 'sport/racing', 'usshowbiz', 'tvshowbiz/the-masked-singer-uk', 'arts', 'auhome', 'breaking_news', 'new_zealand', 'femail', 'femail/food', 'best-buys', 'health', 'world-health-organization', 'sciencetech/nasa', 'sciencetech/apple', 'sciencetech/twitter', 'money/markets', 'money/saving', 'money/investing', 'money/bills', 'money/cars', 'money/holidays', 'money/cardsloans', 'money/pensions', 'money/mortgageshome', 'travel/escape', 'travel/destinations', 'tvshowbiz'];

var Daily_News = function Daily_News() {
  (function _callee() {
    var browser, page, AllData, i, Category, URL, PageData;
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
              _context.next = 28;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            URL = 'https://www.dailymail.co.uk/news/';

            if (Category.indexOf('sport') != -1 || Category === "auhome" || Category === "usshowbiz" || Category === "tvshowbiz/the-masked-singer-uk" || Category === "usshowbiz" || Category.indexOf('femail') != -1 || Category === "best-buys" || Category === "health" || Category.indexOf('sciencetech') != -1 || Category.indexOf('money') != -1 || Category === "tvshowbiz" || Category.indexOf('travel') != -1) {
              URL = 'https://www.dailymail.co.uk/';
            }

            _context.prev = 12;
            _context.next = 15;
            return regeneratorRuntime.awrap(page["goto"]([URL, '', Category, '', '/index.html'].join('')));

          case 15:
            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](12);
            _context.next = 21;
            return regeneratorRuntime.awrap(page["goto"]([URL, '', Category, '', '/index.html'].join('')));

          case 21:
            _context.next = 23;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var categoryName = Category;
              var ArticleDom = document.querySelectorAll(".article-tri-headline");
              var titleClassName = "h2>a";
              var linkClassName = "h2>a";
              var imageClassName = "img";
              var ImageData = true;

              if (categoryName === "worldnews") {
                categoryName = "international";
              }

              if (categoryName === "israel" || categoryName === "china" || categoryName === "nigeria" || categoryName === "turkey" || categoryName === "coronavirus" || categoryName === "crime" || categoryName === "royals" || categoryName === "us-economy" || categoryName === "tvshowbiz/the-masked-singer-uk" || categoryName === "arts" || categoryName === "new_zealand" || categoryName === "breaking_news" || categoryName === "femail/food" || categoryName === "world-health-organization" || categoryName === "sciencetech/nasa" || categoryName === "sciencetech/apple" || categoryName === "sciencetech/twitter" || categoryName === "money/markets" || categoryName === "best-buys") {
                ArticleDom = document.querySelectorAll('.article-small');
                if (categoryName === "crime") categoryName = "safety";
                if (categoryName === "royals") categoryName = "UK,international";
                if (categoryName === "china" || categoryName === "israel" || categoryName === "nigeria" || categoryName === "turkey") categoryName = "international," + categoryName;
                if (categoryName === "us-economy") categoryName = "US,economy";
                if (categoryName === "coronavirus") categoryName = "health," + categoryName;
                if (categoryName === "tvshowbiz/the-masked-singer-uk") categoryName = "celebrity,UK,TV";
                if (categoryName.indexOf('food') != -1) categoryName = "food,women";
                if (categoryName.indexOf('sciencetech') != -1) categoryName = "science";
                if (categoryName.indexOf('best-buys') != -1) categoryName = "shopping";
                if (categoryName === "world-health-organization") categoryName = "health";
                if (categoryName === "breaking_news") categoryName = "international";
                if (categoryName === "arts") categoryName = "art&design";
                ImageData = false;
              }

              if (categoryName === "ushome") categoryName = "US,international";
              if (categoryName === "femail") categoryName = "women";
              if (categoryName === "auhome") categoryName = "AU,international";
              if (categoryName.indexOf('money') != -1) categoryName = "money";
              if (categoryName === "money/markets") categoryName = "money,market";
              if (categoryName === "money/investing") categoryName = "money,investing";
              if (categoryName.indexOf('travel') != -1) categoryName = "travel";

              if (categoryName.indexOf('sport') != -1) {
                var subCategory = categoryName.substring(categoryName.indexOf('/') + 1, categoryName.length);

                if (subCategory === "fa_cup" || subCategory === "champions_league" || subCategory === "transfernews") {
                  ArticleDom = document.querySelectorAll('.article-small');
                  ImageData = true;
                  categoryName = "sport,football";
                } else {
                  if (subCategory === "rugbyunion") categoryName = "sport,rugby";else {
                    if (subCategory === "mma") categoryName = "sport";else {
                      categoryName = "sport," + subCategory;
                    }
                  }
                }
              }

              var data = [];

              for (var j = 0; j < (ArticleDom.length > 4 ? 4 : ArticleDom.length); j++) {
                if (_typeof(ArticleDom[j]) != undefined && ArticleDom[j].querySelector(titleClassName) != "" && ArticleDom[j].querySelector(titleClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: ArticleDom[j].querySelector(titleClassName).textContent,
                    link: ArticleDom[j].querySelector(linkClassName).href,
                    images: typeof ArticleDom[j].querySelector(imageClassName) === "undefined" ? null : ImageData == false ? ArticleDom[j].querySelector(imageClassName).src : j == 0 ? ArticleDom[j].querySelector(imageClassName).src : typeof ArticleDom[j].querySelector(imageClassName).dataset.src != "undefined" ? ArticleDom[j].querySelector(imageClassName).dataset.src : ArticleDom[j].querySelector(imageClassName).src,
                    Category: categoryName,
                    source: "Daily Mail",
                    sourceLink: "https://www.dailymail.co.uk/",
                    sourceLogo: "daily new log"
                  });
                }
              }

              return data;
            }, Category));

          case 23:
            PageData = _context.sent;
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 25:
            i++;
            _context.next = 8;
            break;

          case 28:
            _context.next = 30;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 30:
            _context.next = 32;
            return regeneratorRuntime.awrap(browser.close());

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[12, 17]]);
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
            var text = document.querySelectorAll('.mol-para-with-font');
            var content = "";

            for (var _i = 0; _i < text.length; _i++) {
              content = content + " \n " + text[_i].textContent;
            }

            return content;
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var auth = document.querySelector('.author-section').textContent.split(' ');
              return auth[1] + " " + auth[2];
            } catch (_unused2) {
              return null;
            }
          }));

        case 12:
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

module.exports = Daily_News;