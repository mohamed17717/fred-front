document.addEventListener('DOMContentLoaded', e => {
  const curriculumTitle = document.querySelector('.block__curriculum__title')
  if (curriculumTitle)
    curriculumTitle.innerHTML = '<strong>Course Curriculum</strong>'

  // feedback
  const ratingStars = document.querySelectorAll('.rating .rate .stars .icon')
  const starGreyColor = "invert(0%) sepia(38%) saturate(7%) hue-rotate(119deg) brightness(90%) contrast(53%)";
  const starMainColor = "invert(45%) sepia(32%) saturate(2410%) hue-rotate(347deg) brightness(99%) contrast(93%)";

  function setStarColor(star, color) {
    star.style.filter = color;
  }

  function setPrevStarsColor(startStar, color) {
    while (startStar) {
      setStarColor(startStar, color)
      startStar = startStar.previousElementSibling;
    }
  }

  ratingStars.forEach(star => {
    star.addEventListener('mouseover', e => setPrevStarsColor(star, starMainColor))
    star.addEventListener('mouseout', e => setPrevStarsColor(star, starGreyColor))
  })

  // pricing 
  const pricing = document.querySelector('div[class*="pricing_v"]')
  pricing.setAttribute('id', 'course-price')
  pricing.querySelectorAll('button').forEach(btn => btn.classList.add('solid'))
})