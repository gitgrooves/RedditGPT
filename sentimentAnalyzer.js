// Configuration
const config = {
  checkUrlInterval: 1000,
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
    this.buttonManager = new ButtonManager(this.analysisManager);
    this.lastUrl = window.location.href;
    this.watchUrlChange();
  }

  watchUrlChange()
  {
    const isRedditCommentUrl = /^https?:\/\/(www\.)?reddit\.com\/r\/.+?\/comments\/.+?\/.+?\/?$/i;

    const checkUrlChange = () =>
    {
      
      if (isRedditCommentUrl.test(window.location.href) && this.lastUrl !== window.location.href)
      {
        setTimeout(() =>
        {
          this.main();
        }, 2000);
        
      }
      this.lastUrl = window.location.href;
      setTimeout(checkUrlChange, config.checkUrlInterval);
    };

    checkUrlChange();
  }

  async main()
  { 
    const storedApiKey = await this.apiKeyManager.getStoredApiKey();
    if (!storedApiKey) await this.apiKeyManager.inputApiKey();

    this.buttonManager.addButtons(await this.apiKeyManager.getStoredApiKey());
  }
}
window.SentimentAnalyzer = SentimentAnalyzer;
