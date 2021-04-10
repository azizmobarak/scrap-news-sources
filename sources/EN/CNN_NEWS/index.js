const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../../function/insertData')
const {FormatImage} = require('../../../function/formatimage');
const {SendToServer} = require('../../../function/sendtoserver');

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
        await page.goto(['https://edition.cnn.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://edition.cnn.com/','',Category].join(''));
         //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
        //  await page.solveRecaptchas();
        //  await Promise.all([
        //      page.waitForNavigation(),
        //      page.click(".g-recaptcha"),
        //      await page.$eval('input[type=submit]', el => el.click())
        //  ]);
    }

      // get the data from the page
     var PageData = await page.evaluate((Category)=>{
    
        var loop = 1;
              
      // CNN classes
      var titleClassName=".zn__containers article h3";
      var linkClassName=".zn__containers article a";
      var imageClassName=".zn__containers article img";

      
      if(Category.indexOf('/')!=-1){
          if(Category.indexOf("food-and-drink")!=-1){
                Category="food";
          }else{
              Category=Category.substring(Category.indexOf("/")+1,Category.length);
          }
      }else{
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
                Category="life&style";
          }else{
                  if(Category==="americas" || Category==="asia" || Category==="africa" || Category==="middle-east" || Category==="europe"){
                   Category="international";
                  }
              }
          }
      }



      // get lists
      var titles = document.querySelectorAll(titleClassName);
      var images = document.querySelectorAll(imageClassName);
      var links  = document.querySelectorAll(linkClassName);
  
    

         var data =[];

         for(let j=0;j<loop;j++){
           
              if(typeof(titles[j])!="undefined" && images[j].src.indexOf('http')==0 && typeof(links[j])!="undefined")
                    {
                   data.push({
                       title : titles[j].textContent.trim(),
                       link : links[j].href,
                       image:typeof(images[j])!="undefined" ? images[j].src : null,
                       Category:Category.charAt(0).toUpperCase() + Category.slice(1),
                       source :"CNN - "+Category.charAt(0).toUpperCase() + Category.slice(1),
                       sourceLink:"https://edition.cnn.com/",
                       sourceLogo:"https://bankimooncentre.org/wp-content/uploads/2020/06/cnn-logo-square.png"
                    });
                   }
               }
                      return data;
               },Category);
              console.log(PageData)
               PageData.map((item,j)=>{
                item.images = FormatImage(item.images);
                setTimeout(() => {
                     SendToServer('en',item.Category,item.source,item.sourceLogo)
                },2000*j);
                   AllData.push(item)
               });
       }
  
     await GetContent(page,AllData);
     await browser.close();
    })();
}


// the final result 

const GetContent = async(page,data)=>{
      
    var AllData_WithConetent=[];
    
    for(var i=0;i<data.length;i++){
    
        var item = data[i];
        var url = item.link;
       // console.log(url);

        await page.goto(url);

        Category = item.Category;

        // get the article content
        var Content = await page.evaluate(()=>{
             try{
                // first try to get all content
                var second_text = document.querySelectorAll('.zn-body__paragraph');
                var scond_content ="";
                for(let i=0;i<second_text.length-1;i++){
                   scond_content = scond_content +"\n"+second_text[i].textContent;
                }
                 return scond_content.trim()+".. .";
             }catch{
                return null;
             }
        });

        var contenthtml = await page.evaluate(()=>{
            try{
               // first try to get all content
               return document.querySelector('.pg-special-article__body').innerHTML;
            }catch{
               return null;
            }
       });

        
// check the author
    var author = await page.evaluate((Category)=>{

        var classname = '.metadata__byline__author>a';

        if(Category==="Life&Style"){
            classname=".Authors__writer";
        }
            
            var auth = document.querySelector(classname);
            return auth!=null ? auth.textContent : null;

        },Category);
    
// collect the result into a table
    if(Content!=null && Content!="" && item.title!="Election fact check" && item.title!="Latest election news"){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.image,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                author : author,
                content:Content.substring(0,3000),
                contenthtml : contenthtml
          });
       }
    }
    
    await InsertData(AllData_WithConetent);
}


module.exports=CNN;
