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

var Categories=['france','international','science'];

const RFI = () =>{
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
    var url ="https://www.rfi.fr/en/france/";

    if(Category==="international") url="https://www.rfi.fr/en/international/";
    if(Category==="science") url="https://www.rfi.fr/en/science-technology/";

    try{
        await page.goto(url);
        if(i==0) await page.click('#didomi-notice-agree-button');
       }catch{
        await page.goto(url);
        if(i==0) await page.click('#didomi-notice-agree-button');
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

     await page.waitFor(6000)

    
         // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
    var images = document.querySelectorAll('.article__figure-wrapper img');
    var links = document.querySelectorAll('.m-item-list-article a');
    var titles = document.querySelectorAll('.article__title');
       
         
        var data =[];
         for(let j=0;j<5;j++){
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       images : typeof(images[j])!="undefined" ? images[j].src : null,
                       link : typeof(links[j])==="undefined" ? null : links[j].href ,
                       Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                       source :"RFI NEWS - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                       sourceLink:"https://www.rfi.fr",
                       sourceLogo:"https://static.rfi.fr/meta_og_twcards/jsonld_publisher.png"
                      });
                   }
               }
                      return data;
     },Category);
          PageData.map((item,j)=>{
            item.images = FormatImage(item.images);
            setTimeout(() => {
                 SendToServer('fr',item.Category,item.source,item.sourceLogo)
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
        // console.log(e);
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

       // console.log(url)
        await page.goto(url);
    
        var Content = await page.evaluate(()=>{
        
            try{
            // first try to get all content
             var second_text = document.querySelectorAll('.t-content__body p');
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
             return document.querySelector('.t-content__body').innerHTML;
            }catch{
               return null;
            }
        });

     var author = await page.evaluate(()=>{
         try{
        return document.querySelector('.m-from-author__name').textContent.trim();
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
                content:Content,
                contenthtml:contenthtml
          });
       }
    
    }
  await InsertData(AllData_WithConetent);
}


module.exports=RFI;