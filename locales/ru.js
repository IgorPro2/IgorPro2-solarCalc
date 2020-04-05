;(function () {//function expression (called on initialization)
    if (!window.locales) window.locales = {};
    else return console.error("WINDOW.LOCALES already exists");
    window.locales = {
        zenithLb:        'Зенит',
        nadirLb:         'Надир',
        northLb:         'Север',
        southLb:         'Юг 180°',
        eastLb:          'Восток 90°',
        westLb:          'Запад 270°',
        latLb:           'Широта= ',
        lonLb:           'Долгота= ',
        momentLb:        'Заданный момент= ',
        dayAnimTimeLb:   'Местное время дневного положения= ',
        dayHtLb:         'Высота (день)=',
        dayAzLb:         'Азимут (день)=',
        yearAnimTimeLb:  'Дата годового положения= ',
        yearHtLb:        'Высота (год)= ',
        yearAzLb:        'Азимут (год)= ',

        sunRiseLb:       'Восход= ',
        culmTimeLb:      'Время верхней кульминации= ',
        maxHeightLb:     'Максимальная высота= ',
        sunSetLb:        'Закат= ',
        dayDurationLb:   'Продолжительность дня= ',
        springEquinoxLb: 'Весеннее равноденствие= ',
        summerSolsticeLb:'Летнее солнцесояние= ',
        autumnEquinoxLb: 'Осеннее равноденствие= ',
        winterSolsticeLb:'Зимнее солнцесояние= ',
        summerMaxHLb:    'Максимальная высота летом= ',
        winterMaxHLb:    'Максимальная высота зимой= ',
    }

})();