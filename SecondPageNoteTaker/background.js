chrome.runtime.onInstalled.addListener(function() {
    // Initialize storage or perform any setup actions
});

// Listening for messages from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "openLibrary") {
        // Here, we would ideally open a new tab with an HTML page that shows all saved notes
        // For simplicity, let's just fetch and log all notes
        chrome.storage.local.get(null, function(notes) {
            console.log(notes);
            sendResponse({status: "Library opened"});
        });
        return true; // Keep the messaging channel open for asynchronous response
    }
});

// Functionality to update a note - you can expand this with parameters to target specific notes
function updateNote(title, updatedData) {
    chrome.storage.local.set({[title]: updatedData}, function() {
        console.log('Note updated');
    });
}

// Functionality to delete a note
function deleteNote(title) {
    chrome.storage.local.remove(title, function() {
        console.log('Note deleted');
    });
}

// Example of how you might handle editing a note from the library (not directly implemented here)
// This would involve sending a message from your library page (not shown) back to the background script to edit a specific note
// and possibly relaying that to the popup for display
