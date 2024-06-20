const express = require('express');
const app = express();
const path = require('path');
const QRious = require('qrious');
const { createCanvas, loadImage } = require('canvas');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/generate', async (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).send('Text query parameter is required');
  }

  const qr = new QRious({
    value: text,
    size: 256,
  });

  const qrCodeDataURL = qr.toDataURL();
  const canvas = createCanvas(256, 256);
  const ctx = canvas.getContext('2d');
  const logo = await loadImage(path.join(__dirname, 'public', 'logo.png'));
  const qrCodeImage = await loadImage(qrCodeDataURL);

  ctx.drawImage(qrCodeImage, 0, 0);
  const logoSize = canvas.width * 0.2;
  const x = (canvas.width - logoSize) / 2;
  const y = (canvas.height - logoSize) / 2;
  ctx.drawImage(logo, x, y, logoSize, logoSize);

  res.setHeader('Content-Type', 'image/png');
  canvas.createPNGStream().pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
