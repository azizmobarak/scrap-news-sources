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

var Categories=['economy'];

const MARKETWATCH = () =>{
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
        await page.goto('https://www.economist.com/the-economist-explains/');
       try{
        await page.click('#_evidon-banner-acceptbutton');
       }catch(e){
       console.log(e)
       }
       }catch{
        await page.goto('https://www.economist.com/the-economist-explains/');
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0

    
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{
               

    var titles = document.querySelectorAll('.ds-layout-grid>.teaser__text>h2>a>span');
    var images =document.querySelectorAll('.ds-layout-grid>.teaser__image>img')
    var links = document.querySelectorAll('.ds-layout-grid>.teaser__text>h2>a')
       
         
        var data =[];
         for(let j=0;j<titles.length;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : typeof(images[j])==="undefined" ? null : images[j].src,
                       Category:Category,
                       source :"MARKETWATCH",
                       sourceLink:"https://www.marketwatch.com/",
                       sourceLogo:"https://mw3.wsj.net/mw5/content/logos/mw_logo_social.png"
                      });
                   }
               }
                      return data;
               },Category);
               console.log(PageData);
               PageData.map(item=>{
                   AllData.push(item)
               })
       }}catch{
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
      //  console.log(url)
    
        var Content = await page.evaluate(()=>{
        
            try{

             var first_text = document.querySelectorAll(".article__body-text");
            var first_cont="";
            for(let i=0;i<first_text.length;i++){
                first_cont=first_cont+"\n"+first_text[i].textContent;
            }

              return first_cont;
            }catch{
                return null;
            }
        });

        // var author = await page.evaluate(()=>{
        //     try{
        //      return document.querySelector('.author').textContent.trim();
        //     }catch{
        //       return null;
        //     }
        // })

    
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
                author : null,
                content:Content
          });
       }
    
    }
   // console.log(AllData_WithConetent)
    await InsertData(AllData_WithConetent);
}


module.exports=MARKETWATCH;