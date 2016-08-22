const banner = require('../utils/banner');

const closeButtonClass = '.IndividualManage-button-close';
const mainClass = '.IndividualManage';
const openButtonClass = '.IndividualManage-button-open';
const openSpotReasonClass = '.IndividualManage-reason';
const performanceInfoClass = '.IndividualManage-performanceInfo';
const spotOptionClasses = ['IndividualManage-failed', 'IndividualManage-other', 'IndividualManage-volunteer'];

$(openButtonClass).on('click', () => {
  const apiUrl = '/users/manage';
  const performanceId = getPerformanceId();
  const [nameNumber, spotId] = getNameNumberSpotId();

  let reason, voluntary = false;

  for (const option of spotOptionClasses) {
    if (document.getElementsByClassName(option)[0].checked) {

      /* eslint-disable indent */
      switch (option) {
        case 'IndividualManage-failed':
          reason = 'Failed Music Check';
          break;
        case 'IndividualManage-other':
          reason = $(openSpotReasonClass).val();
          break;
        default:
          reason = 'Voluntarily Opened Spot';
          voluntary = true;
          break;
      }
      break;
    }
  }

  fetch(apiUrl, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify({
      nameNumber,
      performanceId,
      reason,
      spotId,
      voluntary
    })
  })
  .then((response) => {
    if (response.status > 300) {
      throw new Error('Whoops');
    }
    window.location.reload(false);
  })
  .catch(() => {
    banner('We\'re sorry! There was a problem with your request. We\'re working to resolve the issue');
  });
});

$(closeButtonClass).on('click', () => {
  const apiUrl = '/users/manage/close';
  const performanceId = getPerformanceId();
  const [nameNumber, spotId] = getNameNumberSpotId();

  fetch(apiUrl, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify({
      nameNumber,
      performanceId,
      spotId
    })
  })
  .then((response) => {
    if (response.status > 300) {
      throw new Error('Whoops');
    }
    window.location.reload(false);
  })
  .catch(() => {
    banner('We\'re sorry! There was a problem with your request. We\'re working to resolve the issue');
  });
});

const getNameNumberSpotId = () => $(mainClass).attr('class').split(' ').slice(1);
const getPerformanceId = () => parseInt($(performanceInfoClass)[0].className.split(' ')[1], 10);
