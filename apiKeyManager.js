class ApiKeyManager
{
  async inputApiKey()
  {
    const apiKey = prompt("Please enter your API key:");
    if (!apiKey)
    {
      alert("Please provide a valid API key.");
      return;
    }
    await this.saveApiKey(apiKey);
  }

  async getStoredApiKey()
  {
    return new Promise((resolve) =>
    {
      chrome.storage.local.get("apiKey", (result) =>
      {
        resolve(result.apiKey);
      });
    });
  }

  async saveApiKey(apiKey)
  {
    return new Promise((resolve) =>
    {
      chrome.storage.local.set(
        {
          apiKey,
        },
        () =>
        {
          resolve();
        }
      );
    });
  }

}
window.ApiKeyManager = ApiKeyManager;
