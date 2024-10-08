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

var Categories=['politics','health','sports','international','business'];

const ABC_NEWS = () =>{
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
        await page.goto(['https://abcnews.go.com/','',Category].join(''));
       }catch{
        await page.goto(['https://abcnews.go.com/','',Category].join(''));
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0

    
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{
               
               // function to look for a word inside other words for time
        const WordExist=(searchIn)=>{
                    if(searchIn.indexOf("second")!=-1){
                         return true;
                         }else{
                       if(searchIn.indexOf("seconds")!=-1){
                      return true;
                       }else{
                         if(searchIn.indexOf("minute")!=-1){
                       return true;
                       }else{
                       if(searchIn.indexOf("minutes")!=-1){
                           return true;
                          }else{
                        if(searchIn.indexOf("hour")!=-1){
                          return true;
                         }else{
                     if(searchIn.startsWith("1 hour")!=false || searchIn.startsWith("2 hours")!=false || searchIn.startsWith("an hour")!=false){
                                return true;
                        }else{
                            return false;
                        }
                    }
                }
            }
        }
    }
    }
    

                     var titles = document.querySelectorAll('.ContentRoll__Headline>h2>a.AnchorLink');
                     var images =document.querySelectorAll('.ContentRoll__Image img');
                     var time = document.querySelectorAll('.ContentRoll__Date')
    
                     
   if(Category==="sports") Category="sport";
   if(Category==="politics") Category="politic";             
                     
                var data =[];
         for(let j=0;j<titles.length;j++){
           
              if(WordExist(time[j].textContent)==true){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent,
                       link : titles[j].href,
                       images :  typeof(images[j])=="undefined" ? null : images[j].src,
                       Category:Category,
                       source :"ABC NEWS",
                       sourceLink:"https://abcnews.go.com",
                       sourceLogo:"https://gray-wbay-prod.cdn.arcpublishing.com/resizer/fln06LgHS8awdDtCHhWoikKI7UE=/1200x675/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/X3TAX5IMPBHY7EBGM6XW47YETE.jpg"
                      });
                   }
               }
                      return data;
               },Category);
               PageData.map(item=>{
                console.log(item.Category)
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
        console.log(url)
    
        var Content = await page.evaluate(()=>{
            var text = document.querySelector('.Article__Wrapper>.Article__Content')==null ? null : document.querySelector('.Article__Wrapper>.Article__Content').textContent;
            return text;
        });

        var author = await page.evaluate(()=>{
           try{
            const auth =document.querySelector('.Byline__Author').textContent;
            const upperCaseWords = auth.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g);
            return upperCaseWords[0]+" "+upperCaseWords[1]
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


module.exports=ABC_NEWS;