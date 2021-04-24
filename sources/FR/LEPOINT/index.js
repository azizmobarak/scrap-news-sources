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

var Categories=['politique','international','science','technologie'];

const LEPOINT = () =>{
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
    var url ="https://www.lepoint.fr/politique/";

    if(Category==="international") url ="https://www.lepoint.fr/monde/";
    if(Category==="science") url="https://www.lepoint.fr/sciences-nature/";
    if(Category==="technologie") url="https://www.lepoint.fr/high-tech-internet/";

    try{
        await page.goto(url);
       // await page.click('.iubenda-cs-accept-btn')
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
    var images = "img";
    var links = "figure>a";
    var titles = "h2";
       
         
        var data =[];
         for(let j=0;j<5;j++){
           
              if(typeof(article[j].querySelector(titles))!="undefined" && article[j].querySelector(links)!=null){
                   data.push({
                       time : Date.now(),
                       title : article[j].querySelector(titles).textContent.trim(),
                       link : j==0 ? article[j].querySelector("a").href : article[j].querySelector(links).href,
                       images : typeof(article[j].querySelector(images))==="undefined" ? null : article[j].querySelector(images).src ,
                       Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                       source :"Le Point - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                       sourceLink:"https://www.lepoint.fr/",
                       sourceLogo:"https://www.lebal.paris/wp-content/uploads/2018/07/18117-1.jpg"
                      });
                   }
               }
                      return data;
     },Category);
           console.log(PageData);
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

        try{
             console.log(url)
            await page.goto(url);
           }catch{
            i++;
            var item = data[i];
            var url = item.link;
            console.log(url)
            await page.goto(url);
           }
    
        var Content = await page.evaluate(()=>{
        
            try{
                // first try to get all content
             var second_text = document.querySelectorAll('.ArticleBody p');
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
             return document.querySelector('.ArticleBody').innerHTML
            }catch{
               return null;
            }
        });

        var author = await page.evaluate(()=>{
            try{
                var authr =document.querySelector('.SigatureAuthorNames>span>a').textContent.trim()
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
                content:Content,
                contenthtml:contenthtml
          });
       }
    
    }
  console.log(AllData_WithConetent)
  await InsertData(AllData_WithConetent);
}


module.exports=LEPOINT;