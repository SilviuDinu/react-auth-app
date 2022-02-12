const downloadFile = (fileContent, fileName) => {
  const link = document.createElement('a');
  link.href = fileContent;
  link.download = fileName;
  link.click();
  link.remove();
};

export default downloadFile;
