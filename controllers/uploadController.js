const fs = require('fs');
const path = require("path");
const userDB = require('../models/model.user.js');


module.exports = (req, res) => {
    
    if (req.files === null) {
      return res.status(400).json({ msg: "No file was uploaded" });
    } else if (req.files.file.name.match(/.csv$/) == null) {
      return res.status(400).json({msg: "Please upload CSV file."});
    }
  
    const file = req.files.file;
    const columnIndex = req.body.columnIndex;
    const rootDir = path.dirname(require.main.filename);
    const realFileName = `${rootDir}/client/public/uploads/${file.name}`;

    file.mv(`${realFileName}`, (err) => {
      
        if (err) { 
            console.error(err);
            return res.status(500).send(err);
        }      

        let data = fs.readFileSync(`${realFileName}`)
            .toString()
            .split('\n')
            .map(e => e.split(','));

        let header = data[0];
        
        header.push('DNC(Y/N)');
        data.shift();
        
        let phoneArray = [];
        
        for (let i = 0; i < data.length; i++) {
          
          let element = data[i][columnIndex - 1];
          
          if(!element) continue;
          
          element = (element.match(/\d/gmi)?element.match(/\d/gmi).join(''):'');
          
          data[i][columnIndex - 1] = element;
          
          element = Array.from(element);
          element.splice(3,0,",");
          element = element.join('');
          
          phoneArray.push(element);
          
          data[i][columnIndex - 1] = element;
          data[i][data[i].length - 1] = (data[i][data[i].length - 1].replace(/\r/,''));
        }
        
        // console.log(phoneArray, ' === phoneNumber === ');
        
        // userDB.find({PhoneNumber: { $in : phoneArray }})
        userDB.find({PhoneNumber: { $in : phoneArray }})
        .then(qr => {
          console.log(qr.length);

          data.forEach((e, i) => {
            if ( qr.findIndex(a=> {
              return a.PhoneNumber == e[columnIndex - 1];
            }) >= 0 ) {
              e.push('Y');
            }
            else e.push('N');
          })
          
          data.unshift(header);
          let wData = data.map(v => v.map(x => `"${x}"`).join(',')).join('\n');

          const directoryPath = `${rootDir}/client/public/downloads/`;
          const rFile = fs.createWriteStream(directoryPath+file.name);
          
          rFile.write(wData);
          rFile.end();

          res.json({ fileName: file.name, filePath: realFileName});
        })
        .catch(err => {
          res.status(422).json(err);
          console.log(err);
        });


    });
} 