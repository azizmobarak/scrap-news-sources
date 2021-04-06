'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../../function/insertData');
const {FormatImage} = require('../../../function/FormatImage')
const {SendToServer} = require('../../../function/SendToServer')


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

var Categories=['politique','avis','économie'];

const TELQUEL = () =>{
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
    var url ="https://telquel.ma/categorie/maroc/politique";
    if(Category==="avis") url="https://telquel.ma/categorie/opinions";
    if(Category==="économie") url="https://telquel.ma/categorie/economie";
    
    try{
        await page.goto(url);
        await page.waitForSelector('footer')
        if(i==0) await page.click('#pn-show-terms');
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

                if(totalHeight >= 1000){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
    });

     await page.waitFor(3000)
    
         // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
    var images =document.querySelectorAll('.articles-list .article-image>img');
    var links = document.querySelectorAll('.articles-list .article-image');
    var titles =document.querySelectorAll('.articles-list h3');
       
         
        var data =[];

         for(let j=0;j<6;j++){

            if(typeof(titles[j])!="undefined" && links[j]!=null){
                data.push({
                    time : Date.now(),
                    title : titles[j].textContent.trim(),
                    link : links[j].href,
                    images : typeof(images[j])==="undefined" ? null : images[j].src,
                    Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                    source :"TelQuel.ma - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink:"https://www.telquel.ma",
                    sourceLogo:"https://cdn.dialy.net/png/telquel.png"
                      });
                   }
               }
                      return data;
     },Category);
            PageData.map((item,j)=>{
                item.images = FormatImage(item.images);
                setTimeout(() => {
                     SendToServer('en',item.Category,item.source,item.sourceLogo)
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

        await page.goto(url);
    
        var Content = await page.evaluate(()=>{
            try{
                // first try to get all content
                var second_text = document.querySelectorAll('#article-container p');
                var scond_content ="";
                for(let i=0;i<second_text.length;i++){
                   scond_content = scond_content +"\n"+second_text[i].textContent;
                }
                 return scond_content.trim();
             }catch{
                return null;
             }
        });

        var ContentHtml = await page.evaluate(()=>{
            try{
                return document.querySelector('#article-container').innerHTML;
             }catch{
                return null;
             }
        });

     var author = await page.evaluate(()=>{
         try{
         return document.querySelector('.author').textContent.trim();
         }catch{
             return null;
         }
     });

    
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
                contentHtml : ContentHtml
          });
       }
    }
  await InsertData(AllData_WithConetent);
}


module.exports=TELQUEL;