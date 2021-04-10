'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../../function/insertData');
const  {FormatImage} = require('../../../function/formatimage')
const  {SendToServer} = require('../../../function/sendtoserver')

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

var Categories=['Colombia','politica','tecnología','economía','venezuela','cultura'];

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
    var url ="https://www.eltiempo.com/colombia";

    if(Category==="politica") url="https://www.eltiempo.com/politica";
    if(Category==="tecnología") url="https://www.eltiempo.com/tecnosfera";
    if(Category==="economía") url="https://www.eltiempo.com/economia";
    if(Category==="venezuela") url="https://www.eltiempo.com/mundo/venezuela";
    if(Category==="cultura") url="https://www.eltiempo.com/cultura";
    
    try{
        await page.goto(url);
       // await page.waitForSelector('footer')
     //   if(i==0) await page.click('#noads-promo-close');
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

     await page.waitFor(2000)
    
         // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
    var articles = document.querySelectorAll('article');
    var images ="img"
    var links = "a"
    var titles ="h3"
       
         
        var data =[];

         for(let j=2;j<4;j++){
            if(typeof(articles[j])!="undefined"){
                data.push({
                    time : Date.now(),
                    title : articles[j].querySelector(titles).textContent.trim(),
                    link : articles[j].querySelector(links).href,
                    images : articles[j].querySelector(images)==null ? null : articles[j].querySelector(images).src,
                    Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                    source :"Eltiempo - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink:"www.eltiempo.com",
                    sourceLogo:"https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/062011/elt.jpg"
                      });
                   }
               }
                      return data;
     },Category);
           PageData.map((item,j)=>{
            item.images = FormatImage(item.images);
            setTimeout(() => {
                 SendToServer('es',item.Category,item.source,item.sourceLogo)
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

      //  console.log(url)
        await page.goto(url);
    
        var Content = await page.evaluate(()=>{
            try{
               // first try to get all content
               var second_text = document.querySelectorAll('.modulos p');
               var scond_content ="";
               for(let i=1;i<second_text.length;i++){
                  scond_content = scond_content +"\n"+second_text[i].textContent;
               }
                return scond_content.replaceAll('\n','');
            }catch{
               return null;
            }
        });

        var contenthtml = await page.evaluate(()=>{
            try{
               return document.querySelector('.modulos').innerHTML
            }catch{
               return null;
            }
        });

    var author = null;
    
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
                author : author,
                content:Content,
                contenthtml : contenthtml
          });
       }
    }
    await InsertData(AllData_WithConetent);
}


module.exports=LARAZON;