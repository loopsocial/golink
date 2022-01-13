// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getFirestore } from 'firebase-admin/firestore';
import { getApp } from '../../../services/firebase_admin';

const db = getFirestore(getApp());

export default async function handler(req, res) {
  const link = req.query.link;
  const ref = db.collection('links').doc(link);
  const doc = await ref.get();
  if (!doc.exists) {
    console.log('No such doc:', link);
    res.redirect(`/error?link=${link}`);
  } else {
    console.log('find redirect url:', doc.data());
    res.redirect(doc.data().redirect);
  }
}
