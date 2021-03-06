const bk = 'https://thegoodzone.pythonanywhere.com';

function createElmV2(html) {
  const div = document.createElement('div')
  div.innerHTML = html.trim();

  return div.childNodes[0];
}

// curriculum collapse


// function handleCurriculumCollapse() {
//   const curriculumContainer = document.querySelector('.block__curriculum')
//   let sections = curriculumContainer.querySelector('.block_curriculum_sections')
//   const collapseBtn = createElmV2(`
//     <button class="block__curriculum__view-all-lectures-btn" type="button">
//       <span>Show All Lectures</span>
//       <img alt="show all lectures icon" class="block__curriculum__view-all-lectures-btn-icon__svg"
//         src="https://fedora.teachablecdn.com/assets/icons/chevron-down-solid-263093b97bd01b06adb0ad6caee9cc0ed3fd93607596fb8dee102ebd20d6d85e.svg">
//     </button>
//   `)

//   let collapseOldBtn = document.querySelector('.block__curriculum > button');
//   if (collapseOldBtn)
//     collapseOldBtn.remove()

//   let index = 0
//   sections.querySelectorAll('section').forEach(item => {
//     if (index > 3)
//       item.remove()
//     index++
//   })


//   setTimeout(() => {
//     let sectionHeight = sections.querySelector('section').clientHeight;

//     sections.style.height = `${sectionHeight}px`;
//     sections.style.overflow = 'hidden';
//     sections.dataset.collapsestatus = 1;
//   }, 2000)

//   collapseBtn.addEventListener('click', e => {
//     const status = sections.dataset.collapsestatus;

//     if (status == 1) {
//       sections.style.height = 'auto';
//       sections.dataset.collapsestatus = 0;
//     } else if (status == 0) {
//       let sectionHeight = sections.querySelector('section').clientHeight;

//       sections.style.height = `${sectionHeight}px`;
//       sections.dataset.collapsestatus = 1;
//     }
//   })

//   curriculumContainer.appendChild(collapseBtn)
// }


