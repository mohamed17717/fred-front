const bk = 'https://thegoodzone.pythonanywhere.com';

function renderLiveEvents() {
  const eventsContainer = document.querySelector('.events');
  const url = `${bk}/live-events/`

  const months = ['january', 'febreuary', 'march', 'april', 'may', 'june', 'july', 'august', 'septemper', 'october', 'november', 'december']
  fetch(url)
    .then(res => res.json())
    .then(events => {
      events.forEach(event => {
        date = event.date.split('-')

        eventsContainer.innerHTML += `
            <div class="event">
              <div class="card" style="background-image: url(${event.thumbnail});">
                <div class="date">
                  <div class="d">${date[0]}</div>
                  ${months[date[1]-1] ? '<div class="m-y">' + months[date[1]-1] + ', ' + date[2] + '</div>' : ''}
                </div>

                <div class="info">
                  <div class="name" style="text-transform: capitalize;">
                    ${event.title}
                  </div>

                  <p>
                    ${event.description}
                  </p>

                  <div class="time">
                    WITH ${event.name} AT ${event.time}
                  </div>
                </div>
              </div>

              <button data-to="${event.calendly}" class="outline">Register Now</button>
            </div>
        `
      })
    })

}

renderLiveEvents()