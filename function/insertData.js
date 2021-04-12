const {category} = require('../model/Category')

const InsertData=async(data)=>{
  
var lang = "es";
var type="Article";
var second_categorie ="uruguay"  
    data.map(article=>{

        var articleCateory = article.Category;
             
          var articledetails ={
              articleTitle : article.title,
              articleSourceLink : article.link,
              articleImageURL : article.images,
              categoryName:articleCateory,
              mediaName :article.source,
              mediaLogo:article.sourceLogo,
              mediaName:article.source,
              articleType:type,
              authorName : article.author,
              articleLanguage:lang,
              articleDescription:article.content,
              articleCleanDescription : article.contenthtml
      }

      
       var Model =  category("articles");
      Model.find({$and : [
          {articleSourceLink:articledetails.articleSourceLink},
          {categoryName:articledetails.categoryName}
        ]},(err,doc)=>{
          if(err) console.log(err)
          else{
             if(typeof doc[0]!="undefined"){
             } else{
                 
            for(let i=0;i<2;i++){
            if(i==0){
                var newModel = new Model(articledetails);
                newModel.save((err,doc)=>{
                   if(err)console.log(err)
                  else{
                     console.log("insert")
                   }
               });
            }else{
               if(articledetails.categoryName!=second_categorie && articledetails.categoryName!="international"){
                articledetails.categoryName=second_categorie;
                var newModel = new Model(articledetails);
                newModel.save((err,doc)=>{
                   if(err)console.log(err)
                  else{
                     console.log("insert 2")
                     }
                 });
               }
               }
            }
             }
          }
      })
         });
}


module.exports={InsertData}