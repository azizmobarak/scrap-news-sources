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

var Categories=['sports','news/canada','news/politics','news/opinion','news/business','news/health','news/entertainment','news/technology','news/investigates'];

const CBC = () =>{
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
        await page.goto(["https://www.cbc.ca/",'',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(["https://www.cbc.ca/",'',Category].join(''));
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

    //change category name
    var cateogryName = "";
    
     if(Category.indexOf('/')!=-1){
         if(Category.indexOf('investigates')!=-1){
             cateogryName="investing"
         }else{
           cateogryName = Category.substring(Category.indexOf('/')+1,Category.length);
         }
     }else{
         cateogryName = Category;
     }
    //////////////////////////////
    

    // CBC classes by categories 
      var titleClassName=".card-content h3.headline";
      var linkClassName=".featuredArea a";
      var imageClassName=".cardImageWrap>figure.imageMedia>div>img";
      var timeClassName="div.card-content-bottom>.metadata>div>time.timeStamp";
      var author =null;
      if(Category==="news/opinion"){
          author = document.querySelectorAll(".authorName");
      }
    
     // change the source logo to http 
    var titles = document.querySelectorAll(titleClassName)
    var images =  document.querySelectorAll(imageClassName);
    var time = document.querySelectorAll(timeClassName);
    var links = document.querySelectorAll(linkClassName);
  

         var data =[];
         for(let j=0;j<titles.length;j++){
           
              if((j!=1 && j!=2 && j!=3) && WordExist(typeof(time[j])=="undefined" ? "nothing" : time[j].textContent)==true && typeof(time[j])!="undefined" && typeof(titles[j])!="undefined" && typeof(links[j])!="undefined" &&  images[j].src.indexOf('http')==0 && typeof(images[j])!="undefined")
                    {
                   data.push({
                       time : time[j].textContent,
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : images[j].src,
                       Category:cateogryName,
                       source :"CBC NEWS",
                       sourceLink:"https://www.cbc.ca",
                       sourceLogo:"cbc logo",
                       author:author[j].textContent
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


            var text = document.querySelectorAll('div.story p');
            var textArray=[];

            for(let i=2;i<text.length;i++){
                textArray.push(text[i].textContent);
                textArray.push('   ');
            }
            return textArray.join('\n');
        });
    

    if(item.images!=null &&  Content!=null && Content!=""){
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


module.exports=CBC;