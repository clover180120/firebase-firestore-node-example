import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount),
});

class Storage {
  constructor(collection) {
    const db = getFirestore();
    this.collection = db.collection(collection);
  }

  async getCount() {
    return (await this.collection.count().get()).data().count;
  }

  async setItem(key, value) {
    await this.collection.doc(key).set(value);
  }

  async getItem(key) {
    return (await this.collection.doc(key).get()).data();
  }

  async getItems() {
    const items = {};
    const snapshot = await this.collection.get();
    snapshot.forEach((item) => {
      items[item.id] = item.data();
    });
    return items;
  }

  async removeItem(key) {
    await this.collection.doc(key).delete();
  }
}

const storage = new Storage('links');

storage.setItem('foo', {
  foo: 'bar',
});

(async () => {
  console.log(await storage.getCount());
  console.log(await storage.getItems());
  console.log(await storage.getItem('foo'));
  console.log(await storage.removeItem('foo'));
})();