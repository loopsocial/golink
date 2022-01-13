// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener((text) => {
  // Encode user input for special characters , / ? : @ & = + $ #
  const newURL = 'http://go/' + encodeURIComponent(text);
  chrome.tabs.create({ url: newURL });
});
