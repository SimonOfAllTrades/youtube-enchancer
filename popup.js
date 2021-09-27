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
        function: swapCommentsAndRelatedVideos,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
        document.getElementById("secondary").style.backgroundColor = color;
    });
}

function swapCommentsAndRelatedVideos() {

    function swapElements(nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    
        // Move `nodeA` to before the `nodeB`
        nodeB.parentNode.insertBefore(nodeA, nodeB);
    
        // Move `nodeB` to before the sibling of `nodeA`
        parentA.insertBefore(nodeB, siblingA);
    }

    function createSideDiv() {
        if (document.getElementById("newSideDiv")) {
            document.getElementById("newSideDiv").remove();
            return null
        } else {
            const newSideDiv = document.createElement("div");
            newSideDiv.id = "newSideDiv";
            newSideDiv.style.height = playerApi.style.height;
            newSideDiv.style.width = "auto";
            newSideDiv.style.overflowY = "scroll";
            return newSideDiv;
        }
    }

    const playerApi = document.getElementById("player-api");
    
    let secondaryInner = document.getElementById("secondary-inner");
    let comments = document.getElementById("comments");

    //swapElements(secondaryInner, comments);
    newSideDiv = createSideDiv();
    if (newSideDiv) {
        secondaryInner.parentNode.prepend(newSideDiv);
        newSideDiv.appendChild(comments);
    }
}