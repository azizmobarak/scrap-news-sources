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
var Categories = ['coronavirus', 'world', 'UK', 'business', 'technology', 'science_and_environment', 'stories', 'entertainment_and_arts', 'health'];

var BBC = function BBC() {
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
              _context.next = 21;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category); //navigate to category sub route

            _context.next = 13;
            return regeneratorRuntime.awrap(page["goto"](['https://www.bbc.com/news/', '', Category].join('')));

          case 13:
            _context.next = 15;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // function to look for a word inside other words
              var WordExist = function WordExist(searchIn) {
                if (searchIn.indexOf("second") != -1) {
                  return true;
                } else {
                  if (searchIn.indexOf("seconds") != -1) {
                    return true;
                  } else {
                    if (searchIn.indexOf("minute") != -1) {
                      return true;
                    } else {
                      if (searchIn.indexOf("minutes") != -1) {
                        return true;
                      } else {
                        if (searchIn.startsWith("1 hour") != false || searchIn.startsWith("2 hours") != false || searchIn.startsWith("an hour") != false) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    }
                  }
                }
              }; // change the source logo to http 


              var titles = document.querySelectorAll('h3.gs-c-promo-heading__title');
              var images = document.querySelectorAll('div.gs-c-promo-image>div>div>img'); //.gs-o-media-island>div>img

              var time = document.querySelectorAll('time.gs-o-bullet__text>span');
              var link = document.querySelectorAll('.gs-c-promo-body>div>a.gs-c-promo-heading');
              var categoryName = Category;

              if (categoryName === "coronavirus") {
                categoryName = "Health";
              } else {
                if (categoryName === "world") {
                  categoryName = "International";
                } else {
                  if (categoryName === "science_and_environment") {
                    categoryName = "Science,Environment";
                  } else {
                    if (categoryName === "entertainment_and_arts") {
                      categoryName = "Entertainment,Art&Design";
                    }
                  }
                }
              }

              var data = [];

              for (var j = 0; j < titles.length; j++) {
                if (WordExist(typeof time[j] == "undefined" ? "nothing" : time[j].textContent) == true && typeof time[j] != "undefined" && typeof titles[j] != "undefined" && images[j].src.indexOf('http') == 0 && typeof link[j] != "undefined" && typeof images[j] != "undefined") {
                  data.push({
                    time: time[j].textContent,
                    title: titles[j].textContent,
                    link: link[j].href,
                    images: images[j].src,
                    Category: categoryName,
                    source: "BBC NEWS",
                    sourceLink: "https://bbc.com",
                    sourceLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATcAAACiCAMAAAATIHpEAAAAflBMVEX///8AAADV1dWcnJwhISH6+vrz8/MYGBg7OztaWlp0dHTPz8/s7Oz39/eXl5f8/PysrKxpaWlNTU2hoaEcHBzi4uJGRkaQkJAMDAy5ublAQEAkJCSJiYnp6elubm6vr6/b29u/v781NTV+fn5YWFgsLCzGxsYRERFjY2ODg4P3WRULAAADz0lEQVR4nO2b2VbqMBRAQ7E4QCkzogwiCvr/P3ihaZEm6SIclkK4e78RciTZq0lPBpUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/6dRnteBvclgZvY1NpcP/SyjKea0Ia22BpbG0bG0tjny+tLONO2vyLebu7tLIMvMnAmwy8ycCbDLzJwJsMvMnAmwy8yTC8PZR5r9bq8PZiBA9k3j5XnXU0HEaT8Uso3gbW9+lw8uXp7dUV/HGqt+nw4A/M2mF4u3fWaXW9vLk7NHs8xdt3YoTH3+F6U6oj96ZU3d9b5AiPNuF6c/Td35uaenobNJzhyShcb+r9DG/KekEopzdzjBbMA/GWzJ8K2sXIWfp6a3SL2FW9CF54edu/ENar193nXn+WfTQmyOv11jgs+kizstTXW+uw6EvZZVXe2nmLmq8/ZavtI9gz6gXirei7Oda8vNWedLCPt7xB43JpZGoLxlutlRWa7ffzls9ZZgKrbG8d3R5Dm4NgvOlZykxgPb3pSav8RnR6i7OKzaPawvGmJzjZOM1Hn9l3ZXnr6oqft+NtkpVZU7uft3VWNjzubZFVXB/XdsXekt5jQbee56Irb28Hwf08I5ubwcryNnRXDMqbA/tBOCHvnVjByvKmDd/fmLe+3Xx/b449DWV6c06swXuz8v1TvDmc294+s6rWPBi4N5Xae3D+z1tipa7/jTdrkXjaut4Sp25ynP40fzOazvKKvt5+8pD73lgvNWwfquK9sDErBuptx1RXNKcpv/wtX6ybqydVkYe4NpZD9ZaLMxNfz/VCPSs0Jy5ledPZ9fKWvOVjyDja8vTmXmgpy1u+cVJ9BBagt7es1Jjcfb3p+dHYEFH2ul43x2OhFY43/bw9yLy5fsblTQ9UZR5f2fdog/GWX0Q2mu/pbeIMVra34vS1fIhzN3sL1NtIb2momae3Ur1efsJgdl459nvzjUvVPNhL2r1VomC8pc09b/ujOd885DB4f0B1PA+pFTPhlmjc2+yuOyz1zp+xl3m93pyYvTxlveCR924ZpBXh5ScuLG+/vM7KeK84QC0/rUF5O2ddH9t3a1TFPYemIzwxwsPxli4c/1Xj6y123C2pvlfz1DLjrW2oa/Q2iOOkzKy5cG9eu7wlVnDHveJU1fe45uuDaW4YyD2uE/jF+5aj73pnOemMu87G4U0G3mTgTQbeZOBNBt5k4E0G3mTgTQbeZFyHN3HXL+atdqxLf0IkJT0n+KxfvrAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgED4BzguQleqi30iAAAAAElFTkSuQmCC"
                  });
                }
              }

              return data;
            }, Category));

          case 15:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 18:
            i++;
            _context.next = 8;
            break;

          case 21:
            console.log(AllData);
            _context.next = 24;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 24:
            _context.next = 26;
            return regeneratorRuntime.awrap(browser.close());

          case 26:
          case "end":
            return _context.stop();
        }
      }
    });
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
          url = item.link; // console.log(url);

          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelector('.ssrcss-5h7eao-ArticleWrapper') == null ? null : document.querySelector('.ssrcss-5h7eao-ArticleWrapper').innerText.replace('Related Topics', '').replace('IMAGE COPYRIGHT', '').replace('Share', '');
            return text;
          }));

        case 9:
          Content = _context2.sent;

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
              content: Content != null ? Content.substring(0, 50) : null
            });
          }

        case 11:
          i++;
          _context2.next = 2;
          break;

        case 14:
          console.log(AllData_WithConetent);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = BBC;