import axios from 'axios';
import compressImage from '../utils/compress_image';

const uploadPic = async (pic) => {
  try {
    const compressedPic = await compressImage(pic);
    console.log('After compression name', compressedPic.name);
    console.log('file size after compression', compressedPic.size);

    const data = new FormData();
    data.append('upload_preset', process.env.REACT_APP_UploadPreset);
    data.append('cloud_name', process.env.REACT_APP_CloudName);
    data.append('file', compressedPic);

    const res = await axios.post(process.env.REACT_APP_ImageDatabaseUrl, data);

    console.log('Upload pic data', res.data.url);
    return res.data.url;
  } catch (error) {
    console.log(error.message);
  }
};

export default uploadPic;
