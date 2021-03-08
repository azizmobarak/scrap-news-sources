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

var Categories=['politic','international','economy'];

const OBSERVATEUR = () =>{
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
    var url ="https://www.nouvelobs.com/politique/";

    if(Category==="international") url = "https://www.nouvelobs.com/monde/";
    if(Category==="economy") url="https://www.nouvelobs.com/economie/";

    try{
        await page.goto(url);
        await page.click('.iubenda-cs-accept-btn')
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
               
    var article=document.querySelectorAll('article');
    var images = "source";
    var links = "a";
    var titles = "h2";
       
         
        var data =[];
         for(let j=0;j<5;j++){
           
              if(typeof(article[j].querySelector(titles))!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : article[j].querySelector(titles).textContent,
                       link : article[j].querySelector(links).href,
                       images : typeof(article[j].querySelector(images))==="undefined" ? null : (j!=0 ? article[j].querySelector(images).srcset : article[j].querySelector("img").src ),
                       Category:Category,
                       source :"Le Nouvel Observateur",
                       sourceLink:"https://www.nouvelobs.com/",
                       sourceLogo:"https://www.nouvelobs.com/icons/lobs/lobs-pwa-192.png"
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

        //await page.goto(url);
        console.log(url)
    
        var Content = await page.evaluate(()=>{
        
            try{
                // first try to get all content
             var second_text = document.querySelectorAll('.ObsArticle-body p');
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
                var authr =document.querySelector('.article__footer-author>a').textContent.trim()
             return authr;
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
                content:Content
          });
       }
    
    }
  // console.log(AllData_WithConetent)
  await InsertData(AllData_WithConetent);
}


module.exports=OBSERVATEUR;