document.addEventListener('DOMContentLoaded', e => {
  const curriculumTitle = document.querySelector('.block__curriculum__title')
  if (curriculumTitle)
    curriculumTitle.innerHTML = '<strong>Course Curriculum</strong>'

  // pricing 
  const pricing = document.querySelector('div[class*="pricing_v"]')
  pricing.setAttribute('id', 'course-price')
  pricing.querySelectorAll('button').forEach(btn => btn.classList.add('solid'))

  // user enrolled
  const enrolledElm = document.querySelector('[data-enrolled]')
  if(enrolledElm && enrolledElm.dataset.enrolled === "true")
    pricing.remove()
})