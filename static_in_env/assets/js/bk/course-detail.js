const bk="https://thegoodzone.pythonanywhere.com";function createElmV2(html){const div=document.createElement("div");return div.innerHTML=html.trim(),div.childNodes[0]}function handleCurriculumCollapse(){const curriculumContainer=document.querySelector(".block__curriculum"),sections=curriculumContainer.querySelector(".block_curriculum_sections"),collapseBtn=createElmV2('\n<button class="block__curriculum__view-all-lectures-btn" type="button">\n  <span>Show All Lectures</span>\n  <img alt="show all lectures icon" class="block__curriculum__view-all-lectures-btn-icon__svg"\nsrc="https://fedora.teachablecdn.com/assets/icons/chevron-down-solid-263093b97bd01b06adb0ad6caee9cc0ed3fd93607596fb8dee102ebd20d6d85e.svg">\n</button>\n  ');console.log("sections: ",sections),setTimeout(()=>{let sectionHeight=sections.querySelector("section").clientHeight;sections.style.height=`${sectionHeight}px`,sections.style.overflow="hidden",sections.dataset.collapsestatus=1},2e3),collapseBtn.addEventListener("click",e=>{const status=sections.dataset.collapsestatus;if(1==status)sections.style.height="auto",sections.dataset.collapsestatus=0;else if(0==status){let sectionHeight=sections.querySelector("section").clientHeight;sections.style.height=`${sectionHeight}px`,sections.dataset.collapsestatus=1}}),curriculumContainer.appendChild(collapseBtn)}function getCourseStars(average){const count=5,star1='<div class="icon icon-star-fill"></div>',star0='<div class="icon icon-star-outline"></div>';let stars="";for(let i=0;i<5;i++)stars+=average>.44?star1:star0,average--;return stars}function renderCourseIntroRating(rating){const ratingContainer=document.querySelector("#course-intro .rating");ratingContainer.innerHTML=`\n  <div>${rating.average}</div>\n  <div class="stars">\n${getCourseStars(rating.average)}\n  </div>\n  <div>\n(${rating.total} Ratings)\n  </div>\n  `}function renderCourseFeedbackRatingTotal(rating){const container=document.querySelector("#course-feedback .rating .total");container.innerHTML=`\n  <div class="num">${rating.average}</div>\n  <div class="stars">\n${getCourseStars(rating.average)}\n  </div>\n  <div>\n(${rating.total} Ratings)\n  </div>\n  `}function renderCourseFeedbackRatingProgress(rating){const container=document.querySelector("#course-feedback .rating .detail");container.innerHTML=`\n  <ul>\n<li>\n  <div class="progress">\n<div class="fill" style="width: ${rating.rates_counts[4]/rating.total*100}%;"></div>\n  </div>\n  <div>(5/5) - ${(rating.rates_counts[4]/rating.total*100).toFixed(1)}%</div>\n</li>\n<li>\n  <div class="progress">\n<div class="fill" style="width: ${rating.rates_counts[3]/rating.total*100}%;"></div>\n  </div>\n  <div>(4/5) - ${(rating.rates_counts[3]/rating.total*100).toFixed(1)}%</div>\n</li>\n<li>\n  <div class="progress">\n<div class="fill" style="width: ${rating.rates_counts[2]/rating.total*100}%;"></div>\n  </div>\n  <div>(3/5) - ${(rating.rates_counts[2]/rating.total*100).toFixed(1)}%</div>\n</li>\n<li>\n  <div class="progress">\n<div class="fill" style="width: ${rating.rates_counts[1]/rating.total*100}%;"></div>\n  </div>\n  <div>(2/5) - ${(rating.rates_counts[1]/rating.total*100).toFixed(1)}%</div>\n</li>\n<li>\n  <div class="progress">\n<div class="fill" style="width: ${rating.rates_counts[0]/rating.total*100}%;"></div>\n  </div>\n  <div>(1/5) - ${(rating.rates_counts[0]/rating.total*100).toFixed(1)}%</div>\n</li>\n  </ul>\n  `}function insertReview(review){const reviewsContainer=document.querySelector("#course-feedback .reviews .reviews-box");reviewsContainer.innerHTML+=`\n  <div class="review">\n<div class="author">\n  <div class="avatar" style="background-image: url(${review.pp})"></div>\n \n</div>\n\n<div class="info">\n  <div class="name">${review.name}</div>\n  <div class="meta">\n${review.rating?`<div class="stars">\n${getCourseStars(review.rating.rate)}\n  </div>`:""}\n<div class="date">${review.created||"now"}</div>\n  </div>\n  <div class="opinion">\n${review.content}\n  </div>\n</div>\n  </div>\n`}function renderReviews(reviews){reviews.forEach(review=>{insertReview(review)})}function setStarColor(star,color){star.style.filter=color}function setPrevStarsColor(startStar,color){for(;startStar;)setStarColor(startStar,color),startStar=startStar.previousElementSibling}const postData=async(url,data)=>{const rawResponse=await fetch(url,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(data)});return rawResponse};function renderFeedbackRate(){const user=currentUser.email?currentUser:anonUser;console.log("user: ",user);const courseId=document.querySelector("[data-courseid]").dataset.courseid,userId=user.email||"16",ratingStars=document.querySelectorAll(".rating .rate .stars .icon"),starGreyColor="invert(0%) sepia(38%) saturate(7%) hue-rotate(119deg) brightness(90%) contrast(53%)",starMainColor="invert(45%) sepia(32%) saturate(2410%) hue-rotate(347deg) brightness(99%) contrast(93%)";fetch(`${bk}/rate/${courseId}/${userId}`).then(res=>200===res.status?res.json():null).then(userRate=>{if(userRate){const star=document.querySelector(`#course-feedback .rate .stars .icon:nth-child(${userRate.rate})`);setPrevStarsColor(star,starMainColor)}else ratingStars.forEach(star=>{star.addEventListener("mouseover",e=>setPrevStarsColor(star,starMainColor)),star.addEventListener("mouseout",e=>setPrevStarsColor(star,starGreyColor)),star.addEventListener("click",e=>setCourseRate(e,userId,courseId))})})}function setCourseRate(e,userId,courseId){const ratingStars=document.querySelectorAll(".rating .rate .stars .icon"),starMainColor="invert(45%) sepia(32%) saturate(2410%) hue-rotate(347deg) brightness(99%) contrast(93%)",star=e.target;postData(`${bk}/rate/${courseId}/`,{userId:userId,rate:star.dataset.ratevalue}).then(res=>res.status).then(status=>{200===status&&(setPrevStarsColor(star,starMainColor),ratingStars.forEach(s=>{const new_element=s.cloneNode(!0);s.parentNode.replaceChild(new_element,s)}))})}function notifyText(elm,text,old){const defaultText=old||elm.innerText;elm.innerText=text,elm.disabled=!0,setTimeout(()=>{elm.innerText=defaultText,elm.disabled=!1},2e3)}function setReview(){const user=currentUser.email?currentUser:anonUser;console.log("user: ",user);const courseId=document.querySelector("[data-courseid]").dataset.courseid,userId=user.email||"16",container=document.querySelector("#course-feedback .reviews .write");container.innerHTML=`\n  <div class="author">\n<div class="avatar" style="background-image: url(${user.pp})"></div>\n\n  </div>\n\n  <div class="info">\n<div class="name">${user.name}</div>\n<div>\n  <textarea name="review" id="review" placeholder="Leave a review..."></textarea>\n</div>\n<div class="bottom">\n  <button class="solid">post comment</button>\n</div>\n  </div>\n  `,container.querySelector("button").addEventListener("click",e=>{notifyText(e.target,"loading...");const newComment={userId:userId,rate:e.target.dataset.ratevalue,...user,content:container.querySelector("textarea").value};postData(`${bk}/review/${courseId}/`,newComment).then(res=>res.status).then(status=>{200===status?(notifyText(e.target,"success!","post comment"),container.querySelector("textarea").value="",insertReview(newComment)):notifyText(e.target,"failed!","post comment")})})}function renderInstructor(instructor){const section=document.querySelector("#course-instructor"),container=section.querySelector(".card");instructor||section.remove(),container.innerHTML=`\n  <div class="image" style="background-image: url(${instructor.pp})"></div>\n  <div class="info">\n<h3>\n  ${instructor.name}\n</h3>\n\n<p>\n  ${instructor.description}\n</p>\n<div class="social">\n  ${instructor.instagram&&'<a target="_blank" href="'+instructor.instagram+'" class="icon icon-insta"></a>'||""}\n  ${instructor.facebook&&'<a target="_blank" href="'+instructor.facebook+'" class="icon icon-fb"></a>'||""}\n  ${instructor.twitter&&'<a target="_blank" href="'+instructor.twitter+'" class="icon icon-twt"></a>'||""}\n  ${instructor.site&&'<a target="_blank" href="'+instructor.site+'" class="icon icon-site"></a>'||""}\n</div>\n  </div>\n  `}function getRecommendedCourses(){const courseIdElm=document.querySelector("[data-courseid]");if(!courseIdElm)return;const courseId=courseIdElm.dataset.courseid,section=document.querySelector("#course-suggest-courses"),container=section.querySelector(".courses"),url=`${bk}/random-related-courses/${courseId}/`;fetch(url).then(res=>200===res.status?res.json():[]).then(data=>{data.forEach(course=>{container.innerHTML+=`\n  <div class="item card">\n<div class="thumbnail" style="background-image: url(${course.thumbnail})"></div>\n\n<div class="info">\n  <h3><a href="${course.url}">${course.title}</a></h3>\n\n\n  <div class="rating">\n<div>${course.rating.average}</div>\n<div class="stars">\n  ${getCourseStars(course.rating.average)}\n</div>\n<div>\n  (${course.rating.total} Ratings)\n</div>\n  </div>\n\n  <p>\n${course.description}\n  </p>\n  <div class="footer">\n<div class="author">\n  <div class="avatar" style="background-image: url(${course.author_pp})"></div>\n  <div class="name">${course.author_name}</div>\n</div>\n<div class="price">${course.price}</div>\n  </div>\n</div>\n  </div>\n`}),0===data.length&&section.remove()})}function renderCourseFeedbacks(){const courseId=document.querySelector("[data-courseid]").dataset.courseid,url=`${bk}/course/${courseId}`;console.log(url),fetch(url).then(res=>res.json()).then(data=>{console.log(data),renderCourseIntroRating(data.rating),renderReviews(data.reviews),renderCourseFeedbackRatingTotal(data.rating),renderCourseFeedbackRatingProgress(data.rating),renderInstructor(data.instructor)})}function getCurrentUserData(){const elm=document.querySelector("meta#fedora-data").dataset;let user={};return elm&&(user={img:elm.gravatarUrl,pp:elm.gravatarUrl,email:elm.email,name:elm.name}),user}const anonUser={name:"anonymous",email:"anon@anon.com",pp:"https://iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png"};let currentUser=null;document.addEventListener("DOMContentLoaded",e=>{currentUser=getCurrentUserData(),console.log("currentUser: ",currentUser),handleCurriculumCollapse(),renderCourseFeedbacks(),renderFeedbackRate(),setReview(),getRecommendedCourses()});