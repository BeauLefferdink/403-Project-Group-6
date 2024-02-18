document.addEventListener('DOMContentLoaded', function() {

    const addButton = document.getElementById('add-note');
  
    if (addButton) {
  
      addButton.addEventListener('click', function() {
  
        // Create a textarea element
        const textbox = document.createElement('textarea');
  
        // Set some properties 
        textbox.cols = 30;
        textbox.rows = 5;
  
        // Add a CSS class to style it
        textbox.classList.add('note-textbox'); 
  
        // Append it to the body or another container
        document.body.appendChild(textbox);
  
        // Focus the textarea 
        textbox.focus();
  
        // Optionally, remove the textbox on blur
        textbox.addEventListener('blur', function() {
          textbox.remove();  
        });
  
      });
  
    }
  
  });