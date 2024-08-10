function checkForKeywords() {
    const elements = [
        ...document.querySelectorAll('.style-scope ytd-video-renderer'),
        ...document.querySelectorAll('.style-scope ytd-reel-item-renderer'),
        ...document.querySelectorAll('.style-scope ytd-grid-video-renderer'),
        ...document.querySelectorAll('ytd-watch-card-compact-video-renderer'),
    ];

    elements.forEach((element) => {
        const titleElement = element.querySelector('#video-title') || element.querySelector('yt-formatted-string.title.style-scope.ytd-watch-card-compact-video-renderer');
        const authorElement = element.querySelector('yt-formatted-string#text') || element.querySelector("yt-formatted-string.byline");

        if (titleElement) {
            const titleText = titleElement.textContent || '';
            const titleFormated = titleText.toLowerCase();

            if (authorElement) {
                const author = authorElement.title;

                for (const regex of spoilerWordsFormated) {
                    if (regex.test(titleFormated)) {
                        blockImgSpoiler(element, keywordMap.get(regex), 'results', author, true);
                        break;
                    }
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
    return node.matches('.style-scope ytd-video-renderer, .style-scope ytd-reel-item-renderer, .style-scope ytd-grid-video-renderer, ytd-watch-card-compact-video-renderer');
}

initContentScript();