function handleCurriculumCollapse() {
  let collapseOldBtn = document.querySelector('.block__curriculum > button');
  if (collapseOldBtn)
    collapseOldBtn.remove()

  const titles = document.querySelectorAll('.block__curriculum__section__title')
  titles.forEach(title => {
    title.addEventListener('click', e => {
      const clickedElm = e.target;
      let parentSection = clickedElm;
      while(parentSection.tagName !== 'SECTION'){
        parentSection = parentSection.parentElement
      }

      parentSection.querySelector('ul').classList.toggle('show')
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

function renderCourseIntroRating(rating) {
  const ratingContainer = document.querySelector('#course-intro .rating');

  ratingContainer.innerHTML = `
      <div>${rating.average}</div>
      <div class="stars">
        ${getCourseStars(rating.average)}
      </div>
      <div>
        (${rating.total} Ratings)
      </div>
  `

}

function renderCourseFeedbackRatingTotal(rating) {
  const container = document.querySelector('#course-feedback .rating .total')
  container.innerHTML = `
      <div class="num">${rating.average}</div>
      <div class="stars">
        ${getCourseStars(rating.average)}
      </div>
      <div>
        (${rating.total} Ratings)
      </div>
  `
}

function renderCourseFeedbackRatingProgress(rating) {
  const container = document.querySelector('#course-feedback .rating .detail')
  container.innerHTML = `
      <ul>
        <li>
          <div class="progress">
            <div class="fill" style="width: ${rating.rates_counts[4] / rating.total * 100}%;"></div>
          </div>
          <div>(5/5) - ${(rating.rates_counts[4] / rating.total * 100 || 0).toFixed(1)}%</div>
        </li>
        <li>
          <div class="progress">
            <div class="fill" style="width: ${rating.rates_counts[3] / rating.total * 100}%;"></div>
          </div>
          <div>(4/5) - ${(rating.rates_counts[3] / rating.total * 100 || 0).toFixed(1)}%</div>
        </li>
        <li>
          <div class="progress">
            <div class="fill" style="width: ${rating.rates_counts[2] / rating.total * 100}%;"></div>
          </div>
          <div>(3/5) - ${(rating.rates_counts[2] / rating.total * 100 || 0).toFixed(1)}%</div>
        </li>
        <li>
          <div class="progress">
            <div class="fill" style="width: ${rating.rates_counts[1] / rating.total * 100}%;"></div>
          </div>
          <div>(2/5) - ${(rating.rates_counts[1] / rating.total * 100 || 0).toFixed(1)}%</div>
        </li>
        <li>
          <div class="progress">
            <div class="fill" style="width: ${rating.rates_counts[0] / rating.total * 100}%;"></div>
          </div>
          <div>(1/5) - ${(rating.rates_counts[0] / rating.total * 100 || 0).toFixed(1)}%</div>
        </li>
      </ul>
  `
}

function insertReview(review) {
  const reviewsContainer = document.querySelector('#course-feedback .reviews .reviews-box')
  reviewsContainer.innerHTML += `
  <div class="review">
    <div class="author">
      <div class="avatar" style="background-image: url(${review.pp})"></div>
      <!--
      <div class="bow">instructor</div>
      -->
    </div>

    <div class="info">
      <div class="name">${review.name}</div>
      <div class="meta">
        ${
          review.rating ?

          `<div class="stars">
            ${getCourseStars(review.rating.rate)}
          </div>` : ''
        }
        <div class="date">${review.created || 'now'}</div>
      </div>
      <div class="opinion">
        ${review.content}
      </div>
    </div>
  </div>
`
}


function renderReviews(reviews) {
  reviews.forEach(review => {
    insertReview(review)
  })
}


function setStarColor(star, color) {
  star.style.filter = color;
}

function setPrevStarsColor(startStar, color) {
  while (startStar) {
    setStarColor(startStar, color)
    startStar = startStar.previousElementSibling;
  }
}

const postData = async (url, data) => {
  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return rawResponse;
}


function renderFeedbackRate() {
  if(!isUserEnrolled()){
    const rate = document.querySelector('.rating .rate')
    rate.title = "You must be enrolled in course to rate."
    rate.style.opacity = '.4';
    return
  }

  // const user = {};
  const user = currentUser.email ? currentUser : anonUser;

  const courseId = document.querySelector('[data-courseid]').dataset.courseid;
  const userId = user.email; // user come from header

  // feedback
  const ratingStars = document.querySelectorAll('.rating .rate .stars .icon')
  const starGreyColor = "invert(0%) sepia(38%) saturate(7%) hue-rotate(119deg) brightness(90%) contrast(53%)";
  const starMainColor = "invert(45%) sepia(32%) saturate(2410%) hue-rotate(347deg) brightness(99%) contrast(93%)";

  fetch(`${bk}/rate/${courseId}/${userId}`)
    .then(res => res.status === 200 ? res.json() : null)
    .then(userRate => {
      if (userRate) {
        const star = document.querySelector(`#course-feedback .rate .stars .icon:nth-child(${userRate.rate})`)
        setPrevStarsColor(star, starMainColor)
      } else {
        ratingStars.forEach(star => {
          star.addEventListener('mouseover', e => setPrevStarsColor(star, starMainColor))
          star.addEventListener('mouseout', e => setPrevStarsColor(star, starGreyColor))
          star.addEventListener('click', e => setCourseRate(e, userId, courseId))
        })
      }
    })

}

// rate course
function setCourseRate(e, userId, courseId) {
  const ratingStars = document.querySelectorAll('.rating .rate .stars .icon');
  const starMainColor = "invert(45%) sepia(32%) saturate(2410%) hue-rotate(347deg) brightness(99%) contrast(93%)";
  const star = e.target;

  postData(`${bk}/rate/${courseId}/`, {
      userId,
      'rate': star.dataset.ratevalue
    })
    .then(res => res.status)
    .then(status => {
      if (status === 200) {
        setPrevStarsColor(star, starMainColor)
        ratingStars.forEach(s => {
          const new_element = s.cloneNode(true);
          s.parentNode.replaceChild(new_element, s);
        })
      }
    })

}


function notifyText(elm, text, old) {
  const defaultText = old || elm.innerText;
  elm.innerText = text
  elm.disabled = true;

  setTimeout(() => {
    elm.innerText = defaultText
    elm.disabled = false
  }, 2000)
}

function isUserEnrolled(){
  const elm = document.querySelector('[data-enrolled]')
  return elm.dataset.enrolled.toString() == "true"
}

// reviewcourse
function setReview() {
  if(!isUserEnrolled())
    return 

  const user = currentUser.email ? currentUser : anonUser;
  // const user = currentUser || anonUser;

  const courseId = document.querySelector('[data-courseid]').dataset.courseid;
  const userId = user.email || '16'; // user come from header


  const container = document.querySelector('#course-feedback .reviews .write')
  container.innerHTML = `
      <div class="author">
        <div class="avatar" style="background-image: url(${user.pp})"></div>
      </div>

      <div class="info">
        <div class="name">${user.name}</div>
        <div>
          <textarea name="review" id="review" placeholder="Leave a review..."></textarea>
        </div>
        <div class="bottom">
          <button class="solid">post comment</button>
        </div>
      </div>
  `

  container.querySelector('button').addEventListener('click', e => {
    notifyText(e.target, 'loading...')

    const newComment = {
      userId,
      'rate': e.target.dataset.ratevalue,
      ...user,
      content: container.querySelector('textarea').value
    }

    postData(`${bk}/review/${courseId}/`, newComment)
      .then(res => res.status).then(status => {
        if (status === 200) {
          notifyText(e.target, 'success!', 'post comment')
          container.querySelector('textarea').value = ''
          insertReview(newComment)
        } else {
          notifyText(e.target, 'failed!', 'post comment')
        }
      })
  })
}

// instructor
function renderInstructor(instructor) {
  const section = document.querySelector('#course-instructor');
  const container = section.querySelector('.card');

  if (!instructor)
    section.remove()

  container.innerHTML = `
      <div class="image" style="background-image: url(${instructor.pp})"></div>
      <div class="info">
        <h3>
          ${instructor.name}
        </h3>
        <p>
          ${instructor.description}
        </p>
        <div class="social">
          ${
            instructor.instagram &&
            '<a target="_blank" href="'+ instructor.instagram + '" class="icon icon-insta"></a>' || ''
          }
          ${
            instructor.facebook &&
            '<a target="_blank" href="'+ instructor.facebook + '" class="icon icon-fb"></a>' || ''
          }
          ${
            instructor.twitter &&
            '<a target="_blank" href="'+ instructor.twitter + '" class="icon icon-twt"></a>' || ''
          }
          ${
            instructor.site &&
            '<a target="_blank" href="'+ instructor.site + '" class="icon icon-site"></a>' || ''
          }
        </div>
      </div>
  `
}

// recommended courses
function getRecommendedCourses() {
  const courseIdElm = document.querySelector('[data-courseid]')
  if (!courseIdElm) return;

  const courseId = courseIdElm.dataset.courseid

  const section = document.querySelector('#course-suggest-courses')
  const container = section.querySelector('.courses')

  const url = `${bk}/random-related-courses/${courseId}/`
  fetch(url)
    .then(res => res.status === 200 ? res.json() : [])
    .then(data => {
      data.forEach(course => {
        container.innerHTML += `
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
      })

      if (data.length === 0) {
        section.remove()
      }
    })
}

function getCourseFullDescription() {
  const courseIdElm = document.querySelector('[data-courseid]')
  if (!courseIdElm) return;

  const courseId = courseIdElm.dataset.courseid
  const descriptionElm = document.querySelector('#course-content section p')

  const url = `${bk}/course-description/${courseId}/`
  fetch(url)
    .then(res => res.status === 200 ? res.json() : null)
    .then(data => {
      if (data)
        descriptionElm.innerText = data.full_description
    })
}



function renderCourseFeedbacks() {
  const courseId = document.querySelector('[data-courseid]').dataset.courseid;


  const url = `${bk}/course/${courseId}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      renderCourseIntroRating(data.rating)

      renderReviews(data.reviews)
      renderCourseFeedbackRatingTotal(data.rating)
      renderCourseFeedbackRatingProgress(data.rating)

      renderInstructor(data.instructor)

    })
}


function getCurrentUserData() {
  // const userELm = document.querySelector('header button[onclick="toggleMenu(\'user-menu\')"]')
  const elm = document.querySelector('meta#fedora-data').dataset
  let user = {}
  if (elm) {
    user = {
      img: elm.gravatarUrl,
      pp: elm.gravatarUrl,
      email: elm.email,
      name: elm.name
    }
  }

  return user
}

const anonUser = {
  name: 'anonymous',
  email: 'anon@anon.com',
  pp: 'https://iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png'
};
let currentUser = null;

document.addEventListener('DOMContentLoaded', e => {
  currentUser = getCurrentUserData()

  handleCurriculumCollapse()
  renderCourseFeedbacks()
  renderFeedbackRate()
  setReview()
  getRecommendedCourses()

  getCourseFullDescription()
})