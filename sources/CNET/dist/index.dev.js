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

var _require3 = require('../../function/SendToServer'),
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
var Categories = ['topics/security', 'topics/tech-industry', 'topics/internet', 'topics/culture', 'topics/mobile', 'topics/sci-tech', 'topics/computers', 'personal-finance/investing', 'health/fitness', 'health/healthy-eating', 'health/sleep', 'health/personal-care'];

var CNET = function CNET() {
  (function _callee() {
    var browser, page, AllData, _loop, i, Category, PageData;

    return regeneratorRuntime.async(function _callee$(_context2) {
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
            AllData = []; // boucle on categories started 

            _context2.prev = 7;

            _loop = function _loop(i) {
              return regeneratorRuntime.async(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      //get the right category by number
                      Category = Categories[i];
                      console.log(Category);
                      _context.prev = 2;
                      _context.next = 5;
                      return regeneratorRuntime.awrap(page["goto"](["https://www.cnet.com/", '', Category].join('')));

                    case 5:
                      _context.next = 24;
                      break;

                    case 7:
                      _context.prev = 7;
                      _context.t0 = _context["catch"](2);
                      _context.next = 11;
                      return regeneratorRuntime.awrap(page["goto"](["https://www.cnet.com/", '', Category].join('')));

                    case 11:
                      _context.next = 13;
                      return regeneratorRuntime.awrap(page.solveRecaptchas());

                    case 13:
                      _context.t1 = regeneratorRuntime;
                      _context.t2 = Promise;
                      _context.t3 = page.waitForNavigation();
                      _context.t4 = page.click(".g-recaptcha");
                      _context.next = 19;
                      return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
                        return el.click();
                      }));

                    case 19:
                      _context.t5 = _context.sent;
                      _context.t6 = [_context.t3, _context.t4, _context.t5];
                      _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
                      _context.next = 24;
                      return _context.t1.awrap.call(_context.t1, _context.t7);

                    case 24:
                      _context.next = 26;
                      return regeneratorRuntime.awrap(page.evaluate(function (Category) {
                        //change category name
                        var cateogryName = "";

                        if (i == 9) {
                          cateogryName = "food";
                        } else {
                          if (Category.indexOf("tech") != -1) {
                            cateogryName = "technology";
                          } else {
                            if (Category.indexOf('sci-tech') != -1) {
                              cateogryName = "science";
                            } else {
                              if (Category.indexOf('sleep') != -1 || cateogryName.indexOf('care') != -1 || Category.indexOf('fitness')) {
                                cateogryName = "health";
                              } else {
                                if (Category.indexOf('computers') != -1) {
                                  cateogryName = "technology," + Category.substring(Category.indexOf('/') + 1, Category.length);
                                } else {
                                  if (Category.indexOf('cobile') != -1) {
                                    cateogryName = "technology," + Category.substring(Category.indexOf('/') + 1, Category.length);
                                  } else {
                                    if (Category.indexOf('internet') != -1) {
                                      cateogryName = "technology," + Category.substring(Category.indexOf('/') + 1, Category.length);
                                    } else {
                                      if (Category.indexOf('security') != -1) {
                                        cateogryName = "safety";
                                      } else {
                                        cateogryName = Category.substring(Category.indexOf('/') + 1, Category.length);
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        } //////////////////////////////
                        // CBC classes by categories 


                        var titleClassName = ".assetBody h2";
                        var linkClassName = ".assetBody a";
                        var imageClassName = ".assetThumb>a>figure>img";
                        var authorClassName = ".assetAuthor";

                        if (Category.indexOf('health') != -1 || Category.indexOf('investing') != -1) {
                          authorClassName = ".c-metaText_link";
                        }

                        if (cateogryName === "culture") {
                          titleClassName = ".assetText a";
                          linkClassName = ".assetText a";
                          imageClassName = ".assetBody>a>figure>img";
                        } else {
                          if (cateogryName === "investing" || cateogryName === "health") {
                            titleClassName = ".latestScrollItems .c-universalLatest_text h3";
                            linkClassName = ".latestScrollItems .c-universalLatest_text>a";
                            imageClassName = ".c-universalLatest_image>a>span>img";
                          }
                        } // change the source logo to http 


                        var titles = document.querySelectorAll(titleClassName);
                        var images = document.querySelectorAll(imageClassName);
                        var links = document.querySelectorAll(linkClassName);
                        var authors = document.querySelectorAll(authorClassName);
                        var data = [];

                        for (var j = 0; j < 3; j++) {
                          if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                            var auth = "";

                            if (typeof authors[j] != "undefined") {
                              if (authors[j].textContent.indexOf('by') != -1) auth = authors[j].textContent.replace('by', '').trim();else {
                                auth = authors[j].textContent.trim();
                              }
                            } else {
                              auth = null;
                            }

                            data.push({
                              title: titles[j].textContent.trim(),
                              link: links[j].href,
                              images: typeof images[j] != "undefined" ? images[j].src : null,
                              Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                              source: "CNET - " + cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                              sourceLink: "https://www.cnet.com",
                              sourceLogo: "https://cdn.freebiesupply.com/logos/thumbs/2x/cnet-1-logo.png",
                              author: auth
                            });
                          }
                        }

                        return data;
                      }, Category));

                    case 26:
                      PageData = _context.sent;
                      PageData.map(function (item, j) {
                        item.images = FormatImage(item.images);
                        setTimeout(function () {
                          SendToServer('en', item.Category, item.source, item.sourceLogo);
                        }, 2000 * j);
                        AllData.push(item);
                      });

                    case 28:
                    case "end":
                      return _context.stop();
                  }
                }
              }, null, null, [[2, 7]]);
            };

            i = 0;

          case 10:
            if (!(i < Categories.length)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 13;
            return regeneratorRuntime.awrap(_loop(i));

          case 13:
            i++;
            _context2.next = 10;
            break;

          case 16:
            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](7);
            _context2.next = 22;
            return regeneratorRuntime.awrap(browser.close());

          case 22:
            _context2.prev = 22;
            _context2.next = 25;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 25:
            _context2.next = 31;
            break;

          case 27:
            _context2.prev = 27;
            _context2.t1 = _context2["catch"](22);
            _context2.next = 31;
            return regeneratorRuntime.awrap(browser.close());

          case 31:
            _context2.next = 33;
            return regeneratorRuntime.awrap(browser.close());

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 18], [22, 27]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, contenthtml;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 17;
            break;
          }

          item = data[i];
          url = item.link; // console.log(url);

          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelectorAll('.article-main-body p');
            var textArray = [];

            for (var _i = 0; _i < text.length; _i++) {
              textArray.push(text[_i].textContent);
              textArray.push('   ');
            }

            return textArray.join('\n');
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.article-main-body').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          contenthtml = _context3.sent;

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
              author: item.author,
              content: Content != null ? Content : null,
              contentHtml: contenthtml
            });
          }

        case 14:
          i++;
          _context3.next = 2;
          break;

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = CNET;