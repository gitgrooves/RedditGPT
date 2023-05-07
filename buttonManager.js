
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
    const fontLink = document.createElement('link');
    fontLink.href = `https://fonts.googleapis.com/css?family=Orbitron&display=swap`;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    const button = document.createElement("button");
    button.className = className + " btn";
    button.type = "button";

    const strong = document.createElement("strong");
    strong.textContent = text;
    button.appendChild(strong);

    const containerStars = document.createElement("div");
    containerStars.id = "container-stars";
    const stars = document.createElement("div");
    stars.id = "stars";
    containerStars.appendChild(stars);
    button.appendChild(containerStars);

    const glow = document.createElement("div");
    glow.id = "glow";
    const circle1 = document.createElement("div");
    circle1.className = "circle";
    const circle2 = document.createElement("div");
    circle2.className = "circle";
    glow.appendChild(circle1);
    glow.appendChild(circle2);
    button.appendChild(glow);
    return button;
  }


  disableButton(button)
  {
    button.disabled = true;

    // Remove current text content
    button.textContent = '';

    // Create a new strong element with "Loading..." text
    const strongElement = document.createElement('strong');
    strongElement.textContent = 'Loading...';

    // Append the strong element to the button
    button.appendChild(strongElement);
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
    analysisBox.classList.add("analysisBox");

    const textWrapper = document.createElement("div");
    textWrapper.style = 'width: 100%; height: auto; transition: all 1s; padding: 12px; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto;';
    analysisBox.appendChild(textWrapper);

    const strongText = document.createElement("strong");
    textWrapper.appendChild(strongText);

    // Add stars and glow animations
    const containerStars = document.createElement("div");
    containerStars.id = "container-stars";
    const stars = document.createElement("div");
    stars.id = "stars";
    containerStars.appendChild(stars);
    analysisBox.appendChild(containerStars);

    const glow = document.createElement("div");
    glow.id = "glow";
    const circle1 = document.createElement("div");
    circle1.className = "circle";
    const circle2 = document.createElement("div");
    circle2.className = "circle";
    glow.appendChild(circle1);
    glow.appendChild(circle2);
    analysisBox.appendChild(glow);
    // End of stars and glow animations

    let i = 0;
    function typeWriter()
    {
      if (i < text.length)
      {
        strongText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30); // Adjust the speed of the typing animation (in milliseconds)
      } else
      {
        analysisBox.style.animation = 'wiggle 0.5s ease-in-out';
        // Center the text after the typing animation is complete
        setTimeout(() =>
        {
          textWrapper.style.textAlign = 'center';
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
