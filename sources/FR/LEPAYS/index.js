'use strict';

const puppeteer = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const { InsertData } = require('../../../function/insertData');
const { FormatImage } = require('../../../function/formatimage');
const { SendToServer } = require('../../../function/sendtoserver');

//block ads
puppeteer.use(AdblockerPlugin());
// stealth
puppeteer.use(puppeteer_stealth());
// captcha configuration
puppeteer.use(
    Recaptcha({
        provider: { id: '2captcha', token: process.env.KEY },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
);

puppeteer.use(puppeteer_agent());

var Categories = ['football', 'rugby', 'basketball'];

const LEPAY = () => {
    (async () => {
        var browser = await puppeteer.launch({
            headless: true,
            args: [
                '--enable-features=NetworkService',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--shm-size=3gb',
            ],
        });


        var page = await browser.newPage();


        var AllData = [];

        try {
            // boucle on categories started 
            for (let i = 0; i < Categories.length; i++) {

                //get the right category by number
                var Category = Categories[i]
                //navigate to category sub route
                var url = "https://www.le-pays.fr/theme/football/";

                if (Category === "rugby") url = "https://www.le-pays.fr/theme/rugby/"
                if (Category === "basketball") url = "https://www.le-pays.fr/theme/basket/"

                try {
                    await page.goto(url);
                    await page.waitForSelector('footer')
                    if (i == 0) await page.click('#didomi-notice-agree-button');
                } catch {
                    await page.goto(url);
                    if (i == 0) await page.click('#didomi-notice-agree-button');
                }
                //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0


                await page.evaluate(() => {

                    var totalHeight = 0;
                    var distance = 100;
                    var timer = setInterval(async () => {
                        var scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= 1000) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });

                await page.waitFor(3000)

                // get the data from the page
                var PageData = await page.evaluate((Category) => {

                    var images = document.querySelectorAll('.c-photo img');
                    var links = document.querySelectorAll('.c-titre h2>a');
                    var titles = document.querySelectorAll('.c-titre h2');


                    var data = [];

                    for (let j = 0; j < 4; j++) {
                        var index = 0;
                        if (j > 0) {
                            links = document.querySelectorAll('.c-titre h3>a');
                            titles = document.querySelectorAll('.c-titre h3');
                            index = j - 1;
                        }
                        if (typeof (titles[j]) != "undefined" && links[j] != null) {
                            data.push({
                                time: Date.now(),
                                title: titles[index].textContent.trim().replaceAll('\t', ' ').substring(20, titles[index].textContent.trim().length).trim(),
                                link: links[index].href,
                                images: typeof (images[j]) === "undefined" ? null : images[j].src,
                                Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                                source: "LE PAYS - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                                sourceLink: "https://www.le-pays.fr/",
                                sourceLogo: "https://www.ffp.asso.fr/wp-content/uploads/2016/08/le-pays-roannais.jpgtps://www.notrevoienews.com/wp-content/uploads/2018/12/logo-retina-400x200-1.jpg"
                            });
                        }
                    }
                    return data;
                }, Category);
                PageData.map((item,j)=>{
                    item.images = FormatImage(item.images);
                    setTimeout(() => {
                         SendToServer('fr',item.Category,item.source,item.sourceLogo)
                    },2000*j);
                       AllData.push(item)
                   });
            }
        } catch (e) {
            console.log(e)
            await browser.close();
        }

        try {
            await GetContent(page, AllData);
        } catch (e) {
            console.log(e);
            await browser.close();
        }

        await browser.close();
    })();
}



const GetContent = async (page, data) => {

    var AllData_WithConetent = [];

    for (var i = 0; i < data.length; i++) {

        var item = data[i];
        var url = item.link;

        console.log(url)

        try {
            await page.goto(url);
        } catch {
            i++;
            var item = data[i];
            var url = item.link;
            console.log(url)
            await page.goto(url);
        }

        var Content = await page.evaluate(() => {
            try {
                // first try to get all content
                var second_text = document.querySelectorAll('.contenu p');
                var scond_content = "";
                for (let i = 0; i < second_text.length - 1; i++) {
                    scond_content = scond_content + "\n" + second_text[i].textContent;
                }
                return scond_content;
            } catch {
                return null;
            }
        });

        var contenthml = await page.evaluate(() => {
            try {
                return document.querySelector('.contenu').innerHTML
            } catch {
                return null;
            }
        });

        var author = null;


        if (Content != null && Content != "") {
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
                contenthml: contenthml
            });
        }
    }
     await InsertData(AllData_WithConetent);
}


module.exports = LEPAY;