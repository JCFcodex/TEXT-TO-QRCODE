document.addEventListener('DOMContentLoaded', () => {
  const themeCheckBox = document.getElementById('theme-checkbox');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.toggle('dark-mode', currentTheme === 'dark');
  themeCheckBox.checked = currentTheme === 'dark';

  themeCheckBox.addEventListener('change', () => {
    const isDarkMode = themeCheckBox.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });

  document.getElementById('generate').addEventListener('click', async () => {
    const text = document.getElementById('text').value.trim();
    const qrcodeDiv = document.getElementById('qrcode');

    const maxLength = getMaxQRCodeLength();

    if (!text) {
      alert('Please enter a text or URL.');
      return;
    }

    if (text.length > maxLength) {
      alert(`Input length exceeds maximum capacity (${maxLength} characters).`);
      return;
    }

    const qr = new QRious({
      value: text,
      size: 256,
    });

    const qrCodeDataURL = qr.toDataURL('image/png');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const logo = new Image();
    const qrCodeImage = new Image();

    qrCodeImage.src = qrCodeDataURL;
    qrCodeImage.onload = () => {
      canvas.width = qrCodeImage.width;
      canvas.height = qrCodeImage.height;
      ctx.drawImage(qrCodeImage, 0, 0);

      logo.src = '../assets/rd-wh-logo.png'; // Logo
      logo.onload = () => {
        const logoSize = qrCodeImage.width * 0.2;
        const x = (qrCodeImage.width - logoSize) / 2;
        const y = (qrCodeImage.height - logoSize) / 2;
        ctx.drawImage(logo, x, y, logoSize, logoSize);

        const mergedDataURL = canvas.toDataURL('image/png');
        const mergedImage = document.createElement('img');
        mergedImage.src = mergedDataURL;
        qrcodeDiv.innerHTML = '';
        qrcodeDiv.appendChild(mergedImage);

        const blob = dataURItoBlob(mergedDataURL);
        const blobUrl = URL.createObjectURL(blob);

        const existingDownloadButton = document.getElementById('download');
        if (!existingDownloadButton) {
          createDownloadButton(blobUrl);
        } else {
          existingDownloadButton.href = blobUrl;
        }
      };
    };
  });

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const createDownloadButton = (blobUrl) => {
    const downloadButton = document.createElement('a');
    downloadButton.id = 'download';
    downloadButton.href = blobUrl;
    downloadButton.download = 'jcfcodex-qrcode.png';
    downloadButton.textContent = 'Download';

    document.querySelector('.container').appendChild(downloadButton);
  };

  const getMaxQRCodeLength = () => {
    const version = 40;
    const mode = 'alphanumeric';

    switch (mode) {
      case 'numeric':
        return getNumericCapacity(version);
      case 'alphanumeric':
        return getAlphanumericCapacity(version);
      case 'binary':
        return getBinaryCapacity(version);
      case 'kanji':
        return getKanjiCapacity(version);
      default:
        return 0;
    }
  };

  const getNumericCapacity = (version) => {
    return 7089;
  };

  const getAlphanumericCapacity = (version) => {
    return 4296;
  };

  const getBinaryCapacity = (version) => {
    return 2953;
  };

  const getKanjiCapacity = (version) => {
    return 1817;
  };
});
