const multer = require('multer');
const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    try {
      // Uso el fieldName para determinar la ruta donde debo guardar el archivo
      let destinationFolder;
      if (file.fieldname === 'document') {
        destinationFolder = 'documents';
      } else if (file.fieldname === 'profile') {
        destinationFolder = 'profiles';
      } else if (file.fieldname === 'product') {
        destinationFolder = 'products';
      } else {
        return cb(new Error('Invalid fieldname'));
      }

      // Construyo la ruta completa
      const fullPath = path.join(`${__dirname}/../public/filesUploadedByUser/${destinationFolder}`);

      // Si la carpeta no existe, la creo
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
      // Fecha actual de subida en milisegundos
      let timestampMs = Date.now();

      // Formateo la fecha para que sea más legible
      let readableDate = DateTime.fromMillis(timestampMs).toFormat('dd-MM-yyyy');
      let readableTime = DateTime.fromMillis(timestampMs).toFormat('HH-mm-ss');

      // Armo el nombre final del archivo que se sube
      cb(null, `${readableDate}_${readableTime} - ${file.originalname}`);
      
    } catch (error) {
      console.error('Error in filename function:', error);
      cb(error);
    }
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
