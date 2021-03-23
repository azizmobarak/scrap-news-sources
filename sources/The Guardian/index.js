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

var Categories=['uk/commentisfree','uk/sport','uk/culture','uk/lifeandstyle','world','uk-news','uk/environment','science','global-development','football','uk/technology','uk/business','sport/cricket','sport/rugby-union','sport/tennis','sport/cycling','sport/formulaone','sport/golf','sport/us-sport','books','artanddesign','fashion','food','lifeandstyle/love-and-sex','lifeandstyle/health-and-wellbeing','lifeandstyle/home-and-garden','lifeandstyle/women','lifeandstyle/men','lifeandstyle/family','uk/travel','uk/money'];

const Gardian = () =>{
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
        await page.goto(['https://www.theguardian.com/','',Category].join(''));
        //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0
        try{
          await page.click('.ncm-not-interested-button');
        }catch{
          console.log('passed');
        }
    }catch(e){
         //navigate to category sub route
         await page.goto(['https://www.theguardian.com/','',Category].join(''));
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
    var loop=2;

    var titleClassName=".fc-container--rolled-up-hide .fc-slice-wrapper .fc-item__container .fc-item__content h3";
    var linkClassName=".fc-container--rolled-up-hide .fc-slice-wrapper .fc-item__container .fc-item__content a";
    var imageClassName=".fc-container--rolled-up-hide .fc-slice-wrapper .fc-item__container .fc-item__media-wrapper img";

    // all elements
    var titles = document.querySelectorAll(titleClassName);
    var images = document.querySelectorAll(imageClassName);
    var links = document.querySelectorAll(linkClassName);
  
    //change category name
    var cateogryName = "";
    
        if(Category.indexOf('/')!=-1 && Category.indexOf('uk')!=-1){
            if(Category.indexOf('commentisfree')!=-1){
                cateogryName="opinion"
            }else{
                if(Category.indexOf('lifeandstyle')!=-1){
                    cateogryName="life&style"
                }else{
                   cateogryName ="uk";
                        }
            }
        }else{
            if(Category.indexOf('/')!=-1 && Category.indexOf('sport')!=-1){
                if(Category.indexOf('us')!=-1){
                    cateogryName="sport";
                }else{
                    if(Category.indexOf('rugby')!=-1){
                        cateogryName="rugby";
                    }else{
                        cateogryName ="sport";
                    }
                }
        }else{
            if(Category.indexOf('uk-news')!=-1){
                cateogryName="uk";
            }else{
                if(Category.indexOf('global-development')!=-1){
                    cateogryName="international";
                }else{
                    if(Category.indexOf('artanddesign')!=-1){
                        cateogryName="art&design";
                    }else{
                        if(Category.indexOf('/')!=-1 && Category.indexOf('lifeandstyle/')!=-1){
                            if(Category.indexOf('home-and-garden')!=-1){
                                cateogryName="life&style";
                            }else{
                                if(Category.indexOf('health-and-wellbeing')!=-1){
                                    cateogryName="health";
                                }else{
                                    if(cateogryName.indexOf('love-and-sex')!=-1){
                                        cateogryName="life&style";
                                    }else{
                                            cateogryName ="life&style";
                                    }
                                }
                            }
                        }else{
                            if(Category==="football"){
                                cateogryName="football";
                            }else{
                            if(Category==="world") cateogryName="international";
                             else{
                               cateogryName=Category;
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
                       source :"The Gardian",
                       sourceLink:"https://www.theguardian.com/",
                       sourceLogo:"https://www.youthalive.org/wp-content/uploads/2020/07/the-guardian-logo.jpg"
                         });
                   }
              }
                      return data;
               },Category);

               console.log(PageData);
               PageData.map(item=>{
                   AllData.push(item)
               });
       }} catch{
           await browser.close();
             }
    
     try{
        await GetContent(page,AllData);
         }catch{
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
        console.log(url);

        await page.setJavaScriptEnabled(false);

        try{
            await page.goto(url);
        }catch{
            await page.goto(url);
        }

    
        var Content = await page.evaluate(()=>{
           try{
            var text = document.querySelector('.article-body-commercial-selector p').textContent+"\n"+ document.querySelector('.article-body-commercial-selector p+p').textContent;
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
                content:Content!=null ? Content : null
          });
       }
    }
    
    await InsertData(AllData_WithConetent);
}


module.exports=Gardian;
