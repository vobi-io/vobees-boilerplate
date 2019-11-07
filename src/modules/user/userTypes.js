module.exports = (api) => {
  api.createType('AccessToken', {
    accessToken: 'String!'
  })

  api.createEnumType('Locale', {
    en: { value: 'en' },
    ge: { value: 'ge' }
  })
}
