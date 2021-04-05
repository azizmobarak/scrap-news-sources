const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../function/insertData');
const  {FormatImage} = require('../../function/FormatImage');
const  {SendToServer} = require('../../function/sendToServer');


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

try{
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
/*         await page.solveRecaptchas();
         await Promise.all([
             page.waitForNavigation(),
             page.click(".g-recaptcha"),
             await page.$eval('input[type=submit]', el => el.click())
         ]);*/
    }

      // get the data from the page
     var PageData = await page.evaluate((Category)=>{
               

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
    var articles = document.querySelectorAll(".card")
    var titles = "h3"
    var images =  "img"
    var links = "a"
    var author =".authorName"
  

         var data =[];
         for(let j=0;j<4;j++){
           
              if(articles[j].querySelector(titles)!=null && articles[j].querySelector(links)!=null)
                {
                   data.push({
                       time : Date.now(),
                       title : articles[j].querySelector(titles).textContent.trim(),
                       link : articles[j].querySelector(links).href,
                       images : articles[j].querySelector(images)!=null ? articles[j].querySelector(images).src : null,
                       Category:cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                       source :"CBC NEWS - "+cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                       sourceLink:"https://www.cbc.ca",
                       sourceLogo:"https://ropercenter.cornell.edu/sites/default/files/styles/800x600/public/Images/CBS_News_logo8x6.png",
                       author:articles[j].querySelector(author)==null ? null : articles[j].querySelector(author).textContent
                    });
                   }
               }
                      return data;
               },Category);
                console.log(PageData)
                PageData.map((item,j)=>{

                    item.images = FormatImage(item.images);
                    console.log(item.images)
                    setTimeout(() => {
                        console.log("request here")
                        SendToServer("en",item.Category,item.source,item.sourceLogo)
                    }, 5000*j);
                       AllData.push(item);
    
                   });
       }
  }catch(e){console.log(e); await browser.close();}
     
     try{await GetContent(page,AllData);}catch(e){console.log(e); await browser.close();}

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
            try{
                var text = document.querySelectorAll('div.story p');
                var textArray=[];
    
                for(let i=2;i<text.length;i++){
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
             return document.querySelector('div.story').innerHTML;
             }catch{
               return null;
             }
        });
    

    if(Content!=null && Content!="" && ContentHTML!=null){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.images,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                content:Content,
                contentHTML:ContentHTML
          });
       }
    }
   //  console.log(AllData_WithConetent)
     await InsertData(AllData_WithConetent);

}


module.exports=CBC;
