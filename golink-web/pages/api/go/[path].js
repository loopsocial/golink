// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getFirestore } from 'firebase-admin/firestore';
import { getApp } from '../../../services/firebase_admin';

const db = getFirestore(getApp());

export default async function handler(req, res) {
  const path = req.query.path;
  const ref = db.collection('links').doc(path);
  const doc = await ref.get();
  if (!doc.exists) {
    console.log('No such doc:', path);
    res.redirect('/error');
  } else {
    console.log('find redirect path:', doc.data());
    res.redirect(doc.data().redirect);
  }
}
