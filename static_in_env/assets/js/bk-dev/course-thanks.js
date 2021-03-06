const bk = 'https://thegoodzone.pythonanywhere.com';



function getBoughtCourseFromLocalStorage() {
  return JSON.parse(localStorage.getItem('bought') || '[]')
}

function setBoughtCourseInLocalStorage(courseId) {
  const bought = getBoughtCourseFromLocalStorage()

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


function getCourseStars(average) {
  const count = 5;
  const star1 = '<div class="icon icon-star-fill"></div>'
  const star0 = '<div class="icon icon-star-outline"></div>'

  let stars = '';
  for (let i = 0; i < count; i++) {
    if (average > .44)
      stars += star1
    else
      stars += star0

    average--;
  }

  return stars

}

function getRecommendedCourses() {
  const courseIdElm = document.querySelector('[data-courseid]')
  if (!courseIdElm) return;

  const courseId = courseIdElm.dataset.courseid

  const section = document.querySelector('#recommended-courses')
  const container = section.querySelector('.courses ul')

  const url = `${bk}/random-related-courses/${courseId}/`
  fetch(url)
    .then(res => res.status === 200 ? res.json() : [])
    .then(data => {
      data.forEach(course => {
        container.innerHTML += `
          <li class="item card" data-to="${course.url}">
            <div class="thumbnail" style="background-image: url(${course.thumbnail})"></div>

            <div class="info">
              <h3><a href="${course.url}">${course.title}</a></h3>


              <div class="rating">
                <div>${course.rating.average}</div>
                <div class="stars">
                  ${getCourseStars(course.rating.average)}
                </div>
                <div>
                  (${course.rating.total} Ratings)
                </div>
              </div>

              <p>
                ${course.description}
              </p>
              <div class="footer">
                <div class="author">
                  <div class="avatar" style="background-image: url(${course.author_pp})"></div>
                  <div class="name">${course.author_name}</div>
                </div>
                <div class="price">${course.price}</div>
              </div>
            </div>
          </li>
        `
      })

      if (data.length === 0) {
        section.remove()
      }
    })
}

document.addEventListener('DOMContentLoaded', e => {
  courseBought()
  getRecommendedCourses()
})