;(function () {
    if (window.location.search.match(new RegExp('forceLocale\=true'))) return false;
    let locales = [
        'en',
        'ru',
        'es',
        'de'
    ];
    let lang = navigator.language;
    let match = false;
    for (let i = 0; i < locales.length; i++) {
        let loc = locales[i];
        if (lang.match(new RegExp(loc))) {
            match = loc;
            break;
        }
    }
    let localeToSet = match ? match : locales[0];
    if (localeToSet === window.currentLocale) return false;
    window.location.replace('index_' + localeToSet + '.html');
})();


