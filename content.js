// Wait for the page to load completely
window.addEventListener('load', async () => 
{

  async function inputAPIkey() 
  {
    storedApiKey = prompt("Please enter your API key:");
    if (!storedApiKey) {
      alert("Please provide a valid API key.");
      return;
    }
    // Save API key to Chrome storage for future use
    await saveApiKey(storedApiKey);
  }

    var storedApiKey = await getStoredApiKey();
  if (!storedApiKey) {
    // If API key is not stored, prompt user to enter it
    await inputAPIkey();
    
  }
    // Function to add the sentiment analysis button
    function addButton() {
        /*const saveButtonDiv = document.querySelector("div.usertext-buttons");
        if (!saveButtonDiv) return;*/
      
        const sentimentButton = document.createElement("button");
        sentimentButton.className = "sentiment-analysis";
        sentimentButton.textContent = "Comment Analysis";
        sentimentButton.style.marginTop = "8px";
        sentimentButton.style.marginBottom = "8px";
        sentimentButton.style.marginLeft = "8px";
        sentimentButton.style.padding = "6px 12px";
        sentimentButton.style.fontSize = "14px";
        sentimentButton.style.fontWeight = "bold";
        sentimentButton.style.color = "rgb(255, 255, 255)";
        sentimentButton.style.backgroundColor = "rgb(0, 121, 211)";
        sentimentButton.style.border = "none";
        sentimentButton.style.borderRadius = "4px";
        sentimentButton.style.cursor = "pointer";
        sentimentButton.style.padding = "10px";
        sentimentButton.style.boxSizing = "border-box";
        sentimentButton.style.display = "block";
        sentimentButton.style.marginLeft = "auto";
        sentimentButton.style.marginRight = "auto";
      
        const siteTable = document.querySelector('.sitetable.nestedlisting') || document.querySelector('#comment-tree');

        const messageReportTemplate = document.querySelector(
          "#message-report-template"
        ) || document.querySelector('[bundlename="comment_body_header"], #comment-tree');
        
        sentimentButton.onclick = async () => {
          
          sentimentButton.disabled = true;
          sentimentButton.style.backgroundColor = "rgb(200, 200, 200)";
          sentimentButton.textContent = "Loading...";
        
          const comments = extractComments();
          const sentiment = await getChatGPTResponse(storedApiKey, comments);
      
          const sentimentBox = document.createElement("div");
          sentimentBox.style.backgroundColor = "#f4f4f4";
          sentimentBox.style.color = "#333"; // make text more contrast
          sentimentBox.style.padding = "16px";
          sentimentBox.style.marginTop = "8px";
          sentimentBox.style.marginBottom = "8px";
          sentimentBox.style.marginLeft = "auto";
          sentimentBox.style.marginRight = "auto";
          sentimentBox.style.borderRadius = "4px";
          sentimentBox.style.textAlign = "center";
          sentimentBox.style.marginLeft = "20px";
          sentimentBox.style.marginRight = "20px";
          sentimentBox.style.display = "flex";
          sentimentBox.style.justifyContent = "center";
          sentimentBox.style.alignItems = "center";
          sentimentBox.style.fontSize = "12px"; // make text a bit bigger
          sentimentBox.style.fontWeight = "bold"; // make text bold
          sentimentBox.textContent = `${sentiment}`;

      
          sentimentButton.disabled = false;
          sentimentButton.style.backgroundColor = "rgb(0, 121, 211)";
          sentimentButton.textContent = "Comment Analysis";
          sentimentButton.style.display = "none";
      
          messageReportTemplate.parentNode.insertBefore(sentimentBox, siteTable);
        };
      
        messageReportTemplate.parentNode.insertBefore(sentimentButton, siteTable);
      }
      

      
      
      
      
    addButton();


    function getStoredApiKey() {
      return new Promise((resolve) => {
        chrome.storage.local.get("apiKey", (result) => {
          resolve(result.apiKey);
        });
      });
    }

    // Function to save the API key to Chrome storage
  function saveApiKey(apiKey) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ apiKey }, () => {
        resolve();
      });
    });
  }

    function extractComments() {
      const MAX_COMMENT_LENGTH = 200; // set maximum comment length to 200 characters
      const MAX_TOTAL_CHARACTERS = 6000; // set maximum total number of characters to 15000
      let totalCharacters = 0;
      const comments = [];
      const commentElements = document.querySelectorAll('div.entry div.md')  ;
      commentElements.forEach((comment) => {
        if (totalCharacters >= MAX_TOTAL_CHARACTERS) {
          // stop extracting comments if maximum total number of characters has been reached
          return;
        }
        const text = comment.innerText.substring(0, MAX_COMMENT_LENGTH); // truncate comment to maximum length
        const commentLength = text.length;
        if (totalCharacters + commentLength <= MAX_TOTAL_CHARACTERS) {
          comments.push(text);
          totalCharacters += commentLength;
        } else {
          // if adding this comment would exceed the maximum total number of characters, truncate the comment
          const remainingCharacters = MAX_TOTAL_CHARACTERS - totalCharacters;
          const truncatedText = text.substring(0, remainingCharacters);
          comments.push(truncatedText);
          totalCharacters += remainingCharacters;
        }
      });
      return comments;
    }
    
    

  
  
    // Function to call ChatGPT API
    async function getChatGPTResponse(apiKey, comments) {
      const API_URL = 'https://api.openai.com/v1/chat/completions';
      const commentSection = comments.join('\n\n');
    
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          'model': 'gpt-3.5-turbo',
          'messages': [
            {
              'role': 'system',
              'content': 'You are a general sentiment detector. You will receive a text with all the content of a Reddit post\'s comment section and you will provide a summary of the thread, and then the general sentiment of that thread\'s comment section.'
            },
            {
              'role': 'user',
              'content': commentSection
            }
          ],
          'n': 1,
          'stop': null,
          'temperature': 0.8
        })
      };
    
      const response = await fetch(API_URL, requestOptions);
    
      if (response.status === 401) {
        alert('Invalid API key!');
        await inputAPIkey();
        location.reload();
        return null;
      }
    
      const data = await response.json();
      return data.choices[0].message.content;
    }
    
  
  });
  