import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log('Received file:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype
  });

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

  // Very lenient validation - accept anything that looks like an image
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    console.log(`✓ Accepting file with mimetype: ${file.mimetype}`);
    cb(null, true);
  } else if (allowedTypes.includes(file.mimetype)) {
    console.log(`✓ Accepting file with mimetype: ${file.mimetype}`);
    cb(null, true);
  } else if (file.originalname && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname)) {
    console.log(`✓ Accepting file based on extension: ${file.originalname}`);
    cb(null, true);
  } else {
    console.log(`✗ Rejected file - mimetype: ${file.mimetype}, filename: ${file.originalname}`);
    cb(new Error('Invalid file type. Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});
