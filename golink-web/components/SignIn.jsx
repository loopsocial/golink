import sharedStyles from '../styles/shared.module.css';
import styles from '../styles/SignIn.module.css';
import React, { useEffect, useState } from 'react';
import { getApp } from '../services/firebase_web';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth(getApp());

export function SignIn() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [path, setPath] = useState('');
  const [redirect, setRedirect] = useState('');
  const [status, setStatus] = useState(undefined);

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setIsAuthReady(true);
      setUser(auth.currentUser);
    });
  }, []);

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
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to Firework Go Links</h2>
      <button
        style={{ width: '200px' }}
        className={sharedStyles.button}
        onClick={signIn}>
        Sign in
      </button>
    </div>
  );
}
