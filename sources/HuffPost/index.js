const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs');

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

var Categories=['news/us-news','impact/Business','section/Health','entertainment/Celebrity','entertainment/arts','life/style','life/taste','news/media','news/world-news','entertainment/tv','life/Travel','voices/women','life/relationships','news-australia','news-canada','news-uk'];

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

for(let k=0;k<5;k++){
    try{
        await page.goto('https://www.huffpost.com/');
        await page.click('button[type=submit]');
       }catch(e){
        console.log("cookie passed")
       }
}
// boucle on categories started 
for(let i=0;i<Categories.length;i++){

        //get the right category by number
        var Category = Categories[i]
        console.log(Category)
      
        var url="https://www.huffpost.com/";
        if(Category==="news-australia"){
            url = "https://www.huffingtonpost.com.au/news";
            Category = "Australia"
        }else{
            if(Category==="news-canada"){
                url="https://www.huffingtonpost.ca/news/";
                Category="Canada";
            }else{
                if(Category==="news-uk"){
                    url="https://www.huffingtonpost.co.uk/news";
                    Category="UK"
                }
            }
        }

      try{
         //navigate to category sub route
         if(Category==="Australia" || Category==="UK" || Category==="Canada"){
            await page.goto(url);
         }else{
            await page.goto([url,'',Category].join(''));
         }
       
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         if(Category==="Australia" || Category==="UK"  || Category==="Canada"){
            await page.goto(url);
         }else{
            await page.goto([url,'',Category].join(''));
         }
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
         await page.solveRecaptchas();
         await Promise.all([
             page.waitForNavigation(),
             page.click(".g-recaptcha"),
             await page.$eval('input[type=submit]', el => el.click())
         ]);
    }

   
var PageData = await page.evaluate((Category,url)=>{

     // HuffPost Classes
     var titleClassName=".zone__content a.card__headline--long>h2";
     var linkClassName=".zone__content a.card__headline--long";
     var imageClassName=".zone__content .card__image__src picture img.landscape";
     var authorClassName=".card__byline__author__name-title";

     if(Category.indexOf("life")!=-1){
       titleClassName=".zone--latest .zone__content h3.card__headline__text";
       linkClassName=".zone--latest .zone__content a.card__headline";
       imageClassName=".zone--latest .zone__content .card__image__src picture>img";
       authorClassName=null;
     }

 
      // get lists
      var titles = document.querySelectorAll(titleClassName);
      var links = document.querySelectorAll(linkClassName);
      var images = document.querySelectorAll(imageClassName);
      var author = document.querySelectorAll(authorClassName);
  
    
    //change category name
    var cateogryName = Category;

    if(Category.indexOf('/')!=-1){
     if(Category.indexOf('arts')!=-1 && Category.indexOf('entertainment')!=-1){
        cateogryName = "art&design,entertainment";
     }else{
         if(Category.indexOf('life')!=-1){
             if(Category.indexOf('travel')!=-1){
                cateogryName="life&style,travel";
             }else{
                cateogryName="life&style";
             }
         }
     }
    }
    if(Category==='world-news'){
        cateogryName="International"
    }
    if(Category==="news/us-news"){
        cateogryName="US";
    }
    //////////////////////////////

         var data =[];
         for(let j=0;j<3;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined" &&  images[j].src.indexOf('http')==0)
                    {
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images :typeof(images[j])!="undefined" ? images[j].src : null,
                       Category:cateogryName,
                       source :"HuffPost",
                       sourceLink:url,
                       sourceLogo:"HuffPost logo",
                       author:typeof(author)!="undefined" ? (author!=null ? author[j].textContent : null) : null
                    });
                   }
               }
                      return data;
    },Category,url);

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

        console.log(i);

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
        if(item.Category==="life&style"){
         author = await page.evaluate(()=>{
             var auth = document.querySelector('.entry__byline__author>a>div');
             if(auth!=null && typeof(auth)!="undefined"){
                 return auth.textContent;
             }else{
                 return null;
             }
         })
        }
    
        // change null author
        var applyAuthor='';

        if(item.author==null && item.Category==="life&style"){
          applyAuthor=author;
        }else{
            applyAuthor=item.author;
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
                author:applyAuthor,
                content:Content
          });
       }
    }
    
    console.log(AllData_WithConetent)
}


module.exports=HuffPost;