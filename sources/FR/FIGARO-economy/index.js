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

var Categories=['economy'];

const FIGARO = () =>{
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
        await page.goto('https://www.lefigaro.fr/economie');
       // await page.click('button.button__acceptAll');
       // await page.waitFor(10000);
       }catch{
        await page.goto('https://www.lefigaro.fr/economie');
       // await page.click('button.button__acceptAll');
       // await page.waitForSelector('article.fig-profile>a>figure>div>img');
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

     await page.waitFor(3000)

         // get the data from the page
    var PageData = await page.evaluate(async(Category)=>{


    var titles = document.querySelectorAll('article.fig-profile>a>h2');
    var images ="" // look inside next for boucle
    var links = document.querySelectorAll('article.fig-profile>a')
       
         
        var data =[];
         for(let j=0;j<4;j++){
             var img="";
             if(j==0){
                 images = document.querySelectorAll('.fig-profile__media>img');
                 img =typeof(images[j])!="undefined" ? images[j].srcset : null;
             }else{
                 images= document.querySelectorAll('article.fig-profile>a>figure>div>img');
                 img =typeof(images[j-1])!="undefined" ? images[j-1].srcset : null;
             }
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : img==null ? null : img.split(' ')[0],
                       Category:Category,
                       source :"Le Figaro",
                       sourceLink:"https://www.lefigaro.fr",
                       sourceLogo:"https://images-na.ssl-images-amazon.com/images/I/41MSIU5OVUL.png"
                      });
                   }
               }
                      return data;
               },Category);
             //  console.log(PageData);
               PageData.map(item=>{
                   AllData.push(item)
               })
       }}catch(e){
        console.log(e);
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

             var first_text = document.querySelectorAll(".fig-body>.fig-paragraph");
            var first_cont="";
            for(let i=0;i<first_text.length;i++){
                first_cont=first_cont+"\n"+first_text[i].textContent;
            }

              return first_cont;
            }catch{
                return null;
            }
        });

 var author = await page.evaluate(()=>{
            try{
             return document.querySelector('.fig-content-metas__author').textContent.trim();
            }catch{
              return null;
            }
        })

    
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


module.exports=FIGARO;