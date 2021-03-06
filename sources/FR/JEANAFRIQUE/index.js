'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../../function/insertData');
const { category } = require('../../../model/Category');

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

var Categories=['politic',"culture"];

const JEAN = () =>{
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
    var url ="";

    if(Category==="politic") url ="https://www.jeuneafrique.com/rubriques/politique/";
    else{
        if(Category==="culture") url="https://www.jeuneafrique.com/rubriques/culture/";
    }

    try{
        await page.goto(url);
        var count=i;
      if(count==0)  await page.click('#didomi-notice-agree-button');
       }catch{
        await page.goto(url);
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

     await page.waitFor(2000)

    
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{
               

    var images = document.querySelectorAll('article a>img');
    // inside boucle for
    var links = "";
    var titles = "";
       
         
        var data =[];
         for(let j=0;j<6;j++){

             titles = j==0 ? document.querySelectorAll('article h1') : document.querySelectorAll('article h2');
             links = j==0 ? document.querySelectorAll('article a') : document.querySelectorAll('article>a+a');
             var index = j==0 ? j : j-1;
           
              if(typeof(titles[index])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[index].textContent.trim(),
                       link : links[index].href,
                       images : typeof(images[j])==="undefined" ? null : images[j].src,
                       Category:Category,
                       source :"LeQuotidien",
                       sourceLink:"https://www.lequotidien.com",
                       sourceLogo:"https://www.otlhotelsaguenay.ca/uploads/1/0/6/8/106825145/editor/le-quotidien-logo1_10.jpg"
                      });
                   }
               }
                      return data;
     },Category);
          // console.log(PageData);
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

        await page.goto(url);
       // console.log(url)
    
        var Content = await page.evaluate(()=>{
        
            try{
                // first try to get all content
             var second_text = document.querySelectorAll('.ja-teads-inread p');
             var scond_content ="";
             for(let i=0;i<second_text.length;i++){
                scond_content = scond_content +"\n"+second_text[i].textContent;
             }
              return scond_content;
            }catch{
               return null;
            }
        });

        var author = await page.evaluate(()=>{
            try{
                var authr =document.querySelector('.art-header-author>a').textContent.trim()
             return authr;
            }catch{
                try{
                    var authr = document.querySelector('.box__description-title>span').textContent.trim();
                    return authr;
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
  // console.log(AllData_WithConetent)
   await InsertData(AllData_WithConetent);
}


module.exports=JEAN;