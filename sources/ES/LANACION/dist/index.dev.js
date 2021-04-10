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
var Categories = ['Política', 'fútbol', 'Vida & Estilo', 'tenis', 'rugby', 'internacional'];

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
              _context2.next = 39;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.lanacion.com.ar/politica/";
            if (Category === "internacional") url = "https://www.lanacion.com.ar/el-mundo/";
            if (Category === "Vida & Estilo") url = "https://www.lanacion.com.ar/lifestyle/";
            if (Category === "fútbol") url = "https://www.lanacion.com.ar/deportes/futbol/";
            if (Category === "rugby") url = "https://www.lanacion.com.ar/deportes/rugby/";
            if (Category === "tenis") url = "https://www.lanacion.com.ar/deportes/tenis/";
            _context2.prev = 17;
            _context2.next = 20;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 20:
            _context2.next = 22;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 22:
            _context2.next = 28;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](17);
            _context2.next = 28;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 28:
            _context2.next = 30;
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

          case 30:
            _context2.next = 32;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 32:
            _context2.next = 34;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('article');
              var images = "img";
              var links = "a";
              var titles = "h2";
              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof articles[j].querySelector(titles) != "undefined" && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles) == null ? articles[j].querySelector("h2").textContent.trim() : articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).src,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "Lanacion - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.lanacion.com.ar/",
                    sourceLogo: "https://tuquejasuma.com/media/cache/97/60/976035403b6c74beaafd36a33aac8d8f.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 34:
            PageData = _context2.sent;
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('es', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 36:
            i++;
            _context2.next = 9;
            break;

          case 39:
            _context2.next = 46;
            break;

          case 41:
            _context2.prev = 41;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 46;
            return regeneratorRuntime.awrap(browser.close());

          case 46:
            _context2.prev = 46;
            _context2.next = 49;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 49:
            _context2.next = 56;
            break;

          case 51:
            _context2.prev = 51;
            _context2.t2 = _context2["catch"](46);
            console.log(_context2.t2);
            _context2.next = 56;
            return regeneratorRuntime.awrap(browser.close());

          case 56:
            _context2.next = 58;
            return regeneratorRuntime.awrap(browser.close());

          case 58:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 41], [17, 24], [46, 51]]);
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
            _context3.next = 20;
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
              var second_text = document.querySelectorAll('.cuerpo__nota p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length - 1; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
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
              return document.querySelector('.cuerpo__nota').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          contenthtml = _context3.sent;
          _context3.next = 15;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.--autor').textContent.trim();
            } catch (_unused4) {
              return null;
            }
          }));

        case 15:
          author = _context3.sent;

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

        case 17:
          i++;
          _context3.next = 2;
          break;

        case 20:
          _context3.next = 22;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = SCRAP;