document.addEventListener('DOMContentLoaded', function () {
    const addNoteButton = document.getElementById('addNote');
    const saveNoteButton = document.getElementById('saveNote');
    const noteForm = document.getElementById('noteForm');
    const noteUrl = document.getElementById('noteUrl');
    const noteContent = document.getElementById('noteContent');
    const savedNotesDiv = document.getElementById('savedNotes');

    addNoteButton.onclick = function () {
        noteForm.style.display = 'block';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            noteUrl.value = tabs[0].url; // Set the URL to the current tab's URL
        });
    };

    function saveNote() {
        let url = noteUrl.value;
        let content = noteContent.value;
        let noteName = prompt("Please name your note:");

        // Use the URL as a unique key
        if (noteName) {
            chrome.storage.local.set({[noteName]: {url, content}}, function() {
                console.log('Note is saved.');
                loadNotes();
            });
        }
    }

    function loadNotes() {
        chrome.storage.local.get(null, function(items) {
            savedNotesDiv.innerHTML = '';
            for (let noteName in items) {
                let noteDiv = document.createElement('div');
                noteDiv.textContent = noteName;
                noteDiv.onclick = function () {
                    noteUrl.value = items[noteName].url;
                    noteContent.value = items[noteName].content;
                    noteForm.style.display = 'block';
                };
                savedNotesDiv.appendChild(noteDiv);
            }
        });
    }

    saveNoteButton.onclick = saveNote;
    loadNotes(); // Load the notes when the extension is opened
});