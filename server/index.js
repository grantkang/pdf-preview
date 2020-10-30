
require('dotenv/config');
const express = require('express');
const fsPromises = require('fs').promises;
const multer = require('multer');
const path = require('path');
const gm = require('gm');

const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');

const app = express();

app.use(staticMiddleware);

app.use(express.json());

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) { callback(null, 'server/public/documents'); },
    filename: function (req, file, callback) { callback(null, Date.now() + path.extname(file.originalname)); }
  })
}).single('file');
app.post('/api/upload', upload, (req, res, next) => {
  try {
    const file = req.file;
    if (!file) throw new ClientError('No file provided', 400);
    const readPath = path.join(file.path);
    const thumbnail = path.basename(file.filename, path.extname(file.filename)) + '.jpg';
    const writePath = path.join('server/public/images/', thumbnail);
    gm(readPath)
      .selectFrame(0)
      .setFormat('jpg')
      .resize(200)
      .quality(100)
      .write(writePath, function (error) {
        if (!error) {
          res.status(201).send({
            originalName: file.originalname,
            filename: file.filename,
            thumbnail
          });
        } else {
          return new Error('lol');
        }
      });
  } catch (err) {
    next(err);
  }

});

app.get('/api/gallery', async (req, res, next) => {
  const files = (await fsPromises.readdir('server/public/documents', 'binary')).filter(file => file !== '.gitignore');
  res.status(200).send(files);
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
