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

var Categories=['economy','spain','international','life&style'];

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
    //navigate to category sub route
    var url ="https://www.larazon.es/economia/";

    if(Category==="international") url="https://www.larazon.es/internacional/"
    if(Category==="spain") url="https://www.larazon.es/espana/"
    if(Category==="life&style") url="https://www.larazon.es/lifestyle/"
    
    try{
        await page.goto(url);
        await page.waitForSelector('footer')
        if(i==0) await page.click('#didomi-notice-agree-button');
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
               
    var articles = document.querySelectorAll('article');
    var images ="img"
    var links = "h3>a"
    var titles ="h3"
    var authors =".card__byline>ul>li"

    // if(Category==="opinion"){
    //     articles=document.querySelectorAll('.articulo__interior');
    //     links = "figure .enlace";
    //     titles="h2";
    //     authors=".autor-nombre";
    // }
       
         
        var data =[];

         for(let j=0;j<8;j++){
            if(typeof(articles[j].querySelector(titles))!="undefined" && articles[j].querySelector(links)!=null){
                data.push({
                    time : Date.now(),
                    title : articles[j].querySelector(titles).textContent.trim(),
                    link : articles[j].querySelector(links).href,
                    images : articles[j].querySelector(images)==null ? null : articles[j].querySelector(images).src,
                    Category:Category,
                    author:articles[j].querySelector(authors).textContent.trim(),
                    source :"LARAZON "+Category,
                    sourceLink:"https://www.larazon.es",
                    sourceLogo:"https://www.tibagroup.com/wp-content/uploads/2016/11/LOGO-LA-RAZON-alta2-2.jpg"
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
               var second_text = document.querySelectorAll('.article__body-container p');
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
                author : item.author,
                content:Content
          });
       }
    }
 console.log(AllData_WithConetent)
 // await InsertData(AllData_WithConetent);
}


module.exports=LARAZON;