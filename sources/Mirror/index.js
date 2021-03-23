'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../function/insertData');

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

var Categories=['politic'];

const Investing = () =>{
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
       try{
        await page.goto('https://www.mirror.co.uk/news/politics');
        await page.waitForSelector(".qc-cmp2-summary-buttons>button:nth-child(2)");
        await page.click('.qc-cmp2-summary-buttons>button:nth-child(2)')
        await page.waitForSelector(".section-theme-border>a>img");
       }catch{
        await page.goto('https://www.mirror.co.uk/news/politics');
       // await page.waitForSelector(".section-theme-border>a>img");
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0



    await page.evaluate(()=>{

        var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(async() => {
                var scrollHeight = document.body.scrollHeight;
               window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= 3000){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
    });
    
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{
               

    var article=document.querySelectorAll('.teaser');
    var titles ='a:nth-child(2)';
    var images ='img';
    var links = 'a';
       
         
        var data =[];
         for(let j=0;j<5;j++){
           
              if(article[j].querySelector(titles)!=null && article[j].querySelector(links)!=null){
                   data.push({
                       time : Date.now(),
                       title :article[j].querySelector(titles).textContent.trim(),
                       link : article[j].querySelector(links).href,
                       images :article[j].querySelector(images)==null ? null : article[j].querySelector(images).src,
                       Category:Category,
                       source :"The Mirror "+Category,
                       sourceLink:"https://www.mirror.co.uk",
                       sourceLogo:"https://cdn.freebiesupply.com/logos/large/2x/the-mirror-logo-png-transparent.png"
                      });
                   }
               }
                      return data;
               },Category);
               PageData.map(item=>{
                   AllData.push(item)
               })
       }}catch(e){
        console.log(e);
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

        await page.goto(url);
    
        var Content = await page.evaluate(()=>{
        
            try{
            var first_text = document.querySelectorAll(".article-body>p");
            var first_cont="";
            for(let i=0;i<first_text.length;i++)
                {
                first_cont=first_cont+"\n"+first_text[i].textContent;
                }
              return first_cont;
            }catch{
                return null;
            }
        });

        var author = await page.evaluate(()=>{
            try{
             return document.querySelector('.author>a').textContent;
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
                content:Content
          });
       }
    
    }
    await InsertData(AllData_WithConetent);
}


module.exports=Investing;