;(function () { // Trick for isolation local variables/functions names from access from outer functions

    window.Utils = {
        getLocation: getLocation,
        showResultTimer: showResultTimer,
        show_results: show_results,
        getNow: getNow,
        calcTimeAtGivenHA: calcTimeAtGivenHA
    };  // something like global variables


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
    //4Debugging
    latGrad.value="44";latMin.value="06";latSec.value="16";
    lonGrad.value="39";lonMin.value="04";lonSec.value="03"; dUTC.value="3";
    dateYear.value="2020"; dateMonth.value="3"; dateDay.value="07";
    timeHour.value="7";timeMin.value="18"; timeSec.value="00";
    tempC.value="20"; pressP.value="756"; eyeHeight.value="2";

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
    document.getElementById("shadowLabel").innerText = tx + (eyeHeight.value).trim();
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
        if (inp.value > 4) inp.value = 4;
        if (inp.value < 0) inp.value = 0;
    });
    eyeHeight.addEventListener('input', function () {
        let inp = this;
        //tx = inp.value;  // Define upper
        document.getElementById("shadowLabel").innerText = tx + (inp.value).trim();
    });
    givAg.addEventListener('input', function () {
        radioAz.checked = true;
    });
    givAm.addEventListener('input', function () {
        radioAz.checked = true;
    });
    givAs.addEventListener('input', function () {
        radioAz.checked = true;
    });
    givHg.addEventListener('input', function () {
        radioHt.checked = true;
    });
    givHm.addEventListener('input', function () {
        radioHt.checked = true;
    });
    givHs.addEventListener('input', function () {
        radioHt.checked = true;
    });

    let buttonCalculate = document.getElementById("buttonCalc");
    buttonCalculate.addEventListener("click", show_results);
    let x;
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getHere);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    let buttonNow = document.getElementById("buttonNow");
    buttonNow.addEventListener("click", getNow);

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

        latGrad.value = lat[0];
        latMin.value = lat[1];
        latSec.value = lat[2];
        lonGrad.value = lon[0];
        lonMin.value = lon[1];
        lonSec.value = lon[2];
        dUTC.value = dUTCval;
    }
///////////////////////////////////////////////////   SHOW RESULTS     /////////////////////////////////////////////////
    function show_results() {
        window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
        let g, m, s, L;
        let utcTime, dUTCval;
        let curTime, sDay, sMonth, sYear, ht, mt, st;
        let EphArr, ExistYear;

        g = lonGrad.value;        m = lonMin.value;        s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        ht = timeHour.value;       mt = timeMin.value;       st = timeSec.value;
        dUTCval = + dUTC.value;
        curTime = Utils.grad_textGMS2number(ht, mt, st);
        utcTime = curTime - Utils.grad_textGMS2number(dUTCval, "0", "0");

        sDay = dateDay.value;     sMonth = dateMonth.value;   sYear = dateYear.value;

        // Get ephemeris
        EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value

        //let ResArr=Utils.dataDelivery();

        calcVelocities();
        calcSunRise();
        calcEquinoxSolstice();

    }
