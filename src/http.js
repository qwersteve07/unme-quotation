const API_DOMAIN = 'http://localhost:8080';

class Http {
  fetchImages = async () => {
    try {
      return await fetch(`${API_DOMAIN}/images`).then(res => res.json());
    } catch (err) {
      console.log(err);
    }
  };

  uploadPhoto = async ({ data }) => {
    try {
      return await fetch(`${API_DOMAIN}/upload`, {
        body: data,
        method: 'POST',
      }).then(res => res.json());
    } catch (err) {
      console.log(err);
    }
  };

  uploadData = async ({ data }) => {
    try {
      return await fetch(`${API_DOMAIN}/images`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then(res => res.json());
    } catch (err) {
      console.log(err);
    }
  };
}

export default new Http();
