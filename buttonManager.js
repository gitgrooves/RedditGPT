
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

    // Add the necessary CSS styles
    const style = document.createElement('style');
    style.innerHTML = `
    .btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 13rem;
  height: 3rem;
  background-size: 300% 300%;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
  background-image: linear-gradient(#212121, #212121),  linear-gradient(137.48deg, #ffdb3b 10%,#FE53BB 45%, #8F51EA 67%, #0044ff 87%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

#container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
}

strong {
  z-index: 2;
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  letter-spacing: 5px;
  color: #FFFFFF;
  text-shadow: 0 0 4px white;
}


#glow {
  position: absolute;
  display: flex;
  width: 12rem;
}

.circle {
  width: 100%;
  height: 30px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
}

.circle:nth-of-type(1) {
  background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
  background: rgba(142, 81, 234, 0.704);
}

.btn:hover #container-stars {
  z-index: 1;
  background-color: #212121;
}

.btn:hover {
  transform: scale(1.1)
}

.btn:active {
  border: double 4px #FE53BB;
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}

.btn:active .circle {
  background: #FE53BB;
}

#stars {
  position: relative;
  background: transparent;
  width: 200rem;
  height: 200rem;
}

#stars::after {
  content: "";
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
}

#stars::after {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
}

#stars::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
}

#stars::before {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes animStar {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-135rem);
  }
}

@keyframes animStarRotate {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0);
  }
}

@keyframes gradient_301 {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse_3011 {
  0% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
  `;
    document.head.appendChild(style);

    return button;
  }


  disableButton(button)
  {
    button.disabled = true;
    //button.style.backgroundColor = "#c8c8c8";
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
    analysisBox.style = ` background: linear-gradient(145deg, #cacaca, #f0f0f0); color: #333; padding: 16px; margin-top: 8px; margin-bottom: 8px; margin-left: auto; margin-right: auto; border-radius: 38px; box-shadow: 6px 6px 32px #5a5a5a, -6px -6px 32px #ffffff; text-align: left; margin-left: 20px; margin-right: 20px; display: flex; justify-content: flex-start; align-items: center; font-size: 14px; font-weight: bold; `;
    const textWrapper = document.createElement("div");
    textWrapper.style = 'width: 100%; height: 100%; transition: all 1s; padding: 5px;';
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
