'use strict';

const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const {InsertData} = require('../../function/insertData');
const {FormatImage} = require('../../function/formatimage');
const {SendToServer} = require('../../function/sendtoserver');

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

var Categories=['fútbol'];

const MARCA = () =>{
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
        await page.goto('https://www.marca.com/en/football/international-football.html?intcmp=MENUPROD&s_kw=english-international-football');
       }catch{
        await page.goto('https://www.marca.com/en/football/international-football.html?intcmp=MENUPROD&s_kw=english-international-football');
       }
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0

    
         // get the data from the page
    var PageData = await page.evaluate((Category)=>{
               

    var titles = document.querySelectorAll('.auto-items>li>article>header>h3');
    var images =document.querySelectorAll('.auto-items>li>article>figure>a>img')
    var links = document.querySelectorAll('.auto-items>li>article>figure>a')
       
         
        var data =[];
         for(let j=0;j<(titles.length/2)-3;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined"){
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent,
                       link : links[j].href,
                       images : typeof(images[j])==="undefined" ? null : images[j].src,
                       Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                       source :"MARCA - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                       sourceLink:"https://www.marca.com",
                       sourceLogo:"https://e00-marca.uecdn.es/assets/v16/img/destacadas/marca__logo-generica.jpg"
                      });
                   }
               }
                      return data;
               },Category);
             //  console.log(PageData);
               PageData.map((item,j)=>{
                item.images = FormatImage(item.images);
                setTimeout(() => {
                     SendToServer('es',item.Category,item.source,item.sourceLogo)
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
           console.log(e)
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
            try{
            try  {
               var text = document.querySelectorAll(".ue-c-article__body p");
                var cont="";
                for(let i=0;i<text.length;i++){
                 cont=cont+"\n"+text[i].textContent;
                }
                return cont;
            }catch{
                var text = document.querySelectorAll(".content>p");
                var cont="";
                for(let i=0;i<text.length;i++){
                 cont=cont+"\n"+text[i].textContent;
                }
                return cont;
            }
            }catch{
                return null;
            }
        });

        var contenthtml = await page.evaluate(()=>{
            try{
                try {
                    return document.querySelector('.ue-c-article__body').innerHTML;
                }catch {
                    return document.querySelector(".content").innerHTML;
                }
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
                author : null,
                content:Content,
                contenthtml : contenthtml
          });
       }
    
    }
  //  console.log(AllData_WithConetent)
    await InsertData(AllData_WithConetent);
}


module.exports=MARCA;