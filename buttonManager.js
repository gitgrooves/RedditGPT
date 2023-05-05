
class ButtonManager
{
  constructor(analysisManager)
  {
    this.analysisManager = analysisManager;
    this.summaryButton = null;
    this.sentimentButton = null;
    this.buttonsAdded = false;
  }

  resetButtons()
  {
    if (this.summaryButton)
    {
      this.summaryButton.remove();
      this.buttonsAdded = false;
    }
    if (this.sentimentButton)
    {
      this.sentimentButton.remove();
      this.buttonsAdded = false;
    }
  }

  addButtons(storedApiKey)
  {
    const buttonContainer = this.createButtonContainer();
    const commentsThreadFilterDiv = document.querySelector('#CommentSort--SortPicker').parentNode.parentNode.parentNode;

    this.summaryButton = this.createSummaryButton(storedApiKey, commentsThreadFilterDiv);
    this.sentimentButton = this.createSentimentButton(storedApiKey, commentsThreadFilterDiv);

    buttonContainer.appendChild(this.summaryButton);
    buttonContainer.appendChild(this.sentimentButton);
    this.insertAfter(buttonContainer, commentsThreadFilterDiv);
  }

  createButtonContainer()
  {
    const buttonContainer = document.createElement("div");
    buttonContainer.style = `
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8px;
        margin-bottom: 8px;
        margin-left: auto;
        margin-right: auto;
      `;
    return buttonContainer;
  }

  createSummaryButton(storedApiKey, commentsThreadFilterDiv)
  {
    const prompt = 'create a summary of it, start with Summary: ';
    return this.createAnalysisButton(storedApiKey, commentsThreadFilterDiv, "Summary", "summary-analysis", prompt);
  }

  createSentimentButton(storedApiKey, commentsThreadFilterDiv)
  {
    const prompt = 'create a short,50 character max, sentiment analysis of it, be direct, dont give me a summary of the comments and start with Sentiment Analysis: ';
    return this.createAnalysisButton(storedApiKey, commentsThreadFilterDiv, "Sentiment Analysis", "sentiment-analysis", prompt);
  }

  createAnalysisButton(storedApiKey, commentsThreadFilterDiv, text, className, prompt)
  {
    const button = this.createButton(text, className);
    button.onclick = async () =>
    {
      this.disableButton(button);
      const comments = this.analysisManager.extractComments();
      const analysis = await this.analysisManager.getAnalysis(storedApiKey, comments, prompt);
      const analysisBox = this.createAnalysisBox(analysis);
      this.enableButton(button, text);
      button.style.display = "none";
      this.insertAfter(analysisBox, commentsThreadFilterDiv);
    };
    return button;
  }

  createButton(text, className)
  {
    const button = document.createElement("button");
    button.className = className;
    button.textContent = text;
    button.style = 'margin: 8px; padding: 10px 12px; font-size: 14px; font-weight: bold; color: #fff; background-color: #0079d3; border: none; border-radius: 4px; cursor: pointer;';
    return button;
  }

  disableButton(button)
  {
    button.disabled = true;
    button.style.backgroundColor = "#c8c8c8";
    button.textContent = "Loading...";
  }

  enableButton(button, buttonText)
  {
    button.disabled = false;
    button.style.backgroundColor = "#0079d3";
    button.textContent = buttonText;
  }

  createAnalysisBox(text)
  {
    const analysisBox = document.createElement("div");
    analysisBox.style = 'background-color: #f4f4f4; color: #333; padding: 16px; margin-top: 8px; margin-bottom: 8px; margin-left: auto; margin-right: auto; border-radius: 4px; text-align: center; margin-left: 20px; margin-right: 20px; display: flex; justify-content: center; align-items: center; font-size: 12px; font-weight: bold;';
    analysisBox.textContent = `${text}`;
    return analysisBox;
  }

  insertAfter(newElement, referenceElement)
  {
    if (referenceElement.nextSibling)
    {
      referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
    } else
    {
      referenceElement.parentNode.appendChild(newElement);
    }
  }
}
window.ButtonManager = ButtonManager;
