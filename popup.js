// Initialize button with user's preferred color
let changeColor = document.getElementById("moveComments");

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

    let comments = document.getElementById("comments");
    if (document.getElementById("newSideDiv")) {
        document.getElementById("primary-inner").append(comments);
        document.getElementById("newSideDiv").remove();
    } else {
        const newSideDiv = document.createElement("div");
        // Jesus Christ Youtube uses the same ID twice multiple times in the html, what a f*cking joke
        // used to be document.getElementById("secondary") but cannot use that since "secondary" is used twice as an ID
        const secondary = document.getElementById("secondary-inner");
        newSideDiv.id = "newSideDiv";
        const playerApi = document.getElementsByClassName("ytp-iv-video-content");
        const player = document.getElementById("player-api");
        if (player) {
            newSideDiv.style.height = player.style.height;
        } else if (playerApi.length != 0) {
            newSideDiv.style.height = playerApi[0].clientHeight+"px";
        } else {
            newSideDiv.style.height = "720px";
        }
        console.log(newSideDiv.style.height);
        newSideDiv.style.width = "auto";
        newSideDiv.style.overflowY = "scroll";
        newSideDiv.appendChild(comments);
        secondary.prepend(newSideDiv);
    }

}
