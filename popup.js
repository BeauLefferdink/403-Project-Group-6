document.addEventListener('DOMContentLoaded', function () {
  const noteInput = document.getElementById('noteInput');
  const saveButton = document.getElementById('saveButton');
  const notesContainer = document.getElementById('notesContainer');
  const linkInput = document.getElementById('linkInput');
  const generateBibliographyButton = document.getElementById('generateBibliography');
  const bibliographyContainer = document.getElementById('bibliographyContainer');

  // Function to display saved notes
  function displayNotes(notes) {
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
      notesContainer.innerHTML = 'No notes available.';
    } else {
      notes.forEach(function (note, index) {
        const noteDiv = document.createElement('div');
        noteDiv.textContent = note;

        // Create a delete button for each note
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton';
        deleteButton.onclick = function () {
          deleteNote(index);
        };

        noteDiv.appendChild(deleteButton);
        notesContainer.appendChild(noteDiv);
      });
    }
  }

  // Function to display the bibliography in MLA format
  function displayBibliography(bibliography) {
    bibliographyContainer.innerHTML = '';

    if (bibliography.length === 0) {
      bibliographyContainer.innerHTML = 'Bibliography is empty.';
    } else {
      bibliography.forEach(function (link, index) {
        const citationDiv = document.createElement('div');
        const citation = generateMLACitation(link, index + 1); // index + 1 for numbering

        citationDiv.innerHTML = `<p>${citation}</p>`;
        bibliographyContainer.appendChild(citationDiv);
      });
    }
  }

  // Function to generate MLA citation
  function generateMLACitation(link, number) {
    const title = 'Webpage'; // You can modify this based on your requirements
    const siteName = 'Website'; // You can modify this based on your requirements
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return `${title}. "${siteName}." ${day} ${month} ${year}. <${link}>.`;
  }

  // Function to delete a note
  function deleteNote(index) {
    chrome.storage.sync.get({ notes: [] }, function (result) {
      const notes = result.notes;
      notes.splice(index, 1);

      chrome.storage.sync.set({ notes: notes }, function () {
        // Update and display the notes
        displayNotes(notes);
      });
    });
  }

  // Function to generate bibliography from links
  function generateBibliography() {
    const link = linkInput.value.trim();

    if (link !== '') {
      chrome.storage.sync.get({ bibliography: [] }, function (result) {
        const bibliography = result.bibliography;
        bibliography.push(link);

        chrome.storage.sync.set({ bibliography: bibliography }, function () {
          // Notify user that the link has been added to the bibliography
          alert('Link added to bibliography!');
          // Clear the input field
          linkInput.value = '';

          // Update and display the bibliography
          displayBibliography(bibliography);
        });
      });
    } else {
      alert('Please enter a valid link before adding to the bibliography.');
    }
  }

  // Load and display existing notes and bibliography
  chrome.storage.sync.get({ notes: [], bibliography: [] }, function (result) {
    const notes = result.notes;
    const bibliography = result.bibliography;

    // Display existing notes
    displayNotes(notes);

    // Display existing bibliography links
    displayBibliography(bibliography);
  });

  // Event listener for the "Save Note" button
  saveButton.addEventListener('click', function () {
    const note = noteInput.value.trim();

    if (note !== '') {
      chrome.storage.sync.get({ notes: [] }, function (result) {
        const notes = result.notes;
        notes.push(note);

        chrome.storage.sync.set({ notes: notes }, function () {
          // Notify user that the note has been saved
          alert('Note saved successfully!');
          // Clear the input field
          noteInput.value = '';

          // Update and display the notes
          displayNotes(notes);
        });
      });
    } else {
      alert('Please enter a valid note before saving.');
    }
  });

  // Event listener for the "Generate Bibliography" button
  generateBibliographyButton.addEventListener('click', generateBibliography);
});
