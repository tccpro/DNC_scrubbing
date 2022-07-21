import React from 'react';
import FileUpload from './components/FileUpload';
import './App.css';

const App = () => (
  <div className='container mt-4'>
    <h4 className='display-4 text-center mb-4 scrub-title'>
      <img className="logo-upload" src="https://www.connexiocloud.com/wp-content/uploads/2021/05/cropped-CX-COLORED@2x-1-192x192.png"/> 
      Scrub Data File
    </h4>
    <FileUpload />
  </div>
);


export default App;
