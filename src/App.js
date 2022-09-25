import styles from './app.module.sass';
import random from 'lodash/random';
import { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
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
import LoadingButton from '@mui/lab/LoadingButton';
import { API_DOMAIN } from './config';
const cx = classnames.bind(styles);

function App() {
  const [image, setImage] = useState();
  const [imageLoad, setImageLoad] = useState(false);
  const [dialogShow, setDialogShow] = useState(false);
  const [uploadData, setUploadData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [contributing, setContributing] = useState(false);

  const fetchImage = async () => {
    const images = await fetch(`${API_DOMAIN}/images`).then(res => res.json());

    const imagesLength = images.length;
    const item = images[random(0, imagesLength - 1)];
    setImage(item);
  };

  useEffect(() => {
    fetchImage();
  }, []); // eslint-disable-line

  const refreshImage = () => {
    setImage(null);
    setImageLoad(false);
    fetchImage();
  };

  const handleDialogOpen = () => setDialogShow(true);

  const handleDialogClose = () => setDialogShow(false);

  const handleUploadDataChange = (type, value) => {
    setUploadData(prev => ({ ...prev, [type]: value }));
  };

  const handleUploadFile = async file => {
    setUploading(true);
    let data = new FormData();
    data.append('file', file);
    await fetch(`${API_DOMAIN}/upload`, {
      body: data,
      method: 'POST',
    })
      .then(res => res.json())
      .then(value => {
        setUploadData(prev => ({ ...prev, imageUrl: value.url }));
      })
      .catch(err => console.log(err))
      .finally(() => {
        setUploading(false);
      });
  };

  const handleContribute = async () => {
    setContributing(true);
    await fetch(`${API_DOMAIN}/images`, {
      body: JSON.stringify(uploadData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(() => {
        setDialogShow(false);
        setUploadData(() => ({}));
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setContributing(false);
      });
  };

  const ContributeDialog = () => {
    return (
      <Dialog open={dialogShow} onClose={handleDialogClose}>
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
            onChange={e => handleUploadDataChange('name', e.target.value)}
          />
          <TextField
            margin="dense"
            id="comment"
            label="說明"
            placeholder="請補充這人在幹嘛"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => handleUploadDataChange('comment', e.target.value)}
          />
          <Button disabled={uploading} margin="dense" variant="outlined" component="label">
            {uploading ? <CircularProgress size={25} /> : '選擇圖片'}
            <input hidden accept="image/*" type="file" onChange={e => handleUploadFile(e.target.files[0])} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleDialogClose}>
            取消
          </Button>

          <LoadingButton
            disabled={Object.keys(uploadData).length !== 3}
            onClick={handleContribute}
            loading={contributing}
            loadingPosition="start"
            variant="contained"
          >
            傳送！
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  };

  const Image = () => {
    const Loading = () => {
      return (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      );
    };
    if (!image) {
      return (
        <div className={styles['loading-container']}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={styles['image-container']}>
        {imageLoad && (
          <div className={styles.refresh} onClick={refreshImage}>
            <img src={iconRefresh} alt="refresh" />
          </div>
        )}
        <div className={styles.name}>
          由 <b>{image.name}</b> 所提供
        </div>
        <div className={styles.image}>
          {!imageLoad && <Loading />}
          <img
            style={{ display: imageLoad ? 'block' : 'none' }}
            src={image.imageUrl}
            alt="quote"
            onLoad={() => setImageLoad(true)}
          />
        </div>
        <div className={styles.comment}>{image.comment}</div>
      </div>
    );
  };

  return (
    <div className={styles.app}>
      <img src={iconLogo} alt="logo" width="70" />
      <h1>UNME 陪你過日子</h1>
      <p>就讓非我設計的每個人，在你最失意的時刻，用最真實的模樣陪伴著你。</p>
      <div className={cx({ container: true, load: imageLoad })}>
        <Image />
      </div>

      <Button variant="outlined" onClick={handleDialogOpen}>
        上傳 UNME 的歡樂時光
      </Button>
      {ContributeDialog()}
      <footer>
        Design by Steve Lee .<br />
        Contribution by UNME Design.
      </footer>
    </div>
  );
}

export default App;
