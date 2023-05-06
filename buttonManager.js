
class ButtonManager
{
  constructor(analysisManager)
  {
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
    const style = document.createElement('style');
    style.innerHTML = ` @keyframes pop-in { 0% { opacity: 0; transform: scale(0.5); } 100% { opacity: 1; transform: scale(1); } } @keyframes wiggle { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } 75% { transform: rotate(-3deg); } } `;    document.head.appendChild(style);
    const analysisBox = document.createElement("div");
    analysisBox.style = 'background-color: #f4f4f4; color: #333; padding: 16px; margin-top: 8px; margin-bottom: 8px; margin-left: auto; margin-right: auto; border-radius: 4px; text-align: left; margin-left: 20px; margin-right: 20px; display: flex; justify-content: flex-start; align-items: center; font-size: 14px; font-weight: bold;';
    analysisBox.style.animation = 'pop-in 0.5s ease-out';
    const textWrapper = document.createElement("div");
    textWrapper.style = 'width: 100%; height: 100%; transition: all 1s;';
    analysisBox.appendChild(textWrapper);



    const textSpan = document.createElement("span");
    textWrapper.appendChild(textSpan);

    let i = 0;
    function typeWriter()
    {
      if (i < text.length)
      {
        textSpan.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30); // Adjust the speed of the typing animation (in milliseconds)
      }
      else
      {
        analysisBox.style.animation = 'wiggle 0.5s ease-in-out';
        // Center the text after the typing animation is complete
        setTimeout(() =>
        {
          
          textWrapper.style.display = 'flex';
          textWrapper.style.justifyContent = 'center';
          textWrapper.style.alignItems = 'center';
          textWrapper.style.textAlign = 'center';
          textWrapper.style.width = '100%';
          textWrapper.style.height = '100%';
          
        }, 100); // Delay before centering animation starts (in milliseconds)

      }

    }

    typeWriter();
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
