const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs');
const {InsertData} = require('../../function/insertData');
const { category } = require('../../model/Category');

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

var Categories=['news/us-news','impact/business','section/health','entertainment/celebrity','entertainment/arts','life/style','life/taste','news/media','news/world-news','entertainment/tv','life/travel','voices/women','life/relationships','news-uk'];

const HuffPost = () =>{
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

for(let k=0;k<3;k++){
    try{
        await page.goto('https://www.huffpost.com/');
        await page.click('button[type=submit]');
       }catch(e){
        console.log("cookie passed")
       }
}

try{
// boucle on categories started 
for(let i=0;i<Categories.length;i++){

        //get the right category by number
        var Category = Categories[i]
        console.log(Category)
      
        var url="https://www.huffpost.com/";
        if(Category==="news-australia"){
            url = "https://www.huffingtonpost.com.au/news";
            Category = "australia"
        }else{
            if(Category==="news-canada"){
                url="https://www.huffingtonpost.ca/news/";
                Category="canada";
            }else{
                if(Category==="news-uk"){
                    url="https://www.huffingtonpost.co.uk/news";
                    Category="UK"
                }
            }
        }

      try{
         //navigate to category sub route
         if(Category==="australia" || Category==="UK" || Category==="canada"){
            await page.goto(url);
         }else{
            await page.goto([url,'',Category].join(''));
         }
       
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         if(Category==="australia" || Category==="UK"  || Category==="canada"){
            await page.goto(url);
         }else{
            await page.goto([url,'',Category].join(''));
         }
    }

   
var PageData = await page.evaluate((Category,url)=>{

     // HuffPost Classes
     var articles = document.querySelectorAll('.card--standard');
     var titleClassName="h2";
     var linkClassName="a";
     var imageClassName="img";

     if(Category.indexOf("life")!=-1){
        articles = document.querySelectorAll('.card');
        titleClassName="h3";
     }

  
    
    //change category name
    var cateogryName = Category;

    if(Category.indexOf('/')!=-1){
     if(Category.indexOf('arts')!=-1 && Category.indexOf('entertainment')!=-1){
        cateogryName = "entertainment";
     }else{
         if(Category.indexOf('life')!=-1){
             if(Category.indexOf('travel')!=-1){
                cateogryName="travel";
             }else{
                cateogryName="life&style";
             }
         }else{
                if(Category.indexOf('taste')!=-1){
                   cateogryName="life&style";
                }else{
                        cateogryName=Category.substring(Category.indexOf('/')+1,Category.length);
                }
         }
     }
    }



if(Category==='news/world-news')cateogryName="international"
if(Category==="news/us-news") cateogryName="us";


    //////////////////////////////

         var data =[];
         for(let j=0;j<3;j++){
           
              if(articles[j].querySelector(titleClassName)!=null && articles[j].querySelector(linkClassName)!=null && articles[j].querySelector(imageClassName).src.indexOf('http')==0)
                    {
                   data.push({
                       time : Date.now(),
                       title :articles[j].querySelector(titleClassName).textContent.trim(),
                       link :articles[j].querySelector(linkClassName).href,
                       images : typeof(articles[j].querySelector(imageClassName))!="undefined" ? articles[j].querySelector(imageClassName).src : null,
                       Category:cateogryName.toLowerCase(),
                       source :"HuffPost "+cateogryName,
                       sourceLink:url,
                       sourceLogo:"http://www.logo-designer.co/wp-content/uploads/2017/04/2017-huffpost-new-logo-design-2.png",
                    });
                   }
               }
                      return data;
    },Category,url);
               console.log(PageData)
               PageData.map(item=>{
                   console.log(item.Category)
                   AllData.push(item)
               });
    }
  }catch(e){
    await browser.close();
    }
    try{
     await GetContent(page,AllData);
    }catch(e){
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

        try{
            await page.goto(url,{waitUntil: 'load', timeout: 0});
        }catch{
            await page.goto(url,{waitUntil: 'load', timeout: 0});
        }


    
        var Content = await page.evaluate(()=>{

            var text = document.querySelector('.entry__text');
           if(typeof(text)!="undefined"){
               if(text!=null){
               return text.innerText;
               }else{
                   return null;
               }
           }else{
            return document.querySelector('.entry__content-list')!=null ? document.querySelector('.entry__content-list').textContent.replace('Content loading...','') : null;
           }
        });

        // get the author with content
        var author="";
    if(item.Category.indexOf("life&style")!=-1){
         author = await page.evaluate(()=>{
             var auth = document.querySelector('.entry__byline__author>a>div');
             if(auth!=null && typeof(auth)!="undefined"){
                 return auth.textContent;
             }else{
                 return null;
             }
         })
        }else{
            author = await page.evaluate(()=>{
                var auth = document.querySelector('a.author-card__link>span');
                if(auth!=null && typeof(auth)!="undefined"){
                    return auth.textContent;
                }else{
                    return null;
                }
            })
        }
    
       
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
                content:Content
          });
       }
    }
    console.log(AllData_WithConetent)
   // await InsertData(AllData_WithConetent);
}


module.exports=HuffPost;