import styles from './app.module.sass';
import random from 'lodash/random';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames/bind';
import ReactLoading from 'react-loading';
import iconRefresh from './assets/refresh.svg';
import iconLogo from './assets/logo.svg';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
const cx = classnames.bind(styles);

function App() {
  const inputRef = useRef('');
  const [imageUrl, setImageUrl] = useState();
  const [imageLoad, setImageLoad] = useState(false);
  const [uploadState, setUploadState] = useState('init');
  const [dialogShow, setDialogShow] = useState(false);

  const fetchImage = () => {
    // var listRef = storage.ref().child('');
    // listRef
    //   .listAll()
    //   .then(res => {
    //     // get item
    //     const length = res.items.length;
    //     const pickItem = res.items[random(0, length - 1)];
    //     // get item url
    //     storage
    //       .ref(pickItem.name)
    //       .getDownloadURL()
    //       .then(url => {
    //         setImageUrl(url);
    //       });
    //   })
    //   .catch(error => {
    //     // Uh-oh, an error occurred!
    //   });
  };

  useEffect(() => {
    fetchImage();
  }, []); // eslint-disable-line

  const uploadFile = async file => {
    setUploadState('uploading');

    // const data = {
    //   image: file,
    // };

    fetch('http://localhost:8080/images', {
      body: {
        imageUrl,
      },
      method: 'POST',
    })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });

    setUploadState('done');
  };

  const refreshImage = () => {
    setImageUrl(undefined);
    setImageLoad(false);
    fetchImage();
  };

  const Thanks = () => {
    if (uploadState === 'uploading') return <ReactLoading type="spin" color="#999999" height={20} width={20} />;
    if (uploadState === 'done') return '謝謝您的貢獻，肥婆奶奶：）';

    return <></>;
  };

  const handleDialogOpen = () => setDialogShow(true);
  const handleDialogClose = () => setDialogShow(false);
  const handleUploadFile = async file => {
    let data = new FormData();
    data.append('file', file);
    const imageUrl = await fetch('http://localhost:8080/upload', {
      body: data,
      method: 'POST',
    })
      .then(res => res.json())
      .then(value => console.log(value))
      .catch(err => console.log(err));
  };
  const handleContribute = () => {};

  return (
    <div className={styles.app}>
      <img src={iconLogo} alt="logo" width="70" />
      <h1>UNME 陪你過日子</h1>
      <p>就讓非我設計的每個人，在你最失意的時刻，用最真實的模樣陪伴著你。</p>
      <div className={cx({ container: true, load: imageLoad })}>
        <div className={styles.refresh} onClick={refreshImage}>
          <img src={iconRefresh} alt="refresh" />
        </div>
        <div className={styles.image}>
          {(!imageUrl || !imageLoad) && (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          )}
          <img src={imageUrl} alt="quote" onLoad={() => setImageLoad(true)} />
        </div>
      </div>

      <Button variant="outlined" onClick={handleDialogOpen}>
        上傳 UNME 的歡樂時光
      </Button>
      <ContributeDialog
        show={dialogShow}
        onDismiss={handleDialogClose}
        onUploadFile={handleUploadFile}
        onContribute={handleContribute}
      />
      {/* 
      <div className={styles.contribute}>
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
      </div> */}
      <footer>
        Design by Steve Lee .<br />
        Contribution by UNME Design.
      </footer>
    </div>
  );
}

const ContributeDialog = ({ show, onDismiss, onUploadFile, onContribute }) => {
  return (
    <Dialog open={show} onClose={onDismiss}>
      <DialogTitle>DO IT</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="名稱"
          placeholder="是哪位動物熱心的提供呢？"
          type="text"
          fullWidth
          variant="standard"
        />
        <TextField
          autoFocus
          margin="dense"
          id="comment"
          label="說明"
          placeholder="請補充這人在幹嘛"
          type="text"
          fullWidth
          variant="standard"
        />

        <Button margin="dense" variant="outlined" component="label">
          選擇圖片
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={e => {
              onUploadFile(e.target.files[0]);
            }}
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onDismiss}>
          取消
        </Button>
        <Button variant="contained" onClick={onContribute}>
          傳送！
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default App;
