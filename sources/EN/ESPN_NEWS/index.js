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

var Categories=['nba','soccer','mma','nfl','boxing','golf','racing','tennis','f1'];

const ESPN = () =>{
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
        await page.goto(['https://www.espn.com/','',Category].join(''));
        await page.click('#onetrust-accept-btn-handler')
       }catch{
        await page.goto(['https://www.espn.com/','',Category].join(''));
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0

    
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{
               

         var titles = document.querySelectorAll('.contentItem .contentItem__content--story h1');
         var images =document.querySelectorAll('.contentItem .contentItem__content--story figure>picture>source+source')
         var links = document.querySelectorAll('.contentItem .contentItem__content--story a')

         if(Category==="mba"){
             Category="basketball";
         }else{
             if(Category==="soccer"){
                 Category="football"
             }else{
                 if(Category==="nfl"){
                     Category="rugby"
                 }else{
                     if(Category==="f1"){
                         Category="formulaone"
                     }else{
                         if(Category==="mma"){
                             Category="sport"
                         }
                     }
                 }
             }
         }
            
         
                var data =[];
         for(let j=0;j<3;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent,
                       link : links[j].href,
                       images :  (typeof(images[j+1])=="undefined" || images[j+1]==null ) ? null : images[j+1].getAttribute('data-srcset')==null ? null : images[j+1].getAttribute('data-srcset').split(",")[0],
                       Category:Category,
                       source :"ESPN",
                       sourceLink:"https://espn.com",
                       sourceLogo:"https://i.pinimg.com/originals/b3/69/c7/b369c7454adc03bfea8c6b2f4268be5a.png"
                      });
                   }
               }
                      return data;
               },Category);
               PageData.map(item=>{
                   AllData.push(item)
               })
       }}catch{
        await browser.close();
       }

       try{
        await GetContent(page,AllData);
       }catch{
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
                var text = document.querySelectorAll(".article-body p");
            var cont="";
            for(let i=0;i<text.length;i++){
             cont=cont+"\n"+text[i].textContent;
            }
            return cont;
            }catch{
                return null;
            }
        });

        var author = await page.evaluate(()=>{
           try{
            const auth =document.querySelector(".author").textContent
            if(auth==="ESPN") auth=null;
            return auth;
           }catch{
               return null;
           }
        });
    
    if(item.images!=null && Content!=null && Content!=""){
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


module.exports=ESPN;