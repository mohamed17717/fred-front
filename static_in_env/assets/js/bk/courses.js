const bk="https://thegoodzone.pythonanywhere.com";function renderCategories(){const categoriesContainer=document.querySelector("#courses-intro .tags"),url=`${bk}/categories/`;fetch(url).then(res=>res.json()).then(categories=>{categories.forEach(category=>{categoriesContainer.innerHTML+=`  <a href="?filter=${category.name}&page=1">${category.name}</a>`})})}function getCourseStars(average){const count=5,star1='<div class="icon icon-star-fill"></div>',star0='<div class="icon icon-star-outline"></div>';let stars="";for(let i=0;i<5;i++)stars+=average>.44?star1:star0,average--;return stars}function courseCard(course){return`<div class="item card" data-to="${course.url}">  <div class="thumbnail" style="background-image: url(${course.thumbnail})"></div>  <div class="info"><h3><a href="${course.url}">${course.title}</a></h3>\n<div class="rating">  <div>${course.rating.average}</div>  <div class="stars">${getCourseStars(course.rating.average)}  </div>  <div>(${course.rating.total} Ratings)  </div></div>\n<p>  ${course.description}</p><div class="footer">  <div class="author"><div class="avatar" style="background-image: url(${course.author_pp})"></div><div class="name">${course.author_name}</div>  </div>  <div class="price">${course.price}</div></div>  </div></div>\n  `}function getPath(number){let params=window.location.search;return 0===params.length?`?page=${number}`:(params.includes("page=")?params=params.replace(/page=\d+/,`page=${number}`):params+=`&page=${number}`,params)}function getURL(dPage){const params=new Map(location.search.slice(1).split("&").map(kv=>kv.split("=")));let page=dPage||decodeURI(params.get("page")||1),q=decodeURI(params.get("q")||""),filter=decodeURI(params.get("filter")||""),url,path=`/courses/?page=${page}`;return q?path=`/search/?q=${q}&page=${page}`:filter&&(path=`/filter/${filter}/?page=${page}`),`${bk}`+path}function renderCourses(){const section=document.querySelector("#courses-list"),coursesContainer=section.querySelector(".cards"),url=getURL();console.log(url),fetch(url).then(res=>res.json()).then(courses=>(console.log(courses),courses.data.forEach(course=>{coursesContainer.innerHTML+=courseCard(course)}),0===courses.data.length&&coursesContainer.replaceWith(div({class:"empty-list-msg"},"Theris no courses right now.")),courses)).then(renderPagination)}function paginationLink(number,isActive=!1){return console.log(number),`<li class="${isActive?"active":""}"><a href="${getPath(number)}">${number}</a></li>`}function renderPagination(page){const pagination=document.querySelector("#courses-list .pagination");pagination.innerHTML=`${page.has_prev?'<a href="'+getPath(page.current_page-1)+'" class="btn prev"></a>':""}  <ul>${page.has_prev?paginationLink(page.current_page-1):""}${paginationLink(page.current_page,!0)}${page.has_next?paginationLink(+page.current_page+1):""}${page.total_pages-page.current_page>2?"<li>...</li>"+paginationLink(page.total_pages):""}  </ul>\n${page.has_next?'<a href="'+getPath(+page.current_page+1)+'" class="btn next"></a>':""}\n  `}renderCourses(),renderCategories();