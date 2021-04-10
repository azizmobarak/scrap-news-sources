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
var Categories = ['africa', 'americas', 'asia', 'australia', 'europe', 'india', 'middle-east', 'uk', 'politics', 'business', 'health', 'travel/news', 'travel/food-and-drink', 'style', 'entertainment', 'sport'];

var CNN = function CNN() {
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
              _context.next = 27;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            _context.prev = 10;
            _context.next = 13;
            return regeneratorRuntime.awrap(page["goto"](['https://edition.cnn.com/', '', Category].join('')));

          case 13:
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](10);
            _context.next = 19;
            return regeneratorRuntime.awrap(page["goto"](['https://edition.cnn.com/', '', Category].join('')));

          case 19:
            _context.next = 21;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var loop = 1; // CNN classes

              var titleClassName = ".zn__containers article h3";
              var linkClassName = ".zn__containers article a";
              var imageClassName = ".zn__containers article img";

              if (Category.indexOf('/') != -1) {
                if (Category.indexOf("food-and-drink") != -1) {
                  Category = "food";
                } else {
                  Category = Category.substring(Category.indexOf("/") + 1, Category.length);
                }
              } else {
                //change classes in some conditions
                if (Category.indexOf('travel') != -1) {
                  titleClassName = ".CardBasic__details a";
                  linkClassName = ".CardBasic__details a";
                  imageClassName = ".LayoutThreeColumns__component .Image__image"; // loop length

                  loop = 3; //change category name 

                  Category = "travel";
                } else {
                  if (Category === "style") {
                    titleClassName = "#zone1 .LayoutGrid__component .CardBasic__title";
                    linkClassName = "#zone1 .LayoutGrid__component .CardBasic__title";
                    imageClassName = "#zone1 .LayoutGrid__component img"; // loop length

                    loop = 4;
                    Category = "life&style";
                  } else {
                    if (Category === "americas" || Category === "asia" || Category === "africa" || Category === "middle-east" || Category === "europe") {
                      Category = "international";
                    }
                  }
                }
              } // get lists


              var titles = document.querySelectorAll(titleClassName);
              var images = document.querySelectorAll(imageClassName);
              var links = document.querySelectorAll(linkClassName);
              var data = [];

              for (var j = 0; j < loop; j++) {
                if (typeof titles[j] != "undefined" && images[j].src.indexOf('http') == 0 && typeof links[j] != "undefined") {
                  data.push({
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    image: typeof images[j] != "undefined" ? images[j].src : null,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "CNN - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://edition.cnn.com/",
                    sourceLogo: "https://bankimooncentre.org/wp-content/uploads/2020/06/cnn-logo-square.png"
                  });
                }
              }

              return data;
            }, Category));

          case 21:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 24:
            i++;
            _context.next = 8;
            break;

          case 27:
            _context.next = 29;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 29:
            _context.next = 31;
            return regeneratorRuntime.awrap(browser.close());

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[10, 15]]);
  })();
}; // the final result 


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
            _context2.next = 21;
            break;
          }

          item = data[i];
          url = item.link; // console.log(url);

          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          Category = item.Category; // get the article content

          _context2.next = 10;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.zn-body__paragraph');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length - 1; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content.trim() + ".. .";
            } catch (_unused) {
              return null;
            }
          }));

        case 10:
          Content = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              return document.querySelector('.pg-special-article__body').innerHTML;
            } catch (_unused2) {
              return null;
            }
          }));

        case 13:
          contenthtml = _context2.sent;
          _context2.next = 16;
          return regeneratorRuntime.awrap(page.evaluate(function (Category) {
            var classname = '.metadata__byline__author>a';

            if (Category === "Life&Style") {
              classname = ".Authors__writer";
            }

            var auth = document.querySelector(classname);
            return auth != null ? auth.textContent : null;
          }, Category));

        case 16:
          author = _context2.sent;

          // collect the result into a table
          if (Content != null && Content != "" && item.title != "Election fact check" && item.title != "Latest election news") {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: item.image,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              author: author,
              content: Content.substring(0, 3000),
              contenthtml: contenthtml
            });
          }

        case 18:
          i++;
          _context2.next = 2;
          break;

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = CNN;