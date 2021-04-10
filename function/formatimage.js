
module.exports = {
    FormatImage(img){
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
        }
    }
    }