const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {InsertData} = require('../../../function/insertData');
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

var Categories=['uk/commentisfree','football','sport/rugby-union','sport/cricket','sport/tennis','sport/golf','sport/formulaone','uk/culture','uk/lifeandstyle','world','uk-news','uk/environment','science','global-development','uk/technology','uk/business','books','artanddesign','fashion','food','lifeandstyle/love-and-sex','lifeandstyle/health-and-wellbeing','lifeandstyle/home-and-garden','lifeandstyle/women','lifeandstyle/men','lifeandstyle/family','uk/travel','uk/money'];

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
               
        

    var articles = document.querySelectorAll('.fc-item__container');
    var titleClassName="h3";
    var linkClassName="a";
    var imageClassName="img";

  
    //change category name
    var cateogryName = "";
    
        if(Category.indexOf('/')!=-1 && Category.indexOf('uk')!=-1){
            if(Category.indexOf('commentisfree')!=-1){
                cateogryName="opinion"
            }else{
                if(Category.indexOf('lifeandstyle')!=-1){
                    cateogryName="life&style"
                }else{
                   cateogryName ="UK";
                        }
            }
        }else{
            if(Category.indexOf('/')!=-1 && Category.indexOf('sport')!=-1){
                if(Category.indexOf('golf')!=-1){
                    cateogryName="golf";
                }else{
                    if(Category.indexOf('rugby')!=-1){
                        cateogryName="rugby";
                    }else{
                        if(Category.indexOf('tennis')!=-1){
                            cateogryName="tennis";
                        }else{
                            if(Category.indexOf('formulaone')!=-1){
                                cateogryName="formul 1";
                            }else{
                                if(Category.indexOf('cricket')!=-1){
                                    cateogryName="cricket";
                                }
                            }     
                        }
                        
                    }
                }
        }else{
            if(Category.indexOf('uk-news')!=-1){
                cateogryName="UK";
            }else{
                if(Category.indexOf('global-development')!=-1){
                    cateogryName="international";
                }else{
                    if(Category.indexOf('artanddesign')!=-1){
                        cateogryName="art & Design";
                    }else{
                        if(Category.indexOf('/')!=-1 && Category.indexOf('lifeandstyle/')!=-1){
                            if(Category.indexOf('home-and-garden')!=-1){
                                cateogryName="life & Style";
                            }else{
                                if(Category.indexOf('health-and-wellbeing')!=-1){
                                    cateogryName="health";
                                }else{
                                    if(cateogryName.indexOf('love-and-sex')!=-1){
                                        cateogryName="life & Style";
                                    }else{
                                            cateogryName ="life & Style";
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
         for(let j=0;j<3;j++){
           
              if(articles[j].querySelector(titleClassName)!=null && articles[j].querySelector(linkClassName)!=null)
                    {
                   data.push({
                      time : Date.now(),
                       title : articles[j].querySelector(titleClassName).textContent.trim().replaceAll('\n',' '),
                       link : articles[j].querySelector(linkClassName).href,
                       images :articles[j].querySelector(imageClassName)!=null ? articles[j].querySelector(imageClassName).src : null,
                       Category: cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                       source :"The Gardian - "+cateogryName.charAt(0).toUpperCase() + cateogryName.slice(1),
                       sourceLink:"https://www.theguardian.com/",
                       sourceLogo:"https://www.youthalive.org/wp-content/uploads/2020/07/the-guardian-logo.jpg"
                         });
                   }
              }
                      return data;
               },Category);

              // console.log(PageData);
               
PageData.map((item,j)=>{
    item.images = FormatImage(item.images);
    setTimeout(() => {
         SendToServer('en',item.Category,item.source,item.sourceLogo)
    },2000*j);
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
      //  console.log(url);

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
            try{
                return document.querySelector('.content__standfirst').textContent.trim();
            }catch{
                return null
            }
           }
        });

        var contenthtml = await page.evaluate(()=>{
            try{
             var text = document.querySelector('.article-body-commercial-selector').innerHTML
             return text;
            }catch{
             try{
                 return document.querySelector('.content__standfirst').innerHTML
             }catch{
                 return null
             }
            }
         });
    
        var author = await page.evaluate(()=>{
            try{
             return document.querySelector('address a').textContent.trim();
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
                author:author!="" ? author : null,
                content:Content!=null ? Content : null,
                contenthtml : contenthtml
          });
       }
    }
   // console.log(AllData_WithConetent)
    await InsertData(AllData_WithConetent);
}


module.exports=Gardian;
