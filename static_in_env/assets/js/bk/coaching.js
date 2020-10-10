const bk = 'http://127.0.0.1:8000';



function renderCoaches() {
  const coachesContainer = document.querySelector('#coaching-coaches');
  const url = `${bk}/coaches/`

  console.log('get coaches')

  fetch(url)
    .then(res => res.json())
    .then(coaches => {
      coaches.forEach(coach => {
        console.log(coach)
        coachesContainer.innerHTML += `
            <div>
              <div class="card">
                <div class="image" style="background-image: url(${coach.pp})"></div>
                <div class="info">
                  <h3>
                    ${coach.name}
                  </h3>
                  <!-- <div class="job-title">Co-Founder & CTO</div> -->
                  <p>
                    ${coach.description}
                  </p>
                  <div class="social">
                    ${
                      coach.instagram &&
                      '<a target="_blank" href="'+ coach.instagram + '" class="icon icon-insta"></a>' || ''
                    }
                    ${
                      coach.facebook &&
                      '<a target="_blank" href="'+ coach.facebook + '" class="icon icon-fb"></a>' || ''
                    }
                    ${
                      coach.twitter &&
                      '<a target="_blank" href="'+ coach.twitter + '" class="icon icon-twt"></a>' || ''
                    }
                    ${
                      coach.site &&
                      '<a target="_blank" href="'+ coach.site + '" class="icon icon-site"></a>' || ''
                    }
                  </div>
                </div>
              </div>

              <div>
                <a href="${coach.calendly}" class="outline" target="_blank">coaching with ${coach.name}</a>
              </div>
            </div>
        `
      })
    })

}

renderCoaches()