const bk = 'http://127.0.0.1:8000';

function createElmV2(html) {
  const div = document.createElement('div')
  div.innerHTML = html.trim();

  return div.childNodes[0];
}

// curriculum collapse
function handleCurriculumCollapse() {
  const curriculumContainer = document.querySelector('.block__curriculum')
  const sections = curriculumContainer.querySelector('.block_curriculum_sections')
  const collapseBtn = createElmV2(`
    <button class="block__curriculum__view-all-lectures-btn" type="button">
      <span>Show All Lectures</span>
      <img alt="show all lectures icon" class="block__curriculum__view-all-lectures-btn-icon__svg"
        src="https://fedora.teachablecdn.com/assets/icons/chevron-down-solid-263093b97bd01b06adb0ad6caee9cc0ed3fd93607596fb8dee102ebd20d6d85e.svg">
    </button>
  `)

  const sectionHeight = sections.querySelector('section').clientHeight;

  sections.style.height = `${sectionHeight}px`;
  sections.style.overflow = 'hidden';
  sections.dataset.collapsestatus = 1;

  collapseBtn.addEventListener('click', e => {
    const status = sections.dataset.collapsestatus;
    console.log(status)
    if (status == 1) {
      sections.style.height = 'auto';
      sections.dataset.collapsestatus = 0;
    } else if (status == 0) {
      sections.style.height = `${sectionHeight}px`;
      sections.dataset.collapsestatus = 1;
    }
  })

  curriculumContainer.appendChild(collapseBtn)
}


// instructor
function renderInstructor() {
  // 'course/instructor/',
}





handleCurriculumCollapse()