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

var Categories=['world','us','politics','business','opinion','technology','science','health','sports','arts','books','style','food','travel','realestate'];

const NEWYORKTIMES = () =>{
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
        console.log(Category)
      

      try{
         //navigate to category sub route
        await page.goto(['https://www.nytimes.com/section/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.nytimes.com/section/','',Category].join(''));
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
            
    // Los Angelece News classes
    var loop=3;
    var titleClassName="#collection-highlights-container ol>li>article h2";
    var imageClassName="#collection-highlights-container ol>li>article figure img";
    var linkClassName="#collection-highlights-container ol>li>article figure a";
  
    //change category name
    var cateogryName = "";

    switch(Category){
        case 'world' : 
           cateogryName="International"
           break;

        case 'arts' :
            cateogryName="art&design";
            break;

        case "food" :
            cateogryName="food&drink"
            break;

        case "style" :
            cateogryName="life&style"
            break;

        case 'realestate' :
             cateogryName="business";
           break;

        default :
           cateogryName=Category;
        
    }
      
    //////////////////////////////

      // all elements
      var titles = document.querySelectorAll(titleClassName);
      var images = document.querySelectorAll(imageClassName);
      var links = document.querySelectorAll(linkClassName);

      ////////////////////////////////////

         var data =[];
         for(let j=0;j<loop;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined" && typeof(images[j])!="undefined" && images[j]!="")
                    {
                   data.push({
                      time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : images[j].src,
                       Category: cateogryName,
                       source :"The NEW YORK TIMES",
                       sourceLink:"https://www.nytimes.com",
                       sourceLogo:"NYTIMES logo"
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
     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;
        console.log(url);

        await page.setJavaScriptEnabled(false);

        try{
            await page.goto(url);
        }catch{
            await page.goto(url);
        }

    
        var Content = await page.evaluate(()=>{
           try{
            var text = document.querySelectorAll('.meteredContent p');
            var textArray=[];
            for(let i=0;i<text.length-1;i++){
                textArray.push(text[i].textContent);
                textArray.push('   ');
            }
            return textArray.join('\n');
           }catch{
            return null;
           }
        });
    

    if(item.images!=null && item.images!="" && Content!=null && Content!=""){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.images,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                content:Content!=null ? Content : null
          });
       }
    }
    
    console.log(AllData_WithConetent)
}


module.exports=NEWYORKTIMES;