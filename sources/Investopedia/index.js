'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../function/insertData');
const {FormatImage} = require('../../function/Formatimage');
const {SendToServer} = require('../../function/SendToserver');


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

var Categories=['political-news-4689737','markets-news-4427704','personal-finance-4427760','economy-4689801','investing-essentials-4689754','company-news-4427705'];

const INVESTOPEDIA = () =>{
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
        console.log(Category);
        //navigate to category sub route
       try{
        await page.goto(['https://www.investopedia.com/','',Category].join(''));
       }catch{
        await page.goto(['https://www.investopedia.com/','',Category].join(''));
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0


  
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{
               
           
            var titles = document.querySelectorAll('a.mntl-card .card__title');
            var images =document.querySelectorAll('a.mntl-card .card__media>img')
            var links = document.querySelectorAll('a.mntl-card')

            if(Category.indexOf('market')!=-1){
                Category="market";
            }else{
                if(Category.indexOf('personal')!=-1){
                    Category="money"
                }else{
                    if(Category.indexOf('political')!=-1){
                        Category="politic"
                    }else{
                        if(Category.indexOf("economy")!=-1 || Category.indexOf('company')!=-1){
                            Category="economy"
                        }else{
                            if(Category.indexOf('investing')!=-1){
                                Category="investing"
                            }
                        }
                    }
                }
            }
            
                     
                var data =[];
         for(let j=0;j<4;j++){
           
              if(typeof titles[j] != "undefined" && images[j].src.indexOf("data:image")==-1){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent,
                       link : links[j].href,
                       images :  typeof(images[j])=="undefined" ? null : images[j].src,
                       Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                       source :"Investopedia - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                       sourceLink:"https://www.investopedia.com/",
                       sourceLogo:"https://download.logo.wine/logo/Investopedia/Investopedia-Logo.wine.png"
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
       }
    }catch(e){ await browser.close();console.log(e)}        
     
  try{await GetContent(page,AllData)}catch(e){console.log(e);await browser.close();}

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
            var text = document.querySelectorAll('.article-body-content p');
            var Cont ="";
            if(typeof(text!="undefined") && text!=null){
              for(let i=0;i<text.length;i++){
                  Cont=Cont+"\n"+text[i].textContent;
              }
              return Cont;
            }else{
                return null;
            }
        });

var ContentHtml = await page.evaluate(()=>{
          try{
            var text = document.querySelector('.article-body-content').innerHTML;
            return text;
          }catch{
             return null;
          }
           
        });


var author = await page.evaluate(()=>{
          var auth =document.querySelector('.byline__tooltip>a');
          if(typeof(auth)!="undefined"  &&  auth!=null){
             return auth.textContent;
          }else{
              auth = document.querySelector('.byline__name');
              if(auth!=null && typeof auth!="undefined"){
                  return auth.textContent;
              }else{
                  return null;
              }
          }
});
    
    if(Content!=null && Content!="" || ContentHtml!=null){
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
                contentHtml : ContentHtml
          });
       }
    
    }
    await InsertData(AllData_WithConetent);
}


module.exports=INVESTOPEDIA;
