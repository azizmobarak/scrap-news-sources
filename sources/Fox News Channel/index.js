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
          }
      }

     // get lists
      var titles = document.querySelectorAll(titleClassName);
      var links = document.querySelectorAll(linkClassName);
      var images = document.querySelectorAll(imageClassName);
      var time = document.querySelectorAll(timeClassName);


         var data =[];
         for(let j=0;j<images.length;j++){
           
              if(WordExist(typeof(time[j])=="undefined" ? "nothing" : time[j].textContent)==true && typeof(time[j])!="undefined" && typeof(titles[j])!="undefined" &&  images[j].src.indexOf('http')==0 && typeof(images[j])!="undefined")
                    {
                   data.push({
                       time : time[j].textContent,
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : images[j].src,
                       Category:Category,
                       source :"Bloomberg",
                       sourceLink:"https://www.bloomberg.com/",
                       sourceLogo:"bloomberg logo"
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


            var text = document.querySelectorAll('.article-content p');
            var textArray=[];

            for(let i=1;i<text.length;i++){
                textArray.push(text[i].textContent);
                textArray.push(' ');
            }
            return textArray.join('\n');
        });
    

    if(item.images!=null && Content!=null){
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
    
    return AllData_WithConetent;
}


module.exports=FOXNEWS;