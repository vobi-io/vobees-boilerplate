const sgMail = require('@sendgrid/mail')
const config = require('app/config')
sgMail.setApiKey(config.sendGrid.apiKey)

const mailUtil = require('./mailUtils')

const sendPlain = async ({
  to,
  from = 'no-reply@invoicewave.com',
  subject = 'New email from Invoice Wave',
  text
}) => {
  try {
    const result = await sgMail.send({ to, from, subject, text })
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Send email based on passed data
 * @param {String} templateName -> Template name from utils/template excluding .mjml
 * @param {Object} templateData -> Dynamic data to be passed in template
 * @param {String} from -> Email sender
 * @param {String} to @required -> Email receiver
 * @param {String} subject -> Email subject
 * @returns undefined
 */
const send = async ({
  templateName = 'empty',
  templateData = {},
  to,
  from = 'no-reply@invoicewave.com',
  subject = 'New email from Invoice Wave'
}) => {
  try {
    const html = await mailUtil.readAndRenderTemplate(templateName, templateData)
    return sgMail.send({ to, from, subject, html })
  } catch (e) {
    return Promise.reject(e)
  }
}

const sendInvitedEmail = async user => {
  try {
    const html = await mailUtil.readAndRenderTemplate('Booked',
      Object.assign({}, user, { messageType: 'invitationCreate' }))
    sgMail
      .send({
        to: user.email,
        from: 'no-reply@invoicewave.com',
        subject: 'New Invitation Received',
        html
      })
  } catch (e) {
    return Promise.reject(e)
  }
}

module.exports = {
  sendPlain,
  send,
  sendInvitedEmail
}
