import styles from './app.module.sass';
import random from 'lodash/random';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames/bind';
import firebase from 'firebase/app';
import 'firebase/storage';
import ReactLoading from 'react-loading';
const cx = classnames.bind(styles);

var firebaseConfig = {
  apiKey: 'AIzaSyCHjUOVqUBjEXJyRgxosyBgQJmtEGEAg1A',
  authDomain: 'unme-quotation.firebaseapp.com',
  projectId: 'unme-quotation',
  storageBucket: 'unme-quotation.appspot.com',
  messagingSenderId: '508520909491',
  appId: '1:508520909491:web:bab6e4e495395f0e50fec6',
  measurementId: 'G-S5H2Q2P1NV',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
  const inputRef = useRef('');
  const [imageUrl, setImageUrl] = useState();
  const [imageLoad, setImageLoad] = useState(false);
  const [uploadState, setUploadState] = useState('init');
  const storage = firebase.storage();

  useEffect(() => {
    var listRef = storage.ref().child('');

    listRef
      .listAll()
      .then(res => {
        // get item
        const length = res.items.length;
        const pickItem = res.items[random(0, length - 1)];
        // get item url
        storage
          .ref(pickItem.name)
          .getDownloadURL()
          .then(url => {
            setImageUrl(url);
          });
      })
      .catch(error => {
        // Uh-oh, an error occurred!
      });
  }, []);

  const uploadFile = file => {
    setUploadState('uploading');
    const ref = storage.ref();
    const name = file.name;
    const metadata = {
      contentType: file.type,
    };
    const task = ref.child(name).put(file, metadata);
    task
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        setUploadState('done');
      })
      .catch(console.error);
  };

  const Thanks = () => {
    if (uploadState === 'uploading') return <ReactLoading type="spin" color="#999999" height={20} width={20} />;
    if (uploadState === 'done') return '謝謝您的貢獻，肥婆奶奶：）';

    return <></>;
  };

  return (
    <div className={styles.app}>
      <h1>UNME 陪你過日子</h1>
      <p>就讓非我設計的每個人，在你最失意的時刻，用最真實的模樣陪伴著你。</p>
      <div className={cx({ image: true, load: imageLoad })}>
        {!imageUrl ? (
          <ReactLoading type="spin" color="#999999" height={20} width={20} />
        ) : (
          <img src={imageUrl} alt="quote" onLoad={() => setImageLoad(true)} onChange={x => console.log(x)} />
        )}
      </div>
      <div className={styles.contribute}>
        你也想讓我們的每一天能夠更快樂嗎？
        <input
          type="file"
          id="file"
          ref={inputRef}
          onChange={e => {
            uploadFile(e.target.files[0]);
          }}
        />
        <button
          type="file"
          name="upload"
          id="file-upload"
          onClick={() => {
            inputRef.current.click();
          }}
        >
          是！我很樂意！
        </button>
        <div className={styles.thanks}>
          <Thanks />
        </div>
      </div>
      <footer>
        Design by Steve Lee .<br />
        Contribution by UNME Design.
      </footer>
    </div>
  );
}

export default App;
