const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../function/insertData');
const {SendToServer} = require('../../function/sendToserver');
const {FormatImage} = require('../../function/formatImage');

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
      

      try{
         //navigate to category sub route
        await page.goto(['https://www.nbcnews.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.nbcnews.com/','',Category].join(''));
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }

      // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
    var articles=document.querySelectorAll('article');
    var titleClassName="h2:nth-child(1)";
    var linkClassName="a";
    var imageClassName="img";
  
  
    
    var loop=3;
    //change category name
    var categoryName = "";
    
    if(Category==="health/coronavirus"){
        categoryName="health";
    }else{
        if(Category==="think"){
            categoryName = "opinion";
        }else{

       if(Category==="politics"){ categoryName="politic"; }
       else{
        if(Category==="world"){ categoryName="international";loop=2;}
       else{
          categoryName=Category;
         }
}
            
        }
    }

      ///////////////////////////////////////

         var data =[];
         for(let j=0;j<loop;j++){
           
              if(articles[j].querySelector(titleClassName)!=null && articles[j].querySelector(linkClassName)!=null)
                    {
                   data.push({
                       time : Date.now(),
                       title :articles[j].querySelector(titleClassName).textContent.trim(),
                       link : articles[j].querySelector(linkClassName).href,
                       images :articles[j].querySelector(imageClassName)!=null ? articles[j].querySelector(imageClassName).src : null,
                       Category:categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                       source :"MSNBC - "+categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                       sourceLink:"https://www.nbcnews.com/",
                       sourceLogo:"https://png.pngitem.com/pimgs/s/488-4884737_msnbc-news-cnbc-logo-png-transparent-png.png"
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
       }
  
     await GetContent(page,AllData);
     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;

        try{
            await page.goto(url);
           }catch{
            i++;
            var item = data[i];
            var url = item.link;
            console.log(url)
            await page.goto(url);
           }
    

    
        var Content = await page.evaluate(()=>{
           try{
            var text = document.querySelector('.article-body__content').innerText;
            return text;
           }catch{
               return null
           }
        });

        var contenthtml = await page.evaluate(()=>{
            try{
                var text = document.querySelector('.article-body__content').innerHTML;
                return text;
            }catch{
               return null
            }
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
                content:Content!=null ? Content : null,
                contenthtml : contenthtml
          });
       }
    }
    await InsertData(AllData_WithConetent);
}


module.exports=MSNBC;
