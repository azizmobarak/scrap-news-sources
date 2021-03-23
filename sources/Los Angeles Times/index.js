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

try{
// boucle on categories started 
for(let i=0;i<Categories.length;i++){

        //get the right category by number
        var Category = Categories[i]
      

      try{
         //navigate to category sub route
        await page.goto(['https://www.latimes.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
        try{
          await page.click('.ncm-not-interested-button');
        }catch{
          console.log('passed')
        }
    }catch{
         //navigate to category sub route
         await page.goto(['https://www.latimes.com/','',Category].join(''));
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }

      // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
    // Los Angelece News classes

    var articles = document.querySelectorAll(".promo");
    var titleClassName="p:nth-child(2)";
    var linkClassName="p:nth-child(2)>a";
    var imageClassName="img";
  
    
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
                        cateogryName="entertainment";
                    }else{
                        cateogryName = Category.substring(Category.indexOf('/')+1,Category.length);
                    }
                }
            }
        }else{
            if(Category==="world-nation")
            {
                cateogryName="international";
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

    if(Category==="politics"){
        cateogryName="politic";
         }
    //////////////////////////////

         var data =[];
         for(let j=0;j<3;j++){
           
              if(articles[j].querySelector(titleClassName)!=null && articles[j].querySelector(linkClassName)!=null)
                    {
                   data.push({
                       time : Date.now(),
                       title :articles[j].querySelector(titleClassName).textContent.trim(),
                       link : articles[j].querySelector(linkClassName).href,
                       images :(articles[j].querySelector(imageClassName)!=null && articles[j].querySelector(imageClassName).src.indexOf("data:image")==-1) ? articles[j].querySelector(imageClassName).src : null,
                       Category:cateogryName.toLowerCase(),
                       source :"LosAngelesTimes "+cateogryName,
                       sourceLink:"https://www.latimes.com/",
                       sourceLogo:"https://www.pngkey.com/png/detail/196-1964217_the-los-angeles-times-los-angeles-times-logo.png"
                         });
                   }
               }
                      return data;
               },Category);
               PageData.map(item=>{
                   AllData.push(item)
               });
       }}catch{
            await browser.close();
           }
        
  
  try{
      await GetContent(page,AllData);
    }catch{
        await browser.close();}

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
            await page.waitForSelector('.story');
        }catch{
            await page.goto(url);
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
