document.addEventListener('DOMContentLoaded', function () {
    const addNoteButton = document.getElementById('addNote');
    const saveNoteButton = document.getElementById('saveNote');
    const generateMLAButton = document.getElementById('generateMLA');
    const noteForm = document.getElementById('noteForm');
    const noteNameInput = document.getElementById('noteName'); // Input for the note's title
    const noteUrl = document.getElementById('noteUrl');
    const noteContent = document.getElementById('noteContent');
    const savedNotesDiv = document.getElementById('savedNotes');
    const mlaFormatDisplay = document.getElementById('mlaFormatDisplay');
    const mlaAuthor = document.getElementById('mlaAuthor');
    const mlaTitle = document.getElementById('mlaTitle');
    const mlaWebsiteTitle = document.getElementById('mlaWebsiteTitle');
    const mlaPublisher = document.getElementById('mlaPublisher');
    const mlaPublicationDate = document.getElementById('mlaPublicationDate');

    addNoteButton.onclick = function () {
        noteForm.style.display = 'block';
        noteNameInput.value = ''; // Clear the note name for new notes
        noteContent.value = '';
        mlaAuthor.value = '';
        mlaTitle.value = '';
        mlaWebsiteTitle.value = '';
        mlaPublisher.value = '';
        mlaPublicationDate.value = '';
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            noteUrl.value = tabs[0].url;
        });
    };

    function saveNote() {
        let noteName = noteNameInput.value.trim();
        if (noteName === '') {
            alert('Please provide a title for your note.');
            return;
        }
        let url = noteUrl.value.trim();
        let content = noteContent.value.trim();
        let author = mlaAuthor.value.trim();
        let title = mlaTitle.value.trim();
        let websiteTitle = mlaWebsiteTitle.value.trim();
        let publisher = mlaPublisher.value.trim();
        let publicationDate = mlaPublicationDate.value.trim();

        chrome.storage.local.set({
            [noteName]: {url, content, author, title, websiteTitle, publisher, publicationDate}
        }, function() {
            console.log('Note and MLA info saved.');
            noteForm.style.display = 'none';
            loadNotes();
        });
    }

    saveNoteButton.onclick = saveNote;

    generateMLAButton.onclick = function() {
        const author = mlaAuthor.value.trim() || 'Author';
        const title = mlaTitle.value.trim() || 'Title';
        const websiteTitle = mlaWebsiteTitle.value.trim() || 'Website Title';
        const publisher = mlaPublisher.value.trim() || 'Publisher';
        const publicationDate = mlaPublicationDate.value.trim() || 'Publication Date';
        const url = noteUrl.value.trim() || 'URL';

        const mlaCitation = `${author}. "${title}." ${websiteTitle}, ${publisher}, ${publicationDate}, ${url}.`;
        mlaFormatDisplay.textContent = mlaCitation;
        mlaFormatDisplay.style.display = 'block';
    };

    function loadNotes() {
        chrome.storage.local.get(null, function(items) {
            savedNotesDiv.innerHTML = '';
            Object.keys(items).forEach(function(noteName) {
                let note = items[noteName];
                let noteDiv = document.createElement('div');
                let noteButton = document.createElement('button');
                let deleteButton = document.createElement('button');

                noteButton.textContent = noteName;
                noteButton.classList.add('savedNoteButton');
                noteButton.onclick = function() {
                    noteNameInput.value = noteName; // Load the note name
                    noteUrl.value = note.url;
                    noteContent.value = note.content;
                    mlaAuthor.value = note.author || '';
                    mlaTitle.value = note.title || '';
                    mlaWebsiteTitle.value = note.websiteTitle || '';
                    mlaPublisher.value = note.publisher || '';
                    mlaPublicationDate.value = note.publicationDate || '';
                    noteForm.style.display = 'block';
                };

                deleteButton.textContent = 'X';
                deleteButton.classList.add('deleteNoteButton');
                deleteButton.onclick = function() {
                    chrome.storage.local.remove(noteName, function() {
                        loadNotes();
                    });
                };

                noteDiv.appendChild(noteButton);
                noteDiv.appendChild(deleteButton);
                savedNotesDiv.appendChild(noteDiv);
            });
        });
    }

    loadNotes();
});
