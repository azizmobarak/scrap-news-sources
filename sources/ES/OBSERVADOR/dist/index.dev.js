'use strict';

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
var Categories = ['Uruguay', 'economía', 'internacional'];

var SCRAP = function SCRAP() {
  (function _callee2() {
    var browser, page, AllData, i, Category, url, PageData;
    return regeneratorRuntime.async(function _callee2$(_context2) {
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
            AllData = [];
            _context2.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context2.next = 36;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.elobservador.com.uy/elobservador/nacional";
            if (Category === "economía") url = "https://www.elobservador.com.uy/elobservador/economia-y-empresas";
            if (Category === "internacional") url = "https://www.elobservador.com.uy/elobservador/mundo";
            _context2.prev = 14;
            _context2.next = 17;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 17:
            _context2.next = 19;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 19:
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](14);
            _context2.next = 25;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 25:
            _context2.next = 27;
            return regeneratorRuntime.awrap(page.evaluate(function () {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(function _callee() {
                var scrollHeight;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= 1000) {
                          clearInterval(timer);
                          resolve();
                        }

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }, 100);
            }));

          case 27:
            _context2.next = 29;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 29:
            _context2.next = 31;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('.nota_gen');
              var images = "img";
              var links = "a";
              var titles = "h2";
              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof articles[j].querySelector(titles) != "undefined" && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles) == null ? articles[j].querySelector("h1").textContent.trim() : articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).src,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "El Observador - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.elobservador.com.uy/",
                    sourceLogo: "https://www.elobservador.com.uy/images/og_image.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 31:
            PageData = _context2.sent;
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('es', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 33:
            i++;
            _context2.next = 9;
            break;

          case 36:
            _context2.next = 43;
            break;

          case 38:
            _context2.prev = 38;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 43;
            return regeneratorRuntime.awrap(browser.close());

          case 43:
            _context2.prev = 43;
            _context2.next = 46;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 46:
            _context2.next = 53;
            break;

          case 48:
            _context2.prev = 48;
            _context2.t2 = _context2["catch"](43);
            console.log(_context2.t2);
            _context2.next = 53;
            return regeneratorRuntime.awrap(browser.close());

          case 53:
            _context2.next = 55;
            return regeneratorRuntime.awrap(browser.close());

          case 55:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 38], [14, 21], [43, 48]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, contenthtml, author;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 18;
            break;
          }

          item = data[i];
          url = item.link; //  console.log(url)

          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.cuerpo p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length - 1; _i++) {
                if (second_text[_i].textContent.length > 200) {
                  scond_content = scond_content + "\n" + second_text[_i].textContent;
                }
              }

              return scond_content + ".. .";
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.cuerpo').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          contenthtml = _context3.sent;
          author = null;

          if (Content != null && Content != "" && Content.length > 255) {
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
              content: Content,
              contenthtml: contenthtml
            });
          }

        case 15:
          i++;
          _context3.next = 2;
          break;

        case 18:
          _context3.next = 20;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = SCRAP;