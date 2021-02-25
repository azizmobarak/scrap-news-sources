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

var Categories=['worldnews','israel','china','nigeria','turkey','coronavirus','royals','crime','ushome','us-economy','sport/football','sport/fa_cup','sport/champions_league','sport/transfernews','sport/boxing','sport/rugbyunion','sport/golf','sport/cricket','sport/formulaone','sport/tennis','sport/mma','sport/racing','usshowbiz','tvshowbiz/the-masked-singer-uk','arts','auhome','breaking_news','new_zealand','femail','femail/food','best-buys','health','world-health-organization','sciencetech/nasa','sciencetech/apple','sciencetech/twitter','money/markets','money/saving','money/investing','money/bills','money/cars','money/holidays','money/cardsloans','money/pensions','money/mortgageshome','travel/escape','travel/destinations','tvshowbiz'];


const Daily_News = () =>{
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
// boucle on categories started 
for(let i=0;i<Categories.length;i++){

        //get the right category by number
        var Category = Categories[i]
        //navigate to category sub route

        var URL = 'https://www.dailymail.co.uk/news/';

        if(Category.indexOf('sport')!=-1 || Category==="auhome" || Category==="usshowbiz" ||
           Category==="tvshowbiz/the-masked-singer-uk" || Category==="usshowbiz" || 
           Category.indexOf('femail')!=-1 || Category==="best-buys" || Category==="health" ||
           Category.indexOf('sciencetech')!=-1 || Category.indexOf('money')!=-1 || 
           Category==="tvshowbiz" || Category.indexOf('travel')!=-1
        ){
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
    var ImageData=true;


if(categoryName==="worldnews"){
    categoryName="international";
}

if(categoryName==="israel" || categoryName==="china" || 
    categoryName==="nigeria" || categoryName==="turkey" || 
    categoryName==="coronavirus" || categoryName==="crime" || 
    categoryName==="royals" || categoryName==="us-economy" ||
    categoryName==="tvshowbiz/the-masked-singer-uk" ||
    categoryName==="arts" ||  categoryName==="new_zealand" ||
    categoryName==="breaking_news" || categoryName==="femail/food" ||
    categoryName==="world-health-organization" || categoryName==="sciencetech/nasa" ||
    categoryName==="sciencetech/apple" || categoryName==="sciencetech/twitter" ||
    categoryName==="money/markets"   || categoryName==="best-buys"
    )
    {
    ArticleDom=document.querySelectorAll('.article-small');
   
    if(categoryName==="crime") categoryName = "safety";
    if(categoryName==="royals") categoryName = "UK";
    if(categoryName==="china"|| categoryName==="israel" || categoryName==="nigeria" || categoryName==="turkey") categoryName="international";
    if(categoryName==="us-economy") categoryName = "economy";
    if(categoryName==="coronavirus") categoryName="health,"+categoryName;
    if(categoryName==="tvshowbiz/the-masked-singer-uk") categoryName="UK";
    if(categoryName.indexOf('food')!=-1) categoryName="food";
    if(categoryName.indexOf('sciencetech')!=-1) categoryName="science";
    if(categoryName.indexOf('best-buys')!=-1) categoryName="shopping";
    if(categoryName==="world-health-organization") categoryName="health";
    if(categoryName==="breaking_news") categoryName="international";
    if(categoryName==="arts") categoryName="art&design";

    ImageData=false;
}


if(categoryName==="ushome") categoryName = "US";
if(categoryName==="femail") categoryName = "women";
if(categoryName==="auhome") categoryName = "AU";
if(categoryName.indexOf('money')!=-1) categoryName="money";
if(categoryName==="money/markets") categoryName="market";
if(categoryName==="money/investing") categoryName="investing";
if(categoryName.indexOf('travel')!=-1) categoryName="travel";


if(categoryName.indexOf('sport')!=-1){

    var subCategory = categoryName.substring(categoryName.indexOf('/')+1,categoryName.length);
    
    if(subCategory==="fa_cup" || subCategory==="champions_league" || subCategory==="transfernews"){
      ArticleDom=document.querySelectorAll('.article-small');
      ImageData=true;
      categoryName="football"
    }else{
        if(subCategory==="rugbyunion") categoryName="rugby";
       else{
        if(subCategory==="mma") categoryName="sport";
        else{
            categoryName="sport";
        }
       }
    }
    
}
    
            
                     
    var data =[];
         for(let j=0;j<(ArticleDom.length>4? 4 : ArticleDom.length);j++){
           
              if(typeof(ArticleDom[j])!=undefined && ArticleDom[j].querySelector(titleClassName)!="" && ArticleDom[j].querySelector(titleClassName)!=null){
                   data.push({
                       time : Date.now(),
                       title : ArticleDom[j].querySelector(titleClassName).textContent,
                       link : ArticleDom[j].querySelector(linkClassName).href,
                       images :  typeof(ArticleDom[j].querySelector(imageClassName))==="undefined" ? null : ImageData==false ?  ArticleDom[j].querySelector(imageClassName).src : (j==0 ? ArticleDom[j].querySelector(imageClassName).src : (typeof( ArticleDom[j].querySelector(imageClassName).dataset.src)!="undefined" ?  ArticleDom[j].querySelector(imageClassName).dataset.src :  ArticleDom[j].querySelector(imageClassName).src) ),
                       Category:categoryName,
                       source :"Daily Mail",
                       sourceLink:"https://www.dailymail.co.uk/",
                       sourceLogo:"daily new log"
                      });
                   }
               }
                      return data;
               },Category);

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
    
        var Content = await page.evaluate(()=>{
            var text = document.querySelectorAll('.mol-para-with-font');
            var content="";
            for(let i=0;i<text.length;i++){
               content = content +" \n "+text[i].textContent;
            }
            return content;
        });

        var author = await page.evaluate(()=>{
           try{
            const auth =document.querySelector('.author-section').textContent.split(' ');
            return auth[1]+" "+auth[2];
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
   // console.log(AllData_WithConetent);
    await InsertData(AllData_WithConetent);
}


module.exports=Daily_News;