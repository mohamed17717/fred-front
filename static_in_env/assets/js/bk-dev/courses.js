const bk = 'https://thegoodzone.pythonanywhere.com';


function renderCategories() {
  const categoriesContainer = document.querySelector('#courses-intro .tags');
  const url = `${bk}/categories/`

  fetch(url)
    .then(res => res.json())
    .then(categories => {
      categories.forEach(category => {
        categoriesContainer.innerHTML += `
          <a href="?filter=${category.name}&page=1">${category.name}</a>
        `
      })
    })

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

function courseCard(course) {
  return `
    <div class="item card" data-to="${course.url}">
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
          ${course.author_name ? '<div class="author"><div class="avatar" style="flex-shrink: 0; background-image: url(' + course.author_pp + ')"></div><div class="name">'+ course.author_name + '</div></div>' : ''}
          <div class="price">${course.price}</div>
        </div>
      </div>
    </div>
  `
}

function getPath(number) {
  let params = window.location.search;
  if (params.length === 0)
    return `?page=${number}`

  if (params.includes('page='))
    params = params.replace(/page=\d+/, `page=${number}`)
  else
    params += `&page=${number}`

  return params
}

function getURL(dPage) {
  const params = new Map(location.search.slice(1).split('&').map(kv => kv.split('=')))
  // param value decodeURI(x.get('filter'))

  let page = dPage || decodeURI(params.get('page') || 1);
  let q = decodeURI(params.get('q') || '');
  let filter = decodeURI(params.get('filter') || '');

  let url = `${bk}`
  let path = `/courses/?page=${page}`

  if (q)
    path = `/search/?q=${q}&page=${page}`
  else if (filter)
    path = `/filter/${filter}/?page=${page}`

  return url + path
}

function renderCourses() {
  const section = document.querySelector('#courses-list')
  const coursesContainer = section.querySelector('.cards');
  const url = getURL()

  fetch(url)
    .then(res => res.json())
    .then(courses => {
      courses.data.forEach(course => {
        coursesContainer.innerHTML += courseCard(course)
      })

      if (courses.data.length === 0)
        coursesContainer.replaceWith(div({
          class: "empty-list-msg"
        }, 'Theris no courses right now.'))

      return courses;
    })
    .then(renderPagination)


}

function paginationLink(number, isActive = false) {
  return `<li class="${isActive ? 'active': ''}"><a href="${getPath(number)}">${number}</a></li>`
}

function renderPagination(page) {
  const pagination = document.querySelector('#courses-list .pagination')

  pagination.innerHTML = `
    ${page.has_prev ? '<a href="'+ getPath(page.current_page-1) + '" class="btn prev"></a>' : ''}
    
      <ul>
        ${page.current_page - 1 > 2 ? paginationLink(1) + '<li>...</li>'  : ''}

        ${page.has_prev ? paginationLink(page.current_page-1) : ''}
        ${paginationLink(page.current_page, true)}
        ${page.has_next ? paginationLink(+page.current_page+1) : ''}

        ${page.total_pages - page.current_page > 2 ? '<li>...</li>' + paginationLink(page.total_pages) : ''}
      </ul>

    ${page.has_next ? '<a href="'+ getPath(+page.current_page+1) + '" class="btn next"></a>' : ''}
  `
}


renderCourses()
renderCategories()