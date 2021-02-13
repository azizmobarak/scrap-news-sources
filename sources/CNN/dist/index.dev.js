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
var Categories = ['Africa', 'Americas', 'Asia', 'Australia', 'Europe', 'India', 'Middle-east', 'Uk', 'Politics', 'Business', 'Health', 'travel/news', 'travel/food-and-drink', 'style', 'Entertainment', 'Sport'];

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
              _context.next = 41;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://edition.cnn.com/', '', Category].join('')));

          case 14:
            _context.next = 33;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            _context.next = 20;
            return regeneratorRuntime.awrap(page["goto"](['https://edition.cnn.com/', '', Category].join('')));

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
              var loop = 1; // CNN classes

              var titleClassName = ".zn__containers article h3";
              var linkClassName = ".zn__containers article a";
              var imageClassName = ".zn__containers article img";

              if (Category.indexOf('/') != -1) {
                if (Category.indexOf("food-and-drink") != -1) {
                  Category = "Food&Drink";
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
                  } else {
                    if (Category === "style") {
                      Category === "Life&Style";
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
                    Category: Category,
                    source: "CNN",
                    sourceLink: "https://edition.cnn.com/",
                    sourceLogo: "CNN logo"
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
            return regeneratorRuntime.awrap(browser.close());

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[11, 16]]);
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
          url = item.link; // console.log(url);

          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          Category = item.Category;
          _context2.next = 10;
          return regeneratorRuntime.awrap(page.evaluate(function (Category) {
            switch (Category) {
              case "travel":
                return document.querySelector('.Article__primary').innerText;

              default:
                var text = document.querySelectorAll('.zn-body-text div');
                var textArray = [];

                if (typeof text != "undefined" || text != null) {
                  for (var _i = 0; _i < text.length; _i++) {
                    textArray.push(text[_i].textContent);
                    textArray.push(' ');
                  }

                  return textArray.join('\n');
                } else {
                  return null;
                }

            }
          }, Category));

        case 10:
          Content = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var auth = document.querySelector('.metadata__byline__author>a');
            return auth != null ? auth.textContent : null;
          }));

        case 13:
          author = _context2.sent;

          if (Content != null && item.title != "Election fact check" && item.title != "Latest election news") {
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
              content: Content != null ? Content : null
            });
          }

        case 15:
          i++;
          _context2.next = 2;
          break;

        case 18:
          console.log(AllData_WithConetent);

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = CNN;