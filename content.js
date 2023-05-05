(async () =>
{
  // Initialize SentimentAnalyzer
  const sentimentAnalyzer = new SentimentAnalyzer();

  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) =>
    {
      if (
        request.action === "pageUpdated" &&
        !sentimentAnalyzer.buttonManager.buttonsAdded
      )
      {
        sentimentAnalyzer.main();
      }
    }
  );
})();
