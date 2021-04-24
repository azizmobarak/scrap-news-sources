'use strict';

const puppeteer = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const { InsertData } = require('../../function/insertData');
const { FormatImage } = require('../../function/formatImage');
const { SendToServer } = require('../../function/sendToserver');

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

var Categories = ['entertainment'];

const hollywoodnews = () => {
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
                try {
                    await page.goto('https://www.hollywoodnews.com/');
                } catch {
                    await page.goto('https://www.hollywoodnews.com/');
                    // await page.waitForSelector(".section-theme-border>a>img");
                }
                //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0


                // get the data from the page
                var PageData = await page.evaluate((Category) => {

                    var titles = document.querySelectorAll('.latest-articles> h4>a');
                    var links = document.querySelectorAll('.latest-articles> h4>a');

                    var data = [];
                    for (let j = 0; j < titles.length / 2; j++) {

                        if (typeof (titles[j]) != "undefined" && typeof (links[j]) != "undefined") {
                            data.push({
                                time: Date.now(),
                                title: titles[j].textContent.trim(),
                                link: links[j].href,
                                Category: Category+charAt(0).toUpperCase() + Category.slice(1),
                                source: "HollyWoodNews - "+Category+charAt(0).toUpperCase() + Category.slice(1),
                                sourceLink: "https://www.hollywoodnews.com",
                                sourceLogo: "https://www.hollywoodnews.com/wp-content/themes/starmagazine/images/logo.jpg"
                            });
                        }
                    }
                    return data;
                }, Category);
                console.log(PageData);

                PageData.map((item, j) => {
                    item.images = FormatImage(item.images);
                    setTimeout(() => {
                        SendToServer('en', item.Category, item.source, item.sourceLogo)
                    }, 2000 * j);
                    AllData.push(item)
                });
            }
        } catch {
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

        await page.goto(url);
        // console.log(url)

        var Content = await page.evaluate(() => {
            try {
                var first_text = document.querySelectorAll(".entry-content>p");
                var first_cont = "";
                for (let i = 0; i < first_text.length; i++) {
                    first_cont = first_cont + "\n" + first_text[i].textContent;
                }
                return first_cont.trim();
            } catch {
                return null;
            }
        });

        var contenthtml = await page.evaluate(() => {
            try {
                return document.querySelector(".entry-content").innerHTML;
            } catch {
                return null;
            }
        })

        var author = await page.evaluate(() => {
            try {
                return document.querySelector('.entry-author>a').textContent.trim();
            } catch {
                return null;
            }
        })


        var images = await page.evaluate(() => {
            try {
                return document.querySelector('.entry-content>p>img').src;
            } catch {
                return null;
            }

        })


        if (Content != null && Content != "") {
            AllData_WithConetent.push({
                time: Date.now(),
                title: item.title,
                link: item.link,
                images: images,
                Category: item.Category,
                source: item.source,
                sourceLink: item.sourceLink,
                sourceLogo: item.sourceLogo,
                author: author,
                content: Content,
                contenthtml: contenthtml
            });
        }

    }
    console.log(AllData_WithConetent)
    await InsertData(AllData_WithConetent);
}


module.exports = hollywoodnews;