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

    var titleClassName=".feature-primary article .entry-title";
    var linkClassName=".feature-primary article .entry-title a";
    var imageClassName=".feature-primary article figure div.image-wrapper>img";


    // setconditions on categories 
    if(Category==="news/environment"){
        titleClassName="section.landing a.article-title";
        linkClassName="section.landing a.article-title";
        imageClassName="section.landing .image-wrapper>img";
        loop=1;
    }else{
        if(Category==="business" || Category==="news/politics" || Category==="opinion" ){
            titleClassName=".feature-top article h2";
            linkClassName=".feature-top article a";
            imageClassName=".feature-top article img";
            loop=1;
        }if(Category==="sports"){
            titleClassName=".feature-wrapper .article-title .dfm-title";
            linkClassName=".feature-wrapper article .entry-title a";
            imageClassName=".feature-wrapper article img";
            loop=1;
        }
    }

    // change the source logo to http 
    var titles = document.querySelectorAll(titleClassName);
    var images = document.querySelectorAll(imageClassName);
    var links = document.querySelectorAll(linkClassName);
  
    
    //change category name
    var cateogryName = "";
    
    if(Category==="news/crime-and-public-safety"){
        cateogryName="safety";
    }else{
        if(Category.indexOf('/')!=-1){
            if(Category.indexOf('housing')!=-1){
                cateogryName="house";
            }else{
                cateogryName = Category.substring(Category.indexOf('/')+1,Category.length);
            }
        }else{
            cateogryName=Category;
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
                       source :"Los Angeles Daily News",
                       sourceLink:"https://www.dailynews.com/",
                       sourceLogo:"https://www.brainsway.com/wp-content/uploads/2019/05/img47.png"
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

        try{
            await page.goto(url);
            await page.click('span>span>a');
        }catch{
            await page.goto(url);
        }

    
        var Content = await page.evaluate(()=>{


            var text = document.querySelectorAll('.article-body p');
            var textArray=[];

            for(let i=0;i<text.length;i++){
                textArray.push(text[i].textContent);
                textArray.push('   ');
            }
            return textArray.join('\n');
        });

        var author = await page.evaluate(()=>{
           try{
            var auth = document.querySelector('.byline>a');
            return auth.textContent;
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


module.exports=LosAngelesNews;