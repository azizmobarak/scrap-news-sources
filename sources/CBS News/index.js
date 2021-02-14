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

var Categories=['Sports','news/Canada','news/Politics','news/Opinion','news/Business','news/Health','news/Entertainment','news/Technology','news/Investigates'];

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
                            return false;
                       }
            }
        }
    }
    }

    var start =0;
    var end =1;

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
          end =3;
      }else{
          if(Category==="sports"){
              end = 1;
          }else{
            end =3;
          }
      }
    
     // change the source logo to http 
    var titles = document.querySelectorAll(titleClassName)
    var images =  document.querySelectorAll(imageClassName);
    var time = document.querySelectorAll(timeClassName);
    var links = document.querySelectorAll(linkClassName);
  

         var data =[];
         for(let j=start;j<end;j++){
           
              if(WordExist(typeof(time[j])=="undefined" ? "nothing" : time[j].textContent)==true && typeof(time[j])!="undefined" && typeof(titles[j])!="undefined" && typeof(links[j])!="undefined" &&  images[j].src.indexOf('http')==0)
                {

                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : j==0 ? (typeof images[j]!="undefined" ? images[j].src : null) : null,
                       Category:cateogryName,
                       source :"CBC NEWS",
                       sourceLink:"https://www.cbc.ca",
                       sourceLogo:"cbc logo",
                       author:author==null ? null : author[j].textContent
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
     await page.waitFor(20000);
     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;

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
                content:Content!=null ? Content : null
          });
       }
    }
    return AllData_WithConetent;
}


module.exports=CBC;