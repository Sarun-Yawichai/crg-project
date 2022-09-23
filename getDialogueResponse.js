var axios = require("axios");

module.exports = async function main(text) {
  const getDR = await getDialogueResponse(text);
  return getDR;
};

async function getDialogueResponse(text) {
  var data = {
    query: text,
    cutoff: 0.5,
    uuid: "751d9503-5932-4daf-ae07-f50f97393d93",
    channelId: "webchat", //stepContext.context.activity.channelId,
    userId: "webchat", //stepContext.context.activity.from.id,
    userName: "webchat", //stepContext.context.activity.from.name,
    lang: "th",
    compId: "",
  };
  var config = {
    method: "post",
    url: "https://cubikaai.southeastasia.cloudapp.azure.com/cubika/dialogue/v3/getDialogueResponse.action",
    headers: {
      "Content-Type": "application/json",
      Cookie: "JSESSIONID=263D41A0C4D2DFB6B837D08125DE2811",
    },
    data: data,
  };

  let response
  try {
    response = await axios(config);
  } catch (error) {
    console.error(error);
  }
  if (response) {
    return response.data;
  } else {
    return { data: "error" };
  }
}
