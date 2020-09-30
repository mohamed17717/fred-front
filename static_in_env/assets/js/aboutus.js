function view(imgUrl) {
  const fullImg = imgUrl.replace('.jpg', '-full.jpg')
  const photoViewer = document.querySelector('#photo-viewer')
  photoViewer.classList.add("photo-viewer-show")
  photoViewer.querySelector('img').setAttribute('src', fullImg)
}

function close() {
  console.log('close triggered')
  const photoViewer = document.querySelector('#photo-viewer')
  photoViewer.classList.remove("photo-viewer-show")
}

const images = document.querySelectorAll('#gallery .image')
images.forEach(img => {
  img.addEventListener('click', e => {
    const imgUrl = img.dataset.bgimgurl
    view(imgUrl);
  })
})

document.querySelector('#photo-viewer .close').addEventListener('click', close)
document.querySelector('#photo-viewer .overlay').addEventListener('click', close)
document.querySelector('#photo-viewer .photo').addEventListener('click', close)
document.querySelector('#photo-viewer img').addEventListener('click', e => e.stopPropagation())