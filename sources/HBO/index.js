const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

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

var Categories=['series']; //movies

const HBO = () =>{
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
        console.log(Category)
      

      try{
         //navigate to category sub route
        await page.goto(['https://www.hbo.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.hbo.com/','',Category].join(''));
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
         await page.solveRecaptchas();
         await Promise.all([
             page.waitForNavigation(),
             page.click(".g-recaptcha"),
             await page.$eval('input[type=submit]', el => el.click())
         ]);
    }

      // get the data from the page
     var PageData = await page.evaluate((Category)=>{
               
              
    // HBO Classes
      var titleClassName=".swiper-wrapper a>div";
      var linkClassName=".swiper-wrapper a";
      var imageClassName=".swiper-wrapper a>img";
      var contentClassName=".swiper-wrapper p";

  
       // get lists
       var titles = document.querySelectorAll(titleClassName);
       var links = document.querySelectorAll(linkClassName);
       var images = document.querySelectorAll(imageClassName);
       var content = document.querySelectorAll(contentClassName);
    
   

         var data =[];
         for(let j=0;j<3;j++){
           
              if(typeof(content[j])!="undefined" && typeof(links[j])!="undefined" && typeof(titles[j])!="undefined" &&  images[j].src.indexOf('http')==0 && typeof(images[j])!="undefined")
                    {
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : images[j].src,
                       Category:Category,
                       source :"HBO",
                       sourceLink:"https://www.hbo.com/",
                       sourceLogo:"HBO logo",
                       content : content[j].textContent
                    });
                   }
               }
                      return data;
               },Category);

               console.log(PageData);
               PageData.map(item=>{
                   AllData.push(item)
               });
       }

       // result final with small content description
     // ==> console.log(AllData);
  
     await browser.close();
    })();
}



module.exports=HBO;