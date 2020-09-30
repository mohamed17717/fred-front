const questionsBoxes = document.querySelectorAll('.qs .box');
questionsBoxes.forEach((box, i) => {
  const answerId = `answer${i}`;
  box.dataset["subbox"] = `#${answerId}`;
  box.querySelector('.a').setAttribute('id', answerId);
})