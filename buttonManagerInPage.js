
class ButtonManagerInPage
{
  constructor(analysisManager,CSSManager)
  {
    this.CSSManager = CSSManager;
    this.analysisManager = analysisManager;
    this.commentSummaryButton = null;
    this.postSummaryButton = null;
    this.sentimentButton = null;
    this.buttonsAdded = false;
    this.processedThreadIDs = new Set();
  }

  addButtonsInPage(storedApiKey)
  {
    const mainThreadDivs = document.querySelectorAll('.scrollerItem[data-testid="post-container"]');

    mainThreadDivs.forEach((mainThreadDiv) =>
    {
      const redditThreadID = mainThreadDiv.id.split('_')[1];

      if (!this.processedThreadIDs.has(redditThreadID))
      {
        this.processedThreadIDs.add(redditThreadID);

        const mainThreadDivChild = mainThreadDiv.lastChild;
        const mainThreadTextContent = mainThreadDivChild.lastChild.lastChild.lastChild;
        const h1Element = document.createElement('h1');
        const h1Text = document.createTextNode('Test');
        h1Element.appendChild(h1Text);
        mainThreadTextContent.appendChild(h1Element);
      }
    });
  }

}
window.ButtonManagerInPage = ButtonManagerInPage;