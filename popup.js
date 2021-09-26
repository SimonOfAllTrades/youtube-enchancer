// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

function removeAllChildNodes(parent) {
    
}

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: moveCommentSectionToSide,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
        document.getElementById("secondary").style.backgroundColor = color;
    });
}

function moveCommentSectionToSide() {
    let secondaryInner = document.getElementById("secondary-inner");
    let comments = document.getElementById("comments");
    let temp = secondaryInner.children;

    const parentA = secondaryInner.parentNode;
    const siblingA = secondaryInner.nextSibling === comments ? secondaryInner : secondaryInner.nextSibling;

    // Move `nodeA` to before the `nodeB`
    comments.parentNode.insertBefore(secondaryInner, comments);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(comments, siblingA);

    /*
    secondaryInner.innerHTML = "";
    secondaryInner.appendChild(comments);
    */
}