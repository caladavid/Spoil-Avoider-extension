function checkForKeywords() {
    const elements = document.querySelectorAll('ytd-reel-video-renderer');

    elements.forEach((element) => {
        const titleElement = element.querySelector('yt-formatted-string.reel-player-header-renderer');
        const authorElement = element.querySelector('yt-formatted-string#text');

        if (titleElement) {
            const titleText = titleElement.textContent || '';
            const titleFormated = titleText.toLowerCase();

            if (authorElement) {
                const author = authorElement.title;

                for (const regex of spoilerWordsFormated) {
                    if (regex.test(titleFormated)) {
                        blockImgSpoiler(element, keywordMap.get(regex), 'short', author, true);
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
    return node.matches('ytd-reel-video-renderer');
}

initContentScript();