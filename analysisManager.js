

class AnalysisManager
{
  constructor(config, apiKeyManager)
  {
    this.config = config;
    this.apiKeyManager = apiKeyManager; // Add this line
  }

  async getPostDataFromAPI(threadID)
  {
    try
    {
      const response = await fetch(`https://api.reddit.com/comments/${threadID}.json`);

      if (!response.ok)
      {
        throw new Error('Failed to fetch data from Reddit API');
      }

      const data = await response.json();
      const post = data[0].data.children[0].data;

      if (post.is_self)
      {
        return post.selftext;
      } else
      {
        console.log('This post is not a text post.');
      }
    } catch (error)
    {
      console.error('Error:', error);
    }
  }

  async isTextPost(threadID)
  {
    try
    {
      const response = await fetch(`https://api.reddit.com/comments/${threadID}.json`);

      if (!response.ok)
      {
        return false;
      }

      const data = await response.json();
      const post = data[0].data.children[0].data;

      if (post.is_self)
      {
        if (post.selftext.length > 1000)
          return true;
        else
          return false;

        
      } else
      {
        return false;
      }
    } catch (error)
    {
      return false;
    }
  }


  extractPost()
  {
    const postContentDiv = document.querySelector('div[data-test-id="post-content"]');
    const mediaDiv = postContentDiv.querySelector('div[data-adclicklocation="media"]');
    const mediaChildElements = mediaDiv.querySelectorAll('*'); // select all child elements of mediaDiv
    console.log("Post content: " + mediaChildElements[0].textContent.trim());
    return mediaChildElements[0].textContent.trim();
  }

  extractComments()
  {
    const comments = [];
    let totalCharacters = 0;

    const commentElements = Array.from(document.querySelectorAll('div[data-testid="comment"]'));

    for (let i = 0; i < commentElements.length; i++)
    {
      const comment = commentElements[i];
      const levelSpan = comment.parentNode.querySelector('span');

      if (!levelSpan || levelSpan.innerText !== 'level 1')
      {
        continue;
      }

      const filteredElements = [comment];
      let level2Count = 0;

      for (let j = i + 1; j < commentElements.length && level2Count < 2; j++)
      {
        const nextComment = commentElements[j];
        const nextLevelSpan = nextComment.parentNode.querySelector('span');

        if (nextLevelSpan && nextLevelSpan.innerText === 'level 2')
        {
          filteredElements.push(nextComment);
          level2Count++;
        } else if (nextLevelSpan && nextLevelSpan.innerText === 'level 1')
        {
          break;
        }
      }

      filteredElements.forEach((comment) =>
      {
        if (totalCharacters >= config.maxTotalCharacters)
        {
          return;
        }

        const levelSpan = comment.parentNode.querySelector('span');
        const levelText = levelSpan ? levelSpan.innerText : '';
        const prefix = levelText === 'level 2' ? 'Reply to previous comment: ' : '';
        const text = prefix + comment.innerText.substring(0, config.maxCommentLength);
        const commentLength = text.length;

        if (totalCharacters + commentLength <= config.maxTotalCharacters)
        {
          comments.push(text);
          totalCharacters += commentLength;
        } else
        {
          const remainingCharacters = config.maxTotalCharacters - totalCharacters;
          const truncatedText = text.substring(0, remainingCharacters);
          comments.push(truncatedText);
          totalCharacters += remainingCharacters;
        }
      });
    }

    console.log("Comments content: " + comments);
    return comments;
  }

  async getAnalysis(apiKey, content, prompt)
  {
    var apikey2 = await this.apiKeyManager.getStoredApiKey();
    
    try 
    {
      content = content.join('\n\n');
    }
    catch (error)
    {
      content = content;
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apikey2}`,
      },
      body: JSON.stringify({
        'model': 'gpt-3.5-turbo',
        'messages': [
          {
            'role': 'system',
            'content': `You are a language model. You will receive a text with all the content of a Reddit post's comment section or Post's content and you will, in english,  ${prompt}.`,
          },
          {
            'role': 'user',
            'content': content,
          },
        ],
        'n': 1,
        'stop': null,
        'temperature': 0.1,
      }),
    };

    const response = await fetch(config.apiUrl, requestOptions);

    if (response.status === 401)
    {
      alert('Invalid API key!');
      await this.apiKeyManager.inputApiKey(); // Update this line
      return await this.getAnalysis(apikey2, content, prompt);
    }
    const data = await response.json();
    return data.choices[0].message.content;
   
  }
}
window.AnalysisManager = AnalysisManager;
