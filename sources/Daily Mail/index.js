'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../function/insertData');
const { category } = require('../../model/Category');

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

var Categories=['worldnews','israel','china','nigeria','turkey','coronavirus','royals','crime','ushome','us-economy','sport/football','sport/fa_cup','sport/champions_league','sport/transfernews','sport/boxing','sport/rugbyunion','sport/golf','sport/cricket','sport/formulaone','sport/tennis','sport/mma','sport/racing','usshowbiz','tvshowbiz/the-masked-singer-uk','arts','auhome','breaking_news','new_zealand','femail','femail/food','best-buys','health','news/world-health-organization','sciencetech/nasa','sciencetech/apple','sciencetech/twitter','money/markets','money/saving','money/investing','money/bills','money/cars','money/holidays','money/cardsloans','money/pensions','money/mortgageshome','travel/escape','travel/destinations','tvshowbiz'];


const Daily_News = () =>{
    (async()=>{
       var browser =await puppeteer.launch({
        headless: false,
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
// boucle on categories started 
for(let i=0;i<Categories.length;i++){

        //get the right category by number
        var Category = Categories[i]
        console.log(Category);
        //navigate to category sub route

        var URL = 'https://www.dailymail.co.uk/news/'
        if(Category.indexOf('sport')!=-1 || Category==="auhome" || Category==="usshowbiz"){
            URL = 'https://www.dailymail.co.uk/'
        }


       try{
        await page.goto([URL,'',Category,'','/index.html'].join(''));
       }catch{
        await page.goto([URL,'',Category,'','/index.html'].join(''));
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0

    
         // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
var categoryName=Category;
var ArticleDom = document.querySelectorAll(".article-tri-headline");
var titleClassName ="h2>a";
var linkClassName="h2>a";
var imageClassName="img";


if(categoryName==="worldnews"){
    categoryName="international";
                      }
if(categoryName==="israel" || categoryName==="china" || 
    categoryName==="nigeria" || categoryName==="turkey" || 
    categoryName==="coronavirus" || categoryName==="crime" || 
    categoryName==="royals" || categoryName==="us-economy")
    {
    ArticleDom=document.querySelectorAll('.article-small');
    var cat = categoryName;
   
    if(categoryName==="crime") cat = "safety";
    if(categoryName==="royals") cat = "UK,international";
    if(categoryName==="china"|| categoryName==="israel" || categoryName==="nigeria" || categoryName==="turkey") cat="international,"+categoryName;
    if(categoryName==="us-economy") categoryName = "US,economy";

    categoryName=cat;
}


if(categoryName==="ushome") categoryName = "US,international";
    
            
                     
    var data =[];
         for(let j=0;j<ArticleDom.length/2;j++){
           
              if(typeof(ArticleDom[j])!=undefined && ArticleDom[j].querySelector(titleClassName)!="" && ArticleDom[j].querySelector(titleClassName)!=null){
                   data.push({
                       time : Date.now(),
                       title : ArticleDom[j].querySelector(titleClassName).textContent,
                       link : ArticleDom[j].querySelector(linkClassName).href,
                       images :  typeof(ArticleDom[j].querySelector(imageClassName))==="undefined" || ArticleDom[j].querySelector(imageClassName).src.indexOf('http') ==-1 ? null : ArticleDom[j].querySelector(imageClassName).src,
                       Category:categoryName,
                       source :"Daily Mail",
                       sourceLink:"https://www.dailymail.co.uk/",
                       sourceLogo:"daily new log"
                      });
                   }
               }
                      return data;
               },Category);

               console.log(PageData)
               PageData.map(item=>{
                   AllData.push(item)
               })
       }

  
     await GetContent(page,AllData);
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


module.exports=Daily_News;