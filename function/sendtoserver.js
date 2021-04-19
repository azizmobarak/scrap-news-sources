module.exports = {
    FormatImage(img){
      try{
        if(img.indexOf('.jpg')!=-1){
            return img.substring(0,img.indexOf('.jpg')+4);
        }else{
            if(img.indexOf('.png')!=-1){
                return img.substring(0,img.indexOf('.png')+4);
            }else{
                if(img.indexOf('.jpeg')!=-1){
                    return img.substring(0,img.indexOf('.jpeg')+5);
                }else{
                  return img;
                    }
            }
        }}catch{
           return null
        }
    }
    }


const axios = require('axios');
async function SendToServer(lng,category,mediaName,mediaLogo){
    await  axios
          .post('https://postgoo-final-api.herokuapp.com/api/v1/sources', {
              sourcesLanguage: lng,
              category: category,
              media: [
                  {
                      mediaName: mediaName,
                      mediaLogo: mediaLogo,
                  },
              ],
          })
          .catch((error) => {
           //   console.error(error);
          });

}

module.exports  = {SendToServer}
