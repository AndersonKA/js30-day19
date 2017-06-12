const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(localMediaStream => {
    console.log(localMediaStream);
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(err => {
    console.error(`the webcam didn't work!`, err);
  });
}

function paintToCanvas() {
  const width = video.videowidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take pixels out
    let pixels = ctx.getImageData(0, 0, width, height);

    // change them (uncomment the one you want)
    // pixels = blueEffect(pixels);
    // pixels = rgbSplit(pixels);
      // ctx.globalAlpha = 0.1;
    // pixels = rgbSplit(pixels);

    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime= 0;
  snap.play();

  const data = canvas.toDataURL('/img/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'super');
  link.innerHTML = `<img src="${data}"" alt="super pic" />`;
  strip.insertBefore(link, strip.firstChild);
}

function blueEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i = i + 4) {
    pixels.data[i + 0] = pixels.data[i + 0] * 0.5; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] + 100;  // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i = i + 4) {
    pixels.data[i - 150] = pixels.data[i + 0] * 0.5; // red
    pixels.data[i + 100] = pixels.data[i + 1] - 50; // green
    pixels.data[i - 150] = pixels.data[i + 2] + 100;  // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

document.querySelectorAll('.rgb input').forEach((input) => {
  levels[input.name] = input.value;
});

for (i = 0; i < pixels.data.length; i = i + 4) {
  red = pixels.data[i + 0];
  green = pixels.data[i + 1];
  blue = pixels.data[i + 2];
  alpha = pixels.data[i + 3];

  if (red >= levels.rmin
    && green >= levels.gmin
    && blue >= levels.bmin
    && red <= levels.rmax
    && green <= levels.gmax
    && blue <= levels.bmax) {
    // take out the alpha
    pixels.data[i + 3] = 0;
  }
}

return pixels;
}

getVideo();


video.addEventListener('canplay', paintToCanvas);
