const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../function/insertData');
const {SendToServer} = require('../../function/SendToServer');
const {capitalizeFirstLetter} = require('../../function/toUppearCase');
const {FormatImage} = require('../../function/imageFormat');

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

var Categories=['news/crime-and-public-safety','news/environment','business','news/politics','tag/health','tag/jobs','business/housing','sports','things-to-do/travel','things-to-do/movies','opinion'];

const LosAngelesNews = () =>{
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
for(let i=0;i<Categories.length;i++){

        //get the right category by number
        var Category = Categories[i]
        console.log(Category)
      

      try{
         //navigate to category sub route
        await page.goto(['https://www.dailynews.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.dailynews.com/','',Category].join(''));
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
    var loop=3;

    var articles = document.querySelectorAll('article')
    var titleClassName="h4";
    var linkClassName="a";
    var imageClassName="img";


   // set conditions on categories 
        if(Category==="business" || Category==="news/politics" || Category==="opinion" || Category==="sports" ){
            var titleClassName="h2";
            loop=1;
        }
  
    
    //change category name
    var cateogryName = "";
    
    if(Category==="news/crime-and-public-safety"){
        var titleClassName="h2";
        loop=1;
        cateogryName="Safety";
    }else{
        if(Category.indexOf('/')!=-1){
            if(Category.indexOf('housing')!=-1){
                var titleClassName="h2";
                loop=1;
                cateogryName="Business";
            }else{
                var titleClassName="h2";
                loop=1;
                cateogryName = Category.substring(Category.indexOf('/')+1,Category.length);
            }
        }else{
            cateogryName=Category;
        }
    }

  if(cateogryName.indexOf("politics")!=-1) cateogryName="Politic";
    //////////////////////////////

         var data =[];
         for(let j=0;j<loop;j++){
           
              if(articles[j].querySelector(titleClassName)!=null && articles[j].querySelector(linkClassName)!=null)
                    {
                   data.push({
                       time : Date.now(),
                       title : articles[j].querySelector(titleClassName).textContent.trim(),
                       link : articles[j].querySelector(linkClassName).href,
                       images :articles[j].querySelector(imageClassName)!=null ? articles[j].querySelector(imageClassName).src: null,
                       Category:cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                       source :"LosAngeles Daily News - "+cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                       sourceLink:"https://www.dailynews.com",
                       sourceLogo:"https://www.brainsway.com/wp-content/uploads/2019/05/img47.png"
                         });
                   }
               }
                      return data;
               },Category);

               console.log(PageData);
               PageData.map((item,j)=>{

                var category = capitalizeFirstLetter(item.Category)
                item.Category = category;
                item.images = FormatImage(item.images);
                console.log(item.images)
                setTimeout(() => {
                    console.log("request here")
                    SendToServer("en",item.Category,item.source,item.sourceLogo)
                }, 5000*j);
                   AllData.push(item);

               });
       }
     }catch(e){
        console.log(e)
     await browser.close();
       }

      try{
      await GetContent(page,AllData);
        }catch(e){
          console.log(e)
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
        console.log(url);

        try{
            await page.goto(url);
            await page.click('span>span>a');
        }catch{
            await page.goto(url);
        }

    
        var Content = await page.evaluate(()=>{
           try{
            var text = document.querySelectorAll('.article-body p');
            var textArray=[];
            for(let i=0;i<text.length;i++){
                textArray.push(text[i].textContent);
                textArray.push('   ');
            }
            return textArray.join('\n');
           }catch{
            return null;
           }
        });

        var ContentHTML = await page.evaluate(()=>{
           try{
            var text = document.querySelector('.article-body').innerHTML;
            return text;
           }catch{
             return null;
           }
        });
        

        var author = await page.evaluate(()=>{
           try{
            var auth = document.querySelector('.byline>a');
            return auth.textContent;
           }catch{
               return null;
           }
});
    

if(Content!=null && Content!="" && ContentHTML!=null){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.images==="" ? null : item.images,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                author:author,
                content:Content!=null ? Content : null,
                contentHTML : ContentHTML
          });
       }
    }
  // console.log(AllData_WithConetent)
    await InsertData(AllData_WithConetent);
}


module.exports=LosAngelesNews;
