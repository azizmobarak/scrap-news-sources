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

var Categories=['politics','media','opinion','economy','markets','technology','entertainment','sports','lifestyle','health','security','computers','video-games','science','us','movies'];

const FOXNEWS = () =>{
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
try{
for(let i=0;i<Categories.length;i++){

        //get the right category by number
        var Category = Categories[i]
        console.log(Category)
        var url="";
      
        // switch url depending on categories
        if(Category==="economy" || Category==="markets" || Category==="technology"){
           url = "https://www.foxbusiness.com/";
        }else{
            if(Category==="security" || Category==="computers" || Category==="video-games"){
                url ="https://www.foxnews.com/category/tech/topics/";
            }
          else{
              if(Category==="movies"){
                  url="https://www.foxnews.com/category/entertainment/";
              }else{
                  url="https://www.foxnews.com/";
              }
            }
        }
      // ------------------------------------------------------------

      try{
         //navigate to category sub route
        await page.goto([url,'',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto([url,'',Category].join(''));
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
                        if(searchIn.startsWith("1 hour")!=false || searchIn.startsWith("an hour")!=false){
                          return true;
                         }else{
                            return false;
                        }
                  }
            }
        }
    }
    }
 
    
     // Fox classes
      var titleClassName=".article h4.title";
      var linkClassName=".article h4.title a";
      var imageClassName=".article-list .article a>img";
      var timeClassName=".article-list .article span.time";

      if(Category==="economy" || Category==="markets" || Category==="technology"){
          titleClassName=".collection-river .article h3.title";
          linkClassName=".collection-river .article h3.title>a";
          imageClassName=".collection-river .article a>picture>img";
          timeClassName=".collection-river .article time.time";
      }else{
          if(Category==="lifestyle"){
              Category="life&style"
          }else{
              if(Category==="politics"){
                  Category="politic"
              }
              else{
                  if(Category==="sports"){
                    Category="sport"
                }
              }
          }
      }

     // get lists
      var titles = document.querySelectorAll(titleClassName);
      var links = document.querySelectorAll(linkClassName);
      var images = document.querySelectorAll(imageClassName);
      var time = document.querySelectorAll(timeClassName);

      // collect data in data table

         var data =[];
         for(let j=0;j<images.length;j++){
           
              if(WordExist(typeof(time[j])=="undefined" ? "nothing" : time[j].textContent)==true && typeof(time[j])!="undefined" && typeof(titles[j])!="undefined" &&  images[j].src.indexOf('http')==0)
                    {
                   data.push({
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images :typeof(images[j])!="undefined" ? images[j].src : null,
                       Category:Category,
                       source :"FoxNews Channel_"+Category,
                       sourceLink:"https://www.foxnews.com",
                       sourceLogo:"https://pbs.twimg.com/profile_images/918480715158716419/4X8oCbge_400x400.jpg"
                    });
                   }
               }
                      return data;
               },Category);
    
               PageData.map(item=>{
                console.log(item.Category);
                   AllData.push(item)
               });
       }
    }catch{
        await browser.close();
       }
     try{
        await GetContent(page,AllData);
     }catch{
        await browser.close();
     }
     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;


        await page.goto(url);
      //  console.log(url)

    
        var Content = await page.evaluate(()=>{
           try{
            var text = document.querySelectorAll('.article-content p');
            var textArray=[];

            for(let i=1;i<text.length;i++){
                textArray.push(text[i].textContent);
                textArray.push(' ');
            }
            return textArray.join(' ').replaceAll('\n','  ');
           }catch{
             return null;
           }
        });

        var ContentHTML = await page.evaluate(()=>{
           try {
            return document.querySelector('.article-content').innerHTML;
           }catch{
            return null;
           }
        });

        var Author = await page.evaluate(()=>{
            var auth = document.querySelector('.author-byline span>span>a');
            if(typeof auth !="undefined" && auth!=null){
                if(auth.textContent.indexOf('Content provided')!=-1){
                    return null;
                }
                return auth.textContent;
            }else{
                return null;
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
                author : Author,
                content:Content.substring(0,3000),
                contentHTML : ContentHTML
          });
       }
    }
   //console.log(AllData_WithConetent) 
   await InsertData(AllData_WithConetent);
}


module.exports=FOXNEWS;