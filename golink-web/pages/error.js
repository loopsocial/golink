import { useEffect, useState } from 'react';
import sharedStyles from '../styles/shared.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Error() {
  const [link, setLink] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setLink(router.query.link ?? '');
  }, [router.isReady, router.query]);

  if (!router.isReady) {
    return null;
  }

  return (
    <div>
      <main className={`${sharedStyles.main} ${sharedStyles.flexCenter}`}>
        <Image src='/missing.jpg' width={400} height={300}></Image>
        <h3>{`go/${link} is not found`}</h3>
        <Link href={`/?link=${link}`}>
          <a className={sharedStyles.button}>Create link</a>
        </Link>
      </main>
    </div>
  );
}
