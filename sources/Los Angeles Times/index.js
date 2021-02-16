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

var Categories=['business','business/technology','business/real-estate','entertainment-arts/business','topic/arts','food','lifestyle','topic/fashion','opinion','politics','science','travel','world-nation','environment','entertainment-arts','entertainment-arts/movies','entertainment-arts/books','homeless-housing'];

const LosAngelesTimes = () =>{
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
        await page.goto(['https://www.latimes.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
        try{
          await page.click('.ncm-not-interested-button');
        }catch{
          console.log('passed')
        }
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.latimes.com/','',Category].join(''));
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
    var loop=1;

    var titleClassName=".promo-content .promo-title";
    var linkClassName=".promo-content .promo-title a";
    var imageClassName="ps-promo a img";


    // all elements
    var titles = document.querySelectorAll(titleClassName);
    var images = document.querySelectorAll(imageClassName);
    var links = document.querySelectorAll(linkClassName);
  
    
    //change category name
    var cateogryName = "";
    
    if(Category==="homeless-housing"){
        cateogryName="house";
    }else{
        if(Category.indexOf('/')!=-1){
            if(Category.indexOf('real-estate')!=-1){
                cateogryName="business";
            }else{
                if(Category.indexOf('arts')!=-1){
                    cateogryName="art&design";
                }else{
                    if(Category.indexOf('entertainment-arts')!=-1){
                        cateogryName="entertainment," + Category.substring(Category.indexOf('/')+1,Category.length);
                    }else{
                        cateogryName = Category.substring(Category.indexOf('/')+1,Category.length);
                    }
                }
            }
        }else{
            if(Category==="world-nation")
            {
                cateogryName="International";
            }else{
                if(Category==="entertainment-arts"){
                    cateogryName="entertainment";
                }
                else{
                    if(Category==="lifestyle"){
                        cateogryName="life&style";
                    }else{
                        cateogryName=Category;
                    }
                }
            }
        }
    }
    //////////////////////////////

         var data =[];
         for(let j=0;j<loop;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined")
                    {
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images :typeof(images[j])!="undefined" ? images[j].src : null,
                       Category:cateogryName,
                       source :"Los Angeles Times",
                       sourceLink:"https://www.latimes.com/",
                       sourceLogo:"LaTimes logo"
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
            await page.waitForSelector('.story');
        }catch{
            await page.goto(url);
            await page.waitForSelector('.story');
        }

    
        var Content = await page.evaluate(()=>{
           
            var text = document.querySelector('.rich-text-article-body-content');

           if(text==null || typeof(text)==="undefined"){
               text = document.querySelectorAll('p');
               var allcontent ="";
               for(let k=0;k<text.length/2;k++){
                if(text[k].textContent!="" && text[k].textContent.length>150){
                    allcontent =k!=0 ? allcontent + "\n" + text[k].textContent : text[k].textContent;
                }
               }
               return allcontent.substring(0,1200).replaceAll("\n",' ')+" ...";
           }else{
               return text.textContent.replaceAll('Advertisement','').replaceAll("\n",' ').substring(0,1200)+" ...";
           }
        });

        var author = await page.evaluate(()=>{
            try{
               return document.querySelector('.author-name>span+span').textContent;
            }catch{
                return null;
            }
        })
    

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
                author:author,
                content:Content!=null ? Content : null
          });
       }
    }
    
    await InsertData(AllData_WithConetent);
}


module.exports=LosAngelesTimes;