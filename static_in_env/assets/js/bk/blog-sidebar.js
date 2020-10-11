const bk = 'https://thegoodzone.pythonanywhere.com';



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