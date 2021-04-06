'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../../function/insertData');
const {SendToServer} = require('../../../function/SendToServer');
const {FormatImage} = require('../../../function/FormatImage')

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



var Categories=['Guatemala','internacional','celebridad'];

const SCRAP = () =>{
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
    var url="https://www.publinews.gt/gt/guatemala";
    if(Category==="internacional") url ="https://www.publinews.gt/gt/mundo";
    if(Category==="celebridad") url ="https://www.publinews.gt/gt/espectaculos";
    

	page.on('dialog', async dialog => {
    await dialog.dismiss();
	});


       try{
        await page.goto(url);
        await page.click('.sub-dialog-btn');
       }catch{
             await page.goto(url);
         }

 await page.evaluate(()=>{

        var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(async() => {
                var scrollHeight = document.body.scrollHeight;
               window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= 1000){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
    });

     await page.waitFor(2000)
    
         // get the data from the page
var PageData = await page.evaluate((Category)=>{
            
    var articles = document.querySelectorAll('article');
    var images ="img";
    var links = "a";
    var titles ="h2";
             
        var data =[];

         for(let j=0;j<4;j++){

            if(typeof(articles[j].querySelector(titles))!="undefined" && articles[j].querySelector(links)!=null){
  
                var img = articles[j].querySelector(images)==null ? null :  articles[j].querySelector(images).src;

                data.push({
                    time : Date.now(),
                    title : articles[j].querySelector(titles).textContent.trim(),
                    link : articles[j].querySelector(links).href,
                    images : img,
                    Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                    source :"PubliNews "+Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink:"https://www.publinews.gt",
                    sourceLogo:"https://a.calameoassets.com/691806/picture.jpg"
                      });
                   }
               }
                      return data;
     },Category);

        PageData.map((item,j)=>{
            item.images = FormatImage(item.images);
            setTimeout(() => {
                 SendToServer('en',item.Category,item.source,item.sourceLogo)
            },2000*j);
               AllData.push(item)
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

        await page.goto(url);
    
        var Content = await page.evaluate(()=>{
            try{
               // first try to get all content
               var second_text = document.querySelectorAll('.entry-content p');
               var scond_content ="";
               for(let i=0;i<second_text.length;i++){
                scond_content = scond_content +"\n"+second_text[i].textContent;
               }
                return scond_content+".. .";
            }catch{
               return null;
            }
        });

        var ContentHtml = await page.evaluate(()=>{
            try{
               return document.querySelector('.entry-content').innerHTML;
            }catch{
               return null;
            }
        });

        var author = await page.evaluate(()=>{
            try{
                return document.querySelector('.author').textContent.trim();
            }catch{
                return null;
            }
        })
    
    if(Content!=null && Content!="" && Content.length>255){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.images==="" ? null : item.images,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                author : author,
                content:Content,
                contentHTML : ContentHtml
          });
       }
    }
await InsertData(AllData_WithConetent);
}

module.exports=SCRAP;