const {category} = require('../model/Category')

const InsertData=async(data)=>{
  
var lang = "fr";
var type="Article";

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
              articleCleanDescription : article.contentHtml 
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
                   var newModel = new Model(articledetails);
                   newModel.save((err,doc)=>{
                    if(err)console.log(err)
                 else{
                  console.log("insert")
                    }
                });
             }
          }
      })
         });
}


module.exports={InsertData}