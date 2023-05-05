

class AnalysisManager
{
  constructor(config)
  {
    this.config = config;
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

    console.log(comments);
    return comments;
  }

  async getAnalysis(apiKey, comments, prompt)
  {
    const commentSection = comments.join('\n\n');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        'model': 'gpt-3.5-turbo',
        'messages': [
          {
            'role': 'system',
            'content': `You are a language model. You will receive a text with all the content of a Reddit post's comment section and you will ${prompt}.`,
          },
          {
            'role': 'user',
            'content': commentSection,
          },
        ],
        'n': 1,
        'stop': null,
        'temperature': 0.9,
      }),
    };

    const response = await fetch(config.apiUrl, requestOptions);

    if (response.status === 401)
    {
      alert('Invalid API key!');
      await this.sentimentAnalyzer.inputApiKey();
      location.reload();
      return null;
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
window.AnalysisManager = AnalysisManager;
