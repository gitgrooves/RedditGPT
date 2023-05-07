class CSSManager {
  constructor() {
    this.addStyles();
  }

  addStyles() {
      // Add the necessary CSS styles
    const fontLink = document.createElement('link');
    const style = document.createElement('style');
    fontLink.href = `https://fonts.googleapis.com/css?family=Orbitron&display=swap`;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
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

    #analysis-container-stars {
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      overflow: hidden;
      transition: 0.5s;
      backdrop-filter: blur(1rem);
      border-radius: 2rem;
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
  background-image: 
    radial-gradient(#ffffff80 1px, transparent 1px),
    radial-gradient(#ffffff80 1px, transparent 1px),
    radial-gradient(#ffffff80 1px, transparent 1px);
  background-size: 50px 50px, 40px 40px, 30px 30px;
  background-position: 0 0, 10px 20px, 30px 15px;
}

#stars::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
  background-image: 
    radial-gradient(#ffffff 1px, transparent 1px),
    radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 25px 25px, 35px 35px;
  background-position: 5px 10px, 20px 25px;
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
  }

  createButtonContainerStyle(buttonContainer,text,className)
  {
    buttonContainer.style = `
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8px;
        margin-bottom: 8px;
        margin-left: auto;
        margin-right: auto;
      `;
  }

  createButtonStyle(button, text, className)
  {
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
  }

  disableButtonStyle(button)
  {
    // Find the strong element within the button
    const oldStrongElement = button.querySelector('strong');

    // Remove the strong element from the button
    if (oldStrongElement)
    {
      oldStrongElement.parentNode.removeChild(oldStrongElement);
    }

    // Create a new strong element with "Loading..." text
    const strongElement = document.createElement('strong');
    strongElement.textContent = 'Loading...';


    // Append the strong element to the button
    button.appendChild(strongElement);
  }

  createAnalysisBoxStyle(text, analysisBox,button)
  {
    button.style.display = "none";
    analysisBox.classList.add("analysisBox");

    const textWrapper = document.createElement("div");
    textWrapper.style = 'width: 100%; height: auto; transition: all 1s; padding: 12px;';
    analysisBox.appendChild(textWrapper);

    const strongText = document.createElement("strong");
    textWrapper.appendChild(strongText);

    // Add stars and glow animations
    const containerStars = document.createElement("div");
    containerStars.id = "analysis-container-stars";
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
  }
}
window.CSSManager = CSSManager;