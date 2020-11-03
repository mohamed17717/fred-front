const bk = 'https://thegoodzone.pythonanywhere.com';

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

function renderMostSellCourses() {
  const section = document.querySelector('#courses')
  const coursesContainer = section.querySelector('ul');
  const url = `${bk}/courses/most-sell/`

  fetch(url)
    .then(res => res.json())
    .then(courses => {
      courses.forEach(course => {
        coursesContainer.innerHTML += `
            <li class="item" data-to="${course.url}">
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
                  ${course.author_name ? '<div class="author"><div class="avatar" style="flex-shrink: 0;background-image: url(' + course.author_pp + ')"></div><div class="name">'+ course.author_name + '</div></div>' : ''}
                  <div class="price">${course.price}</div>
                </div>
              </div>
            </li>
        `
      })

      if (courses.length === 0) {
        section.remove()
      }
    })

}

function blogHomebageResponsive() {
  const homepageBlog = document.querySelector('#blog');
  const handle = () => {
    if (window.innerWidth < 1080)
      homepageBlog.querySelector('.item:first-child').classList.remove('cover');
    else
      homepageBlog.querySelector('.item:first-child').classList.add('cover');
  }

  handle()
  if (homepageBlog)
    window.addEventListener('resize', e => handle());
}

function renderBlogs() {

  const section = document.querySelector('#blog')
  const blogsContainer = section.querySelector('ul');
  const url = `${bk}/blogs/`

  fetch(url)
    .then(res => res.json())
    .then(blogs => {

      blogs.slice(0, 5).forEach(blog => {
        blogsContainer.innerHTML += `
            <li class="item">
              <div class="thumbnail" style="background-image: url(${blog.thumbnail})"></div>
              <div class="info">
                <h3>${blog.title}</h3>
                <p>
                  ${blog.description}
                </p>
                <div class="footer">
                  <div class="author">
                    <div class="avatar" style="flex-shrink: 0;background-image: url(${blog.author_pp})"></div>
                    <div class="name">${blog.author_name}</div>
                  </div>
                  <div class="date">${blog.date}</div>
                </div>
              </div>
            </li>
        `
      })

      if (blogs.length < 5) {
        section.remove()
        document.querySelector('#coaching').style.marginBottom = '0';
      } else
        blogHomebageResponsive()

    })

}



renderMostSellCourses()
renderBlogs()