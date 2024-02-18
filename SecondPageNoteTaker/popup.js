document.getElementById('saveNote').addEventListener('click', function() {
    const link = document.getElementById('linkInput').value;
    const title = document.getElementById('titleInput').value;
    const notes = document.getElementById('notesInput').value;
    // Here you would save the note for future access, e.g., using Chrome's storage API
    chrome.storage.local.set({[title]: {link, notes}}, function() {
        alert('Note saved!');
    });
});

// Open Library
document.getElementById('library').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "openLibrary"}, function(response) {
        console.log(response.status);
    });
});

// New Note functionality (resetting input fields)
document.getElementById('newNote').addEventListener('click', function() {
    document.getElementById('linkInput').value = '';
    document.getElementById('titleInput').value = '';
    document.getElementById('notesInput').value = '';
});

// Assuming you have a method to listen for messages from the background script to update the popup with note data for editing
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "editNote") {
        document.getElementById('linkInput').value = request.data.link;
        document.getElementById('titleInput').value = request.data.title;
        document.getElementById('notesInput').value = request.data.notes;
    }
});
