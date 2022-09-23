const microsoftSTT = require("./microsoftSTT");
const googleSTT = require("./googleSTT");
const getDialogueResponse = require("./getDialogueResponse");

main();

async function main() {
  // console.log("=====================microsoftSTT======================");
  // const ms = await microsoftSTT();
  // console.log(ms);
  console.log("=====================googleSTT=========================");
  const g = await googleSTT();
  console.log(g);
  // console.log("=====================getDialogueResponse=========================");
  // const getDR = await getDialogueResponse("the giant 1");
  // console.log(getDR);
}
