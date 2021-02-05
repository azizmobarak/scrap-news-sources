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

var Categories=['topics/security','topics/tech-industry','topics/internet','topics/culture','topics/mobile','topics/sci-tech','topics/computers','personal-finance/investing','health/fitness','health/healthy-eating'];

const CNET = () =>{
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
        await page.goto(["https://www.cnet.com/",'',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(["https://www.cnet.com/",'',Category].join(''));
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

           //change category name
           var cateogryName = "";
    
          if(i==9){
              cateogryName="health"
          }else{
            if(Category.indexOf("tech")!=-1){
            cateogryName = "technology";
            }else{
            cateogryName = Category.substring(Category.indexOf('/')+1,Category.length);
           }
         }
    //////////////////////////////
    

    // CBC classes by categories 
      var titleClassName=".assetBody h2";
      var linkClassName=".assetBody a";
      var imageClassName=".assetThumb>a>figure>img";

      if(cateogryName==="culture"){
           titleClassName=".assetText a";
           linkClassName=".assetText a";
           imageClassName=".assetBody>a>figure>img";
      }else{
          if(cateogryName==="investing" || cateogryName==="fitness" || cateogryName==="health"){
            titleClassName=".latestScrollItems .c-universalLatest_text h3";
            linkClassName=".latestScrollItems .c-universalLatest_text>a";
            imageClassName=".c-universalLatest_image>a>span>img";
          }
      }
    
     // change the source logo to http 
    var titles = document.querySelectorAll(titleClassName)
    var images =  document.querySelectorAll(imageClassName);
    var links = document.querySelectorAll(linkClassName);
  

         var data =[];
         for(let j=0;j<5;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined" &&  images[j].src.indexOf('http')==0 && typeof(images[j])!="undefined")
                    {
                   data.push({
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : images[j].src,
                       Category:cateogryName,
                       source :"CNET",
                       sourceLink:"https://www.cnet.com",
                       sourceLogo:"cnet logo"
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


            var text = document.querySelectorAll('.article-main-body p');
            var textArray=[];

            for(let i=0;i<text.length;i++){
                textArray.push(text[i].textContent);
                textArray.push('   ');
            }
            return textArray.join('\n');
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
                content:Content!=null ? Content : null
          });
       }
    }
    console.log(AllData_WithConetent)
}


module.exports=CNET;