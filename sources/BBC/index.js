const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

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

var Categories=['coronavirus','world','UK','business','technology','science_and_environment','stories','entertainment_and_arts','health'];

const BBC = () =>{
    (async()=>{
       var browser = await puppeteer.launch({
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
        //navigate to category sub route
        await page.goto(['https://www.bbc.com/news/','',Category].join(''));
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0

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
    var titleClassName="h3.gs-c-promo-heading__title";
    var linkClassName=".gs-c-promo-body>div>a.gs-c-promo-heading";
    var imageClassName="div.gs-c-promo-image>div>div>img";
    var timeClassName="time.gs-o-bullet__text>span";
   // var authorClassName=".vice-card .vice-card-details__byline";

   if(Category==="coronavirus" || Category==="stories" || Category==="UK"){
    titleClassName="h3.gs-c-promo-heading__title";
    linkClassName="a.gs-c-promo-heading";
    imageClassName=".gs-o-media-island img";
    timeClassName=".gs-c-timestamp";
   }
    
     
    var titles = document.querySelectorAll(titleClassName);
    var images = document.querySelectorAll(imageClassName); //.gs-o-media-island>div>img
    var time = document.querySelectorAll(timeClassName);
    var link = document.querySelectorAll(linkClassName);


    var categoryName=Category;

    if(categoryName==="coronavirus"){
        categoryName="Health";
    }else{
        if(categoryName==="world"){
            categoryName="International";
        }else{
            if(categoryName==="science_and_environment"){
                categoryName="Science,Environment";
            }else{
                if(categoryName==="entertainment_and_arts"){
                    categoryName="Entertainment,Art&Design";
                }
            }
        }
    }
                     
         var data =[];
         for(let j=0;j<4;j++){
           
              if((WordExist(typeof(time[j])=="undefined" ? "nothing" : time[j].textContent)==true)  && typeof(titles[j])!="undefined" && images[j].src.indexOf('http')==0  && typeof(link[j])!="undefined")
                    {
                   data.push({
                       time :Date.now(),
                       title : titles[j].textContent,
                       link : link[j].href,
                       images :typeof(images[j])!="undefined" ? images[j].src : null,
                       Category:categoryName,
                       source :"BBC NEWS",
                       sourceLink:"https://bbc.com",
                       sourceLogo:"logo",
                       type:"article",
                       author:null
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
       // console.log(url);

        await page.goto(url);

        var Content = await page.evaluate(()=>{
            try{
                var text = document.querySelectorAll('.ssrcss-5h7eao-ArticleWrapper p');

                var allcontent ="";
                for(let k=1;k<text.length;k++){
                 if(text[k].textContent!=""){
                     allcontent = allcontent + "\n" + text[k].textContent
                 }
               }
               return allcontent;
            }catch{
               try{
                return document.querySelector('.ssrcss-5h7eao-ArticleWrapper').textContent.substring(100,1100);
               }catch{
                return null;
               }
            }
        });
    
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
                content:Content
          });
       }
    
    }
    
    console.log(AllData_WithConetent)
}


module.exports=BBC;