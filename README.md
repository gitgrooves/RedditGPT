<h1>Reddit Summarizer</h1>
<p>A Chrome extension that uses GPT to summarize and analyze content on Reddit. This extension automatically adds buttons to Reddit posts and comments, allowing users to generate a summarized version of the content using OpenAI's GPT-3.5-turbo model. Additionally, it provides sentiment analysis for the summarized content.</p>
<h2>Features</h2>
<ul>
   <li>Summarize long Reddit posts and comments</li>
   <li>Sentiment analysis of the summarized content</li>
   <li>Customizable typing animations for the summary display</li>
   <li>Supports both Reddit comment threads and main pages</li>
   <li>Automatically detects URL changes and updates accordingly</li>
   <li>Intuitive and aesthetically pleasing UI design</li>
</ul>
<h2>Installation</h2>
  <h3>Chrome Web Store</h3>
  <ul>
   <li><a href="https://chrome.google.com/webstore/detail/reddit-summarizer/jhbpjalfakhbaiojoaejjnjbminnacak" title="RGPT" class="active">Reddit Summarizer</a></li>
   </ul>
  <h3>Local</h3>
 <ol>
   <li>Clone or download this repository.</li>
   <li>Open Google Chrome and navigate to <code>chrome://extensions</code>.</li>
   <li>Enable "Developer mode" in the top-right corner.</li>
   <li>Click "Load unpacked" and select the folder containing the downloaded repository.</li>
   <li>The extension should now appear in your Chrome extensions list and be available for use on Reddit.</li>
</ol>
<h2>Usage</h2>
<ol>
   <li>Navigate to Reddit in your Chrome browser.</li>
   <li>Open a post or a comment thread.</li>
   <li>Look for "Summarize" and "Analyze" buttons that have been added next to the comments or posts.</li>
   <li>Insert your OpenAI API Key for the first time.</li>
   <li>Click on the "Summarize" button to generate a summarized version of the content.</li>
   <li>Click on the "Analyze" button to get the sentiment analysis of the summarized content.</li>
   <li>The extension will display the summarized content or analysis result in a visually appealing manner.</li>
</ol>
<h2>Configuration</h2>
<p>The extension can be customized by modifying the <code>config</code> object in <code>sentimentAnalyzer.js</code>. The following options are available:</p>
<ul>
   <li><code>checkUrlInterval</code>: The interval (in milliseconds) at which the extension checks for URL changes.</li>
   <li><code>maxCommentLength</code>: The maximum length of a comment to be included in the summary.</li>
   <li><code>maxTotalCharacters</code>: The maximum total characters to be included in the summary.</li>
   <li><code>apiUrl</code>: The URL of the OpenAI API.</li>
   <li><code>model</code>: The GPT model to be used for summarization (e.g., 'gpt-3.5-turbo').</li>
   <li><code>n</code>: The number of generated responses.</li>
   <li><code>stop</code>: The stop sequence for the GPT model.</li>
   <li><code>temperature</code>: The randomness of the generated output (0.0-1.0).</li>
</ul>
<h2>Dependencies</h2>
<ul>
   <li>OpenAI's API</li>
   <li>Google Chrome browser</li>
</ul>
<h2>License</h2>
<p>This project is available under the MIT License.</p>
<h2>Disclaimer</h2>
<p>This extension is not officially affiliated with Reddit or OpenAI.</p>
