import { useEffect, useState } from 'react';
import { getApp } from '../services/firebase_web';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const auth = getAuth(getApp());
const db = getFirestore(getApp());

export default function AddPath() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [path, setPath] = useState('');
  const [redirect, setRedirect] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setIsAuthReady(true);
      setUser(auth.currentUser);
    });
  }, []);

  const submitForm = (evt) => {
    evt.preventDefault();
    if (!redirect.startsWith('https://')) {
      redirect = `https://${redirect}`;
    }
    setDoc(doc(db, 'links', path), {
      redirect,
    })
      .then(() => {
        setStatus('Add path succeeded');
        setPath('');
        setRedirect('');
      })
      .catch((err) => {
        setStatus(`Error: ${err.message}`);
        setPath('');
        setRedirect('');
      });
  };

  const signIn = () => {
    const app = getApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        setUser(result.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (!isAuthReady) {
    return <div>Checking auth status...</div>;
  }
  if (!user) {
    return <button onClick={signIn}>sign in</button>;
  }

  return (
    <form onSubmit={submitForm}>
      <label>
        Path:{' '}
        <input
          type='text'
          name='path'
          value={path}
          onChange={(evt) => {
            setPath(evt.target.value);
          }}></input>
      </label>
      <label>
        Redirect:{' '}
        <input
          type='text'
          name='redirect'
          value={redirect}
          onChange={(evt) => {
            setRedirect(evt.target.value);
          }}></input>
      </label>
      <input type='submit' value='Submit'></input>
      <div>{status}</div>
    </form>
  );
}
