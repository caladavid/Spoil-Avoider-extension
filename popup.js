document.addEventListener('DOMContentLoaded', function () {
    const addKeywordBtn = document.getElementById('addKeyword');
    const keywordInput = document.getElementById('keyword');
    const keywordList = document.getElementById('keywordList');
    const titleElement = document.querySelector('.alert');
    const alertContainer = document.createElement("h5");

    // Load existing keywords from storage on initialization
    chrome.storage.sync.get(['spoilerList'], function (result) {
        const spoilerWords = result.spoilerList || [];
        updateKeywordList(spoilerWords);
    });

    // Add a keyword when the Enter key is pressed in the input field
    keywordInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addKeyword();
        }
    });

    // Agregar nueva keyword
    addKeywordBtn.addEventListener('click', addKeyword);

    // Function to add a new keyword to the list
    function addKeyword() {
        const newKeyword = keywordInput.value.trim();
        if (newKeyword) {
            // Get current keywords from storage
            chrome.storage.sync.get(['spoilerList'], function (result) {
                let spoilerWords = result.spoilerList || [];
                // Check if the keyword already exists
                if (!spoilerWords.includes(newKeyword)) {
                    // Add the new keyword and update storage
                    spoilerWords.push(newKeyword);
                    chrome.storage.sync.set({ spoilerList: spoilerWords }, function () {
                        // Update the displayed keyword list and clear input
                        updateKeywordList(spoilerWords);
                        keywordInput.value = '';
                        showAlert("Keyword created!");
                    });
                } else {
                    showAlert("Keyword already exists!", "exist");
                }
            });
        }
    };

    // Function to update the list of keywords displayed in the UI
    function updateKeywordList(spoilerWords) {
        keywordList.innerHTML = '';
        spoilerWords.forEach(function (keyword, index) {
            const li = document.createElement('li');
            li.textContent = keyword;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function () {
                removeKeyword(index);
            });

            li.appendChild(deleteBtn);
            keywordList.appendChild(li);
        });
    }

    // Function to remove a keyword based on its index
    function removeKeyword(index) {
        chrome.storage.sync.get(['spoilerList'], function (result) {
            let spoilerWords = result.spoilerList || [];
            // Remove the keyword from the list
            spoilerWords.splice(index, 1);
            // Update storage with the modified list
            chrome.storage.sync.set({ spoilerList: spoilerWords }, function () {
                // Update the displayed keyword list
                updateKeywordList(spoilerWords);
            });
            showAlert("Keyword removed!", "delete");
        });
    };

    // Function to show alert messages with different styles based on type
    function showAlert(message, type) {
        if (type === "delete") {
            titleElement.style.backgroundColor = '#ef4444';
        } else if (type === "exist"){
            titleElement.style.backgroundColor = '#f97316';
        } else {
            titleElement.style.backgroundColor = '#22c55e';
        }
        
        titleElement.appendChild(alertContainer);
        alertContainer.textContent = message;
        alertContainer.style.display = 'block';
        titleElement.style.padding = '2px 0';

        setTimeout(() => {
            alertContainer.style.display = 'none';
            titleElement.style.backgroundColor = '';
            titleElement.style.padding = '';
        }, 3000);
    }

});
