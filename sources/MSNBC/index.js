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

var Categories=['politics','health/coronavirus','business','think','world'];

const MSNBC = () =>{
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
        await page.goto(['https://www.nbcnews.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.nbcnews.com/','',Category].join(''));
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
    var loop=0;

    var titleClassName="div.layout-grid-item .multi-up__content h2.tease-card__headline";
    var linkClassName="div.layout-grid-item .multi-up__content .multi-up__article article>.tease-card__picture>a";
    var imageClassName="div.layout-grid-item .multi-up__content .multi-up__article article>.tease-card__picture img";
  
  
    
    //change category name
    var cateogryName = "";
    
    if(Category==="health/coronavirus"){
        cateogryName="health";
        imageClassName=".cover-spread-tease .cover-spread-tease--null .cover-spread-tease__image img";
        titleClassName=".cover-spread-tease__text-wrapper h3.cover-spread-tease__headline";
        linkClassName=".cover-spread-tease .cover-spread-tease--null .cover-spread-tease__image a";
        loop=3;
    }else{
        if(Category==="think"){
            cateogryName = "opinion";
            imageClassName=".lazyload-wrapper img";
            titleClassName=".lead-one-up__info h2.lead-one-up__title";
            linkClassName=".lead-one-up__info h2.lead-one-up__title a";
            loop=1;
        }else{

       if(Category==="politics"){ categoryName="politic";loop=3; }
       else{
        if(Category==="world"){ categoryName="international";loop=3;}
       else{
          categoryName=Category;
          loop=3;
         }
}
            
        }
    }
    //////////////////////////////

      // change the source logo to http 
      var titles = document.querySelectorAll(titleClassName);
      var images = document.querySelectorAll(imageClassName);
      var links = document.querySelectorAll(linkClassName);

      ///////////////////////////////////////

         var data =[];
         for(let j=0;j<loop;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined")
                    {
                   data.push({
                       time : Date.now(),
                       title :typeof(images[j])!="undefined" ? titles[j].textContent.trim() : null,
                       link : links[j].href,
                       images :typeof(images[j])!="undefined" ? images[j].src : null,
                       Category:cateogryName,
                       source :"MSNBC NEWS",
                       sourceLink:"https://www.nbcnews.com/",
                       sourceLogo:"https://png.pngitem.com/pimgs/s/488-4884737_msnbc-news-cnbc-logo-png-transparent-png.png"
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

        try{
            await page.goto(url);
        }catch{
            await page.goto(url);
        }

    
        var Content = await page.evaluate(()=>{
            var text = document.querySelector('.article-body__content').innerText;
            return text;
        });
    

    if(Content!=null && Content!="" && item.title!=null){
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
    
    await InsertData(AllData_WithConetent);
}


module.exports=MSNBC;
