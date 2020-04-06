;(function () {
    window.localeStorage = {};
    // return false;
    //     // if (window.location.search.match(new RegExp('forceLocale\=true'))) return false;
    //     // let locales = [
    //     //     'en',
    //     //     'ru',
    //     //     'es',
    //     //     'de'
    //     // ];
    //     // let lang = navigator.language;
    //     // let match = false;
    //     // for (let i = 0; i < locales.length; i++) {
    //     //     let loc = locales[i];
    //     //     if (lang.match(new RegExp(loc))) {
    //     //         match = loc;
    //     //         break;
    //     //     }
    //     // }
    //     // let localeToSet = match ? match : locales[0];
    //     // if (localeToSet === window.currentLocale) return false;
    //     // window.location.replace('index_' + localeToSet + '.html');
    window.setLocale = function (locale) {
        if (!locale) {//on page loaded we need to ask browser what locale is preferable
            let locales = [//current available locales
                'en',
                'ru',
                // 'es',
                // 'de'
            ];
            let lang = navigator.language;//language preferred by browser
            let match = false;
            for (let i = 0; i < locales.length; i++) {
                let loc = locales[i];
                if (lang.match(new RegExp(loc))) {
                    match = loc;
                    break;
                }
            }
            locale = match ? match : locales[0];
        }
        if (locale === window.currentLocale) return false;
        if (!window.localeStorage[locale]){
            getLocaleFromServer(locale, function (localeObject) {
                window.localeStorage[locale] = localeObject;
                window.locales = localeObject;
                window.translateVariables(document);
                window.currentLocale = locale;
            });
        } else {
            window.locales = window.localeStorage[locale];
            window.translateVariables(document);
            window.currentLocale = locale;
        }


        function getLocaleFromServer(locale, callback) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'locales/' + locale + '.json', true);
            xhr.send();
            xhr.onload = function () {
                if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
                    console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
                    callback && callback(false);
                } else { // если всё прошло гладко, выводим результат
                    console.log(`Готово, получили ${xhr.response.length} байт`); // response -- это ответ сервера
                    let locale;
                    try {
                        locale = JSON.parse(xhr.response);
                    } catch (e) {
                        callback && callback(false);
                    }
                    callback && callback(locale);
                }
            };
            xhr.onerror = function () {
                console.log("Запрос не удался");
                callback && callback(false);
            };
        }
    }
})();


