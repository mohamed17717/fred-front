document.addEventListener('scroll', e => {
  const header = document.querySelector('header')

  if (this.scrollY === 0)
    header.classList.remove('scroll')
  else
    header.classList.add('scroll')
})

document.addEventListener('DOMContentLoaded', e => {
  const homepageBlog = document.querySelector('#blog');
  if (homepageBlog) {
    if (window.innerWidth < 1080)
      homepageBlog.querySelector('.item:first-child').classList.remove('cover');
    else
      homepageBlog.querySelector('.item:first-child').classList.add('cover');
  }

  const header = document.querySelector('header');
  if (window.innerHeight < 510) {
    header.style.position = 'absolute'

    const boxes = header.querySelectorAll('[id^="box"]');
    boxes.forEach(box => box.style.position = 'absolute');
  }


  const dropdownBtns = document.querySelectorAll('[data-box]');
  dropdownBtns.forEach(btn => {
    btn.onclick = (e) => {
      const boxId = btn.dataset.box;

      document.querySelectorAll('.show-sub').forEach(elm => elm.classList.remove('show-sub'))
      document.querySelectorAll('.show').forEach(elm => {
        if (`#${elm.getAttribute('id')}` !== boxId)
          elm.classList.remove('show');
      })


      const box = document.querySelector(boxId);
      box.classList.toggle('show')
    }
  })

  const dropdownSubBtns = document.querySelectorAll('[data-subbox]');
  dropdownSubBtns.forEach(btn => {
    btn.onclick = (e) => {
      const box = document.querySelector(btn.dataset.subbox);
      box.classList.toggle('show-sub')
    }
  })

  const menuBtn = document.querySelector('#nav-mob-sub-menu');
  if (menuBtn)
    menuBtn.addEventListener('click', e => e.stopPropagation());


  const backgrounds = document.querySelectorAll('[data-bgimgurl]');
  backgrounds.forEach(elm => elm.style.backgroundImage = `url(${elm.dataset.bgimgurl})`)
})