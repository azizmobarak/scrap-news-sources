
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

