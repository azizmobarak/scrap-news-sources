const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../function/insertData');
const {FormatImage} = require('../../function/formatImage');
const {SendToServer} = require('../../function/sendToserver');

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
       // console.log(Category)
      

      try{
         //navigate to category sub route
        await page.goto(['https://www.wsj.com/news/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.wsj.com/news/','',Category].join(''));
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }

      // get the data from the page
var PageData = await page.evaluate((Category)=>{   
            
    // Los Angelece News classes
    var articles =  document.querySelectorAll("article");
    var titleClassName="h2";
    var imageClassName="img";
    var linkClassName="a";

  
    //change category name
    var categoryName = Category;

    switch(Category){
        case 'world' : 
           categoryName="international"
           break;

        case 'life-arts' :
            categoryName="art & Design";
            break;

        case 'realestate' :
             categoryName="business";
           break;
        case 'politics' :
            categoryName="politic"
            break;
        case 'markets':
            categoryName="market";
            break;
        

        default :
           if(Category.indexOf('asia')!=-1){
               categoryName="international";
           }else{
              if(categoryName.indexOf('africa')!=-1){
                  categoryName="international";
              }else{
                  if(categoryName.indexOf('china')!=-1){
                      categoryName='international';
                  }else{
                      if(categoryName.indexOf('america')!=-1){
                          categoryName="international";
                      }else{
                          if(categoryName.indexOf('middle-east')!=-1){
                              categoryName="international";
                          }else{
                              if(categoryName.indexOf('canada')!=-1){
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
      ////////////////////////////////////

         var data =[];
         for(let j=0;j<4;j++){
           
              if(j>0) titleClassName="h3";

              if(typeof(articles[j])!="undefined" && articles[j].querySelector(titleClassName)!=null && articles[j].querySelector(linkClassName)!=null)
                    {
                   data.push({
                      time : Date.now(),
                       title :articles[j].querySelector(titleClassName).textContent.trim(),
                       link : articles[j].querySelector(linkClassName).href,
                       images : articles[j].querySelector(imageClassName)!=null ? articles[j].querySelector(imageClassName).src : null,
                       Category: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                       source :"The WallStreetJournal - "+categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                       sourceLink:"https://www.wsj.com",
                       sourceLogo:"https://assets.website-files.com/5a33ed4f5aec59000163e8fa/5bbf5920e9654bdac813dc27_WSJ%20thumbnial.png"
                         });
                   }
              }
                      return data;
               },Category);
               PageData.map((item,j)=>{
                item.images = FormatImage(item.images);
                setTimeout(() => {
                     SendToServer('en',item.Category,item.source,item.sourceLogo)
                },2000*j);
                   AllData.push(item)
               });
       }}catch(e){
             console.log(e)
             await browser.close();
            }
  
    
try{await GetContent(page,AllData);}catch{console.log(e);await browser.close()}

     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;
       // console.log(url)
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


        var contenthtml =await page.evaluate(()=>{
            try{
            return document.querySelector('.snippet').innerHTML;
            }catch{
             return null;
            }
         });

        var author = await page.evaluate(()=>{
            try{
                return document.querySelector('.author-button').textContent.trim();
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
                content:Content,
                contenthtml:contenthtml
          });
       }
    }
   await InsertData(AllData_WithConetent);
}


module.exports=WALLSTREET;
