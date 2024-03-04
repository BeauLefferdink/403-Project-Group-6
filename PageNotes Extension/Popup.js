document.addEventListener('DOMContentLoaded', function () {
    const addNoteButton = document.getElementById('addNote');
    const saveNoteButton = document.getElementById('saveNote');
    const noteForm = document.getElementById('noteForm');
    const noteUrl = document.getElementById('noteUrl');
    const noteContent = document.getElementById('noteContent');
    const savedNotesDiv = document.getElementById('savedNotes');
    
    addNoteButton.classList.add('addNoteButton');
    
    
    addNoteButton.onclick = function () {
        noteForm.style.display = 'block';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            noteUrl.value = tabs[0].url; // Set the URL to the current tab's URL
        });
    };
    
    let noteSaved = false;
    
    function saveNote() {
        let url = noteUrl.value;
        let content = noteContent.value;
        let noteName = noteContent.dataset.noteName; // Retrieve the note name from the dataset
    
        // Use the URL as a unique key
        if (noteName) {
            chrome.storage.local.set({[noteName]: {url, content}}, function() {
                console.log('Note is saved.');
                showSavedMessage();
                loadNotes();
                noteSaved = true;
            });
        } else {
            noteName = prompt("Please name your note:");
            if (noteName) {
                noteContent.dataset.noteName = noteName; // Store the note name in the dataset
                chrome.storage.local.set({[noteName]: {url, content}}, function() {
                    console.log('Note is saved.');
                    showSavedMessage();
                    loadNotes();
                    noteSaved = true;
                });
            }
        }
    }
    
    saveNoteButton.onclick = function() {
        saveNote();
        if (noteSaved) {
            noteForm.style.display = 'none'; // Hide the note form
        }
    };
    
    function showSavedMessage() {
        savedMessage.style.display = 'block';
        setTimeout(function() {
            savedMessage.style.display = 'none';
        }, 2000); // Hide the message after 2 seconds (2000 milliseconds)
    }
    
    function loadNotes() {
        chrome.storage.local.get(null, function(items) {
            savedNotesDiv.innerHTML = '';
            for (let noteName in items) {
                let noteDiv = document.createElement('div');
                let noteButton = document.createElement('button');
                noteButton.textContent = noteName;
                noteButton.classList.add('savedNoteButton'); // Add a custom CSS class for styling
                noteButton.onclick = function() {
                    noteUrl.value = items[noteName].url;
                    noteContent.value = items[noteName].content;
                    noteContent.dataset.noteName = noteName;
                    noteForm.style.display = 'block';
                };
                noteDiv.appendChild(noteButton);
                savedNotesDiv.appendChild(noteDiv);
            }
        });
    }
    
    saveNoteButton.onclick = saveNote;
    loadNotes(); // Load the notes when the extension is opened
    
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        var url = currentTab.url;
        chrome.runtime.sendMessage({ url: url }, function(response) {
          // Handle the response from the background script
        });
      });
    });
