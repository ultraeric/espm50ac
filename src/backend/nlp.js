import language from "@google-cloud/language";

const client = new language.LanguageServiceClient();

function requestSentiment(text) {
  const document = {content: text, type: 'PLAIN_TEXT'};
  return client
    .analyzeSentiment({document: document})
    .then(results => {
      const sentiment = results[0].documentSentiment;
      return {score: sentiment.score, magnitude: sentiment.magnitude};
    })
    .catch(err => {
      throw(err);
    });
}

export default requestSentiment;
export {requestSentiment};