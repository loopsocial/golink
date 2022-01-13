import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import sharedStyles from '../styles/shared.module.css';
import { useEffect, useState } from 'react';
import { getApp } from '../services/firebase_web';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { SignIn } from '../components/SignIn';
import { useRouter } from 'next/router';

const auth = getAuth(getApp());
const db = getFirestore(getApp());

function TextInput({ label, prefix, name, value, onChange }) {
  return (
    <label className={styles.label}>
      <div className={styles.labelTitle}>{label}</div>
      {prefix}
      <input
        className={styles.labelInput}
        type='text'
        name={name}
        value={value}
        onChange={onChange}></input>
    </label>
  );
}

export default function Home() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [link, setLink] = useState('');
  const [redirect, setRedirect] = useState('');
  const [status, setStatus] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setLink(router.query.link ?? '');
  }, [router.isReady, router.query]);

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
    setDoc(doc(db, 'links', link), {
      redirect,
    })
      .then(() => {
        setStatus({ text: 'Update succeeded', isSuccessful: true });
        setLink('');
        setRedirect('');
      })
      .catch((err) => {
        setStatus({ text: err.message, isSuccessful: false });
        setLink('');
        setRedirect('');
      });
  };

  if (!isAuthReady) {
    // Do not render anything before auth state is ready.
    return null;
  }
  if (!user) {
    // Render the sign in view when user is logged out.
    // Note that the firestore also has a permission check so even if the user
    // bypass this logic by modifying the JS on the client side, unauthorized
    // users still can't hack into our database.
    return (
      <main className={`${sharedStyles.main} ${sharedStyles.flexCenter}`}>
        <SignIn></SignIn>
      </main>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Firework Go Links</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={sharedStyles.main}>
        <div className={styles.banner}>
          <Image src='/banner.jpg' width={2048} height={504}></Image>
        </div>
        <h2 className={styles.title}>Create a go link</h2>
        <form className={styles.form} onSubmit={submitForm}>
          <TextInput
            label='Go link name'
            prefix='go/'
            name='link'
            value={link}
            onChange={(evt) => {
              setLink(evt.target.value);
            }}></TextInput>
          <TextInput
            label='Target URL'
            prefix=''
            name='redirect'
            value={redirect}
            onChange={(evt) => {
              setRedirect(evt.target.value);
            }}></TextInput>
          <div>
            <input
              disabled={!link || !redirect}
              className={sharedStyles.button}
              type='submit'
              value='Submit'></input>
            {status ? (
              <span
                className={`${styles.statusText} ${
                  status.isSuccessful
                    ? styles.statusTextSuccess
                    : styles.statusTextFailure
                }`}>
                {status.text}
              </span>
            ) : null}
          </div>
        </form>
      </main>
    </div>
  );
}
