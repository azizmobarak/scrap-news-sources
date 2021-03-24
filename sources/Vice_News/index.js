const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../function/insertData');


//block ads
puppeteer.use(AdblockerPlugin());
// stealth
puppeteer.use(puppeteer_stealth());


puppeteer.use(puppeteer_agent());


var Categories=['entertainment','world','health','travel','sex','tech','food','money','environment'];

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
try{ 
// boucle on categories started 
for(let i=0;i<1;i++){

        //get the right category by number
        var Category = Categories[parseInt(Math.random()*9)]
        console.log(Category)
      
      
    try{
         //navigate to category sub route
        await page.goto(['https://www.vice.com/en/section/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.vice.com/en/section/','',Category].join(''));
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }


await page.evaluate(()=>{

    var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(async() => {
            var scrollHeight = document.body.scrollHeight;
           window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= 4000){
                clearInterval(timer);
                resolve();
            }
        }, 100);
});

 await page.waitFor(6000)

try {
     // get the data from the page
var PageData = await page.evaluate((Category)=>{
                     
    var article = document.querySelectorAll('.vice-card');
    var titleClassName="h3";
    var linkClassName="a";
    var imageClassName="picture>source+source+source";
    var authorClassName=".vice-card-details__byline";

  
    //change category name
    var cateogryName = Category;
    
       if(Category==="world"){
           cateogryName="international"
       }else{
           if(Category==="sex"){
               cateogryName="health"
           }
       }

     //////////////////////////////

         var data =[];
         for(let j=0;j<4;j++){
           
              if(typeof(article[j])!="undefined" && article[j].querySelector(titleClassName)!=null && article[j].querySelector(linkClassName)!=null)
                    {
                   data.push({
                       time : Date.now(),
                       title : article[j].querySelector(titleClassName).textContent.trim(),
                       link :article[j].querySelector(linkClassName).href,
                       images : article[j].querySelector(imageClassName)!=null ? article[j].querySelector(imageClassName).srcset.substring(0,article[j].querySelector(imageClassName).srcset.indexOf('*')-1) : null,
                       Category: cateogryName,
                       source :"VICENEWS "+cateogryName,
                       sourceLink:"https://www.vice.com",
                       sourceLogo:"vice news logo",
                       author:article[j].querySelector(authorClassName)!=null ? article[j].querySelector(authorClassName).textContent : null,  
                    });
                   }
              }
                      return data;
               },Category);
               console.log(PageData)
               PageData.map(item=>{
                   AllData.push(item)
               });

            }catch(e){
            console.log(e);
             i=i-1;
            }

              
       }}catch(e){  console.log(e); await browser.close();  }
  
try{await GetContent(page,AllData);}catch(e){await browser.close();}

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
    

    if((Content!=null && Content!="")){
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
                type : "Article",
                content:Content!=null ? Content : null
          });
       }
    }
    
   // console.log(AllData_WithConetent)
   await InsertData(AllData_WithConetent);
}


module.exports=VICENEWS;
