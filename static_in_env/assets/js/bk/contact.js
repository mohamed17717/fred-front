const bk = 'http://127.0.0.1:8000';

function formButtonMsg(btn, msg) {
  btn.innerText = msg
}

function formButtonDisabled(btn) {
  btn.disabled = true;
  formButtonMsg(btn, 'loading...')
}

function extractFormDataJSON(form) {
  const formData = new FormData(form);

  var object = {};
  formData.forEach(function (value, key) {
    object[key] = value;
  });

  return object;
}

const postData = async (data) => {
  const rawResponse = await fetch(`${bk}/contact-us/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return rawResponse;
}


const form = document.querySelector('#contact form');
form.addEventListener('submit', e => {
  e.preventDefault();

  const formBtn = form.querySelector('button')
  formButtonDisabled(formBtn)


  const data = extractFormDataJSON(form);
  postData(data)
    .then(res => res.status)
    .then(status => {
      if (status === 200) {
        formButtonMsg(formBtn, 'success!!');
        form.reset();
      } else {
        formButtonMsg(formBtn, 'failed!!');
      }
    }).then(() => {
      setTimeout(() => {
        formBtn.disabled = false
        formBtn.innerText = 'submit'
      }, 1200)
    })


})