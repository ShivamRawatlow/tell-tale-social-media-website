import imageCompression from 'browser-image-compression';

const compressImage = async (pic) => {
  console.log(pic);
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  try {
    const compressedPic = await imageCompression(pic, options);

    return compressedPic;
  } catch (comp_error) {
    return new Error('Image compression failed');
  }
};

export default compressImage;
