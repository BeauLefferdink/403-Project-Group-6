function saveNote() {
  var title = document.getElementById("title").value;
  var link = document.getElementById("link").value;
  var notes = document.getElementById("notes").value;

  // Implement saving logic here, such as using Chrome storage API
  console.log("Title:", title);
  console.log("Link:", link);
  console.log("Notes:", notes);

  // Optionally, redirect to library page after saving
  window.location.href = "library.html";
}
