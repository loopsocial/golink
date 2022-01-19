import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import sharedStyles from '../styles/shared.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getApp } from '../services/firebase_web';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { SignIn } from '../components/SignIn';
import { useRouter } from 'next/router';

const auth = getAuth(getApp());
const db = getFirestore(getApp());

function parseOwners(owners) {
  return owners
    .split(',')
    .map((item) => item.trim())
    .filter((item) => !!item);
}

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

function GoLink({ link }) {
  return (
    <span className={styles.statusText}>
      <a className={styles.link} href={`http://go/${link}`}>
        go/{link}
      </a>{' '}
      is ready!
    </span>
  );
}

function RequestStatus({ link, error }) {
  if (link) {
    return <GoLink link={link}></GoLink>;
  }
  if (error) {
    return (
      <span className={`${styles.statusText} ${styles.statusTextFailure}`}>
        {error.message}
      </span>
    );
  }
  return null;
}

export default function Home() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [link, setLink] = useState('');
  const [redirect, setRedirect] = useState('');
  const [owners, setOwners] = useState(auth.currentUser?.email);
  const [submittedLink, setSubmittedLink] = useState('');
  const [error, setError] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.link) {
      setLink(router.query.link);
    }
    if (router.query.redirect) {
      setRedirect(router.query.redirect);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setIsAuthReady(true);
      setUser(auth.currentUser);
      setOwners(auth.currentUser?.email);
    });
  }, []);

  const submitForm = async (evt) => {
    evt.preventDefault();
    if (!redirect.startsWith('https://') && !redirect.startsWith('http://')) {
      redirect = `https://${redirect}`;
    }
    try {
      const docRef = doc(db, 'links', link);
      const docSnap = await getDoc(docRef);
      let count = 0;
      if (docSnap.exists() && docSnap.data().count !== undefined) {
        count = docSnap.data().count;
      }
      await setDoc(docRef, {
        redirect,
        owners: parseOwners(owners),
        count,
      });
      setSubmittedLink(link);
      setError(undefined);
    } catch (err) {
      setSubmittedLink('');
      setError(err);
    } finally {
      setLink('');
      setRedirect('');
      setOwners('');
    }
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
        <div className={styles.content}>
          <div className={styles.formContainer}>
            <h2>Create a go link</h2>
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
              <TextInput
                label='Owners'
                prefix=''
                name='owners'
                value={owners}
                onChange={(evt) => {
                  setOwners(evt.target.value);
                }}></TextInput>
              <div>
                <input
                  disabled={!link || !redirect}
                  className={sharedStyles.button}
                  type='submit'
                  value='Submit'></input>
                <RequestStatus
                  link={submittedLink}
                  error={error}></RequestStatus>
              </div>
            </form>
          </div>
          <div className={styles.extensionContainer}>
            <h2>Short links FTW!</h2>
            <p>
              Go links is a URL shortener built for Firework internal links.
              <br />
              Add the Chrome extension and create your own go links today.
            </p>
            <Link href='https://chrome.google.com/webstore/detail/firework-go-link/gkfplgdhimpaeoglmablmnpbbiioahci'>
              <a className={`${sharedStyles.button} ${styles.downloadBtn}`}>
                Download Chrome Extension
              </a>
            </Link>
          </div>
        </div>
        <div className={styles.footer}>
          Please file{' '}
          <a
            className={styles.link}
            href='https://github.com/loopsocial/golink/issues/new'>
            Github Issues
          </a>{' '}
          for feature requests and bug reports.
        </div>
      </main>
    </div>
  );
}
