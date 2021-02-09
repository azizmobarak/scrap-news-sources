const puppeteer  = require('puppeteer-extra');
const puppeteer_stealth = require('puppeteer-extra-plugin-stealth');
const puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');
const Recaptcha = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

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

var Categories=['coronavirus','world','UK','business','technology','science_and_environment','stories','entertainment_and_arts','health'];

const BBC = () =>{
    (async()=>{
       var browser = await puppeteer.launch({
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
        //navigate to category sub route
        await page.goto(['https://www.bbc.com/news/','',Category].join(''));
      //  await page.waitForNavigation({ waitUntil: 'networkidle0' }) //networkidle0

      // get the data from the page
     var PageData = await page.evaluate((Category)=>{
               
               // function to look for a word inside other words
     const WordExist=(searchIn)=>{
                    if(searchIn.indexOf("second")!=-1){
                         return true;
                         }else{
                       if(searchIn.indexOf("seconds")!=-1){
                      return true;
                       }else{
                         if(searchIn.indexOf("minute")!=-1){
                       return true;
                       }else{
                       if(searchIn.indexOf("minutes")!=-1){
                           return true;
                          }else{
                    if(searchIn.startsWith("1 hour")!=false || searchIn.startsWith("2 hours")!=false || searchIn.startsWith("an hour")!=false){
                                return true;
                         }else{
                            return false;
                        }
                  }
            }
        }
    }
    }
    
     // change the source logo to http 
    var titles = document.querySelectorAll('h3.gs-c-promo-heading__title');
    var images = document.querySelectorAll('div.gs-c-promo-image>div>div>img'); //.gs-o-media-island>div>img
    var time = document.querySelectorAll('time.gs-o-bullet__text>span');
    var link = document.querySelectorAll('.gs-c-promo-body>div>a.gs-c-promo-heading');


    var categoryName=Category;
    if(categoryName==="coronavirus"){
        categoryName="health";
    }else{
        if(categoryName==="world"){
            categoryName="International";
        }else{
            if(categoryName==="science_and_environment"){
                categoryName="science,environment";
            }else{
                if(categoryName==="entertainment_and_arts"){
                    categoryName="entertainment,arts";
                }
            }
        }
    }
                     
         var data =[];
         for(let j=0;j<titles.length;j++){
           
              if((WordExist(typeof(time[j])=="undefined" ? "nothing" : time[j].textContent)==true)  && typeof(time[j])!="undefined" && typeof(titles[j])!="undefined" && images[j].src.indexOf('http')==0  && typeof(link[j])!="undefined" && typeof(images[j])!="undefined")
                    {
                   data.push({
                       time : time[j].textContent,
                       title : titles[j].textContent,
                       link : link[j].href,
                       images : images[j].src,
                       Category:categoryName,
                       source :"BBC NEWS",
                       sourceLink:"https://bbc.com",
                       sourceLogo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATcAAACiCAMAAAATIHpEAAAAflBMVEX///8AAADV1dWcnJwhISH6+vrz8/MYGBg7OztaWlp0dHTPz8/s7Oz39/eXl5f8/PysrKxpaWlNTU2hoaEcHBzi4uJGRkaQkJAMDAy5ublAQEAkJCSJiYnp6elubm6vr6/b29u/v781NTV+fn5YWFgsLCzGxsYRERFjY2ODg4P3WRULAAADz0lEQVR4nO2b2VbqMBRAQ7E4QCkzogwiCvr/P3ihaZEm6SIclkK4e78RciTZq0lPBpUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/6dRnteBvclgZvY1NpcP/SyjKea0Ia22BpbG0bG0tjny+tLONO2vyLebu7tLIMvMnAmwy8ycCbDLzJwJsMvMnAmwy8yTC8PZR5r9bq8PZiBA9k3j5XnXU0HEaT8Uso3gbW9+lw8uXp7dUV/HGqt+nw4A/M2mF4u3fWaXW9vLk7NHs8xdt3YoTH3+F6U6oj96ZU3d9b5AiPNuF6c/Td35uaenobNJzhyShcb+r9DG/KekEopzdzjBbMA/GWzJ8K2sXIWfp6a3SL2FW9CF54edu/ENar193nXn+WfTQmyOv11jgs+kizstTXW+uw6EvZZVXe2nmLmq8/ZavtI9gz6gXirei7Oda8vNWedLCPt7xB43JpZGoLxlutlRWa7ffzls9ZZgKrbG8d3R5Dm4NgvOlZykxgPb3pSav8RnR6i7OKzaPawvGmJzjZOM1Hn9l3ZXnr6oqft+NtkpVZU7uft3VWNjzubZFVXB/XdsXekt5jQbee56Irb28Hwf08I5ubwcryNnRXDMqbA/tBOCHvnVjByvKmDd/fmLe+3Xx/b449DWV6c06swXuz8v1TvDmc294+s6rWPBi4N5Xae3D+z1tipa7/jTdrkXjaut4Sp25ynP40fzOazvKKvt5+8pD73lgvNWwfquK9sDErBuptx1RXNKcpv/wtX6ybqydVkYe4NpZD9ZaLMxNfz/VCPSs0Jy5ledPZ9fKWvOVjyDja8vTmXmgpy1u+cVJ9BBagt7es1Jjcfb3p+dHYEFH2ul43x2OhFY43/bw9yLy5fsblTQ9UZR5f2fdog/GWX0Q2mu/pbeIMVra34vS1fIhzN3sL1NtIb2momae3Ur1efsJgdl459nvzjUvVPNhL2r1VomC8pc09b/ujOd885DB4f0B1PA+pFTPhlmjc2+yuOyz1zp+xl3m93pyYvTxlveCR924ZpBXh5ScuLG+/vM7KeK84QC0/rUF5O2ddH9t3a1TFPYemIzwxwsPxli4c/1Xj6y123C2pvlfz1DLjrW2oa/Q2iOOkzKy5cG9eu7wlVnDHveJU1fe45uuDaW4YyD2uE/jF+5aj73pnOemMu87G4U0G3mTgTQbeZOBNBt5k4E0G3mTgTQbeZFyHN3HXL+atdqxLf0IkJT0n+KxfvrAxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgED4BzguQleqi30iAAAAAElFTkSuQmCC"
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

        var Content = await page.evaluate(()=>{
            var text =  document.querySelector('.ssrcss-5h7eao-ArticleWrapper')==null ? null : document.querySelector('.ssrcss-5h7eao-ArticleWrapper').innerText.replace('Related Topics','').replace('IMAGE COPYRIGHT','').replace('Share','');
            return text;
        });
    
    if(item.images!=null && Content!=null && Content!=""){
          AllData_WithConetent.push({
                time : Date.now(),
                title : item.title,
                link : item.link,
                images : item.images,
                Category:item.Category,
                source :item.source,
                sourceLink:item.sourceLink,
                sourceLogo:item.sourceLogo,
                content:Content!=null ? Content.substring(0,50) : null
          });
       }
    
    }
    
    console.log(AllData_WithConetent)
}


module.exports=BBC;