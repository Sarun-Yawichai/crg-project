// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

// Creates a client
const client = new speech.SpeechClient();
const storage = new Storage();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const filename = __dirname + "\\server\\audio\\recording2.wav";
const encoding = "LINEAR16";
const sampleRateHertz = 48000;
const languageCode = "th-TH";
const audio_channel_count = 2;

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  audio_channel_count: audio_channel_count,
};

module.exports = async function main() {
  /**
   * Note that transcription is limited to 60 seconds audio.
   * Use a GCS file for audio longer than 1 minute.
   */
  const audio = {
    content: fs.readFileSync(filename).toString("base64"),
  };

  const request = {
    config: config,
    audio: audio,
  };
  const gSTT = await stt(request);
  // console.log(gSTT);
  return gSTT;
};

async function stt(request) {
  //   await listBuckets();
  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  // console.log(`Transcription: ${transcription}`);
  return transcription;
}
