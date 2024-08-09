// Initialize variables for storing formatted spoiler keywords and their mappings.
// Use 'var' to ensure these variables are accessible throughout the script.
if (typeof spoilerWordsFormated === 'undefined') {
    var spoilerWordsFormated = [];
    var keywordMap = new Map();
}

// Retrieve the list of spoiler keywords from Chrome's storage and format them.
chrome.storage.sync.get(['spoilerList'], function (result) {
    // Get the 'spoilerList' from storage or default to an empty array if not set.
    const spoilerWords = result.spoilerList || [];

    // Convert each spoiler word into a regular expression for case-insensitive matching.
    spoilerWordsFormated = spoilerWords.map(word => new RegExp(`\\b${word}\\b`, 'i'));

    keywordMap = new Map(spoilerWordsFormated.map((regex, index) => [regex, spoilerWords[index]]));
    initContentScript();
});

function createSpoilerMessage(keyword, context, author) {
    const spoilerMessage = document.createElement("div");
    if (context === "watch") {
        spoilerMessage.innerHTML = `
        <div class="spoiler-message watch">
            <p class="keyword watch">Detected keyword: ${keyword}</p>
            <button class="continue-btn watch">Click to see spoiler</button>
            <h1 class="author watch">${author}</h1>
        </div>
    `;
    } else if (context === "short") {
        spoilerMessage.innerHTML = `
            <div class="spoiler-message">
                <p class="keyword short">Detected keyword: ${keyword}</p>
                <button class="continue-btn">Click to see spoiler</button>
                <h1 class="author short">${author}</h1>
            </div>
    `;
    } else {
        spoilerMessage.innerHTML = `
            <div class="spoiler-message">
                <p class="keyword">Detected keyword: ${keyword}</p>
                <button class="continue-btn">Click to see spoiler</button>
                <h1 class="author">${author}</h1>
            </div>
        `;
    }

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
            justify-content: space-between;
            text-align: center;
            backdrop-filter: blur(24px);
            z-index: 2000;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
        }

        .author.watch{
            padding: 4px;
        }

        .keyword.watch{
            padding: 4px;
        }

        .keyword.watch, .author.watch{
            font-size: 14px;
        }

        .keyword, .author{
            color: white;
            padding: 2rem 16px;
            font-size: 16px;
        }

        .continue-btn {
            background-color: transparent;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            border: 2px solid white;
            cursor: pointer;
            width: 60%;
            margin: auto;
            padding: 6px 16px;
            text-transform: uppercase;
            color: white;
        }  
        
        .continue-btn:hover{
            background-color: white;
            color: black;
        }

        .delete-message{
            display: none;
        }
    `;
    return style;
}

function blockImgSpoiler(element, keyword, context, author, isShort = null) {
    const spoilerMessage = createSpoilerMessage(keyword, context, author);
    const style = createSpoilerStyle();

    document.head.appendChild(style);
    if (!element.querySelector('.spoiler-message')) {
        element.appendChild(spoilerMessage);
    }

    spoilerMessage.querySelector(".continue-btn").addEventListener('click', () => {
        spoilerMessage.classList.add('delete-message');
    });

    if (isShort && element.querySelector('.spoiler-message')) {
        // El video se pausa aun si se quita el spoiler
        const videoElement = element.querySelector('video');
        if (videoElement) {
            // Check if the video has already been paused by the spoiler.
            if (!videoElement.dataset.pausedBySpoiler) {
                videoElement.pause();
                videoElement.dataset.pausedBySpoiler = true;
            }
        }
    }
}

// Function to debounce another function, limiting how often it can be called.
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}