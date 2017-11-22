Template.footer.helpers({
  languageSwitchers: function() {
    const supportedLanguages = TAPi18n.getLanguages();
    const currentLanguageCode = TAPi18n.getLanguage();
    return Object.keys(supportedLanguages).map(function(languageCode){ return {
      name: supportedLanguages[languageCode].name,
      attributes: {
        'data-lang':'',
        'data-lang-code': languageCode,
        'data-lang-name': supportedLanguages[languageCode].name,
        'class': (languageCode === currentLanguageCode ? 'selected_language' : '')
      }};
    });
  }
});

Template.footer.events({
  "click [data-lang]": function(event, template){
    event.preventDefault();
    const languageCode = event.target.dataset.langCode
    const languageName = event.target.dataset.langName

    TAPi18n.setLanguage(languageCode)
    .done(() => {
      Bert.alert(TAPi18n.__("alert_language_change", `${languageName} (${languageCode})`), 'success', 'growl-top-right' );
    })
    .fail((error) => {
      Bert.alert(TAPi18n.__("alert_language_change_fail", `${languageName} (${languageCode})`), 'danger', 'growl-top-right' );
      console.log(error);
    })
    .always(() => {
      localStorage.setItem('languageCode', TAPi18n.getLanguage());
    })
  }
});
