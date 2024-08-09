function checkForKeywords() {
    const elements = document.querySelectorAll('ytd-compact-video-renderer');

    elements.forEach((element) => {
        const titleElement = element.querySelector('#video-title');
        const authorElement = element.querySelector('yt-formatted-string#text').title;

        if (titleElement) {
            const titleText = titleElement.textContent || '';
            const titleFormated = titleText.toLowerCase();

            for (const regex of spoilerWordsFormated) {
                if (regex.test(titleFormated)) {
                    blockImgSpoiler(element, keywordMap.get(regex), 'watch', authorElement);
                    break;
                }
            }
        }
    });
}

function initContentScript() {
    // Create a debounced version of the checkForKeywords function to limit its execution
    const debouncedCheckForKeywords = debounce(checkForKeywords, 300);

    // Create a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver((mutations) => {
        let shouldRunCheck = false;

        // Check if there are any added nodes in the mutations
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldRunCheck = true;
                break;
            }
        }

         // If there are added nodes, run the debounced checkForKeywords function
        if (shouldRunCheck) {
            debouncedCheckForKeywords();
        }
    });

    // Start observing changes in the document body, including all descendant nodes
    observer.observe(document.body, { subtree: true, childList: true });

    // Perform an initial check to cover elements already present
    debouncedCheckForKeywords();
}

initContentScript();
