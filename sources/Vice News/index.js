const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../function/insertData');


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


var Categories=['world','health','entertainment','travel','sex','tech','food','money','environment'];

const VICENEWS = () =>{
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
        await page.goto(['https://www.vice.com/en/section/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.vice.com/en/section/','',Category].join(''));
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
         await page.solveRecaptchas();
         await Promise.all([
             page.waitForNavigation(),
             page.click(".g-recaptcha"),
             await page.$eval('input[type=submit]', el => el.click())
         ]);
    }

    try {
     // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
            
    // Los Angelece News classes
    var loop=3;
    var start=0;

    var titleClassName=".vice-card h3.vice-card-hed";
    var linkClassName=".vice-card h3.vice-card-hed a";
    var imageClassName=".vice-card .vice-card-image__placeholder-image picture>source+source+source";
    var authorClassName=".vice-card .vice-card-details__byline";

    
    // all elements
    var titles = document.querySelectorAll(titleClassName);
    var images = document.querySelectorAll(imageClassName);
    var links = document.querySelectorAll(linkClassName);
    var authors = document.querySelectorAll(authorClassName);
  
    //change category name
    var cateogryName = Category;
    
       if(Category==="world"){
           cateogryName="International"
       }else{
           if(Category==="sex"){
               cateogryName="health,love"
           }
       }
    //////////////////////////////

         var data =[];
         for(let j=start;j<loop;j++){
             var type="article";
            
             if(links[j].href.indexOf('video')!=-1){
                type = "video";
            }
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined")
                    {
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images :type==="article" ? (typeof(images[j])!="undefined" ? images[j].srcset.substring(0,images[j].srcset.indexOf('*')-1) : null) : links[j].href,
                       Category: cateogryName,
                       source :"VICE news",
                       sourceLink:"https://www.vice.com/",
                       sourceLogo:"vice news logo",
                       author:typeof(authors[j])!="undefined" ? authors[j].textContent : null,
                       type:type     
                    });
                   }
              }
                      return data;
               },Category);

               console.log(PageData);
               PageData.map(item=>{
                   AllData.push(item)
               });

            }catch{
             i=i-1;
             console.log('try again')
            }

              
       }
     // console.log(AllData);
  
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
            var text = document.querySelector('.article__body-components').textContent
            return text;
           }catch{
            return null;
           }
        });


    var imageItem="";
     if(item.images==="" || item.images.length==0){
        imageItem= await page.evaluate(()=>{
        try{
            var img = document.querySelector('picture source').srcset;
            return img.substring(0,img.indexOf('*')-1);
         }catch{
            return null;
        }
      });
     }
    

    if(((Content!=null && Content!="") && item.type==="article")){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : imageItem,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                author : item.author,
                type : item.type,
                content:Content!=null ? Content : null
          });
       }
    }
    
    await InsertData(AllData_WithConetent);
}


module.exports=VICENEWS;