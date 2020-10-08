// extract data
document.querySelectorAll('.read-more').forEach(elm => elm.remove())

const posts = document.querySelectorAll('.blog-container .post');
posts.forEach(post => {
  let postData = {
    title: post.querySelector('h1').innerText,
    author_name: post.querySelector('.post-byline .post-author-name').innerText,
    author_pp: post.querySelector('.post-byline img').src,
    date: post.querySelector('.post-byline .post-date').innerText,
    description: post.querySelector('.post-content').innerText,
    url: post.querySelector('h1 a').href,
  }

  const styledPost = 
    div({class: 'card'},
      div({class: 'info'}, 
        div({class: 'title'}, postData.title),
        p({class: 'overview'}, postData.description),
        div({class: 'author'}, 
          div({class: 'profile-pic author2'}),
          div({class: 'name'}, postData.author_name),
        ),

        div({class: 'bottom'}, 
          button({class: 'outline light'}, 'read more'),
          div({class: 'date'}, postData.date)
        )
      )
    )
  
  post.replaceWith(styledPost);
});

const sidebar = document.querySelector('.sidebar-block')
sidebar.replaceWith(
  aside({id: 'blog-sidebar'},
    div({class: 'search-widget'},
      div({class: 'search-box'},
        input({type:"text" ,name:"q" ,id:"search" ,placeholder:"Search..." }),
        button(i({class: 'icon icon-search'}))
      )
    ),
    div({class: 'recent-posts'},
      div({class: 'title'}, 'recent posts'),
      div({class: 'poost'}, 
        div({class: 'image image1'}),
        div({class: 'info'}, 
          div({class: 'name'}, 'Lorem ipsum dolor sit.'),
          div({class: 'date'}, 'April, 01 2020')
        )
      )
    ),
  )
)