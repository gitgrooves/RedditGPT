// Configuration
const config = {
  checkUrlInterval: 1000,
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

.analysisBox {
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 300% 300%;
  backdrop-filter: blur(1rem);
  border-radius: 2rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
  background-image: linear-gradient(#212121, #212121),  linear-gradient(137.48deg, #ffdb3b 10%,#FE53BB 45%, #8F51EA 67%, #0044ff 87%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  margin:20px;
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
    this.apiKeyManager = new ApiKeyManager();
    this.analysisManager = new AnalysisManager(config, this.apiKeyManager); // Update this line
    this.buttonManager = new ButtonManager(this.analysisManager);
    this.lastUrl = window.location.href;
    this.watchUrlChange();
  }

  watchUrlChange()
  {
    const isRedditCommentUrl = /^https?:\/\/(www\.)?reddit\.com\/r\/.+?\/comments\/.+?\/.+?\/?$/i;

    const checkUrlChange = () =>
    {
      
      if (isRedditCommentUrl.test(window.location.href) && this.lastUrl !== window.location.href)
      {
        setTimeout(() =>
        {
          this.main();
        }, 2000);
        
      }
      this.lastUrl = window.location.href;
      setTimeout(checkUrlChange, config.checkUrlInterval);
    };

    checkUrlChange();
  }

  async main()
  { 
    const storedApiKey = await this.apiKeyManager.getStoredApiKey();
    if (!storedApiKey) await this.apiKeyManager.inputApiKey();

    this.buttonManager.addButtons(storedApiKey);
  }
}
window.SentimentAnalyzer = SentimentAnalyzer;
