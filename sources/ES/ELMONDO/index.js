'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../../function/insertData');

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

var Categories=['economy','opinion','international','spain'];

const ELMONDO = () =>{
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
    var url ="https://www.elmundo.es/economia.html";

    if(Category==="opinion") url="https://www.elmundo.es/opinion.html"
    if(Category==="international") url="https://www.elmundo.es/internacional.html"
    if(Category==="spain") url="https://www.elmundo.es/espana.html"
    
    
    try{
        await page.goto(url);
        await page.waitForSelector('footer')
        if(i==0) await page.click('#didomi-notice-agree-button');
       }catch{
        await page.goto(url);
        if(i==0) await page.click('#didomi-notice-agree-button');
    }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0


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

     await page.waitFor(3000)
    
         // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
    var articles = document.querySelectorAll('article');
    var images ="img"
    var links = ".ue-c-cover-content__link"
    var titles ="h2"
    var authors =".ue-c-cover-content__byline-name"

         
        var data =[];

         for(let j=0;j<4;j++){
            if(articles[j].querySelector(titles)!=null && articles[j].querySelector(links)!=null){
                data.push({
                    time : Date.now(),
                    title : articles[j].querySelector(titles).textContent.trim(),
                    link : articles[j].querySelector(links).href,
                    images : articles[j].querySelector(images)==null ? null : articles[j].querySelector(images).src,
                    Category:Category,
                    author: articles[j].querySelector(authors)!=null ? articles[j].querySelector(authors).textContent.replace('Redacción:','').trim() : null,
                    source :"ELMUNDO",
                    sourceLink:"https://www.elmundo.es/",
                    sourceLogo:"https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102015/elmundo_0.png"
                      });
                   }
               }
                      return data;
     },Category);
           console.log(PageData);
            PageData.map(item=>{
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

      // console.log(url)
       await page.goto(url);
 


    var Content = await page.evaluate(()=>{
        try{
              // I-first try to get all content 
              var text = document.querySelectorAll('.ue-l-article__body p');
              var scond_content ="";
              for(let i=0;i<text.length;i++){
                 scond_content = scond_content +"\n"+text[i].textContent;
                }
               return scond_content;
         }catch{
              try{
                   // II-first try to get all content
               var text = document.querySelectorAll('.ue-c-article--first-letter-highlighted');
               var scond_content ="";
               for(let i=0;i<text.length;i++){
                  scond_content = scond_content +"\n"+text[i].textContent;
                 }
                return scond_content;
                 }catch{
                  return null;
                 }
           }
        });

    
    if(Content!=null && Content!=""){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.images==="" ? null : item.images,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                author : item.author,
                content:Content
          });
       }
    }
// console.log(AllData_WithConetent)
  await InsertData(AllData_WithConetent);
}


module.exports=ELMONDO;