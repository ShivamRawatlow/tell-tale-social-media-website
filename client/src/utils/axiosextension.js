import axios from 'axios';
import store from 'store2';

const fetchClient = () => {
  const defaultOptions = {
    responseType: 'json',
  };

  let instance = axios.create(defaultOptions);

  instance.interceptors.request.use((config) => {
    const token = store.get('jwt');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return instance;
};

export default fetchClient();
