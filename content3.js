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
      this.sentimentButton = null;
      this.buttonAdded = false;
      this.lastUrl = window.location.href;
  }

  watchUrlChange()
  {
      if (this.lastUrl !== window.location.href)
      {
          this.lastUrl = window.location.href;
          this.resetButton();
          this.main();
      }
      setTimeout(() => this.watchUrlChange(), config.checkUrlInterval);
  }

  async main()
  {
      if (this.buttonAdded) return;
      this.buttonAdded = true;

      const storedApiKey = await this.getStoredApiKey();
      if (!storedApiKey) await this.inputApiKey();

      this.addButton(storedApiKey);
  }

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
              apiKey
          }, () =>
          {
              resolve();
          });
      });
  }

  resetButton()
  {
      if (this.sentimentButton)
      {
          this.sentimentButton.remove();
          this.buttonAdded = false;
      }
  }

  addButton(storedApiKey)
  {
      this.sentimentButton = document.createElement("button");
      this.sentimentButton.className = "sentiment-analysis";
      this.sentimentButton.textContent = "Comment Analysis";
      this.sentimentButton.style = `
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 8px;
    padding: 10px 12px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #0079d3;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: block;
    margin-left: auto;
    margin-right: auto;
  `;

      const commentsThreadFilterDiv = document.querySelector('#CommentSort--SortPicker').parentNode.parentNode.parentNode;
      this.sentimentButton.onclick = async () =>
      {
          this.sentimentButton.disabled = true;
          this.sentimentButton.style.backgroundColor = "#c8c8c8";
          this.sentimentButton.textContent = "Loading...";
          const comments = this.extractComments();

          const sentiment = await this.getSentimentAnalysis(storedApiKey, comments);
          const sentimentBox = document.createElement("div");
          sentimentBox.style = `
      background-color: #f4f4f4;
      color: #333;
      padding: 16px;
      margin-top: 8px;
      margin-bottom: 8px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 4px;
      text-align: center;
      margin-left: 20px;
      margin-right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
    `;
          sentimentBox.textContent = `${sentiment}`;
          this.sentimentButton.disabled = false;
          this.sentimentButton.style.backgroundColor = "#0079d3";
          this.sentimentButton.textContent = "Comment Analysis";

          this.sentimentButton.style.display = "none";
          this.insertAfter(sentimentBox, commentsThreadFilterDiv);
      };
      this.insertAfter(this.sentimentButton, commentsThreadFilterDiv);
  }

  extractComments() {
    let totalCharacters = 0;
    const comments = [];
  
    const commentElements = Array.from(document.querySelectorAll('div[data-testid="comment"]'));
    const filteredElements = [];
  
    for (let i = 0; i < commentElements.length; i++) {
      const comment = commentElements[i];
      const levelSpan = comment.parentNode.querySelector('span');
      if (levelSpan) {
        const levelText = levelSpan.innerText;
  
        if (levelText === 'level 1') {
          filteredElements.push(comment);
          let level2Count = 0;
  
          for (let j = i + 1; j < commentElements.length && level2Count < 2; j++) {
            const nextComment = commentElements[j];
            const nextLevelSpan = nextComment.parentNode.querySelector('span');
            if (nextLevelSpan && nextLevelSpan.innerText === 'level 2') {
              filteredElements.push(nextComment);
              level2Count++;
            } else if (nextLevelSpan && nextLevelSpan.innerText === 'level 1') {
              break;
            }
          }
        }
      }
    }
  
    filteredElements.forEach((comment) => {
      if (totalCharacters >= config.maxTotalCharacters) {
        return;
      }
      const levelSpan = comment.parentNode.querySelector('span');
      const levelText = levelSpan ? levelSpan.innerText : '';
      const prefix = levelText === 'level 2' ? 'Reply to previous comment: ' : '';
      const text = prefix + comment.innerText.substring(0, config.maxCommentLength);
      const commentLength = text.length;
      if (totalCharacters + commentLength <= config.maxTotalCharacters) {
        comments.push(text);
        totalCharacters += commentLength;
      } else {
        const remainingCharacters = config.maxTotalCharacters - totalCharacters;
        const truncatedText = text.substring(0, remainingCharacters);
        comments.push(truncatedText);
        totalCharacters += remainingCharacters;
      }
    });
  
    console.log(comments);
    return comments;
  }
  
  
  

  async getSentimentAnalysis(apiKey, comments)
  {
      const commentSection = comments.join('\n\n');
      const requestOptions = {
          method: 'POST',
          headers:
          {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(
          {
              'model': 'gpt-3.5-turbo',
              'messages': [
              {
                  'role': 'system',
                  'content': 'You are a general sentiment detector. You will receive a text with all the content of a Reddit post\'s comment section and you will provide the general sentiment of that thread\'s comment section.'
              },
              {
                  'role': 'user',
                  'content': commentSection
              }],
              'n': 1,
              'stop': null,
              'temperature': 0.8
          })
      };

      const response = await fetch(config.apiUrl, requestOptions);

      if (response.status === 401)
      {
          alert('Invalid API key!');
          await this.inputApiKey();
          location.reload();
          return null;
      }

      const data = await response.json();
      return data.choices[0].message.content;
  }

  insertAfter(newElement, referenceElement)
  {
      if (referenceElement.nextSibling)
      {
          referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
      }
      else
      {
          referenceElement.parentNode.appendChild(newElement);
      }
  }
}

const sentimentAnalyzer = new SentimentAnalyzer();
sentimentAnalyzer.watchUrlChange();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) =>
{
  if (request.action === "pageUpdated" && !sentimentAnalyzer.buttonAdded)
  {
      sentimentAnalyzer.main();
  }
});