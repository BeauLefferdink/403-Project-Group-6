chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.url) {
    chrome.storage.local.set({ url: request.url }, function() {
      console.log('URL saved');
    });
  }
});