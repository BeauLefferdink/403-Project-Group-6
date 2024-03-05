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
        mlaFormatDisplay.style.display = 'none';
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
            loadNotes();
        });
    }

    saveNoteButton.onclick = saveNote;

    generateMLAButton.onclick = function() {
        const author = mlaAuthor.value.trim() || '';
        const title = mlaTitle.value.trim() || '';
        const websiteTitle = mlaWebsiteTitle.value.trim() || '';
        const publisher = mlaPublisher.value.trim() || '';
        const publicationDate = mlaPublicationDate.value.trim() || '';
        const url = noteUrl.value.trim() || '';
    
        // Split the author name into last name and first name
        const authorNames = author.split(' ');
        const lastName = authorNames.pop() || '';
        const firstName = authorNames.join(' ') || '';
    
        // Format the publication date
        let formattedDate = '';
        if (publicationDate) {
            const dateObject = new Date(publicationDate);
            const day = dateObject.getDate();
            const month = dateObject.toLocaleString('default', { month: 'short' });
            const year = dateObject.getFullYear();
            formattedDate = `${day} ${month}. ${year}`;
        }
    
        // Generate the MLA citation
        let mlaCitation = '';
        if (author) {
            mlaCitation += `${lastName}, ${firstName}. `;
        }
        if (title) {
            mlaCitation += `"${title}." `;
        }
        if (websiteTitle) {
            mlaCitation += `${websiteTitle}, `;
        }
        if (publisher) {
            mlaCitation += `${publisher}, `;
        }
        if (formattedDate) {
            mlaCitation += `${formattedDate}, `;
        }
        if (url) {
            mlaCitation += `${url}.`;
        }
    
        mlaFormatDisplay.textContent = mlaCitation.trim();
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
                    mlaFormatDisplay.style.display = 'none';
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
