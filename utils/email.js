/* eslint-disable new-cap, no-sync */
const fs = require('fs');
const Handlebars = require('handlebars');
const moment = require('moment');
const path = require('path');
const sendGrid = require('sendgrid');

const helper = sendGrid.mail;
const sg = sendGrid.SendGrid(process.env.SENDGRID_API_KEY);
const fromMail = new helper.Email('osumbit@gmail.com');

const sendChallengeList = (recipients, fileData) => {
  const request = sg.emptyRequest();

  request.body = {
    attachments: [
      {
        content: fileData,
        content_id: 'ii_139db99fdb5c3704',
        disposition: 'inline',
        filename: `challenge-list-${moment().format('YYYY-MM-DD')}.csv`,
        type: 'csv'
      }
    ],
    content: [
      {
        type: 'text/html',
        value: '<html><p>Here is the Challenge List This Week!</p></html>'
      }
    ],
    from: {
      email: 'osumbit@gmail.com',
      name: 'Challenge App'
    },
    mail_settings: {
      footer: {
        enable: true,
        html: '<p>Sincerely, The Challenge App Team</p>'
      },
      subject: 'Challenge List'
    },
    personalizations: [
      {
        to: recipients,
        subject: 'Challenge List'
      }
    ],
    subject: 'Challenge List'
  };

  request.method = 'POST';
  request.path = '/v3/mail/send';

  return new Promise(resolve => {
    sg.API(request, resolve);
  });
};

const sendChallengeSuccessEmail = (options) => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    const { email, spotId, performanceName } = options;
    const to = new helper.Email(email);
    const subject = `Challenges for ${performanceName}`;
    const source = fs.readFileSync(path.resolve(__dirname, '../views/emails/challenge-signup-confirmation.handlebars'), 'utf8');
    const template = Handlebars.compile(source);

    const content = new helper.Content('text/html', template({ performanceName, spotId }));
    const requestBody = new helper.Mail(fromMail, subject, to, content).toJSON();

    const request = sg.emptyRequest();

    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requestBody;
    return new Promise((resolve) => {
      sg.API(request, resolve);
    });
  }
  return new Promise((resolve) => resolve());
};

const sendErrorEmail = (errMessage) => {
  const to = new helper.Email('atareshawty@gmail.com');
  const subject = 'Error From Challenge App';
  const content = new helper.Content('text/plain', `${errMessage}`);
  const requestBody = new helper.Mail(fromMail, subject, to, content).toJSON();

  const request = sg.emptyRequest();

  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;
  sg.API(request, (response) => {
    console.log('ERROR_EMAIL:', response);
  });
};

module.exports = {
  sendChallengeList,
  sendChallengeSuccessEmail,
  sendErrorEmail
};
