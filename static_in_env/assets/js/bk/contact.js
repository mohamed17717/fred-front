const bk = 'https://thegoodzone.pythonanywhere.com';

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

const contacForm = document.querySelector('#contact form')
contacForm.addEventListener('submit', e => {
  e.preventDefault();

  const formBtn = contacForm.querySelector('button')
  formButtonDisabled(formBtn)


  const data = extractFormDataJSON(contacForm);
  postData(data)
    .then(res => res.status)
    .then(status => {
      if (status === 200) {
        formButtonMsg(formBtn, 'success!!');
        contacForm.reset();
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