///////////////////////////////////////////////////   SHOW RESULTS TIMER    ////////////////////////////////////////////

    function showResultTimer() {
        window.timerIsOn = true;
        let g, m, s, B, L, D, E, utcTime, Radius, resArr, dUTCval, rAsc;
        let sDay, sMonth, sYear;
        let digits = Number(nDigits.value);
        let counter = 0;
        let aDuration = 1000; //timelaps in miliseconds
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        dUTCval = +dUTC.value;
        let EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, 12, 39, dUTCval);
        let ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value
        let temp= tempC.value;
        let press= pressP.value;
        let ht, mt, st, Ht0, Az0 ;
        let options, solar ;

        calcEquinoxSolstice();

        (function delay(duration) {
            //let solar, options;
            if (!window.timerIsOn) return false;
            g = latGrad.value;            m = latMin.value;            s = latSec.value;
            B = Utils.grad_textGMS2number(g, m, s);
            g = lonGrad.value;            m = lonMin.value;            s = lonSec.value;
            L = Utils.grad_textGMS2number(g, m, s);
            digits = Number(nDigits.value);

            getNow();
            sDay = dateDay.value; sMonth = dateMonth.value; sYear = dateYear.value; dUTCval = dUTC.value;
            ht = timeHour.value;  mt = timeMin.value;  st = timeSec.value;
            utcTime = Utils.grad_textGMS2number(ht, mt, st) - Utils.grad_textGMS2number(dUTCval, 0, 0);
            EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
            D = EphArr[11];   E = EphArr[12];   Radius = EphArr[13];   rAsc = EphArr[10];

            options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, UTCTime:utcTime, dUTC:dUTCval, Temp:temp, Press:press};
            solar = new Solar(options);
            resArr = solar._calculate();
            Ht0=resArr[1];  Az0=resArr[0];


            sunHeight.textContent =      Utils.grad_number2text(resArr[1], digits);
            sunAzimuth.textContent =     Utils.grad_number2text(resArr[0], digits);
            refraction.textContent =     Utils.grad_number2text(resArr[3], digits);
            declination.textContent =    Utils.grad_number2text(resArr[9], digits);
            timeEquation.textContent =   Utils.grad_number2text(resArr[10], digits, " ", "hms")+" ("+
                Utils.grad_number2text((12-resArr[10]), digits, " ", "hms")+")";
            sunRadius.textContent =      Utils.grad_number2text(Radius, digits);
            rightAscension.textContent = Utils.grad_number2text(rAsc, digits);

            // if (dayDur === 24 || dayDur === 0) Time2Dawn = Utils.grad_number2text(0, digits, "", ":: ");      //Time2Dawn At Polar Day -:)
            // else Time2Dawn= Utils.grad_number2text((sunSetTime - utcTime ), digits, "", ":: ");      // Time 2 Dawn at common day
            // time2SunSet.textContent = (Time2Dawn);

            calcSunRise();
            calcVelocities();

            if (++counter <= 200 && window.timerIsOn) setTimeout(delay, duration, duration);

        })(aDuration)

    }

    function calcEquinoxSolstice() {
        let g, m, s, Lat, Lon, dUTCval, sDay ,sMonth, sYear, sMoment, aMoment, sgn1, sgn2, EfArr, myD1, myD2;
        let time_beg, dTime, time_end, EquDay, EquTime, s1, digits= Number(nDigits.value);
        let nDay, nMonth, nYear, nMoment, solstice, SolDay, SolTime, params, solar, resArr;
        let temp= tempC.value, press= pressP.value;

        g = latGrad.value;        m = latMin.value;        s = latSec.value;
        Lat = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;        m = lonMin.value;        s = lonSec.value;
        Lon = Utils.grad_textGMS2number(g, m, s);
        dUTCval = +dUTC.value;
        sYear = dateYear.value;

        sMoment = sYear+ "-03-19";                           //19 March of given Year
        aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
        sgn1=1; sgn2=1;
        while (sgn1 === sgn2) {
            EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, 0, Lon, dUTCval);
            myD1 = EfArr[11]; sgn1 = Math.sign(myD1);
            EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, 24, Lon, dUTCval);
            myD2 = EfArr[11]; sgn2 = Math.sign(myD2);
            if (sgn1 === sgn2) {                                // Equinox possibly HAPPENS at next day
                aMoment = moment(sMoment, "").add(1,'day');     //Next day
                sMonth = moment(aMoment).format('MM');
                sDay = moment(aMoment).format('DD')            }
        }
        time_beg=0.; dTime=12.;
        while (dTime > 1./3600.){
            time_end= time_beg + dTime;
            EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, time_end, Lon, dUTCval);
            myD2 = EfArr[11];
            if (myD2 < 0){
                time_beg=time_end;
            }
            else{
                dTime=dTime/2;
            }
        }
        EquDay = sYear+"-"+ sMonth+"-"+sDay;
        EquTime = Utils.grad_number2text((time_beg+time_end)/2., digits, "", ":: " );
        s1= EquDay +" "+ EquTime;
        springEquinox.textContent = s1;

        // START FROM 0h 22 SEPTEMBER of given year          AUTUMN EQUINOX
        sMoment = sYear+ "-09-22";                           //22 SEPTEMBER of given Year
        aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
        sgn1=1; sgn2=1;
        while (sgn1 === sgn2) {
            EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, 0, Lon, dUTCval);
            myD1 = EfArr[11]; sgn1 = Math.sign(myD1);
            EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, 24, Lon, dUTCval);
            myD2 = EfArr[11]; sgn2 = Math.sign(myD2);
            if (sgn1 === sgn2) {                                // Equinox possibly HAPPENS at next day
                aMoment = moment(sMoment, "").add(1,'day');     //Next day
                sMonth = moment(aMoment).format('MM');
                sDay = moment(aMoment).format('DD')            }
        }
        time_beg=0.; dTime=12.;
        while (dTime > 1./3600.){
            time_end= time_beg + dTime;
            EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, time_end, Lon, dUTCval);
            myD2 = EfArr[11];
            if (myD2 > 0){
                time_beg=time_end;
            }
            else{
                dTime=dTime/2;
            }
        }
        EquDay = sYear+"-"+ sMonth+"-"+sDay;
        EquTime = Utils.grad_number2text((time_beg+time_end)/2., digits, "", ":: " );
        s1= EquDay +" "+ EquTime;
        autumnEquinox.textContent = s1;

        sMoment = sYear+ "-06-20";                           //20 JUNE of given year
        aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
        nMoment = aMoment.add(1,'day');     //Next day
        nYear = moment(nMoment).format('YYYY'); nMonth = moment(nMoment).format('MM');  nDay = moment(nMoment).format('DD');
        sgn1=1; sgn2=1;
        while (sgn1 === sgn2) {          //compare signs of Declination's Hour change!!!
            EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, 0., Lon, dUTCval);
            myD1 = EfArr[4];
            sgn1 = Math.sign(myD1);
            EfArr = ReadDataFromResourceString(nDay, nMonth, nYear, 0., Lon, dUTCval);
            myD2 = EfArr[4];
            sgn2 = Math.sign(myD2);
            if (sgn1 === sgn2) {                                     // SOLSTICE possibly HAPPENS at next day
                aMoment = nMoment;
                sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
                nMoment = aMoment.add(1,'day');     //Next day
                nYear = moment(nMoment).format('YYYY'); nMonth = moment(nMoment).format('MM');  nDay = moment(nMoment).format('DD');
            }
        }
        EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, 0., Lon, dUTCval);
        myD1 = EfArr[4];
        EfArr = ReadDataFromResourceString(nDay, nMonth, nYear, 0., Lon, dUTCval);
        myD2 = EfArr[4];
        solstice = myD1/(myD1-myD2)*24;    //Time when Declination's Hour change equals 0
        //SummerSolDay = moment(aMoment).format("YYYY-MM-DD");
        SolDay = sYear+"-"+ sMonth+"-"+sDay;
        SolTime = Utils.grad_number2text(solstice, digits, "", ":: " );
        s1= SolDay +" "+ SolTime;
        summerSolstice.textContent = s1;
        //Define max height
        EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, (solstice-dUTCval), Lon, dUTCval);
        s1 = EfArr[14];            //Time of upper culmination at LocalTime corrected at given Longitude
        params ={Lat:Lat, Lon:Lon, Day:sDay, Month:sMonth, Year:sYear, UTCTime:(s1-dUTCval), dUTC:dUTCval, Temp:temp, Press:press};
        solar = new Solar(params);
        resArr = solar._calculate();
        maxHeight.textContent = Utils.grad_number2text(resArr[1], digits);

        // START FROM 0h 21 DECEMBER of given year, and find a moment
        // when Time when Declination's Hour change equals 0                  WINTER SOLSTICE
        sMoment = sYear+ "-12-21";
        aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
        nMoment = aMoment.add(1,'day');     //Next day
        nYear = moment(nMoment).format('YYYY'); nMonth = moment(nMoment).format('MM');  nDay = moment(nMoment).format('DD');

        sgn1=1; sgn2=1;
        while (sgn1 === sgn2) {          //compare signs of Declination's Hour change!!!
            EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, 0., Lon, dUTCval);
            myD1 = EfArr[4];
            sgn1 = Math.sign(myD1);
            EfArr = ReadDataFromResourceString(nDay, nMonth, nYear, 0., Lon, dUTCval);
            myD2 = EfArr[4];
            sgn2 = Math.sign(myD2);
            if (sgn1 === sgn2) {                                     // SOLSTICE possibly HAPPENS at next day
                aMoment = nMoment;
                sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
                nMoment = aMoment.add(1,'day');     //Next day
                nYear = moment(nMoment).format('YYYY'); nMonth = moment(nMoment).format('MM');  nDay = moment(nMoment).format('DD');
            }
        }
        EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, 0., Lon, dUTCval);
        myD1 = EfArr[4];
        EfArr = ReadDataFromResourceString(nDay, nMonth, nYear, 0., Lon, dUTCval);
        myD2 = EfArr[4];
        solstice = myD1/(myD1-myD2)*24;    //Time when Declination's Hour change equals 0
        //WINTER SolDay = moment(aMoment).format("YYYY-MM-DD");
        SolDay = sYear+"-"+ sMonth+"-"+sDay;
        SolTime = Utils.grad_number2text(solstice, digits, "", ":: " );
        s1= SolDay +" "+ SolTime;
        winterSolstice.textContent = s1;
        //Define min height
        EfArr = ReadDataFromResourceString(sDay, sMonth, sYear, (solstice-dUTCval), Lon, dUTCval);
        s1 = EfArr[14];            //Time of upper culmination at LocalTime corrected at given Longitude
        params ={Lat:Lat, Lon:Lon, Day:sDay, Month:sMonth, Year:sYear, UTCTime:(s1-dUTCval), dUTC:dUTCval, Temp:temp, Press:press};
        solar = new Solar(params);
        resArr = solar._calculate();
        minHeight.textContent = Utils.grad_number2text(resArr[1], digits);
    }

    function calcSunRise() {
        let g, m, s, B, L, utcTime, Radius, resArr, dUTCval;
        let sDay, sMonth, sYear;
        let digits = Number(nDigits.value);
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        dUTCval = +dUTC.value;
        let EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, 12, 39, dUTCval);
        let ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value
        let temp= tempC.value;
        let press= pressP.value;
        let hEye= eyeHeight.value;
        let ht, mt, st;
        let newUtcTime, mRef, aRef, tempH, options, solar, sunH, MaxSunH, culmT, Dhorizon, Ihorizon, tt ;

        g = latGrad.value;            m = latMin.value;            s = latSec.value;
        B = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;            m = lonMin.value;            s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        ht = timeHour.value;  mt = timeMin.value;  st = timeSec.value;
        utcTime = Utils.grad_textGMS2number(ht, mt, st) - Utils.grad_textGMS2number(dUTCval, 0, 0);
        EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        culmT = EphArr[14];      //Time of upper culmination at LocalTime corrected at given Longitude
        Radius = EphArr[13];
        // Define maximum Sun Height  at culmination time
        sDay = dateDay.value;     sMonth = dateMonth.value;   sYear = dateYear.value;
        newUtcTime=(culmT - dUTCval);
        options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, UTCTime:newUtcTime, dUTC:dUTCval, Temp:temp, Press:press};
        solar = new Solar(options);
        resArr = solar._calculate();
        sunH=resArr[1];                                              //Height at culmination
        MaxSunH = Utils.grad_number2text(sunH, digits);              //Height at culmination str
        culmHeight.textContent = (MaxSunH);
        culmTime.textContent = Utils.grad_number2text((culmT), digits, "", ":: ");
        if (hEye > 0) {
            Dhorizon = 2.0809*Math.sqrt(hEye)* 1852;         // Range of HORIZON visibility in meters
            tt = hEye/Dhorizon;
            // Inclination of apparent horizon in degrees
            Ihorizon = Math.atan( tt / Math.sqrt ( -1.0 * tt * tt + 1.0) ) * 180 / Math.PI;
        }
        else {Ihorizon=0.0; }
        //  USE METHOD timeAtSunPositionH() IN class "SOLAR" FOR FINDING TIME AT GIVEN SUN HEIGHT WHILE SUNRISE/SUNSET OF UPPER EDGE OF SUN OCCURS !
        mRef = getRefractionTP(0.0, Radius, temp, press); //Refraction on horizon with meteoParameters
        aRef = mRef[0];
        tempH = -1 * Radius - aRef - Ihorizon ;   // SunCenter below horizon on SunRadius + MeteoRefraction + InclinationOfApparentHorizon
        // SUNRISE TIME
        options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, dUTC:dUTCval, Temp:temp, Press:press, isAM: true, sunHeight: tempH};
        solar = new Solar(options);
        resArr = solar._timeAtSunPositionH();
        sunRiseTime= resArr[1];
        sunRise.textContent = (Utils.grad_number2text(sunRiseTime+dUTCval, digits, "", ":: "));
        //SUNSET TIME
        options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, dUTC:dUTCval, Temp:temp, Press:press, isAM: false, sunHeight: tempH};
        solar = new Solar(options);
        resArr = solar._timeAtSunPositionH();
        sunSetTime= resArr[1];
        sunSet.textContent = (Utils.grad_number2text(sunSetTime+dUTCval, digits, "", ":: "));
        // DAY DURATION
        dayDur= sunSetTime - sunRiseTime;
        if (dayDur === 0 && sunH > 0) dayDur=24;    //At Polar Day -:)
        dayDuration.textContent = (Utils.grad_number2text(dayDur, digits, "", ":: "));     // Day duration from Dusk 2 Dawn;
        if (dayDur === 24 || dayDur === 0) Time2Dawn = Utils.grad_number2text(0, digits, "", ":: ");      //Time2Dawn At Polar Day -:)
        else Time2Dawn= Utils.grad_number2text((sunSetTime - utcTime ), digits, "", ":: ");      // Time 2 Dawn at common day
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
        let EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, 12, 39, dUTCval);
        let ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value
        let temp, press, hEye;
        let ht, mt, st, newUtcTime, options, solar, sMoment, aMoment, curTime, utcTime;
        let Ht0, Az0, Ht1m, Az1m, Ht1h, Az1h, Ht1d, Az1d, velH1m, velH1h, velA1m, velA1h, shadLen, velHtDay,velAzDay;

        g = latGrad.value;        m = latMin.value;        s = latSec.value;
        B = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;        m = lonMin.value;        s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        ht = timeHour.value;       mt = timeMin.value;       st = timeSec.value;
        dUTCval = + dUTC.value;
        curTime = Utils.grad_textGMS2number(ht, mt, st);
        utcTime = curTime - Utils.grad_textGMS2number(dUTCval, "0", "0");
        sDay = dateDay.value;     sMonth = dateMonth.value;   sYear = dateYear.value;
        temp= tempC.value;        press= pressP.value;        hEye= eyeHeight.value;

        //Calculate sun position at given moment
        EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, UTCTime:utcTime, dUTC:dUTCval, Temp:temp, Press:press};
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht0=resArr[1];  Az0=resArr[0];

        sunHeight.textContent =      Utils.grad_number2text(resArr[1], digits);
        sunAzimuth.textContent =     Utils.grad_number2text(resArr[0], digits);
        refraction.textContent =     Utils.grad_number2text(resArr[3], digits);
        declination.textContent =    Utils.grad_number2text(EphArr[11], digits);
        rightAscension.textContent = Utils.grad_number2text(EphArr[10], digits);
        timeEquation.textContent =   Utils.grad_number2text(EphArr[12], digits, " ", "hms")+" ("+
            Utils.grad_number2text((12-EphArr[12]), digits, " ", "hms")+")";
        sunRadius.textContent =      Utils.grad_number2text(EphArr[13], digits);

        //SunPosition one minutes later
        ht = timeHour.value;       mt = timeMin.value;       st = timeSec.value;
        sMoment = sYear+"-"+ sMonth+"-"+sDay+" "+ht+":"+mt+":"+st;
        aMoment = moment(sMoment, "").add(1,'minute');
        sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH'); mt = moment(aMoment).format('mm'); st = moment(aMoment).format('ss');
        newUtcTime = Utils.grad_textGMS2number(ht, mt, st) - dUTCval;
        options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, UTCTime:newUtcTime, dUTC:dUTCval, Temp:temp, Press:press};
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht1m=resArr[1];  Az1m=resArr[0];
        //SunPosition one hour later
        aMoment = moment(sMoment, "").add(1,'hour');
        sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH'); mt = moment(aMoment).format('mm'); st = moment(aMoment).format('ss');
        newUtcTime = Utils.grad_textGMS2number(ht, mt, st) - dUTCval;
        options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, UTCTime:newUtcTime, dUTC:dUTCval, Temp:temp, Press:press};
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht1h=resArr[1];  Az1h=resArr[0];
        //SunPosition one day later
        aMoment = moment(sMoment, "").add(1,'day');
        sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH'); mt = moment(aMoment).format('mm'); st = moment(aMoment).format('ss');
        newUtcTime = Utils.grad_textGMS2number(ht, mt, st) - dUTCval;
        options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, UTCTime:newUtcTime, dUTC:dUTCval, Temp:temp, Press:press};
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht1d=resArr[1];  Az1d=resArr[0];
        //Calculate Sun velocities
        velH1m = Utils.grad_number2text(Ht1m-Ht0, digits);  velH1h = Utils.grad_number2text(Ht1h-Ht0, digits);  velHtDay = Utils.grad_number2text(Ht1d-Ht0, digits);
        velA1m = Utils.grad_number2text(Az1m-Az0, digits);  velA1h = Utils.grad_number2text(Az1h-Az0, digits);  velAzDay = Utils.grad_number2text(Az1d-Az0, digits);
        shadLen = hEye/Math.tan(Utils.toRadians(Ht0));
        shadowLength.textContent = shadLen.toFixed(digits);
        moveH1min.textContent = velH1m;
        moveH1hour.textContent = velH1h;
        moveAz1min.textContent = velA1m;
        moveAz1hour.textContent = velA1h;
        nextDaydH.textContent = velHtDay;
        nextDaydAz.textContent = velAzDay;
    }

    function calcTimeAtGivenHA()  {
        let g, m, s, B, L, resArr, dUTCval, options, solar, givenHt, givenAz, aTime;
        let sDay, sMonth, sYear;
        let digits = Number(nDigits.value);
        let temp, press, isAM=true;
        window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        dUTCval = +dUTC.value;
        g = latGrad.value;        m = latMin.value;        s = latSec.value;
        B = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;        m = lonMin.value;        s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        g = givHg.value;        m = givHm.value;        s = givHs.value;
        givenHt = Utils.grad_textGMS2number(g, m, s);
        if (givenHt === 0) givenHt=0.0000001;           //cause +refraction when Ht===0
        g = givAg.value;        m = givAm.value;        s = givAs.value;
        givenAz = Utils.grad_textGMS2number(g, m, s);
        temp= tempC.value;        press= pressP.value;
        if (checkPM.checked) isAM = false;
        if (radioHt.checked)  {
            options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, dUTC:dUTCval, Temp:temp, Press:press, isAM: isAM, sunHeight: givenHt};
            solar = new Solar(options);
            resArr = solar._timeAtSunPositionH();
            aTime= resArr[1]+dUTCval;        //aTime= Utils.grad_number2text((resArr[1]+dUTCval), digits, "", ":: ");
            g = Math.floor(aTime);  m = Math.floor((aTime - g)*60);  s = (3600*(aTime - g - (m/60))).toFixed(digits);
            timeHour.value = g;
            timeMin.value =  m;
            timeSec.value =  s;
        }
        if (radioAz.checked){
            options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, dUTC:dUTCval, Temp:temp, Press:press, isAM: isAM, sunHeight: givenHt, sunAzimuth:givenAz};
            solar = new Solar(options);
            resArr = solar._timeAtSunPositionA();
            aTime= resArr[1];        //aTime= Utils.grad_number2text((resArr[1]+dUTCval), digits, "", ":: ");
            g = Math.floor(aTime);  m = Math.floor((aTime - g)*60);  s = (3600*(aTime - g - (m/60))).toFixed(digits);
            timeHour.value = (g.toString());
            timeMin.value =  (m.toString());
            timeSec.value =  (s.toString());

        }



    }

    function dataDeliveryDay(params) {
        //params = {Day: sDay, Month: sMonth, Year: sYear};
        let sYear =  params.Year;
        let sMonth = params.Month;
        let sDay =   params.Day;
        let g, m, s, B, L, resArr, dUTCval, options, solar;
        let ht, mt, st;
        let utcTime, curTime, i, index, tt;
        let EphArr, ExistYear;
        let resultsHA = new Array(1440); //Array of 1440 pairs of Ht,Az;Every 2 minutes during a day (60min/2)*24h*2pair =1440
        let givenHA =  new Array(2);     //Array of  Ht,Az at given moment
        let aTime =    new Array(1400);  //Array of  Local Time for each pairs of Ht,Az in resultsHA[]
        let results;                                //Array of  3 Arrays for this function Return

        g = latGrad.value;        m = latMin.value;        s = latSec.value;
        B = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;        m = lonMin.value;        s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        ht = timeHour.value;       mt = timeMin.value;       st = timeSec.value;
        dUTCval = +dUTC.value;
        curTime = Utils.grad_textGMS2number(ht, mt, st);
        utcTime = curTime - dUTCval;
        index = Math.floor(utcTime*60);         // index 4 calculation from current UTC
        //console.log("index="+index);

        // Get ephemeris
        EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value
        options = { Lat: B, Lon: L, Day: sDay, Month: sMonth, Year: sYear, UTCTime: utcTime, dUTC: dUTCval, Temp: 0, Press: 0 };
        solar = new Solar(options);
        resArr = solar._calculate();
        givenHA[0] = resArr[1];                //Position at given moment
        givenHA[1] = resArr[0];

        for  (i=0; i < 1439; i=i+2) {
            utcTime = ((index + i)/60 ) % 24;     //UTC time each 2-minutes starts from current time
            //console.log("utcTime="+Utils.grad_number2text(utcTime,0," ","hm"));
            // if Temp&Press == 0 Not implement refraction to Height in class Solar
            options = { Lat: B, Lon: L, Day: sDay, Month: sMonth, Year: sYear, UTCTime: utcTime, dUTC: dUTCval, Temp: 0, Press: 0 };
            solar = new Solar(options);
            resArr = solar._calculate();
            resultsHA[i] = resArr[1];                //Position at each 2 min
            resultsHA[i+1] = resArr[0];
            tt=(utcTime+dUTCval);
            if (tt < 0) tt= tt+24;
            if (tt > 24) tt= tt-24;
            aTime[i/2] = tt;            // Local time of pairs
        }
        //aTime[1440] = sYear+"-"+sMonth+"-"+sDay+" "+ht+":"+mt+":"+st ;            // Pass given Date&Time in last element
        aTime[1440] = moment(sYear+"-"+sMonth+"-"+sDay+" "+ht+":"+mt+":"+st).format('MMMM Do YYYY, HH:mm:ss')+" ,dUTC="+dUTCval;  // Pass given Date&Time in last array element
        results = [resultsHA, givenHA, aTime];
        return results;
    }

    function dataDeliveryYear() {
        let g, m, s, B, L, resArr, dUTCval, options, solar;
        let sDay, sMonth, sYear;
        let utcTime, Az0, Ht0, i ;
        //Array of 365 pairs of Ht,Az; At given local Time every Day in Year; Last 2pairs are: minH,minA,maxH,maxA
        //Array starts from current Date&Time
        let resultsHA = new Array(734);
        let aDate =    new Array( 365);  //Array of  Dates for each pairs of Ht,Az in resultsHA[] starts from current date
        let results;                                //Array of  3 Arrays for this function Return
        let EphArr, ExistYear, aMoment, sMoment, ht, mt, st, minH=-90, maxH=90, minA=0, maxA=360;

        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        ht = timeHour.value;       mt = timeMin.value;       st = timeSec.value;
        dUTCval = +dUTC.value;
        utcTime = +ht+mt/60+st/3600 - dUTCval;
        g = latGrad.value;        m = latMin.value;        s = latSec.value;
        B = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;        m = lonMin.value;        s = lonSec.value;
        L = Utils.grad_textGMS2number(g, m, s);
        //console.log("B="+B+" L="+L);
        // Get ephemeris
        EphArr = ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        ExistYear = EphArr[15];
        if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value

        for  (i=0; i < 729; i=i+2) {
            //SunPosition one day later
            sMoment = sYear+"-"+ sMonth+"-"+sDay+" "+ht+":"+mt+":"+st;
            if (i > 0){aMoment = moment(sMoment, "").add(1,'day');}
            else aMoment = moment(sMoment, "");
            sYear = moment(aMoment).format('YYYY'); sMonth = moment(aMoment).format('MM');  sDay = moment(aMoment).format('DD');
            //options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, UTCTime:utcTime, dUTC:dUTCval, Temp:0, Press:0};
            options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, UTCTime:utcTime, dUTC:dUTCval, Temp:0, Press:0};
            solar = new Solar(options);
            resArr = solar._calculate();
            Ht0 = resArr[5];
            if (i===0) {minH = Ht0; maxH = Ht0;}
            else {
                if (Ht0 < minH) minH= Ht0;
                if (Ht0 > maxH) maxH= Ht0;
            }
            Az0 = resArr[0];
            if (i===0) {minA = Az0; maxA = Az0;}
            else {
                if (Az0 < minA) minA= Az0;
                if (Az0 > maxA) maxA= Az0;
            }

            resultsHA[i] = Ht0;
            resultsHA[i+1] = Az0 ;
            aDate[i/2] =  sMoment; //moment(aMoment).format();
            //console.log(" i="+ i + " aMoment="+ sMoment+" Ht0="+Ht0+" Az0="+Az0);
            //console.log(" i="+ i + " aDateTime="+ aDate[i/2]+" Ht0="+Ht0+" Az0="+Az0);
        }
        resultsHA[730] = minH; resultsHA[731] = minA; resultsHA[732] = maxH; resultsHA[733] = maxA;
        results = [resultsHA, aDate]
        return results;
    }

    window.Utils.dataDeliveryDay = dataDeliveryDay;
    window.Utils.dataDeliveryYear = dataDeliveryYear;

})();       // close...  Trick for isolation  local variables names from access from other functions