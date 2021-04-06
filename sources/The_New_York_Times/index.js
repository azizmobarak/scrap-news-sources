const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../function/insertData');
const {FormatImage} = require('../../function/FormatImage');
const {SendToServer} = require('../../function/SaveToServer');


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
    var cateogryName = Category;

    switch(Category){
        case 'world' : 
           cateogryName="international"
           break;

        case 'arts' :
            cateogryName="art&design";
            break;

        case "food" :
            cateogryName="food"
            break;

        case "style" :
            cateogryName="life&style"
            break;

        case 'realestate' :
             cateogryName="business";
           break;
       case 'politics' :
             categoryName="politic"
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
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined" || cateogryName!="")
                    {
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images :typeof(images[j])!="undefined" ? images[j].src : null,
                       Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                       source :"NYT "+cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                       sourceLink:"https://www.nytimes.com",
                       sourceLogo:"https://static.squarespace.com/static/5321a303e4b0ec6cd1a61429/533da9bbe4b0e2847b2313da/533da9bee4b0e2847b231954/1375473510683/1000w/101065_300.jpg"
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
       }}catch{
        await browser.close();
         }
  
       try{await GetContent(page,AllData);}catch{await browser.close();}

     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;

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

        var ContentHtml = await page.evaluate(()=>{
            try{
                return document.querySelector('.meteredContent').innerHTML;
               }catch{
                return null;
               }
        })

        var author = await page.evaluate(()=>{
            try{
                return document.querySelector('.last-byline').textContent;
            }catch{
                return null;
            }
        })
    

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
                author:author,
                content:Content!=null ? Content : null,
                contetHtml : ContentHtml,
          });
       }
    }
    
    await InsertData(AllData_WithConetent);
}


module.exports=NEWYORKTIMES;
