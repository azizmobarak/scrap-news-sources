'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
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

var Categories=['lifestyle','canada','world','entertainment','politics','health','sci-tech','sports','business'];

const CTV = () =>{
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
        await page.goto(['https://www.ctvnews.ca/','',Category].join(''));
        await page.click('#onetrust-accept-btn-handler')
       }catch{
        await page.goto(['https://www.ctvnews.ca/','',Category].join(''));
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0

    
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{
               

         var titles = document.querySelectorAll('.bn-headline .teaserTitle');
         var images =document.querySelectorAll('.teaserImage>a>img');
         var links = document.querySelectorAll('.teaserImage>a');

         if(Category==="sports"){
             Category="sport";
         }else{
             if(Category==="sci-tech"){
                 Category="technology"
             }else{
                 if(Category==="world"){
                     Category="international"
                 }else{
                     if(Category==="lifestyle"){
                         Category="life&style"
                     }else{
                         if(Category==="politics"){
                             Category="politic"
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
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images :  (typeof(images[j])=="undefined" || images[j]==null ) ? null : images[j].getAttribute('src'),
                       Category:Category,
                       source :"CTV",
                       sourceLink:"https://www.ctvnews.ca",
                       sourceLogo:"https://i.pinimg.com/originals/b3/69/c7/b369c7454adc03bfea8c6b2f4268be5a.png"
                      });
                   }
               }
                      return data;
               },Category);
               console.log(PageData)
               PageData.map(item=>{
                   AllData.push(item)
               })
       }}catch{
        await browser.close();
       }

       try{
        await GetContent(page,AllData);
       }catch(e){
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
            var text = document.querySelectorAll('.articleBody p');
            var cont="";
            for(let i=0;i<text.length;i++){
             cont=cont+"\n"+text[i].textContent.replaceAll('\t','');
            }
            return cont;
            }catch{
                return null;
            }
        });

        var author = await page.evaluate(()=>{
           try{
            const auth = document.querySelector(".byline").textContent
            return auth;
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
    await InsertData(AllData_WithConetent);
}


module.exports=CTV;