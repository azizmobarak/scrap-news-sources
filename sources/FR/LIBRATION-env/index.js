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

var Categories=['environment'];

const LIBRATION = () =>{
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
        await page.goto('https://www.liberation.fr/environnement/');
       // await page.click('#close-icon');
       }catch{
        await page.goto('https://www.liberation.fr/environnement/');
       // await page.click('#close-icon');
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
    var PageData = await page.evaluate((Category)=>{
               

    var titles = document.querySelectorAll('article a>h2');
    var images = document.querySelectorAll('article picture>img');
    var links = document.querySelectorAll('article div>div>a:nth-child(1)');
       
         
        var data =[];
         for(let j=0;j<3;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j==0 ? j : j+1].href,
                       images : typeof(images[j])==="undefined" ? null : images[j].src,
                       Category:Category,
                       source :"Libération",
                       sourceLink:"https://www.liberation.fr/politique",
                       sourceLogo:"https://www.liberation.fr/pf/resources/images/liberation.png?d=10"
                      });
                   }
               }
                      return data;
               },Category);
              // console.log(PageData);
               PageData.map(item=>{
                   AllData.push(item)
               })
       }}catch{
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
        //console.log(url)
    
        var Content = await page.evaluate(()=>{
        
            try{
                // first try to get all content
             var second_text = document.querySelectorAll('.article-body-wrapper p.article_link');
             var first_text = document.querySelector('.margin-md-bottom>div:nth-child(3)').textContent;

             var scond_content ="";
             for(let i=0;i<second_text.length;i++){
                scond_content = scond_content +"\n"+second_text[i].textContent;
             }
              return first_text+"\n"+scond_content;
            }catch{
                try{
                    // second try to get all content
                    var second_text = document.querySelectorAll('.article-body-wrapper p.article_link');
                    var scond_content ="";
                    for(let i=0;i<second_text.length;i++){
                        scond_content = scond_content +"\n"+second_text[i].textContent;
                    }
                     return scond_content;
                }catch{
                    // the last try will return a null content
                    return null;
                }
            }
        });

        var author = await page.evaluate(()=>{
            try{
             return document.querySelector('span.link_primary-color>span').textContent.trim();
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
  //  console.log(AllData_WithConetent)
    await InsertData(AllData_WithConetent);
}


module.exports=LIBRATION;