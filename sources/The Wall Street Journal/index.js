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

var Categories=['us','economy','technology','opinion','realestate','world','politics','business','markets','life-arts','types/asia-news','types/china-news','types/latin-america-news','economy','types/africa-news','types/canada-news','types/middle-east-news'];

const WALLSTREET = () =>{
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
        await page.goto(['https://www.wsj.com/news/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.wsj.com/news/','',Category].join(''));
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
            
    var loop=1;
    var condition=false;

    // Los Angelece News classes
    var titleClassName="#main #top-news article>div>h2";
    var imageClassName="#main #top-news article>div>a>img";
    var linkClassName="#main #top-news article>div>a";


     // all elements
     var titles = document.querySelectorAll(titleClassName);
     var images = document.querySelectorAll(imageClassName);
     var links = document.querySelectorAll(linkClassName);

  
    //change category name
    var cateogryName = "";

    switch(Category){
        case 'world' : 
           cateogryName="International"
           break;

        case 'life-arts' :
            cateogryName="art&design";
            break;

        case 'realestate' :
             cateogryName="business";
           break;

        default :
           if(Category.indexOf('asia')!=0){
               cateogryName="International";
           }else{
              if(cateogryName.indexOf('africa')){
                  categoryName="International";
              }else{
                  if(categoryName.indexOf('china')!=-1){
                      categoryName='International';
                  }else{
                      if(categoryName.indexOf('america')){
                          categoryName="International";
                      }else{
                          if(categoryName.indexOf('middle-east')!=-1){
                              categoryName="International";
                          }else{
                              if(categoryName.indexOf('canada')=-1){
                                 categoryName="canada";
                              } else{
                                cateogryName=Category;
                              }
                          }
                      }
                  }
              }
           }
        
    }
      
    //////////////////////////////

    // change selectors for some categories 
    if(Category==="technology" || Category.indexOf('type')!=-1 || Category==="opinion" || Category==="politics" || Category==="business" || Category==="markets"){
       
        var arr_images =[];
        var arr_titles =[];
        var arr_links =[];

        var inDom =document.querySelectorAll('#main article');

        for(let d=0;d<4;d++){
            if(inDom[d].querySelector('img')!=null){
                arr_images.push(inDom[d]);
                arr_titles.push(inDom[d]);
                arr_links.push(inDom[d]);
            }
        }
        
         titles=arr_titles;
         images=arr_images;
         links=arr_links;

         loop=3;
         condition=true;
    }else{
        loop =1;
        condition=false;
    }

     
      ////////////////////////////////////

         var data =[];
         for(let j=0;j<loop;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined" && typeof(images[j])!="undefined" && images[j]!="")
                    {
                   data.push({
                      time : Date.now(),
                       title : condition==true ? titles[j].querySelector('h3').textContent.trim() :  titles[j].textContent.trim(),
                       link : condition==true ? links[j].querySelector('a').href : links[j].href,
                       images :  condition==true ? images[j].querySelector('img').src :  images[j].src,
                       Category: cateogryName,
                       source :"The WALL STREET JOURNAL",
                       sourceLink:"https://www.wsj.com",
                       sourceLogo:"Wallstreet logo"
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
            var text = document.querySelectorAll('.snippet div+div+div+div p');
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


module.exports=WALLSTREET;