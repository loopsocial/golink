const linksContainer = document.getElementById('linksContainer');
const signInBtn = document.getElementById('addLink');
signInBtn.addEventListener('click', () => {
  addLink();
});

firebase.initializeApp({
  apiKey: 'AIzaSyDfbi-SfW8dnEG7O2MyYxslP6UpuSwN_vw',
  authDomain: 'golink-firwork.firebaseapp.com',
  projectId: 'golink-firwork',
  storageBucket: 'golink-firwork.appspot.com',
  messagingSenderId: '530320667233',
  appId: '1:530320667233:web:9ab4b070f9a279f862f020',
  measurementId: 'G-10PSQCVY6X',
});
const db = firebase.firestore();

getUrl((url) => {
  db.collection('links')
    .where('redirect', '==', url)
    .get()
    .then((snapshot) => {
      const divs = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        divs.push(
          `<div class="row"><div class="link">go/${
            doc.id
          }</div><div class="owners">${
            data.owners ? data.owners.join(',') : ''
          }</div></div>`,
        );
      });
      if (divs.length > 0) {
        divs.unshift(
          `<div class="row row-header"><div class="link">Go link</div><div class="owners">Owners</div></div>`,
        );
        linksContainer.innerHTML = divs.join('');
      } else {
        linksContainer.innerHTML = 'No links found';
      }
    })
    .catch((err) => {
      linksContainer.innerHTML = err.message;
    });
});

function getUrl(cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    cb(activeTab.url);
  });
}

function addLink() {
  getUrl((url) => {
    chrome.tabs.create({
      url: `https://golink-firework.vercel.app/?redirect=${encodeURIComponent(
        url,
      )}`,
      // url: `http://localhost:3000/?redirect=${encodeURIComponent(url)}`,
    });
  });
}
