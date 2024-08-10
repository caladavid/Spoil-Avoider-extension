function checkForKeywords() {
    const elements = [
        ...document.querySelectorAll('ytd-rich-grid-media'),
        ...document.querySelectorAll('ytd-rich-grid-slim-media'),
        ...document.querySelectorAll('.style-scope ytd-grid-video-renderer'),
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
    // Create a new MutationObserver instance to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        // Iterate through all mutations that occurred
        for (const mutation of mutations) {
            // Check if any new nodes were added
            if (mutation.addedNodes.length > 0) {
                // Handle the newly added nodes
                handleNewNodes(mutation.addedNodes);
            }
        }
    });

    // Observe the body element for changes in its subtree and child elements
    observer.observe(document.body, { subtree: true, childList: true });

    // Perform an initial check on the existing child nodes in the body
    handleNewNodes(document.body.childNodes);
}

// Processes newly added nodes to the DOM
function handleNewNodes(nodes) {
    nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            // Ensure that only relevant nodes are processed
            if (isRelevantNode(node)) {
                checkForKeywords(node);
            }
        }
    });
}

function isRelevantNode(node) {
    // Implementa tu lógica para identificar nodos relevantes
    return node.matches('ytd-rich-grid-media, ytd-rich-grid-slim-media, .style-scope ytd-grid-video-renderer');
}

/* function initContentScript() {
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
} */


initContentScript();