import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDfbi-SfW8dnEG7O2MyYxslP6UpuSwN_vw',
  authDomain: 'golink-firwork.firebaseapp.com',
  projectId: 'golink-firwork',
  storageBucket: 'golink-firwork.appspot.com',
  messagingSenderId: '530320667233',
  appId: '1:530320667233:web:9ab4b070f9a279f862f020',
  measurementId: 'G-10PSQCVY6X',
};

// Initialize Firebase
export function getApp() {
  return initializeApp(firebaseConfig);
}
