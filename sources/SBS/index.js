'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../function/insertData');
const {FormatImage} = require('../../function/formatImage');
const {SendToServer} = require('../../function/sendToserver');

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

var Categories=['international'];

const ninenews = () =>{
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
        await page.goto('https://www.sbs.com.au/news/topic/world');
        await page.WaitForSelector('.media-image>a>picture>img:nth-of-type(6)')
    //    try{
    //     await page.click('#_evidon-banner-acceptbutton');
    //    }catch(e){
    //    console.log(e)
    //    }
       }catch{
        await page.goto('https://www.sbs.com.au/news/topic/world');
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0


         // get the data from the page
var PageData = await page.evaluate((Category)=>{
               

    var titles = document.querySelectorAll('.preview__headline');
    var images = document.querySelectorAll('.media-image>a>picture>source')
    var links = document.querySelectorAll('.preview__headline>a')
       
         
        var data =[];
         for(let j=0;j<2;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : typeof(images[j==0 ? j : j+2]) === "undefined" ? null : images[j].srcset,
                       Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                       source :"SBS - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                       sourceLink:"https://www.sbs.com.au",
                       sourceLogo:"https://i1.sndcdn.com/avatars-000069869393-zwvoyp-t500x500.jpg"
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

        try{
            await page.goto(url);
           }catch{
            i++;
            var item = data[i];
            var url = item.link;
            console.log(url)
            await page.goto(url);
           }
    
        var Content = await page.evaluate(()=>{
        
               try{
                return document.querySelector('.article__body').textContent.length>400 ? document.querySelector('.article__body').textContent.trim().substring(0,1050) : null;
                }catch{
                    return null;
                }
        });

        var contenthtml = await page.evaluate(()=>{
            try{
             return document.querySelector('.article__body').innerHTML;
             }catch{
                 return null;
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
                author : null,
                content:Content,
                contenthtml:contenthtml
          });
       }
    
    }
    await InsertData(AllData_WithConetent);
}


module.exports=ninenews;