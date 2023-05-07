
class ButtonManager
{
  constructor(analysisManager,CSSManager)
  {
    this.CSSManager = CSSManager;
    this.analysisManager = analysisManager;
    this.commentSummaryButton = null;
    this.postSummaryButton = null;
    this.sentimentButton = null;
    this.buttonsAdded = false;
  }

  resetButtons()
  {
    if (this.postSummaryButton)
    {
      this.postSummaryButton.remove();
      this.buttonsAdded = false;
    }
    if (this.commentSummaryButton)
    {
      this.commentSummaryButton.remove();
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
    this.resetButtons();
    this.buttonsAdded = true;
    try
    {
      const postContent = this.analysisManager.extractPost();
      if (postContent.length > 1000)
      {
        const buttonContainerPost = this.createButtonContainer();
        const postEndDiv = document.querySelector('div[data-test-id="post-content"] div[data-adclicklocation="media"]').lastElementChild;
        this.postSummaryButton = this.createPostSummaryButton(storedApiKey, postEndDiv);
        buttonContainerPost.appendChild(this.postSummaryButton);
        this.insertAfter(buttonContainerPost, postEndDiv);
      }
    }
    catch (error)
    {
      console.log("Post Text non existing")
    }

    const buttonContainerComments = this.createButtonContainer();
    const commentsThreadFilterDiv = document.querySelector('#CommentSort--SortPicker').parentNode.parentNode.parentNode;
    
    this.commentSummaryButton = this.createCommentSummaryButton(storedApiKey, commentsThreadFilterDiv);
    this.sentimentButton = this.createSentimentButton(storedApiKey, commentsThreadFilterDiv);
    
    buttonContainerComments.appendChild(this.commentSummaryButton);
    buttonContainerComments.appendChild(this.sentimentButton);
    
    this.insertAfter(buttonContainerComments, commentsThreadFilterDiv);
  }

  createButtonContainer()
  {
    const buttonContainer = document.createElement("div");
    this.CSSManager.createButtonContainerStyle(buttonContainer);
    return buttonContainer;
  }
  
  createPostSummaryButton(storedApiKey, commentsThreadFilterDiv)
  {
    const prompt = 'create a summary and sentiment analysis of it, start with Post Summary: ';
    return this.createAnalysisButton(storedApiKey, commentsThreadFilterDiv, "Post Summary", "post-summary-analysis", prompt,"post");
  }

  createCommentSummaryButton(storedApiKey, commentsThreadFilterDiv)
  {
    const prompt = 'create a summary of it, start with Comments Summary: ';
    return this.createAnalysisButton(storedApiKey, commentsThreadFilterDiv, "Summary", "comments-summary-analysis", prompt, "comments");
  }

  createSentimentButton(storedApiKey, commentsThreadFilterDiv)
  {
    const prompt = 'create a short, sentiment analysis of these comments, be direct, dont give me a summary of the comments and start with Comments Sentiment Analysis: ';
    return this.createAnalysisButton(storedApiKey, commentsThreadFilterDiv, "Sentiment Analysis", "sentiment-analysis", prompt, "comments");
  }

  createAnalysisButton(storedApiKey, commentsThreadFilterDiv, text, className, prompt, analysisType)
  {
    
    const button = this.createButton(text, className);
    button.onclick = async () =>
    {
      this.disableButton(button);
      var content = "empty";
      if (analysisType == "post")
        content = this.analysisManager.extractPost();
      else if (analysisType == "comments")
        content = this.analysisManager.extractComments();
      const analysis = await this.analysisManager.getAnalysis(storedApiKey, content, prompt);
      const analysisBox = this.createAnalysisBox(analysis, button);
      this.insertAfter(analysisBox, commentsThreadFilterDiv);
    };
    return button;
  }

  createButton(text, className)
  {
    const button = document.createElement("button");
    this.CSSManager.createButtonStyle(button,text,className);
    return button;
  }


  disableButton(button)
  {
    button.disabled = true;
    this.CSSManager.disableButtonStyle(button);
  }

  enableButton(button, buttonText)
  {
    button.disabled = false;
    button.style.backgroundColor = "#0079d3";
    button.textContent = buttonText;
  }

  createAnalysisBox(text, button)
  {
    const analysisBox = document.createElement("div");
    this.CSSManager.createAnalysisBoxStyle(text, analysisBox, button);  
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
