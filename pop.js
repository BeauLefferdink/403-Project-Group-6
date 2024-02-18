// popup.js

console.log('Popup script loaded!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded!');
    
    const addButton = document.getElementById('add-note');
    
    console.log('Add button:', addButton);
    
    if (addButton) {
        addButton.addEventListener('click', function() {
            console.log('Button clicked!');
            // Perform any action you want when the "Add Note" button is clicked
        });
    } else {
        console.log('Add button not found!');
    }
});
