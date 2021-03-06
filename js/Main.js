;(function () { // Trick for isolation local variables/functions names from access from outer functions
    window.Utils = {};  // something like global variables
    window.currentAction = "calc";
    //window.varsValue is object for storing globals like  window.varsValue.springEquinox = "2020-03-20 03:50:41.4";
    if (!window.varsValue) window.varsValue = {};

//document.body.style.background = 'green'; // сделать фон красным
//setTimeout(() => document.body.style.background = '', 3000); // вернуть назад    alert (ddGrad);

    let latGrad = document.getElementById("latGrad");
    let latMin = document.getElementById("latMin");
    let latSec = document.getElementById("latSec");
    let lonGrad = document.getElementById("lonGrad");
    let lonMin = document.getElementById("lonMin");
    let lonSec = document.getElementById("lonSec");
    let nDigits = document.getElementById("nDigits");
    let dUTC = document.getElementById("dUTC");
    let dateYear = document.getElementById("dateYear");
    let dateMonth = document.getElementById("dateMonth");
    let dateDay = document.getElementById("dateDay");
    let timeHour = document.getElementById("timeHour");
    let timeMin = document.getElementById("timeMin");
    let timeSec = document.getElementById("timeSec");
    let tempC = document.getElementById("temp");
    let pressP = document.getElementById("press");
    let eyeHeight = document.getElementById("height");
    //Time & Place it was pushed to wwww.solarcalculator.ru
    latGrad.value = "45";
    latMin.value = "00";
    latSec.value = "00";
    lonGrad.value = "39";
    lonMin.value = "00";
    lonSec.value = "00";
    dUTC.value = "3";
    dateYear.value = "2020";
    dateMonth.value = "04";
    dateDay.value = "04";
    timeHour.value = "10";
    timeMin.value = "00";
    timeSec.value = "00";
    getNow();
    tempC.value = "20";
    pressP.value = "756";
    eyeHeight.value = "1.68";          // THIS WILL BE LENGTH OF GNOMON

    let sunHeight = document.getElementById("sunHeight");
    let sunAzimuth = document.getElementById("sunAzimuth");
    let declination = document.getElementById("declination");
    let timeEquation = document.getElementById("timeEquation");
    let rightAscension = document.getElementById("rightAscension");
    let sunRadius = document.getElementById("sunRadius");
    let refraction = document.getElementById("refraction");

    let sunRise = document.getElementById("sunRise");
    let culmTime = document.getElementById("culmTime");
    let culmHeight = document.getElementById("culmHeight");
    let sunSet = document.getElementById("sunSet");
    let dayDuration = document.getElementById("dayDuration");
    let time2SunSet = document.getElementById("time2SunSet");

    let winterSolstice = document.getElementById("winterSolstice");
    let minHeight = document.getElementById("minHeight");
    let springEquinox = document.getElementById("springEquinox");
    let summerSolstice = document.getElementById("summerSolstice");
    let maxHeight = document.getElementById("maxHeight");
    let autumnEquinox = document.getElementById("autumnEquinox");

    let moveH1min = document.getElementById("moveH1min");
    let moveH1hour = document.getElementById("moveH1hour");
    let moveAz1min = document.getElementById("moveAz1min");
    let moveAz1hour = document.getElementById("moveAz1hour");
    let tx = document.getElementById("shadowLabel").textContent;
    document.getElementById("shadowLabel").innerText = tx + (eyeHeight.value).trim() + ':';
    let shadowLength = document.getElementById("shadowLength");
    let nextDaydH = document.getElementById("nextDaydH");
    let nextDaydAz = document.getElementById("nextDaydAz");

    let givHg = document.getElementById("givHg");
    let givHm = document.getElementById("givHm");
    let givHs = document.getElementById("givHs");
    let givAg = document.getElementById("givAg");
    let givAm = document.getElementById("givAm");
    let givAs = document.getElementById("givAs");
    let radioHt = document.getElementById("radio1");
    let radioAz = document.getElementById("radio2");
    let checkPM = document.getElementById("check1");

    let sunSetTime, sunRiseTime, dayDur, Time2Dawn;
    {
        // dateYear.addEventListener('input', function () {
        //     let inp = this;
        //     let EphArr, ExistYear, thisYear = inp.value ;
        //     // if (inp.value > 2120) inp.value = 2120;
        //     // if (inp.value < 2018) inp.value = 2018;
        //     // Refresh globals in window.varsValue according to given year
        //     EphArr = Utils.ReadDataFromResourceString("01", "01",  thisYear, 0, 0, 0);
        //     ExistYear = EphArr[15];
        //     // Desired year replaced by nearest we have ephemeris. &change input value
        //     if ((+thisYear !== +ExistYear)) dateYear.value = ExistYear;
        //     if(window.varsValue.eclipticDeclination )         takeEquinoxSolsticeAE() ;
        //     else                                              calcEquinoxSolstice();
        //
        // });
        // dateMonth.addEventListener('input', function () {
        //     let inp = this;
        //     if (inp.value > 12) inp.value = 12;
        //     if (inp.value < 1) inp.value = 1;
        // });
        // dateDay.addEventListener('input', function () {
        //     let inp = this;
        //     if (inp.value > 31) inp.value = 31;
        //     if (inp.value < 1) inp.value = 1;
        // });

        latGrad.addEventListener('input', function () {
            let inp = this;
            if (inp.value > 90) inp.value = 90;
            if (inp.value < -90) inp.value = -90;
        });
        lonGrad.addEventListener('input', function () {
            let inp = this;
            if (inp.value > 180) inp.value = 180;
            if (inp.value < -180) inp.value = -180;
        });
        nDigits.addEventListener('input', function () {
            let inp = this;
            if (inp.value > 6) inp.value = 6;
            if (inp.value < 0) inp.value = 0;
        });
        eyeHeight.addEventListener('input', function () {
            let inp = this;
            //tx = inp.value;  // Define upper
            document.getElementById("shadowLabel").innerText = tx + (inp.value).trim() + ':';
        });
        givAg.addEventListener('input', function () {
            radioAz.checked = true;
            let inp = this;
            if (inp.value > 360) inp.value = 360;
            if (inp.value < 0) inp.value = 0;
        });
        givAm.addEventListener('input', function () {
            radioAz.checked = true;
            let inp = this;
            if (inp.value > 59) inp.value = 59;
            if (inp.value < 0) inp.value = 0;
        });
        givAs.addEventListener('input', function () {
            radioAz.checked = true;
            let inp = this;
            if (inp.value > 60) inp.value = 60;
            if (inp.value < 0) inp.value = 0;
        });
        givHg.addEventListener('input', function () {
            radioHt.checked = true;
            let inp = this;
            if (inp.value > 90) inp.value = 90;
            if (inp.value < -90) inp.value = -90;
        });
        givHm.addEventListener('input', function () {
            radioHt.checked = true;
            let inp = this;
            if (inp.value > 59) inp.value = 59;
            if (inp.value < 0) inp.value = 0;
        });
        givHs.addEventListener('input', function () {
            radioHt.checked = true;
            let inp = this;
            if (inp.value > 60) inp.value = 60;
            if (inp.value < 0) inp.value = 0;
        });
        timeHour.addEventListener('input', function () {
            timeHour.classList.remove("calcVal");
            timeMin.classList.remove("calcVal");
            timeSec.classList.remove("calcVal");
            window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
            let inp = this;
            if (inp.value > 24) inp.value = 24;
            if (inp.value < 0) inp.value = 0;
        });
        timeMin.addEventListener('input', function () {
            timeHour.classList.remove("calcVal");
            timeMin.classList.remove("calcVal");
            timeSec.classList.remove("calcVal");
            window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
            let inp = this;
            if (inp.value > 59) inp.value = 59;
            if (inp.value < 0) inp.value = 0;
        });
        timeSec.addEventListener('input', function () {
            timeHour.classList.remove("calcVal");
            timeMin.classList.remove("calcVal");
            timeSec.classList.remove("calcVal");
            window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
            let inp = this;
            if (inp.value > 60) inp.value = 60;
            if (inp.value < 0) inp.value = 0;
        });
    }
    let buttonCalculate = document.getElementById("buttonCalc");
    buttonCalculate.addEventListener("click", showResult);
    let x;

    function getLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                getHere(position);
                callback && callback(null);
            });
        } else {
            // x.innerHTML = "Geolocation is not supported by this browser.";
            callback && callback("Geolocation is not supported by this browser");
        }
    }

    function getNow() {
        let x = new Date();
        dateYear.value = x.getFullYear();
        dateMonth.value = x.getMonth() + 1;
        dateDay.value = x.getDate();
        timeHour.value = x.getHours();
        timeMin.value = x.getMinutes();
        timeSec.value = x.getSeconds();
    }

    function getHere(position) {
        let lat = Utils.grad_number2text(position.coords.latitude, undefined, undefined, undefined, true);
        let lon = Utils.grad_number2text(position.coords.longitude, undefined, undefined, undefined, true);
        let dUTCval = Math.floor(position.coords.longitude / 15 + 1);

        latGrad.value = lat[3]+lat[0];  //Add sign before degrees
        latMin.value = lat[1];
        latSec.value = lat[2];
        lonGrad.value = lon[3]+lon[0];
        lonMin.value = lon[1];
        lonSec.value = lon[2];
        dUTC.value = dUTCval;

    }

