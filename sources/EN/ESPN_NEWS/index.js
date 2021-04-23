'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../../function/insertData');
const {FormatImage} = require('../../../function/formatImage');
const {SendToServer} = require('../../../function/sendToserver');

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
          var count =1;
        await page.goto(['https://www.espn.com/','',Category].join(''));
         if(count==1)  await page.click('#onetrust-accept-btn-handler');
         count ++;
       }catch{
        await page.goto(['https://www.espn.com/','',Category].join(''));
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{

         var articles = document.querySelectorAll('.contentItem .contentItem__content');
         var titles = "h1";
         var images ="source+source";
         var links = "a"

         if(Category==="nba"){
             Category="basketball";
         }else{
             if(Category==="soccer"){
                 Category="football"
             }else{
                 if(Category==="nfl"){
                     Category="rugby"
                 }else{
                     if(Category==="f1"){
                         Category="formula 1"
                     }else{
                         if(Category==="mma"){
                             Category="boxing"
                         }
                     }
                 }
             }
         }
            
         
                var data =[];
         for(let j=0;j<2;j++){
           
              if(articles[j].querySelector(titles)!=null && articles[j].querySelector(links)!=null){
                   data.push({
                       time : Date.now(),
                       title : articles[j].querySelector(titles).textContent,
                       link : articles[j].querySelector(links).href,
                       images : articles[j].querySelector(images)==null ? null : (articles[j].querySelector(images).srcset.split(",")[0]==="" ? null : articles[j].querySelector(images).srcset.split(",")[0]), 
                       Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                       source :"ESPN - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                       sourceLink:"https://espn.com",
                       sourceLogo:"https://i.pinimg.com/originals/b3/69/c7/b369c7454adc03bfea8c6b2f4268be5a.png"
                      });
                   }
               }
                      return data;
               },Category);
               console.log(PageData)
               PageData.map((item,j)=>{
                item.images = FormatImage(item.images);
                setTimeout(() => {
                     SendToServer('en',item.Category,item.source,item.sourceLogo)
                },2000*j);
                   AllData.push(item)
               });
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

        console.log(url)
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

        var contenthtml = await page.evaluate(()=>{
            try{
               return document.querySelector(".article-body").innerHTML;
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
                content:Content,
                contenthtml:contenthtml
          });
       }
    
    }
    console.log(AllData_WithConetent)
    await InsertData(AllData_WithConetent);
}


module.exports=ESPN;