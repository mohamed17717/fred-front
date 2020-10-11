const bk = 'http://127.0.0.1:8000';



function getBoughtCourseFromLocalStorage() {
  return JSON.parse(localStorage.getItem('bought') || '[]')
}

function setBoughtCourseInLocalStorage(courseId) {
  const bought = getBoughtCourseFromLocalStorage()
  console.log(typeof bought)
  bought.push(courseId)

  localStorage.setItem('bought', JSON.stringify(bought))
}

function checkBoughtCourse(courseId) {
  return getBoughtCourseFromLocalStorage().includes(courseId)
}

function courseBought() {
  const courseBtn = document.querySelector('#thanks-intro button')

  if (!courseBtn)
    return

  const courseId = courseBtn.dataset.to
  const url = `${bk}/buy-course/${courseId}/`

  if (!checkBoughtCourse(courseId)) {
    fetch(url);
    setBoughtCourseInLocalStorage(courseId)
  }
}

courseBought()