///////////////////////////////////////////////////   SHOW RESULTS     /////////////////////////////////////////////////
    function showResult() {
        window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
        let g, m, s, B, L, Barr, Larr;
        let utcTime, dUTCval;
        let curTime, sDay, sMonth, sYear, ht, mt, st;
        let EphArr, ExistYear;
        let delimiter1 = document.getElementById("delmGMS");
        let delm = delimiter1.value;
        let delimiter2 = document.getElementById("delmHMS");
        let delm2 = delimiter2.value;
        let digits = Number(nDigits.value);

        // Reformat B Lon in case of wrong user input
        g = latGrad.value;  m = latMin.value;  s = latSec.value;
        B =   Utils.grad_textGMS2number(g, m, s);
        window.varsValue.B = B;
        if (B > 90)  B =  90;
        if (B < -90) B = -90;
        Barr = Utils.grad_number2text(B, digits, undefined, undefined, true);
        latGrad.value = Barr[3]+Barr[0];        latMin.value =  Barr[1];        latSec.value =  Barr[2];
        g = lonGrad.value;            m = lonMin.value;            s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        window.varsValue.L = L;
        if (L > 180)  L =  180;
        if (L < -180) L = -180;
        Larr = Utils.grad_number2text(L, digits, undefined, undefined, true);
        lonGrad.value = Larr[3]+Larr[0];        lonMin.value =  Larr[1];        lonSec.value =  Larr[2];

        ht = timeHour.value;
        mt = timeMin.value;
        st = timeSec.value;
        dUTCval = +dUTC.value;
        curTime = Utils.grad_textGMS2number(ht, mt, st);
        utcTime = curTime - Utils.grad_textGMS2number(dUTCval, "0", "0");

        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;

        // Get ephemeris
        EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value


        calcVelocities();
        calcSunRise();
        takeEquinoxSolsticeAE();

        timeHour.classList.remove("calcVal");
        timeMin.classList.remove("calcVal");
        timeSec.classList.remove("calcVal");
        timeHour.classList.remove("nowVal");
        timeMin.classList.remove("nowVal");
        timeSec.classList.remove("nowVal");
        givHg.classList.remove("invalidVal");
        givHm.classList.remove("invalidVal");
        givHs.classList.remove("invalidVal");
        givAg.classList.remove("invalidVal");
        givAm.classList.remove("invalidVal");
        givAs.classList.remove("invalidVal");

    }

    var delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));

