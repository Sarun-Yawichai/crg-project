const express = require("express");
const fs = require("fs");
const multer = require("multer");
var axios = require("axios");
const path = require("path");
const cors = require("cors");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const microsoftSTT = require("./microsoftSTT");
const googleSTT = require("./googleSTT");
const getDialogueResponse = require("./getDialogueResponse");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const port = process.env.PORT || 3000;
const app = express();
// app.use(upload.array());
app.use(cors());
app.use(express.static(__dirname + "/public/"));
app.use(express.json());
app.get("/", (req, res) => {
  //   res.send("Hello World!");
  res.sendFile(__dirname + "/index.html");
});
app.get("/siri", (req, res) => {
  //   res.send("Hello World!");
  res.sendFile(__dirname + "public/Siri/index.html");
});
app.get("/kitchen", (req, res) => {
  res.sendFile(__dirname + "public/Kitchen/index.html");
});
app.post("/upload", upload.single("recording"), async (req, res) => {
  console.log("/upload");
  // console.log(req.query.engine);

  var engine = "";
  if (req.query.engine) {
    engine = req.query.engine;
  } else {
    engine = "1";
  }
  // console.log(req.file);
  const { buffer: recording } = req.file;
  // console.log("recording");
  // console.log(recording);
  const PathLike = "server/audio/recording2.wav";
  fs.open(PathLike, "w+", (err, fd) => {
    fs.writeFile(fd, recording, (err) => {
      fs.close(fd, async (err) => {
        let sttData = "";
        if (engine == "1") {
          console.log("Engine : 1");
          const ms = await microsoftSTT();
          sttData = ms;
        } else if (engine == "2") {
          console.log("Engine : 2");
          const g = await googleSTT();
          sttData = g;
        }
        console.log("Text = " + sttData);
        res.status(201).send(sttData);
      });
    });
  });
});

app.post("/uploadms", upload.single("recording"), async (req, res) => {
  console.log("/uploadms");
  const { buffer: recording } = req.file;
  const PathLike = "server/audio/recording2.wav";
  fs.open(PathLike, "w+", (err, fd) => {
    fs.writeFile(fd, recording, (err) => {
      fs.close(fd, async (err) => {
        const speechConfig = sdk.SpeechConfig.fromSubscription(
          "de87d754d15947dbab745bb58567aa1e",
          "southeastasia"
        );
        speechConfig.speechRecognitionLanguage = "th-TH";
        let audioConfig = sdk.AudioConfig.fromWavFileInput(
          fs.readFileSync("./server/audio/recording2.wav")
        );
        let speechRecognizer = new sdk.SpeechRecognizer(
          speechConfig,
          audioConfig
        );
        speechRecognizer.recognizeOnceAsync(async function (result) {
          let sttData = result.text;
          console.log("Text = " + sttData);
          res.status(201).send(sttData);
          speechRecognizer.close();
        });
      });
    });
  });
});

app.post("/upload2", async (req, res) => {
  const recording = req.body.recording;
  const recording2 = req.body.recording2;
  console.log("recording : " + recording);
  console.log("recording2 : " + recording2);
  res.send("recieved your request!");
});

app.get("/getDialogueResponse", async (req, res) => {
  console.log("/getDialogueResponse");
  var text = "";
  if (req.query.text) {
    text = req.query.text;
  } else {
    text = "-";
  }
  const getDR = await getDialogueResponse(text);
  console.log(getDR);
  res.send(getDR);
  // console.log(getDR);
});

var Order = [];

app.post("/setOrder", function (request, response) {
  console.log(request.body);
  Order = request.body;
  response.send(Order); // echo the result back
});
app.post("/addOrder", function (request, response) {
  console.log(request.body);
  Order.push(request.body)
  response.send(Order); // echo the result back
});
app.get("/getOrder", function (request, response) {
  response.send(Order); // echo the result back
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// const fs = require('fs');

// const content = 'Some content!';

// fs.writeFile('./server/audio2/testaa.txt', content, err => {
//   if (err) {
//     console.error(err);
//   }
//   // file written successfully
// });

async function issueToken() {
  console.log("issueToken() called");
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
    return "";
  }
  //   console.log(token.data);
}

async function stt() {
  console.log("stt() called");
  const token = await issueToken();
  // console.log(token);
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
      console.log("==================axiosData.data==================");
      console.log(axiosData.data);
      console.log("==================================================");
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
