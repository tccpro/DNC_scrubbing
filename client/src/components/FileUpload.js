import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [columnIndex, setColumnIndex] = useState('');
  const [fileClass, setfileClass] = useState('file-hide');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onChangeIndex = e => {
    setColumnIndex(e.target.value);
  }


  const onSubmit = async e => {
    
    e.preventDefault();

    if(file == null) {
      alert('Please choose a file.');
      return;
    } else if(columnIndex == '') {
      alert('Please enter columnIndex.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('columnIndex', columnIndex);

    try {
      
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
          if (parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)) > 98);
          setfileClass('file-show');
        },
      });
      
      setfileClass('file-hide');
      setTimeout(() => setUploadPercentage(0), 500);
      const { fileName, filePath, data } = res.data;
      console.log(data);
      setUploadedFile({ fileName, filePath });
      setMessage('File uploaded');
      window.location = `http://localhost:5000/files/${fileName}`;
      return;

    } catch(err) {
      if(err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  }

  return (
    <Fragment>
      { message ? <Message msg={ message } /> : null }
      <form onSubmit={onSubmit}>

        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <div className='custom-file mb-4'>
          <input  
            type="number"
            className="custom-column-index-number"
            id="customeIndex"
            placeholder='Column Index'
            min="1"
            onChange={onChangeIndex} />
        </div>

        <Progress percentage={ uploadPercentage } />
        <h6 className={fileClass}> Operating ... </h6>
        <input 
          type="submit"
          value="Submit"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
    </Fragment>
  );
};

export default FileUpload;
