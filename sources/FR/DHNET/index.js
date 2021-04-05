'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../../function/insertData');
const {SendToServer} = require('../../../function/SendToserver.js')
const {FormatImage} = require('../../../function/FormatImage.js');

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

var Categories=['football','tennis','basketball'];

const DHNET = () =>{
    (async()=>{
       var browser =await puppeteer.launch({
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

 
var AllData=[]; 

try{
// boucle on categories started 
for(let i=0;i<Categories.length;i++){

    //get the right category by number
    var Category = Categories[i]
    //navigate to category sub route
    var url ="https://www.dhnet.be/sports/football";

    if(Category==="tennis") url="https://www.dhnet.be/sports/tennis"
    if(Category==="basketball") url="https://www.dhnet.be/sports/basket"
    
    try{
        await page.goto(url);
        await page.waitForSelector('footer')
       // if(i==0) await page.click('#didomi-notice-agree-button');
       }catch{
        await page.goto(url);
       // if(i==0) await page.click('#didomi-notice-agree-button');
    }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0


      await page.evaluate(()=>{

        var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(async() => {
                var scrollHeight = document.body.scrollHeight;
               window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= 2000){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
    });

     await page.waitFor(3000)

    
         // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
    var images =document.querySelectorAll('article img');
    var links = document.querySelectorAll('article .teaser_link');
    var titles = document.querySelectorAll('article h2.teaser_title');
       
         
        var data =[];

         for(let j=0;j<5;j++){
            if(typeof(titles[j])!="undefined" && links[j]!=null){
                data.push({
                    time : Date.now(),
                    title : titles[j].textContent.trim(),
                    link : links[j].href,
                    images : typeof(images[j])==="undefined" ? null : images[j].src,
                    Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                    source :"DH NET - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink:"https://www.dhnet.be",
                    sourceLogo:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/La_Derni%C3%A8re_Heure_logo.svg/1200px-La_Derni%C3%A8re_Heure_logo.svg.png"
                      });
                   }
               }
                      return data;
     },Category);
            console.log(PageData);

            PageData.map((item,j)=>{
                item.images = FormatImage(item.images);
                console.log(item.images)
            setTimeout(() => {
                    console.log("request here")
                    SendToServer("fr",item.Category,item.source,item.sourceLogo)
              }, 5000*j);
                   AllData.push(item);
               });
       }}catch(e){
        console.log(e)
        await browser.close();
       }

       try{
         await GetContent(page,AllData);
       }catch(e){
         console.log(e);
        await browser.close();
       }

     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;

      //  console.log(url)
        await page.goto(url);
    
        var Content = await page.evaluate(()=>{
            try{
              return document.querySelector('.article-text').textContent;
            }catch{
               return null;
            }
        });

        var ContentHTML = await page.evaluate(()=>{
            try{
              return document.querySelector('.article-text').innerHTML;
            }catch{
               return null;
            }
        });

     var author = await page.evaluate(()=>{
         try{
        return document.querySelector('.author-name').textContent.trim();
         }catch{
        return null;
         }
     })

    
    if(Content!=null && Content!=""){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.images,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                author : author,
                content:Content,
                contentHTML:ContentHTML
          });
       }
    }
//  console.log(AllData_WithConetent)
 await InsertData(AllData_WithConetent);
}


module.exports=DHNET;