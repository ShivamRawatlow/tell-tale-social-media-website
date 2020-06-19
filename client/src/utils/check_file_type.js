const checkExtension = (data) => {
  const file = data;
  if (/\.(jpe?g|png)$/i.test(file.name) === false) {
    return new Error('Please upload a pic of jpeg or png');
  }
};

export default checkExtension;
