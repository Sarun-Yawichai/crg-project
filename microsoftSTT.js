var axios = require("axios");
const path = require("path");
const fs = require("fs");
const { mainModule } = require("process");

module.exports = async function main(){
  const msSTT = await stt();
  // console.log(msSTT.DisplayText);
  return msSTT.DisplayText
}

async function issueToken() {
  // console.log("issueToken() called");
  var config = {
    method: "post",
    url: "https://southeastasia.api.cognitive.microsoft.com/sts/v1.0/issueToken",
    headers: {
      "Ocp-Apim-Subscription-Key": "de87d754d15947dbab745bb58567aa1e",
    },
  };
  let token;
  try {
    token = await axios(config);
    return token.data;
  } catch (error) {
    // do something with error
    // token.data = "";
    console.log(error);
    return "";
  }
  //   console.log(token.data);
}

async function stt() {
  // console.log("stt() called");
  const token = await issueToken();
//   console.log(token);
  if (token) {
    const fname = path.join("./server/audio/recording2.wav");
    //   const fname = path.join("./server/audio/recording2.wav");
    const fileInfo = fs.statSync(fname);
    const fileContent = Buffer.from(fs.readFileSync(fname, "binary"), "binary");
    // console.log(fileContent);
    var data = fileContent;
    var config = {
      method: "post",
      url: "https://southeastasia.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=th-TH",
      headers: {
        "Content-type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        //   "Content-type": "audio/ogg; codecs=opus",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      data: data,
    };

    let axiosData;
    try {
      axiosData = await axios(config);
      // console.log("==================axiosData.data==================");
      // console.log(axiosData.data);
      // console.log("==================================================");
    } catch (error) {
      axiosData.data = "";
    }

    return axiosData.data;
  } else {
    return "";
  }

  //   var axiosData = await

  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
}
