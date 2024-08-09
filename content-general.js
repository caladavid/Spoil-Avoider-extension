function checkForKeywords() {
    const elements = [
        ...document.querySelectorAll('ytd-rich-grid-media'), 
        ...document.querySelectorAll('ytd-rich-grid-slim-media')
    ];
    
    elements.forEach((element) => {
        const titleElement = element.querySelector('#video-title');
        const authorElement = element.querySelector('yt-formatted-string#text').title;

        if (titleElement) {
            const titleText = titleElement.textContent || '';
            const titleFormated = titleText.toLowerCase();

            for (const regex of spoilerWordsFormated) {
                if (regex.test(titleFormated)) {
                    blockImgSpoiler(element, keywordMap.get(regex), 'general', authorElement);
                    break;
                }
            }
        }
    });
}


function initContentScript() {
    const debouncedCheckForKeywords = debounce(checkForKeywords, 300);

    const observer = new MutationObserver((mutations) => {
        let shouldRunCheck = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldRunCheck = true;
                break;
            }
        }

        if (shouldRunCheck) {
            debouncedCheckForKeywords();
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });

    // Perform an initial check to cover elements already present
    checkForKeywords();

    setTimeout(() => {
        // Set a delay for subsequent checks
        debouncedCheckForKeywords();
    }, 3000);
}

initContentScript();


/* function initContentScript() {
    // Debounce the checkForKeywords function
    const observer = new MutationObserver(checkForKeywords);
    observer.observe(document.body, { subtree: true, childList: true });
} */

/* let spoilerWordsFormated = [];

chrome.runtime.sendMessage({ action: 'getSpoilerList' }, (response) => {
    if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        return;
    }

    const spoilerWords = response.spoilerList || [];
    spoilerWordsFormated = spoilerWords.map(word => word.toLowerCase());
});

function createSpoilerMessage(keyword) {
    const spoilerMessage = document.createElement("div");
    spoilerMessage.className = 'spoiler-message';
    spoilerMessage.innerHTML = `
        <div class="spoiler-message">
            <h1>Careful, you might get spoilers</h1>
            <p>Blocked keyword: ${keyword}</p>
            <button class="continue-btn">It's okay, let me in</button>
        </div>
    `;
    return spoilerMessage;
}

function createSpoilerStyle() {
    const style = document.createElement("style");
    style.innerHTML = `
        .spoiler-message {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            backdrop-filter: blur(24px);
            z-index: 10000;
        }

        h1 {
            color: white;
            padding: 0 16px;
        }

        .continue-btn {
            padding: 0 16px;
        }
    `;
    return style;
} */


/* let spoilerWordsFormated = [];

function getSpoilerList() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'getSpoilerList' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError);
                return;
            }
            resolve(response.spoilerList || [])
        });
    })
} */



/* function createSpoilerStyle() {
    const style = document.createElement("style");
    style.innerHTML = `
    .spoiler-message {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        background-color: rgba(0, 0, 0, .5);
        backdrop-filter: blur(16px);
        z-index: 5;
        font-size: 16px;
        gap: 16px;
    }

    .spoiler-message:hover {
        border-radius: 0px !important; 
    }

    .spoiler-message > p {
        color: white;
        padding: 0 16px;
    }

    .keyword {
        text-transform: capitalize;
    }

    .continue-btn {
        width: 50%;
        margin: 0 auto;
        padding: 6px 3px;
        cursor: pointer;
    }

    .delete-message{
        display: none;
    }
  `;
    return style;
} */

/* function createSpoilerMessage(keyword) {
    const spoilerMessage = document.createElement("div");
    spoilerMessage.className = 'spoiler-message';
    spoilerMessage.innerHTML = `
    <div class="spoiler-message">
      <p>Attention, <br> Spoilers for <span class="keyword">"${keyword}"</span> detected. </p>
      <button class="continue-btn">It's okay, let me in</button>
    </div>
    `;
    return spoilerMessage;
} */

