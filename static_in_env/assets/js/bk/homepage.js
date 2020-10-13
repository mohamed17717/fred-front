const bk="https://thegoodzone.pythonanywhere.com";function getCourseStars(n){let e="";for(let i=0;i<5;i++)e+=n>.44?'<div class="icon icon-star-fill"></div>':'<div class="icon icon-star-outline"></div>',n--;return e}function renderMostSellCourses(){const n=document.querySelector("#courses"),e=n.querySelector("ul");fetch(`${bk}/courses/most-sell/`).then(n=>n.json()).then(i=>{i.forEach(n=>{console.log(n),e.innerHTML+=`\n<li class="item">\n  <div class="thumbnail" style="background-image: url(${n.thumbnail})"></div>\n  <div class="info">\n<h3><a href="${n.url}">${n.title}</a></h3>\n\n<div class="rating">\n  <div>${n.rating.average}</div>\n  <div class="stars">\n${getCourseStars(n.rating.average)}\n  </div>\n  <div>\n(${n.rating.total} Ratings)\n  </div>\n</div>\n\n<p>\n  ${n.description}\n</p>\n<div class="footer">\n  <div class="author">\n<div class="avatar" style="background-image: url(${n.author_pp})"></div>\n<div class="name">${n.author_name}</div>\n  </div>\n  <div class="price">${n.price}</div>\n</div>\n  </div>\n</li>\n`}),0===i.length&&n.remove()})}function blogHomebageResponsive(){const n=document.querySelector("#blog");n&&(window.innerWidth<1080?n.querySelector(".item:first-child").classList.remove("cover"):n.querySelector(".item:first-child").classList.add("cover"))}function renderBlogs(){const n=document.querySelector("#blog"),e=n.querySelector("ul");fetch(`${bk}/blogs/`).then(n=>n.json()).then(i=>{i.slice(0,5).forEach(n=>{console.log(n),e.innerHTML+=`\n<li class="item">\n  <div class="thumbnail" style="background-image: url(${n.thumbnail})"></div>\n  <div class="info">\n<h3>${n.title}</h3>\n<p>\n  ${n.description}\n</p>\n<div class="footer">\n  <div class="author">\n<div class="avatar" style="background-image: url(${n.author_pp})"></div>\n<div class="name">${n.author_name}</div>\n  </div>\n  <div class="date">${n.date}</div>\n</div>\n  </div>\n</li>\n`}),0===i.length&&n.remove()}).then(()=>{blogHomebageResponsive()})}renderMostSellCourses(),renderBlogs();