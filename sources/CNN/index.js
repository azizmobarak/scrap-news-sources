const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

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

var Categories=['africa','americas','asia','australia','europe','india','middle-east','uk','politics','business','health','travel/news','travel/food-and-drink','style','entertainment','sport'];

const CNN = () =>{
    (async()=>{
       var browser =await puppeteer.launch({
        headless: false,
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
        await page.goto(['https://edition.cnn.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://edition.cnn.com/','',Category].join(''));
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
    
        var loop = 1;
              
      // CNN classes
      var titleClassName=".zn__containers article h3";
      var linkClassName=".zn__containers article a";
      var imageClassName=".zn__containers article img";

      //change classes in some conditions
      if(Category.indexOf('travel')!=-1){

        titleClassName=".CardBasic__details a";
        linkClassName=".CardBasic__details a";
        imageClassName=".LayoutThreeColumns__component .Image__image";

        // loop length
         loop=3;
         //change category name 
         Category="travel";
      }else{
          if(Category==="style"){
              titleClassName="#zone1 .LayoutGrid__component .CardBasic__title";
              linkClassName="#zone1 .LayoutGrid__component .CardBasic__title";
              imageClassName="#zone1 .LayoutGrid__component img"; 

               // loop length
                loop=4;
          }
      }

      // get lists
      var titles = document.querySelectorAll(titleClassName);
      var images = document.querySelectorAll(imageClassName);
      var links  = document.querySelectorAll(linkClassName);
  
    

         var data =[];

         for(let j=0;j<loop;j++){
           
              if(typeof(titles[j])!="undefined" && typeof(images[j])!="undefined" && images[j].src.indexOf('http')==0 && typeof(links[j])!="undefined")
                    {
                   data.push({
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       image:images[j].src,
                       Category:Category,
                       source :"CNN",
                       sourceLink:"https://edition.cnn.com/",
                       sourceLogo:"CNN logo"
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
     await page.waitFor(20000);
     await browser.close();
    })();
}



const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;
       // console.log(url);

        await page.goto(url);

        Category = item.Category;
        var Content = await page.evaluate((Category)=>{

           switch(Category){
               case "travel":
                    return document.querySelector('.Article__primary').innerText;
                default :

                    var text = document.querySelectorAll('.zn-body-text div');
                    var textArray=[];
       
                    for(let i=0;i<text.length;i++){
                    textArray.push(text[i].textContent);
                    textArray.push(' ');
                      }
                    return textArray.join('\n');
           }
        },Category);
    

    if(item.image!=null && Content!=null && item.title!="Election fact check" && item.title!="Latest election news"){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.image,
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


module.exports=CNN;