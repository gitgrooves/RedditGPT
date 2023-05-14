// Configuration
const config = {
  checkUrlInterval: 500,
  maxCommentLength: 200,
  maxTotalCharacters: 6000,
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
  n: 1,
  stop: null,
  temperature: 0.8,
};

class SentimentAnalyzer
{
  constructor()
  {
    this.CSSManager = new CSSManager();
    this.apiKeyManager = new ApiKeyManager();
    this.analysisManager = new AnalysisManager(config, this.apiKeyManager); // Update this line
    this.buttonManager = new ButtonManager(this.analysisManager, this.CSSManager);
    this.lastUrl = "";
    this.watchUrlChange();
  }

  watchUrlChange()
  {
    const isRedditCommentUrl = /^https?:\/\/(www\.)?reddit\.com\/r\/.+?\/comments\/.+?\/.+?\/?$/i;
    const isRedditUrl = /^https?:\/\/(www\.)?reddit\.com(\/(r\/[A-Za-z0-9_]+(\/new)?|hot|best|new))?\/?$/i;

    const checkUrlChange = () =>
    {
      if (this.lastUrl !== window.location.href)
      {
        let iterator = this.buttonManager.processedThreadIDs.values();

        for (let value of iterator)
        {
          console.log("nwnwn1 " + value);
        }
        this.buttonManager.processedThreadIDs.clear();
        for (let value of iterator)
        {
          console.log("nwnwn2 " + value);
        }
      }
      
      if (isRedditCommentUrl.test(window.location.href) && this.lastUrl !== window.location.href)
      {
        setTimeout(() =>
        {
          this.mainInThread();
        }, 1);
      }
      if (isRedditUrl.test(window.location.href))
      {
        setTimeout(() =>
        {
          this.mainInPage();
        }, 1);
      }
      this.lastUrl = window.location.href;
      setTimeout(checkUrlChange, config.checkUrlInterval);
    };

    checkUrlChange();
  }

  async mainInThread()
  { 
    this.buttonManager.addButtonsInThread(await this.apiKeyManager.getStoredApiKey());
  }

  async mainInPage()
  {

    this.buttonManager.addButtonsInPage(await this.apiKeyManager.getStoredApiKey());
  }

}
window.SentimentAnalyzer = SentimentAnalyzer;
