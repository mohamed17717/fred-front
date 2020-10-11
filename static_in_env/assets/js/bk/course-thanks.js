const bk = 'https://thegoodzone.pythonanywhere.com';



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

function getRecommendedCourses() {
  const courseBtn = document.querySelector('#thanks-intro button')
  const courseId = courseBtn.dataset.to

  const section = document.querySelector('#recommended-courses')
  const container = document.querySelector('#recommended-courses .courses ul')

  const url = `${bk}/random-related-courses/${courseId}/`
  fetch(url)
    .then(res => res.status)
    .then(status => {
      if (status === 200)
        return res.json();
      return []
    })
    .then(data => {
      data.forEach(course => {
        container.innerHTML += `
          <li class="item card">
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

courseBought()