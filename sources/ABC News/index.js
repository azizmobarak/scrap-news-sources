const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

//block ads
puppeteer.use(AdblockerPlugin())
// stealth
puppeteer.use(puppeteer_stealth())
// captcha configuration
puppeteer.use(
    Recaptcha({
        provider: { id: '2captcha', token: process.env.KEY },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
);

//puppeteer.use(puppeteer_agent());

var Categories=['Politics','Entertainment','Technology','Health','Sports','International','Business'];

const ABC_NEWS = () =>{
    (async()=>{
       var browser =await puppeteer.launch({
        headless: false,
        timeout:50000,
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

        //navigate to category sub route
        await page.goto(['https://abcnews.go.com/','',Category].join(''));
      //  await page.waitForNavigation({ waitUntil: 'load' }) //networkidle0

        /*try{
            await page.waitForSelector(".animation-container");
        }catch(e){
        console.log(e)
        }*/

        
         // get the data from the page
         var PageData = await page.evaluate((Category)=>{

               
               // function to look for a word inside other words
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
                         if(searchIn.indexOf("hours")!=-1){
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
                   AllData.push(item)
               })
       }

     console.log(AllData);

     await browser.close();
    })();
}





module.exports=ABC_NEWS;