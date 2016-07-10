$('.UserSearch-search').on('keyup', ({ target }) => {
  if (target.value.length > 2) {
    fetch(`/users/search?q=${target.value}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'get'
    })
    .then(results => results.json())
    .then(users => {
      appendUsersToSearch(users);
    })
    .catch(err => console.error(err));
  } else {
    $('.UserSearch-results').html('');
  }
});

const appendUsersToSearch = users => {
  const ul = document.createElement('ul'), cName = 'UserSearch-search-result list-group-item';

  ul.className = 'list-group';
  const list = $(ul);

  users.forEach(({ name, nameNumber, eligible, spotId, spotOpen }) => {
    const spot = `Spot (${spotId}) ${spotOpen ? 'open' : 'not open'}`;
    const canChallenge = eligible ? 'Can challenge' : 'Can\'t challenge';
    const ineligibleButton = eligible ?
      `<button class="UserSearch-search-result-ineligibleButton ${nameNumber}">Make Ineligible</button>` :
      '';
    const openSpotButton = !spotOpen && parseInt(spotId.substring(1), 10) < 13 ?
      `<button class="UserSearch-search-result-openSpotbutton ${spotId}">Open Spot</button>` :
      '';

    list.append(
      $(`<li class="${cName}">${name} | ${canChallenge} | ${spot} ${ineligibleButton} ${openSpotButton}</li>`)
    );
  });

  $('.UserSearch-results').html(list);

  // Add list button listeners
  $('.UserSearch-search-result-ineligibleButton').click(({ target }) => {
    fetch('/users/makeineligible', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({ nameNumber: target.classList[1] })
    })
    .then(res => res.json())
    .then(() => {
      const buttonParent = $(target.parentElement);

      banner('User is now ineligible for next challenge');
      $(document.getElementsByClassName(target.classList.value)).remove();
      buttonParent.text(buttonParent[0].innerText.replace('Can', 'Can\'t'));
    })
    .catch(() => banner('Sorry! We can\'t fufill that request right now'));
  });

  $('.UserSearch-search-result-openSpotbutton').click(({ target }) => {
    fetch('/spots/open', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({ spotId: target.classList[1] })
    })
    .then(res => res.json())
    .then(() => {
      const buttonParent = $(target.parentElement);

      banner(`Spot ${target.classList[1]} is now open!`);
      $(document.getElementsByClassName(target.classList.value)).remove();
      buttonParent.text(buttonParent[0].innerText.replace('not ', ''));
    })
    .catch(() => banner('Sorry! We can\'t fufill that request right now'));
  });
};

const banner = (message) => {
  $('.bannerMessage').remove();
  $('.navbar').after(`<h3 class="bannerMessage">${message}</h3>`);
};