///////////////////////////////////////////////////   SHOW RESULTS TIMER    ////////////////////////////////////////////

    function showResultTimer() {
        window.timerIsOn = true;
        timeHour.classList.add("nowVal");
        timeMin.classList.add("nowVal");
        timeSec.classList.add("nowVal");

        let g, m, s, B, L, D, E, utcTime, Radius, resArr, dUTCval, rAsc, Barr, Larr;
        let sDay, sMonth, sYear;
        let digits = Number(nDigits.value);
        let counter = 0;
        let aDuration = 1000; //timelaps in miliseconds
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        dUTCval = +dUTC.value;
        let EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 12, 39, dUTCval);
        let ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value
        let temp = tempC.value;
        let press = pressP.value;
        let ht, mt, st, Ht0, Az0;
        let options, solar;
        let delimiter1 = document.getElementById("delmGMS");
        let delm = delimiter1.value;
        let delimiter2 = document.getElementById("delmHMS");
        let delm2 = delimiter2.value;

        // Reformat B Lon in case of wrong user input
        g = latGrad.value;  m = latMin.value;  s = latSec.value;
        B =   Utils.grad_textGMS2number(g, m, s);
        window.varsValue.B = B;
        if (B > 90)  B =  90;
        if (B < -90) B = -90;
        Barr = Utils.grad_number2text(B, digits, undefined, undefined, true);
        latGrad.value = Barr[3]+Barr[0];        latMin.value =  Barr[1];        latSec.value =  Barr[2];
        g = lonGrad.value;            m = lonMin.value;            s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        window.varsValue.L = L;
        if (L > 180)  L =  180;
        if (L < -180) L = -180;
        Larr = Utils.grad_number2text(L, digits, undefined, undefined, true);
        lonGrad.value = Larr[3]+Larr[0];        lonMin.value =  Larr[1];        lonSec.value =  Larr[2];

        takeEquinoxSolsticeAE();
        getNow();
        calcSunRise();
        givHg.classList.remove("invalidVal");
        givHm.classList.remove("invalidVal");
        givHs.classList.remove("invalidVal");
        givAg.classList.remove("invalidVal");
        givAm.classList.remove("invalidVal");
        givAs.classList.remove("invalidVal");

        (function delay(duration) {
            if (!window.timerIsOn) return false;

            digits = Number(nDigits.value);

            getNow();
            sDay = dateDay.value;
            sMonth = dateMonth.value;
            sYear = dateYear.value;
            dUTCval = dUTC.value;
            ht = timeHour.value;
            mt = timeMin.value;
            st = timeSec.value;
            utcTime = Utils.grad_textGMS2number(ht, mt, st) - Utils.grad_textGMS2number(dUTCval, 0, 0);
            EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
            D = EphArr[11];
            E = EphArr[12];
            Radius = EphArr[13];
            rAsc = EphArr[10];

            options = {
                Lat: B,
                Lon: L,
                Day: sDay,
                Month: sMonth,
                Year: sYear,
                UTCTime: utcTime,
                dUTC: dUTCval,
                Temp: temp,
                Press: press
            };
            solar = new Solar(options);
            resArr = solar._calculate();
            Ht0 = resArr[1];
            Az0 = resArr[0];

            sunHeight.textContent = Utils.grad_number2text(resArr[1], digits, delm);
            sunAzimuth.textContent = Utils.grad_number2text(resArr[0], digits, delm);
            refraction.textContent = Utils.grad_number2text(resArr[3], digits, delm);
            declination.textContent = Utils.grad_number2text(resArr[9], digits, delm);
            timeEquation.textContent = Utils.grad_number2text(resArr[10], digits, delm2) + " (" +
                Utils.grad_number2text((12 - resArr[10]), digits, delm2) + ")";
            sunRadius.textContent = Utils.grad_number2text(Radius, digits, delm);
            rightAscension.textContent = Utils.grad_number2text(rAsc, digits, delm);

            calcVelocities();
            showDayDuration();

            if (++counter <= 200 && window.timerIsOn) setTimeout(delay, duration, duration);

        })(aDuration)
    }


    function takeEquinoxSolsticeAE() {

        springEquinox.textContent = window.varsValue.springEquinox;
        summerSolstice.textContent = window.varsValue.summerSolstice;
        autumnEquinox.textContent = window.varsValue.autumnEquinox;
        winterSolstice.textContent = window.varsValue.winterSolstice;
        minHeight.textContent = window.varsValue.winterMaxHeight;
        maxHeight.textContent = window.varsValue.summerMaxHeight;

        let g, m, s, Lat, Lon, dUTCval, sDay, sMonth, sYear, sMoment, aMoment, sgn1, sgn2, EfArr, myD1, myD2;
        let ht, mt, st, solar, resArr, s1;
        let delimiter1 = document.getElementById("delmGMS"),  digits = Number(nDigits.value);
        let delm = delimiter1.value;
        let delimiter2 = document.getElementById("delmHMS");
        let delm2 = delimiter2.value;
        let temp = tempC.value, press = pressP.value, eclipticDecl;
        g = latGrad.value;
        m = latMin.value;
        s = latSec.value;
        Lat = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;
        m = lonMin.value;
        s = lonSec.value;
        Lon = Utils.grad_textGMS2number(g, m, s);
        dUTCval = +dUTC.value;
        sYear = dateYear.value;

        //Define summer max height
        aMoment = moment(window.varsValue.summerSolstice , "");
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH');
        mt = moment(aMoment).format('mm');
        st = moment(aMoment).format('ss');
        sMoment = Utils.grad_textGMS2number(ht, mt, st);
        EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, (sMoment - dUTCval), Lon, dUTCval);
        s1 = EfArr[14];            //Time of upper culmination at LocalTime corrected at given Longitude
        params = {
            Lat: Lat,
            Lon: Lon,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: (s1 - dUTCval),
            dUTC: dUTCval,
            Temp: temp,
            Press: press
        };
        solar = new Solar(params);
        resArr = solar._calculate();
        s1= Utils.grad_number2text(resArr[1], digits, delm);
        window.varsValue.summerMaxHeight =s1;

        //Define winter max height
        aMoment = moment(window.varsValue.winterSolstice, "");
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH');
        mt = moment(aMoment).format('mm');
        st = moment(aMoment).format('ss');
        sMoment = Utils.grad_textGMS2number(ht, mt, st);
        EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, (sMoment - dUTCval), Lon, dUTCval);
        s1 = EfArr[14];            //Time of upper culmination at LocalTime corrected at given Longitude
        params = {
            Lat: Lat,
            Lon: Lon,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: (s1 - dUTCval),
            dUTC: dUTCval,
            Temp: temp,
            Press: press
        };
        solar = new Solar(params);
        resArr = solar._calculate();
        s1= Utils.grad_number2text(resArr[1], digits, delm);
        window.varsValue.winterMaxHeight =s1;

        // minHeight.textContent = window.varsValue.winterMaxHeight;
        // maxHeight.textContent = window.varsValue.summerMaxHeight;


    }

    function calcSunRise() {
        let g, m, s, B, L, utcTime, Radius, resArr, dUTCval, s1;
        let sDay, sMonth, sYear;
        let digits = Number(nDigits.value);
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        dUTCval = +dUTC.value;
        let EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 12, 39, dUTCval);
        let ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value
        let temp = tempC.value;
        let press = pressP.value;
        let hEye = eyeHeight.value;
        let ht, mt, st;
        let newUtcTime, mRef, aRef, tempH, options, solar, sunH, MaxSunH, culmT, Dhorizon, Ihorizon, tt;
        // let delimiter1 = document.getElementById("delmGMS");
        // let delm = delimiter1.value;
        let delimiter2 = document.getElementById("delmHMS");
        let delm2 = delimiter2.value;

        g = latGrad.value;
        m = latMin.value;
        s = latSec.value;
        B = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;
        m = lonMin.value;
        s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        ht = timeHour.value;
        mt = timeMin.value;
        st = timeSec.value;
        utcTime = Utils.grad_textGMS2number(ht, mt, st) - Utils.grad_textGMS2number(dUTCval, 0, 0);
        EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        culmT = EphArr[14];      //Time of upper culmination at LocalTime corrected at given Longitude
        Radius = EphArr[13];
        // Define maximum Sun Height  at culmination time
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        newUtcTime = (culmT - dUTCval);
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: newUtcTime,
            dUTC: dUTCval,
            Temp: temp,
            Press: press
        };
        solar = new Solar(options);
        resArr = solar._calculate();
        sunH = resArr[1];                                              //Height at culmination
        MaxSunH = Utils.grad_number2text(sunH, digits);                //Height at culmination str
        culmHeight.textContent = (MaxSunH);
        s1= Utils.grad_number2text((culmT), digits,  delm2);
        culmTime.textContent = s1;
        window.varsValue.dayCulmHeight =MaxSunH;
        window.varsValue.dayCulmHeightNum =sunH;
        window.varsValue.dayCulmTime =s1;

        if (hEye > 0) {
            Dhorizon = 2.0809 * Math.sqrt(hEye) * 1852;         // Range of HORIZON visibility in meters
            tt = hEye / Dhorizon;
            // Inclination of apparent horizon in degrees
            Ihorizon = Math.atan(tt / Math.sqrt(-1.0 * tt * tt + 1.0)) * 180 / Math.PI;
        } else {
            Ihorizon = 0.0;
        }
        //  USE METHOD timeAtSunPositionH() IN class "SOLAR" FOR FINDING TIME AT GIVEN SUN HEIGHT WHILE SUNRISE/SUNSET OF UPPER EDGE OF SUN OCCURS !
        mRef = Utils.getRefractionTP(0.0, Radius, temp, press); //Refraction on horizon with meteoParameters
        aRef = mRef[0];
        tempH = -1 * Radius - aRef - Ihorizon;   // SunCenter below horizon on SunRadius + MeteoRefraction + InclinationOfApparentHorizon
        // SUNRISE TIME
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            dUTC: dUTCval,
            Temp: temp,
            Press: press,
            isAM: true,
            sunHeight: tempH
        };
        solar = new Solar(options);
        resArr = solar._timeAtSunPositionH();
        sunRiseTime = resArr[1];
        let localSunRiseTime = sunRiseTime + dUTCval;
        sunRise.textContent = (Utils.grad_number2text(sunRiseTime + dUTCval, digits,  delm2));
        window.varsValue.sunRiseTime = localSunRiseTime;
        //SUNSET TIME
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            dUTC: dUTCval,
            Temp: temp,
            Press: press,
            isAM: false,
            sunHeight: tempH
        };
        solar = new Solar(options);
        resArr = solar._timeAtSunPositionH();
        sunSetTime = resArr[1];
        let localSunSetTime = sunSetTime + dUTCval;
        sunSet.textContent = (Utils.grad_number2text(sunSetTime + dUTCval, digits,  delm2));
        window.varsValue.sunSetTime = localSunSetTime;

        // DAY DURATION
        dayDur = sunSetTime - sunRiseTime;
        if (dayDur === 0 && sunH > 0) dayDur = 24;    //At Polar Day -:)
        s1 = Utils.grad_number2text(dayDur, digits,  delm2);
        dayDuration.textContent = s1;     // Day duration from Dusk 2 Dawn;
        window.varsValue.dayDuration = s1;
        if (dayDur === 24 || dayDur === 0) Time2Dawn = Utils.grad_number2text(0, digits,  delm2);      //Time2Dawn At Polar Day -:)
        else Time2Dawn = Utils.grad_number2text((sunSetTime - utcTime), digits,  delm2);                       // Time 2 Dawn at common day
        time2SunSet.textContent = (Time2Dawn);
    }

    function showDayDuration() {
        // DAY DURATION
        let dayDur, sunSetTime = window.varsValue.sunSetTime, sunRiseTime = window.varsValue.sunRiseTime;
        let sunH = window.varsValue.dayCulmHeightNum;
        let ht = timeHour.value, mt = timeMin.value, st = timeSec.value;
        let localTime = Utils.grad_textGMS2number(ht, mt, st);
        let digits = Number(nDigits.value);
        let delm2 = document.getElementById("delmHMS").value;
        dayDur =  window.varsValue.dayDuration.substring(0,1); // Extremum may be "24:00:00" or "0:00:00"
        window.varsValue.commonDay = true;
        window.varsValue.polarDay = false;
        window.varsValue.polarDay = false;
        if (+dayDur > 1 && sunH > 1) {         //At Polar Day "24:00:00" -> 2
            window.varsValue.polarDay = true;
            window.varsValue.commonDay = false;

        }
        if (+dayDur < 1 && sunH < 1) {         //At Polar Night "0:00:00" -> 0
            window.varsValue.polarNight = true;
            window.varsValue.commonDay = false;
        }

        if (dayDur === 24 || dayDur === 0) {
            Time2Dawn = Utils.grad_number2text(0, digits, delm2);  //Time2Dawn At Polar Day or Night -:)
        }
        else {
            Time2Dawn = Utils.grad_number2text((sunSetTime - localTime), digits,  delm2); // Time 2 Dawn at common day
        }
        time2SunSet.textContent = (Time2Dawn);
    }

    function calcVelocities() {
        let g, m, s, B, L, resArr, dUTCval;
        let sDay, sMonth, sYear;
        let digits = Number(nDigits.value);
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        dUTCval = +dUTC.value;
        let EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 12, 39, dUTCval);
        let ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value
        let temp, press, hEye;
        let ht, mt, st, newUtcTime, options, solar, sMoment, aMoment, curTime, utcTime;
        let Ht0, Az0, Ht1m, Az1m, Ht1h, Az1h, Ht1d, Az1d, velH1m, velH1h, velA1m, velA1h, shadLen, velHtDay, velAzDay;
        let delimiter1 = document.getElementById("delmGMS");
        let delm = delimiter1.value;
        let delimiter2 = document.getElementById("delmHMS");
        let delm2 = delimiter2.value;

        g = latGrad.value;
        m = latMin.value;
        s = latSec.value;
        B = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;
        m = lonMin.value;
        s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        ht = timeHour.value;
        mt = timeMin.value;
        st = timeSec.value;
        dUTCval = +dUTC.value;
        curTime = Utils.grad_textGMS2number(ht, mt, st);
        utcTime = curTime - Utils.grad_textGMS2number(dUTCval, "0", "0");
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        temp = tempC.value;
        press = pressP.value;
        hEye = eyeHeight.value;

        //Calculate sun position at given moment
        EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: utcTime,
            dUTC: dUTCval,
            Temp: temp,
            Press: press
        };
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht0 = resArr[1];
        Az0 = resArr[0];

        sunHeight.textContent = Utils.grad_number2text(resArr[1], digits, delm);
        sunAzimuth.textContent = Utils.grad_number2text(resArr[0], digits, delm);
        refraction.textContent = Utils.grad_number2text(resArr[3], digits, delm);
        declination.textContent = Utils.grad_number2text(EphArr[11], digits, delm);
        rightAscension.textContent = Utils.grad_number2text(EphArr[10], digits, delm);
        timeEquation.textContent = Utils.grad_number2text(EphArr[12], digits, delm2) + " (" +
            Utils.grad_number2text((12 - EphArr[12]), digits, delm2) + ")";
        sunRadius.textContent = Utils.grad_number2text(EphArr[13], digits, delm);

        //SunPosition one minutes later
        ht = timeHour.value;
        mt = timeMin.value;
        st = timeSec.value;
        sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
        aMoment = moment(sMoment, "").add(1, 'minute');
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH');
        mt = moment(aMoment).format('mm');
        st = moment(aMoment).format('ss');
        newUtcTime = Utils.grad_textGMS2number(ht, mt, st) - dUTCval;
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: newUtcTime,
            dUTC: dUTCval,
            Temp: temp,
            Press: press
        };
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht1m = resArr[1];
        Az1m = resArr[0];
        //SunPosition one hour later
        aMoment = moment(sMoment, "").add(1, 'hour');
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH');
        mt = moment(aMoment).format('mm');
        st = moment(aMoment).format('ss');
        newUtcTime = Utils.grad_textGMS2number(ht, mt, st) - dUTCval;
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: newUtcTime,
            dUTC: dUTCval,
            Temp: temp,
            Press: press
        };
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht1h = resArr[1];
        Az1h = resArr[0];
        //SunPosition one day later
        aMoment = moment(sMoment, "").add(1, 'day');
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH');
        mt = moment(aMoment).format('mm');
        st = moment(aMoment).format('ss');
        newUtcTime = Utils.grad_textGMS2number(ht, mt, st) - dUTCval;
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: newUtcTime,
            dUTC: dUTCval,
            Temp: temp,
            Press: press
        };
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht1d = resArr[1];
        Az1d = resArr[0];
        //Calculate Sun velocities
        velH1m = Utils.grad_number2text(Ht1m - Ht0, digits, delm);
        velH1h = Utils.grad_number2text(Ht1h - Ht0, digits, delm);
        velHtDay = Utils.grad_number2text(Ht1d - Ht0, digits, delm);
        velA1m = Utils.grad_number2text(Az1m - Az0, digits, delm);
        velA1h = Utils.grad_number2text(Az1h - Az0, digits, delm);
        velAzDay = Utils.grad_number2text(Az1d - Az0, digits, delm);
        shadLen = hEye / Math.tan(Utils.toRadians(Ht0));
        if (shadLen > 0) {
            shadowLength.textContent = shadLen.toFixed(digits);
        } else {
            shadowLength.textContent = window.locales['nightLb']
        }
        moveH1min.textContent = velH1m;
        moveH1hour.textContent = velH1h;
        moveAz1min.textContent = velA1m;
        moveAz1hour.textContent = velA1h;
        nextDaydH.textContent = velHtDay;
        nextDaydAz.textContent = velAzDay;
    }

    function calcTimeAtGivenHA() {
        let g, m, s, B, L, resArr, dUTCval, options, solar, givenHt, givenAz, aTime;
        let sDay, sMonth, sYear;
        let digits = Number(nDigits.value);
        let temp, press, isAM = true;
        let delimiter1 = document.getElementById("delmGMS");
        let delm = delimiter1.value;
        let delimiter2 = document.getElementById("delmHMS");
        let delm2 = delimiter2.value;

        window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        dUTCval = +dUTC.value;
        g = latGrad.value;
        m = latMin.value;
        s = latSec.value;
        B = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;
        m = lonMin.value;
        s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        g = givHg.value;
        m = givHm.value;
        s = givHs.value;
        givenHt = Utils.grad_textGMS2number(g, m, s);
        if (givenHt === 0) givenHt = 0.0000001;           //cause +refraction when Ht===0
        g = givAg.value;
        m = givAm.value;
        s = givAs.value;
        givenAz = Utils.grad_textGMS2number(g, m, s);
        temp = tempC.value;
        press = pressP.value;
        if (checkPM.checked) isAM = false;
        if (radioHt.checked) {
            options = {
                Lat: B,
                Lon: L,
                Day: sDay,
                Month: sMonth,
                Year: sYear,
                dUTC: dUTCval,
                Temp: temp,
                Press: press,
                isAM: isAM,
                sunHeight: givenHt
            };
            solar = new Solar(options);
            resArr = solar._timeAtSunPositionH();
            aTime = resArr[1] + dUTCval;        //aTime= Utils.grad_number2text((resArr[1]+dUTCval), digits,  delm2);
            g = Math.floor(aTime);
            m = Math.floor((aTime - g) * 60);
            s = (3600 * (aTime - g - (m / 60))).toFixed(digits);
            timeHour.value = g;
            timeMin.value = m;
            timeSec.value = s;
        }
        if (radioAz.checked) {
            options = {
                Lat: B,
                Lon: L,
                Day: sDay,
                Month: sMonth,
                Year: sYear,
                dUTC: dUTCval,
                Temp: temp,
                Press: press,
                isAM: isAM,
                sunHeight: givenHt,
                sunAzimuth: givenAz
            };
            solar = new Solar(options);
            resArr = solar._timeAtSunPositionA();
            aTime = resArr[1];        //aTime= Utils.grad_number2text((resArr[1]+dUTCval), digits,  delm2);
            g = Math.floor(aTime);
            m = Math.floor((aTime - g) * 60);
            s = (3600 * (aTime - g - (m / 60))).toFixed(digits);
            timeHour.value = g;
            timeMin.value = m;
            timeSec.value = s;

        }
        timeHour.classList.remove("nowVal");
        timeMin.classList.remove("nowVal");
        timeSec.classList.remove("nowVal");
        timeHour.classList.add("calcVal");
        timeMin.classList.add("calcVal");
        timeSec.classList.add("calcVal");


    }

    window.Utils.getLocation = getLocation;
    window.Utils.showResultTimer = showResultTimer;
    window.Utils.showResult = showResult;
    window.Utils.calcTimeAtGivenHA = calcTimeAtGivenHA;
    window.Utils.getHere = getHere;
    window.Utils.takeEquinoxSolsticeAE =  takeEquinoxSolsticeAE;
    window.Utils.calcSunRise = calcSunRise;
    window.Utils.getNow = getNow;
    window.Utils.showDayDuration = showDayDuration;


})();       // close...  Trick for isolation  local variables names from access from other functions
