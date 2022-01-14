import sharedStyles from '../styles/shared.module.css';
import styles from '../styles/SignIn.module.css';
import React from 'react';
import { getApp } from '../services/firebase_web';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export function SignIn() {
  const signIn = () => {
    const app = getApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
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
