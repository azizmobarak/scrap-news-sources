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

var Categories=['markets','technology','opinion','businessweek','new-economy-forum'];

const Bloomberg = () =>{
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
        await page.goto(['https://www.bloomberg.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.bloomberg.com/','',Category].join(''));
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
    
    // bloomberg serction one
     // change the source logo to http 
    var titles = document.querySelector('.single-story-module__headline-link');
    var images = document.querySelector('.single-story-module img');
    var time = document.querySelector('.single-story-module time');
    var link = document.querySelector('.single-story-module a')
    

    if(i==2 || i==3 || i==4){
        time.textContent="minute";
    }

    //change category name
    var cateogryName = "";
    
    switch(Category){
        case "businessweek":
           cateogryName="Business"
            break;
        case "new-economy-forum" :
            cateogryName="Economy"
            break;
        default :
             cateogryName =Category
             break;
    }
    //////////////////////////////

         var data =[];

         for(let j=0;j<1;j++){
           
              if(WordExist(time==null ? "nothing" : time.textContent)==true && titles!=null)
                    {
                   data.push({
                       time : Date.now(),
                       title : titles.textContent.trim(),
                       link : link.href,
                       images : typeof(images)!="undefined" ? images.src : null,
                       Category:cateogryName,
                       source :"Bloomberg",
                       sourceLink:"https://www.bloomberg.com/",
                       sourceLogo:"bloomberg logo"
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
      console.log(AllData);
  
     await GetContent(page,AllData);
     await page.waitFor(20000);
     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;
       // console.log(url);

        await page.goto(url);

    
        var Content = await page.evaluate(()=>{


            var text = document.querySelectorAll('div.body-copy-v2.fence-body p');
            var textArray=[];

            for(let i=0;i<text.length;i++){
                textArray.push(text[i].textContent);
                textArray.push('   ');
            }
            return textArray.join('\n');
        });
    
        var author = await page.evaluate(()=>{
               try{
                return document.querySelector('.lede-text-v2__byline').textContent.split('\n')[1].trim();
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
                author:author,
                content:Content!=null ? Content : null
          });
       }
    }
    
    console.log(AllData_WithConetent)
}


module.exports=Bloomberg;