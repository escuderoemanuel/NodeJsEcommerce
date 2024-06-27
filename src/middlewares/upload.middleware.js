const multer = require('multer');
const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      let destinationFolder;
      if (file.fieldname === 'profilePicture') {
        destinationFolder = 'profilePicture';
      } else if (file.fieldname === 'identification') {
        destinationFolder = 'documents/identification';
      } else if (file.fieldname === 'proofOfAddress') {
        destinationFolder = 'documents/proofOfAddress';
      } else if (file.fieldname === 'proofOfAccountStatus') {
        destinationFolder = 'documents/proofOfAccountStatus';
      } else if (file.fieldname === 'product') {
        destinationFolder = 'products';
      } else {
        return cb(new Error('Invalid fieldname'));
      }


      const fullPath = path.join(`${__dirname}/../public/filesUploadedByUser/${destinationFolder}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath);

    } catch (err) {
      console.error('Error in destination function:', err);
      cb(err);
    }
  },

  filename: function (req, file, cb) {
    try {
      let timestampMs = Date.now();
      let readableDate = DateTime.fromMillis(timestampMs).toFormat('dd-MM-yyyy');
      let readableTime = DateTime.fromMillis(timestampMs).toFormat('HH-mm-ss');

      cb(null, `${readableDate}_${readableTime} - ${file.originalname}`);

    } catch (error) {
      console.error('Error in filename function:', error);
      cb(error);
    }
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
