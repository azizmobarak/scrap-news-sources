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

var Categories=['bolivia','international','economy','market'];

const LARAZON = () =>{
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
    console.log(Category)
    //navigate to category sub route
    var url ="https://www.la-razon.com/nacional/";

    if(Category==="international") url="https://www.la-razon.com/mundo/"
    if(Category==="economy") url="https://www.la-razon.com/economia/"
    if(Category==="market") url="https://www.la-razon.com/suplementos/marcas/"
    
    try{
        await page.goto(url);
        await page.waitForSelector('footer')
      //  if(i==0) await page.click('#didomi-notice-agree-button');
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

                if(totalHeight >= 1000){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
    });

     await page.waitFor(3000)
    
         // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
    var articles = document.querySelectorAll('.article-block-content');
    var images =".background-holder>div"
    var links = "a"
    var titles =".title"
       
         
        var data =[];

         for(let j=0;j<5;j++){
            if(typeof(articles[j].querySelector(titles))!="undefined" && articles[j].querySelector(links)!=null){
                data.push({
                    time : Date.now(),
                    title : articles[j].querySelector(titles).textContent.trim(),
                    link : articles[j].querySelector(links).href,
                    images : articles[j].querySelector(images)==null ? null : articles[j].querySelector(images).style.backgroundImage.substring(articles[j].querySelector(images).style.backgroundImage.indexOf('("')+2,articles[j].querySelector(images).style.backgroundImage.indexOf('")')),
                    Category:Category,
                    source :"LA-RAZON "+Category,
                    sourceLink:"https://www.la-razon.com",
                    sourceLogo:"https://www.la-razon.com/wp-content/themes/lr-genosha/assets/img/la-razon-logo.png"
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

       console.log(url)
        await page.goto(url);
    
        var Content = await page.evaluate(()=>{
            try{
               // first try to get all content
               var second_text = document.querySelectorAll('.article-body p');
               var scond_content ="";
               for(let i=0;i<second_text.length-1;i++){
                  scond_content = scond_content +"\n"+second_text[i].textContent;
               }
                return scond_content;
            }catch{
               return null;
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
                author : null,
                content:Content
          });
       }
    }
 console.log(AllData_WithConetent)
//  await InsertData(AllData_WithConetent);
}


module.exports=LARAZON;