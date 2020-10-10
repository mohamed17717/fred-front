const bk = 'http://127.0.0.1:8000';



function renderRecentBlogs() {
  const blogsContainer = document.querySelector('.recent-posts');
  const url = `${bk}/blogs/`

  fetch(url)
    .then(res => res.json())
    .then(blogs => {
      blogs.forEach(blog => {
        console.log(blog)
        blogsContainer.innerHTML += `
            <div class="poost">
              <div class="image" style="background-image: url(${blog.thumbnail})"></div>
              <div class="info">
                <div class="name">
                  ${blog.title}
                </div>
                <div class="date">
                  ${blog.date}
                </div>
              </div>
            </div>
        `
      })
    })

}

renderRecentBlogs()