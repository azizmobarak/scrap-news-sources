const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../function/insertData');
const fs = require('fs')

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

var Categories=['politics','opinions','national/investigations','business/technology','local/public-safety','world','sports','entertainment/books','goingoutguide/movies','economy','health-care','markets','climate-environment','education','food','health','lifestyle','science'];

const WASHINGTONPOST = () =>{
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
      

      try{
         //navigate to category sub route
        await page.goto(['https://www.washingtonpost.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.washingtonpost.com/','',Category].join(''));
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
         await page.solveRecaptchas();
         await Promise.all([
             page.waitForNavigation(),
             page.click(".g-recaptcha"),
             await page.$eval('input[type=submit]', el => el.click())
         ]);
    }


    var body = await page.$eval("body", (element) => {
        return element.innerHTML
          });

    await fs.writeFile("test.html",body, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
    


await page.screenshot({path: 'screenshot.png'});
      // get the data from the page
var PageData = await page.evaluate((Category)=>{
               
            
    // Los Angelece News classes
    var loop=3;
    var start=0;

    var titleClassName=".story-list .story-body .story-headline h2";
    var linkClassName=".story-list .story-body .story-headline h2>a";
    var imageClassName=".story-list .story-image img";
    var authorClassName=".story-list .story-list-meta span.author";

    if(Category==="opinions" || Category==="world" || Category==="sports")
    {
        titleClassName="#main-content .top-table h2>a";
        linkClassName="#main-content .top-table h2>a";
        imageClassName="#main-content .top-table .photo-wrapper img";
        authorClassName="#main-content .top-table .author";
    }else{
        if( Category.indexOf("books")!=-1 || Category.indexOf("movies")!=-1 || Category.indexOf("food")!=-1)
        {
        titleClassName="#main-content .moat-trackable h2.headline";
        linkClassName="#main-content .moat-trackable h2.headline>a";
        imageClassName="#main-content .moat-trackable .photo-wrapper img";
        authorClassName="#main-content .moat-trackable span.author";
        start=1;
        }
    }

    // all elements
    var titles = document.querySelectorAll(titleClassName);
    var images = document.querySelectorAll(imageClassName);
    var links = document.querySelectorAll(linkClassName);
    var authors = document.querySelectorAll(authorClassName);
  
    //change category name
    var cateogryName = "";
    
       if(Category.indexOf('investigations')!=-1){
           cateogryName="investing"
       }else{
           if(Category==='business/technology'){
            cateogryName="technology";
           }else{
              if(Category.indexOf('safety')!=-1){
                   cateogryName="safety";
               }else{
                if(Category==='world'){
                   cateogryName="international"
                }else{
                    if(Category==="entertainment/books"){
                        cateogryName="entertainment";
                    }else{
                        if(Category.indexOf("movies")!=-1){
                             cateogryName="movies";
                        }else{
                            if(Category.indexOf('health-care')!=-1){
                                 cateogryName="health"
                            }else{
                                if(Category==='climate-environment'){
                                        cateogryName="environement"
                                    }else{
                                     if(Category==="education"){
                                         cateogryName="education";
                                     }else{
                                        if(Category==="lifestyle"){
                                            cateogryName="life&style"
                                        }else{
                                            if(cateogryName==="poinions"){
                                                cateogryName="opinion"
                                            }else{
                                                cateogryName=Category;
                                            }
                                        }
                                    } 
                                } 
                            } 
                        } 
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
                       Category: cateogryName,
                       source :"The Washington Post",
                       sourceLink:"https://www.washingtonpost.com/",
                       sourceLogo:"The Washingtonpost logo",
                       author:typeof(authors[j])!="undefined" ? authors[j].textContent : null
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
        }catch{
            await page.goto(url);
        }

    
        var Content = await page.evaluate(()=>{
           try{
            var text = document.querySelector('.article-body').textContent
            return text;
           }catch{
            return null;
           }
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
                author : item.author,
                content:Content!=null ? Content : null
          });
       }
    }
    
    await InsertData(AllData_WithConetent);
}


module.exports=WASHINGTONPOST;