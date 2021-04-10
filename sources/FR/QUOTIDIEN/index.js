'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../../function/insertData');
const {FormatImage}  = require('../../../function/formatimage')
const {SendToServer}  = require('../../../function/sendtoserver')

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

var Categories=['avis'];

const QUOTIDIEN = () =>{
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
    var url ="https://www.lequotidien.com/opinions";
    try{
        await page.goto(url);
       // await page.click('#close-icon');
       }catch{
        await page.goto(url);
       // await page.click('#close-icon');
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
               

    var titles = document.querySelectorAll('article h2');
    var images = document.querySelectorAll('article img');
    var links = document.querySelectorAll('article a');
       
         
        var data =[];
         for(let j=0;j<6;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : typeof(images[j])==="undefined" ? null : images[j].src,
                       Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                       source :"LeQuotidien - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                       sourceLink:"https://www.lequotidien.com",
                       sourceLogo:"https://www.otlhotelsaguenay.ca/uploads/1/0/6/8/106825145/editor/le-quotidien-logo1_10.jpg"
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
             var second_text = document.querySelectorAll('article div>div>p');
             var scond_content ="";
             for(let i=0;i<second_text.length;i++){
                scond_content = scond_content +"\n"+second_text[i].textContent;
             }
              return scond_content;
            }catch{
               return null;
            }
        });

        var contenthtml = await page.evaluate(()=>{
        
            try{
             return document.querySelector('article div>div').innerHTML;
            }catch{
               return null;
            }
        });

        var author = await page.evaluate(()=>{
            try{
                var authr = document.querySelector('article p>em').textContent.split(' ');
             return authr[1]+" "+authr[2];
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
                author : author,
                content:Content,
                contenthtml : contenthtml
          });
       }
    
    }
    await InsertData(AllData_WithConetent);
}


module.exports=QUOTIDIEN;