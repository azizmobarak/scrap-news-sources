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

var Categories=['news/us-news','impact/business','section/health','entertainment/celebrity','entertainment/arts','life/style','life/taste','news/media','news/world-news','entertainment/tv','life/travel','voices/women','life/relationships','news-australia','news-canada','news-uk'];

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

       try{
           await page.goto('https://www.huffpost.com/');
           await page.click('button[type=submit]');
       }catch(e){
           console.log(e)
       }
 
var AllData=[]; 
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

    // await page.screenshot({path: 'images/'+i+'.png'});
     
    // var body = await page.$eval('body',b=>b);
    // var body = await page.content();
    //  fs.writeFile("images/test.txt",body, function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log("The file was saved!");
    // }); 

      // get the data from the page
var PageData = await page.evaluate((Category,url)=>{

     // HuffPost Classes
     var titleClassName=".zone__content a.card__headline--long>h2";
     var linkClassName=".zone__content a.card__headline--long";
     var imageClassName=".zone__content .card__image__src picture img.landscape";

     if(Category.indexOf("life")!=-1){
       titleClassName=".zone--latest .zone__content h3.card__headline__text";
       linkClassName=".zone--latest .zone__content a.card__headline";
       imageClassName=".zone--latest .zone__content .card__image__src picture>img";
     }

 
      // get lists
      var titles = document.querySelectorAll(titleClassName);
      var links = document.querySelectorAll(linkClassName);
      var images = document.querySelectorAll(imageClassName);
  
    
    //change category name
    var cateogryName = Category;
    
    if(Category==="news/us-news"){
        cateogryName="US";
    }else{
        if(Category==='world-news'){
            cateogryName="International";
        }else{
        if(Category.indexOf('/')!=-1){
                cateogryName=Category.substring(Category.indexOf('/')+1,Category.length);
        }
    }
    }
    //////////////////////////////

         var data =[];
         for(let j=0;j<3;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(links[j])!="undefined" &&  images[j].src.indexOf('http')==0 && typeof(images[j])!="undefined")
                    {
                   data.push({
                       time : Date.now(),
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       images : images[j].src,
                       Category:cateogryName,
                       source :"HuffPost",
                       sourceLink:url,
                       sourceLogo:"HuffPost logo"
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
    

    if(item.images!=null || Content!=null){
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


module.exports=HuffPost;