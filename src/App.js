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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import http from './http';

const cx = classnames.bind(styles);
const theme = createTheme({
  palette: {
    primary: grey,
  },
});

function App() {
  const [image, setImage] = useState();
  const [imageLoad, setImageLoad] = useState(false);
  const [dialogShow, setDialogShow] = useState(false);
  const [uploadData, setUploadData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [contributing, setContributing] = useState(false);

  const fetchImage = async () => {
    const data = await http.fetchImages();
    const imagesLength = data.length;
    const item = data[random(0, imagesLength - 1)];
    setImage(item);
  };

  useEffect(() => {
    fetchImage();
  }, []);

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

    await http
      .uploadPhoto({ data })
      .then(value => {
        console.log(value);
        setUploadData(prev => ({ ...prev, imageUrl: value.url }));
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleContribute = async () => {
    setContributing(true);
    await http
      .uploadData({ data: uploadData })
      .then(value => {
        setDialogShow(false);
        setUploadData(() => ({}));
        setImage(value);
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
            disabled={!(uploadData.name && uploadData.imageUrl)}
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
        {image.comment && <div className={styles.comment}>{image.comment}</div>}
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <img src={iconLogo} alt="logo" width="50" />
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
          © 2022 Design by Steve Lee.
          <br />
          Contribution by UNME Design.
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