/* getSpoilerList()
.then(spoilerList => {
    spoilerWordsFormated = spoilerList.map(word => word.toLowerCase());
    checkForKeywords(); // Ejecutar la verificación de palabras clave después de cargar la lista de spoilers
    
    // Crear un MutationObserver para detectar cambios en el DOM y ejecutar la verificación de palabras clave
    const observer = new MutationObserver(checkForKeywords);
    const observer = new MutationObserver(debounce(checkForKeywords, 300));
    observer.observe(document.body, { subtree: true, childList: true });
    })
    .catch(error => {
        console.error("Error loading spoiler list:", error);
        }); */




/* let elements = document.querySelectorAll('ytd-app'); */

/* function checkForKeywords() {
    let elements = document.querySelectorAll('ytd-rich-grid-media');
    elements.forEach((element) => {
        const titleElement = element.querySelector('#video-title');
        if (titleElement) {
            const titleText = titleElement.textContent || '';
            const titleFormated = titleText.toLowerCase();
            const detectedWord = spoilerWordsFormated.find(keyword => titleFormated.includes(keyword));
            
            if (detectedWord) {
                if (!element.querySelector('.spoiler-message')) {
                    blockSpoiler(element, detectedWord);
                    }
                    
    }
}
})
}; */


/* const observer = new MutationObserver(checkForKeywords);
observer.observe(document.body, { subtree: true, childList: true }); */

/* function observeDOM() {
    const targetNode = document.querySelector('ytd-app');
    if (!targetNode) {
        setTimeout(observeDOM, 500);
        return;
    }
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                checkForKeywords();
            }
        }
    });
    observer.observe(targetNode, { childList: true, subtree: true });
} */

/*       const spoilerRegex = "Reacting to YOUR Hot Takes";
         for (let i = 0; i < elements.length; i++) {
           const titleText = elements[i].textContent;
           
           if (titleText.includes(keywords)) {
               elements[i].innerText = "Testing"; // Replace "Testing" with your spoiler indicator
           }
       } */

/* chrome.runtime.sendMessage({ action: 'getSpoilerList' }, (response) => {
    if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        return;
    }

    const spoilerWords = response.spoilerList || [];

    const spoilerWords = response.spoilerList || []; // Use empty list if not set
    const spoilerWordsFormated = spoilerWords.map(word => word.toLowerCase());

    spoilerWordsFormated = (response.spoilerList || []).map(word => word.toLowerCase());
    spoilerWordsFormated = spoilerWords.map(word => word.toLowerCase());
    spoilerWordsFormated.push(everySpoilerWords);
}); */

/* function observeDOM() {
    const targetNode = document.querySelector('ytd-app');
    if (!targetNode) {
        setTimeout(observeDOM, 500);
        return;
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                checkForKeywords();
            }
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
} */



/* function blockTitleSpoiler(titleElement, keyword) {
    const originalTitle = titleElement.textContent || '';
    titleElement.setAttribute('data-original-title', originalTitle); // Almacenar el título original
    titleElement.textContent = `The following video contains spoilers for ${keyword}`;
}

function checkForKeywords() {
    const elements = document.querySelectorAll('ytd-rich-grid-media');
    elements.forEach((element) => {
        const titleElement = element.querySelector('#video-title');
        const imgElement = element.querySelector('ytd-thumbnail');
        
        if (titleElement) {
            const titleText = titleElement.textContent || '';
            const titleFormated = titleText.toLowerCase();
            
            for (const keyword of spoilerWordsFormated) {
                const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                if (regex.test(titleFormated) && !element.querySelector('.spoiler-message')) {
                    blockImgSpoiler(imgElement, keyword);
                    blockTitleSpoiler(titleElement, keyword)
                    break;
                }
            }
        }
    });
}

function blockImgSpoiler(element, keyword) {
    if (element.querySelector('.spoiler-message')) return;

    const spoilerMessage = createSpoilerMessage(keyword);
    const style = createSpoilerStyle();


    document.head.appendChild(style);
    element.appendChild(spoilerMessage);


    spoilerMessage.querySelector(".continue-btn").addEventListener('click', () => {
        spoilerMessage.classList.add('delete-message');

    });
}
    
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    } */