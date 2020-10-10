const bk = 'http://127.0.0.1:8000';

function renderLiveEvents() {
  const eventsContainer = document.querySelector('.events');
  const url = `${bk}/live-events/`

  const months = ['january', 'febreuary', 'march', 'april', 'may', 'june', 'july', 'august', 'septemper', 'october', 'november', 'december']
  fetch(url)
    .then(res => res.json())
    .then(events => {
      events.forEach(event => {
        console.log(event)
        date = event.date.split('-')

        eventsContainer.innerHTML += `
            <div class="event">
              <div class="card" style="background-image: url(${event.thumbnail});">
                <div class="date">
                  <div class="d">${date[0]}</div>
                  <div class="m-y">${months[date[1]-1]}, ${date[2]}</div>
                </div>

                <div class="info">
                  <div class="name">
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
              <a href="${event.calendly}" target="_blank" class="outline">Register Now</a>
            </div>
        `
      })
    })

}

renderLiveEvents()