
function dataDeliveryDay(params) {
    //params = {Day: sDay, Month: sMonth, Year: sYear};
    let sYear = params.Year;
    let sMonth = params.Month;
    let sDay = params.Day;
    let g, m, s, B, L, resArr, dUTCval, options, solar;
    let ht, mt, st;
    let utcTime, curTime, i, index, tt, minH, maxH, minA, maxA, Ht0, Az0, Az1, southCulm = false;
    let EphArr, ExistYear;
    let resultsHA = new Array(1440);  //Array of 1440 pairs of Ht,Az;Every 2 minutes during a day (60min/2)*24h*2pair =1440
    let givenHA = new Array(2);       //Array of  Ht,Az at given moment
    let aTime = new Array(1400);      //Array of  Local Time for each pairs of Ht,Az in resultsHA[]
    let minMax = new Array(4);        //Array of  HtMin, HtMax, AzMin, AzMax which are minimals and maximals at this day
    let results;                                 //Array of  4 Arrays for this function Return

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
    utcTime = curTime - dUTCval;
    index = Math.floor(utcTime * 60);         // index 4 calculation from current UTC
    //console.log("index="+index);

    // Get ephemeris
    EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
    ExistYear = EphArr[15];
    if ((+sYear !== +ExistYear)) dateYear.value = ExistYear;   // Desired year replaced by nearest we have ephemeris. &change input value
    options = {
        Lat: B,
        Lon: L,
        Day: sDay,
        Month: sMonth,
        Year: sYear,
        UTCTime: utcTime,
        dUTC: dUTCval,
        Temp: 0,
        Press: 0
    };
    solar = new Solar(options);
    resArr = solar._calculate();
    givenHA[0] = resArr[1];                //Position at given moment
    givenHA[1] = resArr[0];
    minH = resArr[1];
    maxH = resArr[1];
    minA = resArr[0];
    maxA = resArr[0];
    //Az1 =  resArr[0];
    let culmTime = EphArr[14];              //Time of upper culmination at LocalTime corrected at given Longitude
    options = {
        Lat: B,
        Lon: L,
        Day: sDay,
        Month: sMonth,
        Year: sYear,
        UTCTime: (culmTime - dUTCval),
        dUTC: dUTCval,
        Temp: 0,
        Press: 0
    };
    solar = new Solar(options);
    resArr = solar._calculate();
    let culmAz = resArr[0];
    //console.log('culmTime=',culmTime, 'culmAz=',culmAz);
    if (Math.abs(180 - culmAz) < 1) {
        southCulm = true;
    }
    if (!southCulm && minA > 180) {
        minA = minA - 360;
    }   //Distance from NORTH 2 Azimuth

    for (i = 0; i < 1439; i = i + 2) {
        utcTime = ((index + i) / 60) % 24;     //UTC time each 2-minutes starts from current time
        //console.log("utcTime="+Utils.grad_number2text(utcTime,0," ","hm"));
        // if Temp&Press == 0 Not implement refraction to Height in class Solar
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: utcTime,
            dUTC: dUTCval,
            Temp: 0,
            Press: 0
        };
        solar = new Solar(options);
        resArr = solar._calculate();
        resultsHA[i] = resArr[1];                //Position at each 2 min
        resultsHA[i + 1] = resArr[0];
        tt = (utcTime + dUTCval);
        if (tt < 0) tt = tt + 24;
        if (tt > 24) tt = tt - 24;
        aTime[i / 2] = tt;                         // Local time of pairs
        Ht0 = resArr[5];
        if (Ht0 < minH) minH = Ht0;               // found Min Max
        if (Ht0 > maxH) maxH = Ht0;
        Az0 = resArr[0];
        // if ( (Az1 < 180 && Az0 > 180)  && Math.abs(Az1-Az0) < 330 ) {southCulm = true;}
        // Az1 = Az0;
        if (!southCulm && Az0 > 180) {
            Az0 = Az0 - 360;
        }   //Distance from NORTH 2 Azimuth
        if (Az0 < minA) minA = Az0;
        if (Az0 > maxA) maxA = Az0;
        //console.log(Az0)
    }
    // Pass given Date&Time in last array element
    aTime[1440] = moment(sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st).format('MMMM Do YYYY, HH:mm:ss') + " ,dUTC=" + dUTCval;
    if (!southCulm) {
        minA = minA + 360;
    }  //Reverse Distance from NORTH 2 real Azimuth
    minMax[0] = minH;
    minMax[1] = maxH;
    minMax[2] = minA;
    minMax[3] = maxA;
    minMax[4] = southCulm;
    results = [resultsHA, givenHA, aTime, minMax];
    return results;
}

function dataDeliveryDay2AoA() {
    let latGrad = document.getElementById("latGrad");
    let latMin = document.getElementById("latMin");
    let latSec = document.getElementById("latSec");
    let lonGrad = document.getElementById("lonGrad");
    let lonMin = document.getElementById("lonMin");
    let lonSec = document.getElementById("lonSec");
    let dUTC = document.getElementById("dUTC");
    let nDigits = document.getElementById("nDigits");
    let delim2 = document.getElementById("delmHMS");
    let delim1 = document.getElementById("delmGMS");
    let tempC = document.getElementById("temp");
    let pressP = document.getElementById("press");
    let dateYear = document.getElementById("dateYear");
    let dateMonth = document.getElementById("dateMonth");
    let dateDay = document.getElementById("dateDay");
    let sYear = dateYear.value;
    let sMonth = dateMonth.value;
    let sDay = dateDay.value;
    let delm2=delim2.value;
    let delm1=delim1.value;
    let nDig = 1*nDigits.value;
    let temp = tempC.value, press = pressP.value;
    let g, m, s, B, L, resArr, dUTCval, options, solar;
    let localTime, utcTime,  i;
    let aDay = sYear + "-" + sMonth + "-" + sDay+ " ";


    g = latGrad.value;
    m = latMin.value;
    s = latSec.value;
    B = Utils.grad_textGMS2number(g, m, s);
    g = lonGrad.value;
    m = lonMin.value;
    s = lonSec.value;
    L = Utils.grad_textGMS2number(g, m, s);
    dUTCval = +dUTC.value;

    let rowArray, EphArr, D, E, R;
    let tableAoA = new Array(720);

    //Header
    rowArray = new Array(8);
    rowArray[0] = window.locales["local"] + window.locales["dateLb"] + window.locales["timeLb"] ;
    rowArray[1] = window.locales["htRadioLb"];
    rowArray[2] = window.locales["azRadioLb"];
    rowArray[3] = window.locales["refractionLb"];
    rowArray[4] = window.locales["declinationLb"];
    rowArray[5] = window.locales["equationLb"];
    rowArray[6] = window.locales["hourAngle"];
    rowArray[7] = window.locales["radiusLb"];

    tableAoA[0] = rowArray;

    utcTime = -2/60;
    for (i = 1; i < 721; i++) {
        utcTime = (utcTime + 2/60);     //UTC time each 2-minutes starts from 0 UTC
        localTime = (utcTime + dUTCval)%24;
        // Get ephemeris
        EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        D = EphArr[11];
        E = EphArr[12];
        R = EphArr[13];
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
        rowArray = new Array(8);
        rowArray[0] = aDay + Utils.grad_number2text( localTime, nDig, delm2);   //Local Date & Time
        rowArray[1] = Utils.grad_number2text(resArr[1], nDig, delm1, " ");  // Height of  sun's center corrected for refraction
        rowArray[2] = Utils.grad_number2text(resArr[0], nDig, delm1, " ");  // Sun Azimuth from North counted clockwise
        rowArray[3] = Utils.grad_number2text(resArr[3], nDig, delm1, " ");  // Refraction corrected for meteoParameters
        rowArray[4] = Utils.grad_number2text(D, nDig, delm1, " ");          //Apparent declination
        rowArray[5] = Utils.grad_number2text(E, nDig, delm2, " ");          //Equation of time
        rowArray[6] = Utils.grad_number2text(resArr[2], nDig, delm1, " ");  // Hour Angle of Sun
        rowArray[7] = Utils.grad_number2text(R, nDig, delm1, " ");          //Apparent radius
        tableAoA[i] = rowArray;

    }
    return tableAoA;
}

function dataDeliveryYear(params) {
    let sYear = params.Year;
    let sMonth = params.Month;
    let sDay = params.Day;
    let ht = params.aHour;
    let mt = params.aMinute;
    let st = params.aSecond;
    let dUTCval = params.dUTC;
    dUTCval = +dUTC.value;    //Must take it from user input!! not from parameters. Because valuse need recalculation.
    let curYear = sYear;
    let g, m, s, B, L, resArr, options, solar;
    let utcTime, Az0, Ht0, i;
    //Array of 365 pairs of Ht,Az; At given local Time every Day in Year; Last 2pairs are: minH,minA,maxH,maxA
    //Array starts from current Date&Time     TODO     WHEN LEAP YEAR HAPPENS WE MISS ONE DAY :-(
    let resultsHA = new Array(734);
    let aDate = new Array(365);  //Array of  Dates for each pairs of Ht,Az in resultsHA[] starts from current date
    let results;                                //Array of  3 Arrays for this function Return
    let EphArr, ExistYear, aMoment, sMoment;

    utcTime = +ht + mt / 60 + st / 3600 - dUTCval;
    g = latGrad.value;
    m = latMin.value;
    s = latSec.value;
    B = Utils.grad_textGMS2number(g, m, s);
    g = lonGrad.value;
    m = lonMin.value;
    s = lonSec.value;
    L = Utils.grad_textGMS2number(g, m, s);
    //console.log("B="+B+" L="+L);
    // Get ephemeris
    EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
    ExistYear = EphArr[15];
    if ((+sYear !== +ExistYear)) {
        dateYear.value = ExistYear;
        sYear = ExistYear
    }  // Desired year replaced by nearest we have ephemeris. &change input value
    moment.locale('ru');
    for (i = 0; i < 731; i = i + 2) {
        //SunPosition one day later
        sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
        if (i > 0) {
            aMoment = moment(sMoment, "").add(1, 'day')
        } else {
            aMoment = moment(sMoment, "")
        }
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        if (+sYear !== +curYear) {
            sYear = curYear      //Not to Jump to Next year and Return to CURRENT year.
        }
        options = {
            Lat: B,
            Lon: L,
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            UTCTime: utcTime,
            dUTC: dUTCval,
            Temp: 0,
            Press: 0
        };
        solar = new Solar(options);
        resArr = solar._calculate();
        Ht0 = resArr[5];
        if (i === 0) {
            minH = Ht0;
            maxH = Ht0;
        } else {
            if (Ht0 < minH) minH = Ht0;
            if (Ht0 > maxH) maxH = Ht0;
        }
        Az0 = resArr[0];
        if (i === 0) {
            minA = Az0;
            maxA = Az0;
        } else {
            if (Az0 < minA) minA = Az0;
            if (Az0 > maxA) maxA = Az0;
        }

        resultsHA[i] = Ht0;
        resultsHA[i + 1] = Az0;
        sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;       // TO FORMAT aMoment
        aDate[i / 2] = moment(sMoment).format('lll'); //sMoment;           // moment(sMoment).format(LLL);
        //console.log(" i="+ i + " aDateTime="+ aDate[i/2]+" Ht0="+Ht0+" Az0="+Az0);
    }
    resultsHA[730] = minH;
    resultsHA[731] = minA;
    resultsHA[732] = maxH;
    resultsHA[733] = maxA;
    results = [resultsHA, aDate];
    return results;
}

function dataDeliveryYear2AoA() {
    let latGrad = document.getElementById("latGrad");
    let latMin = document.getElementById("latMin");
    let latSec = document.getElementById("latSec");
    let lonGrad = document.getElementById("lonGrad");
    let lonMin = document.getElementById("lonMin");
    let lonSec = document.getElementById("lonSec");
    let timeHour = document.getElementById("timeHour");
    let timeMin = document.getElementById("timeMin");
    let timeSec = document.getElementById("timeSec");
    let dUTC = document.getElementById("dUTC");
    let nDigits = document.getElementById("nDigits");
    let delim2 = document.getElementById("delmHMS");
    let delim1 = document.getElementById("delmGMS");
    let tempC = document.getElementById("temp");
    let pressP = document.getElementById("press");

    let dateYear = document.getElementById("dateYear");
    let dateMonth = document.getElementById("dateMonth");
    let dateDay = document.getElementById("dateDay");
    let sYear = dateYear.value;
    let sMonth = dateMonth.value;
    let sDay = dateDay.value;
    let delm2=delim2.value;
    let delm1=delim1.value;
    let nDig = 1*nDigits.value;
    let temp = tempC.value, press = pressP.value;

    let g, m, s, B, L, resArr, dUTCval, options, solar, D, E, R;
    let ht, mt, st;
    let localTime, utcTime,  i;
    let sMoment, aMoment;

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
    sMoment = sYear + "-" + "01" + "-" + "01" + " " + ht + ":" + mt + ":" + st;         //start from 01
    let numDays = moment(sMoment ).isLeapYear() ? 366: 365;
    aMoment = moment(sMoment, "");                              //for nice formatting of tables 1-st string
    sYear = moment(aMoment).format('YYYY');
    sMonth = moment(aMoment).format('MM');
    sDay = moment(aMoment).format('DD');
    sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
    let rowArray, EphArr ;
    let tableAoA = new Array(numDays);
    let aDate = new Array(numDays);
    localTime = +ht + mt/60 + st/3600;
    utcTime = localTime - dUTCval;

    //Header
    rowArray = new Array(8);
    rowArray[0] = window.locales["local"] + window.locales["dateLb"] + window.locales["timeLb"] ;
    rowArray[1] = window.locales["htRadioLb"];
    rowArray[2] = window.locales["azRadioLb"];
    rowArray[3] = window.locales["refractionLb"];
    rowArray[4] = window.locales["declinationLb"];
    rowArray[5] = window.locales["equationLb"];
    rowArray[6] = window.locales["hourAngle"];
    rowArray[7] = window.locales["radiusLb"];
    tableAoA[0] = rowArray;

    for (i = 1; i < numDays+1; i++) {
        //aDate[i] = moment(sMoment).format('lll');           // moment(sMoment).format(LLL);
        //console.log(" i="+ i + " aDate="+ aDate[i]);
        // Get ephemeris
        EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        D = EphArr[11];
        E = EphArr[12];
        R = EphArr[13];
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
        rowArray = new Array(8);
        rowArray[0] = sMoment;                                                  //Local Date & Time
        rowArray[1] = Utils.grad_number2text(resArr[1], nDig, delm1, " ");  // Height of  sun's center corrected for refraction
        rowArray[2] = Utils.grad_number2text(resArr[0], nDig, delm1, " ");  // Sun Azimuth from North counted clockwise
        rowArray[3] = Utils.grad_number2text(resArr[3], nDig, delm1, " ");  // Refraction corrected for meteoParameters
        rowArray[4] = Utils.grad_number2text(D, nDig, delm1, " ");          //Apparent declination
        rowArray[5] = Utils.grad_number2text(E, nDig, delm2, " ");          //Equation of time
        rowArray[6] = Utils.grad_number2text(resArr[2], nDig, delm1, " ");  // Hour Angle of Sun
        rowArray[7] = Utils.grad_number2text(R, nDig, delm1, " ");          //Apparent radius
        tableAoA[i] = rowArray;

        // one day later
        aMoment = moment(sMoment, "").add(1, 'day');
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        // if (+sYear !== +curYear) {
        //     sYear = curYear      //Not to Jump to Next year and Return to CURRENT year.
        // }
        sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;

    }
    return tableAoA;
}

function sunDials2AoA(){
//Calculate coordinates of shadow's end drops by vertical Gnomon  on horizontal Cadran.
// Gnomon height = User eye height.  Calculation units are units of Gnomon's height.
// Calculations do for each day of given year for the moment of beginning of each hour, from 6:00 to 19:00 hours.
// Results are: Analemmas for each hour from [startH] = 7 hours to [stopH] =17;  at Cadran.
// Then calculates coordinates of shadow's end for each 1-st day of each month of given year,
// each [mStep] minutes of each calculating hours from [startH]  to [stopH].
// Results are:  Hour's lines for 1-st day of each month.
// Pass calculation in csv table.
// Draw results on graphic's page.
    let latGrad = document.getElementById("latGrad");
    let latMin = document.getElementById("latMin");
    let latSec = document.getElementById("latSec");
    let lonGrad = document.getElementById("lonGrad");
    let lonMin = document.getElementById("lonMin");
    let lonSec = document.getElementById("lonSec");
    let dUTC = document.getElementById("dUTC");
    let nDigits = document.getElementById("nDigits");
    let delim2 = document.getElementById("delmHMS");
    let delim1 = document.getElementById("delmGMS");
    let tempC = document.getElementById("temp");
    let pressP = document.getElementById("press");
    let dateYear = document.getElementById("dateYear");
    let dateMonth = document.getElementById("dateMonth");
    let dateDay = document.getElementById("dateDay");
    let eyeHeight = document.getElementById("height");
    eyeHeight = eyeHeight.value;
    let sYear = dateYear.value;
    let curYear = sYear;
    let sMonth = dateMonth.value;
    let sDay = dateDay.value;
    let delm2=delim2.value;
    let delm1=delim1.value;
    let nDig = 1*nDigits.value;
    let temp = tempC.value, press = pressP.value;
    let g, m, s, B, L, resArr, dUTCval, options, solar;
    let localTime, utcTime,  i;
    let aDay = sYear + "-" + sMonth + "-" + sDay+ " ";
    let sMoment, aMoment;
    let startH = 0, stopH =23;
    let hh=startH, mm=0, ss=0;
    let ht = hh.toString(), mt= mm.toString(), st= ss.toString(), x, y, z, x2, y2, z2, tt, l, upperEdge, refU, resRef;

    sMoment = sYear + "-" + "01" + "-" + "01" + " " + ht + ":" + mt + ":" + st;         //start from 01 Jan [startH]
    //sMoment = sYear + "-" + "03" + "-" + "03" + " " + ht + ":" + mt + ":" + st;         //start from 01 Jan [startH]
    aMoment = moment(sMoment, "");              // trick for nice formatting to tables 1-st string
    sYear = moment(aMoment).format('YYYY');
    sMonth = moment(aMoment).format('MM');
    sDay = moment(aMoment).format('DD');
    ht = moment(aMoment).format('HH');
    mt = moment(aMoment).format('mm');
    st = moment(aMoment).format('ss');
    hh = +ht;
    mm = +mt;
    ss = +st;
    sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;


    g = latGrad.value;
    m = latMin.value;
    s = latSec.value;
    B = Utils.grad_textGMS2number(g, m, s);
    g = lonGrad.value;
    m = lonMin.value;
    s = lonSec.value;
    L = Utils.grad_textGMS2number(g, m, s);
    dUTCval = +dUTC.value;

    let rowArray, EphArr, D, E, sunHt, sunAz, sunRd;
    /////////////////////// PARAMETERS FOR SUN DIAL TABLES //////////////////////////////////////////////////////////
    let minSunHeight = 5;                           // Minimal height of sun above horizon in degrees for calculation
    //let gnomonLen    = 7;                         // length of Gnomon in some units
    let gnomonLen    = +eyeHeight;                   // length of Gnomon in some units
    let maxShadow    = 7 * gnomonLen;               // Maximal length of Gnomon's shadow in "Gnomon's" units
    let numDays = moment(sMoment ).isLeapYear() ? 366: 365;
    let mStep = 6;                                  // Each [mStep] MINUTES of each calculating hours
    let arrLen1 = numDays*(stopH-startH + 1);       //Analemmas array
    let arrLen2 = 12*(stopH-startH)*60/mStep + 12;  //Hour's lines array
    /////////////////////// PARAMETERS FOR SUN DIAL TABLES //////////////////////////////////////////////////////////

    let AoA1stdays = new Array(arrLen1 + 1);  // +1 for Headers
    //Header
    rowArray = new Array(10);
    rowArray[0] = window.locales["dateLb"];
    rowArray[1] = window.locales["local"]  +" "+ window.locales["timeLb"] ;
    rowArray[2] = window.locales["declinationLb"];
    rowArray[3] = window.locales["equationLb"];
    rowArray[4] = window.locales["htRadioLb"];
    rowArray[5] = window.locales["azRadioLb"];
    rowArray[6] = "x";
    rowArray[7] = "y";
    rowArray[8] = "l";
    rowArray[9] = "Month";

    AoA1stdays[0] = rowArray;

    // Calculations do for each day of given year for the moment of beginning of each hour, from 6:00 to 19:00 hours.
    hh = startH;
    localTime = hh+ mm/60+ ss/3600;
    utcTime = (localTime - dUTCval);
    aDay = sYear + "-" + sMonth + "-" + sDay;

    for (i = 1; i < arrLen1+1; i++) {
        // Get ephemeris
        EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        D = EphArr[11];
        E = EphArr[12];
        sunRd = EphArr[13];
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
        sunHt = resArr[5];  // Uncorrected height of  sun's center
        sunAz = resArr[0];
        upperEdge = sunHt + sunRd;
        resRef = Utils.getRefractionTP(upperEdge , sunRd , +temp, +press);
        refU = resRef[0];
        upperEdge = upperEdge + refU;
        sunHt = resArr[1];  // Height of  sun's center corrected for refraction

        rowArray = new Array(9);
        rowArray[0] = aDay ;                                                    //Date
        rowArray[1] = Utils.grad_number2text( localTime, nDig, ":: ");    //LocalTime. delm =":: " for split(":") later
        rowArray[2] = Utils.grad_number2text(D, nDig, delm1, " ");          //Apparent declination
        rowArray[3] = Utils.grad_number2text(E, nDig, delm2, " ");          //Equation of time
        rowArray[4] = Utils.grad_number2text(sunHt, nDig, delm1, " ");  // Height of  sun's center corrected for refraction
        rowArray[5] = Utils.grad_number2text(sunAz, nDig, delm1, " ");  // Sun Azimuth from North counted clockwise

        if (sunHt >= minSunHeight ){
            let shadArr = new Array(3);
            // Calculate orthogonal 3d coordinates of sun, assume that sun is on sphere with radius of 100 gnomons
            // Assume that Sun'd latitude is Height of Suns UPPER EDGE
            // Assume that Sun'd longitude is (360-SunAzimuth) count it counterclockwise from NORTH AXIS
            shadArr = Sphere2Decart(gnomonLen*10000, upperEdge, (360-sunAz));

            if (shadArr[2] >= 0) {
                //Пересечение прямой и плоскости  "Ефимов Н.В. Курс Аналитической геометрии" стр.221,223
                //координаты пересечения прямой проходящей через точки (0,0,Lgnm)(x2,y2,z2) и плоскости z=0
                // каноническое ур-е такой прямой: x-x1   y-y1   z-z1
                //                                 ---- = ---- = ----  полагаем = t    тогда x=x2*t; y = y2*t; z=z2*t-Lgnm*t-Lgnm=0;
                //                                 x2-x1  y2-y1  z2-z1
                //отсюда t= -Lgnm/(z2-Lgnm)
                x2 = shadArr[0];
                y2 = shadArr[1];
                z2 = shadArr[2];
                tt = -1 * gnomonLen / (z2 - gnomonLen);
                z = 0;
                y = x2 * tt;                     // y = x
                x = -1 * (y2 * tt);              // x = -y     Rotate North UP
                l = Math.sqrt(x * x + y * y); //shadow length
            }
            else { x=y=l=0;}
        }
        else  { x=y=l=0;}
        if (l < maxShadow) {
            rowArray[6] = x;
            rowArray[7] = y;
            rowArray[8] = l;
        }
        else {
            rowArray[6] = 0;
            rowArray[7] = 0;
            rowArray[8] = 0;
        }
        rowArray[9] = +sMonth;   //month number

        AoA1stdays[i] = rowArray;

        aMoment = moment(sMoment, "").add(1, 'day');

        sYear =   moment(aMoment).format('YYYY');
        sMonth =  moment(aMoment).format('MM');
        sDay =    moment(aMoment).format('DD');
        ht =      moment(aMoment).format('HH');
        mt =      moment(aMoment).format('mm');
        st =      moment(aMoment).format('ss');
        sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
        aDay = sYear + "-" + sMonth + "-" + sDay;

        if (sYear !== curYear){  //after 31-dec jump to next year
            hh = hh + 1;
            sMoment = curYear + "-" + "01" + "-" + "01" + " " + ht + ":" + mt + ":" + st;         //start from 01 Jan
            aMoment = moment(sMoment, "");
            sYear =   moment(aMoment).format('YYYY');
            sMonth =  moment(aMoment).format('MM');
            sDay =    moment(aMoment).format('DD');
            ht =      moment(aMoment).format('HH');
            mt =      moment(aMoment).format('mm');
            st =      moment(aMoment).format('ss');
            sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
            aDay = sYear + "-" + sMonth + "-" + sDay;
            localTime = hh+ mm/60+ ss/3600;
            utcTime = (localTime - dUTCval);
            if (hh > stopH){ break }
        }
    }

    // Calculate coordinates of shadow's end for each 1-st day of each month of given year,
    // each [mStep]  minutes of each calculating hours from .
    hh=startH; mm = 0; ss = 0;
    ht = hh.toString();
    localTime = hh+ mm/60+ ss/3600;
    utcTime = (localTime - dUTCval);
    sMoment = curYear + "-" + "01" + "-" + "01" + " " + ht + ":" + mt + ":" + st;         //start from 01 Jan [startH]
    aMoment = moment(sMoment, "");              // nice formatting
    sYear = moment(aMoment).format('YYYY');
    sMonth = moment(aMoment).format('MM');
    sDay = moment(aMoment).format('DD');
    ht = moment(aMoment).format('HH');
    mt = moment(aMoment).format('mm');
    st = moment(aMoment).format('ss');
    sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
    aDay = sYear + "-" + sMonth + "-" + sDay;

    let AoAHlines = new Array(arrLen2 + 1);  // +1 for Headers
    //Header
    rowArray = new Array(10);
    rowArray[0] = window.locales["dateLb"];
    rowArray[1] = window.locales["local"]  +" "+ window.locales["timeLb"] ;
    rowArray[2] = window.locales["declinationLb"];
    rowArray[3] = window.locales["equationLb"];
    rowArray[4] = window.locales["htRadioLb"];
    rowArray[5] = window.locales["azRadioLb"];
    rowArray[6] = "x";
    rowArray[7] = "y";
    rowArray[8] = "l";
    rowArray[9] = "Month";
    AoAHlines[0] = rowArray;

    for (i = 1; i < arrLen2+1; i++) {
        // Get ephemeris
        EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, utcTime, L, dUTCval);
        D = EphArr[11];
        E = EphArr[12];
        sunRd = EphArr[13];
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
        sunHt = resArr[5];  // Uncorrected height of  sun's center
        sunAz = resArr[0];
        upperEdge = sunHt + sunRd;
        resRef = Utils.getRefractionTP(upperEdge , sunRd , +temp, +press);
        refU = resRef[0];
        upperEdge = upperEdge + refU;
        sunHt = resArr[1];  // Height of  sun's center corrected for refraction

        rowArray = new Array(9);
        rowArray[0] = aDay ;                                                    //Date
        rowArray[1] = Utils.grad_number2text( localTime, nDig, delm2);          //Local  Time
        rowArray[2] = Utils.grad_number2text(D, nDig, delm1, " ");          //Apparent declination
        rowArray[3] = Utils.grad_number2text(E, nDig, delm2, " ");          //Equation of time
        rowArray[4] = Utils.grad_number2text(sunHt, nDig, delm1, " ");  // Height of  sun's center corrected for refraction
        rowArray[5] = Utils.grad_number2text(sunAz, nDig, delm1, " ");  // Sun Azimuth from North counted clockwise

        if (sunHt >= minSunHeight ){
            let shadArr = new Array(3);
            // Calculate orthogonal 3d coordinates of sun, assume that sun is on sphere with radius of 100 gnomons
            // Assume that Sun'd latitude is Height of Suns UPPER EDGE
            // Assume that Sun'd longitude is (360-SunAzimuth) count it counterclockwise from North axis
            shadArr = Sphere2Decart(gnomonLen*10000, upperEdge, (360-sunAz));
            if (shadArr[2] >= 0) {
                //Пересечение прямой и плоскости  "Ефимов Н.В. Курс Аналитической геометрии" стр.221,223
                //координаты пересечения прямой проходящей через точки (0,0,Lgnm)(x2,y2,z2) и плоскости z=0
                // каноническое ур-е такой прямой: x-x1   y-y1   z-z1
                //                                 ---- = ---- = ----  полагаем = t    тогда x=x2*t; y = y2*t; z=z2*t-Lgnm*t-Lgnm=0;
                //                                 x2-x1  y2-y1  z2-z1
                //отсюда t= -Lgnm/(z2-Lgnm)
                x2 = shadArr[0];
                y2 = shadArr[1];
                z2 = shadArr[2];
                tt = -1 * gnomonLen / (z2 - gnomonLen);
                z = 0;
                y = x2 * tt;                     // y = x
                x = -1 * (y2 * tt);              // x = -y     Rotate North UP
                l = Math.sqrt(x * x + y * y); //shadow length
            }
            else { x=y=l=0;}
        }
        else  { x=y=l=0;}
        if (l < maxShadow) {
            rowArray[6] = x;
            rowArray[7] = y;
            rowArray[8] = l;
        }
        else {
            rowArray[6] = 0;
            rowArray[7] = 0;
            rowArray[8] = 0;
        }
        rowArray[9] = +sMonth;   //month number

        AoAHlines[i] = rowArray;

        aMoment = moment(sMoment, "").add(mStep, 'minutes');

        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        ht = moment(aMoment).format('HH');
        mt = moment(aMoment).format('mm');
        st = moment(aMoment).format('ss');
        localTime = +ht + mt/60 + st/3600;
        utcTime = (localTime - dUTCval);
        sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;

        if ( +ht >= stopH) {  // jump to next month 1-st day
            sMonth =  +sMonth +1;
            if (sMonth > 12) { break }
            hh = startH; mm = 0; ss = 0;
            ht = startH.toFixed(0);
            sMoment = curYear + "-" + sMonth + "-" + "01" + " " + ht + ":" + "00" + ":" + "00";      //start next month
            localTime = hh+ mm/60+ ss/3600;
            utcTime = (localTime - dUTCval);
            aMoment = moment(sMoment, "");              // nice formatting
            sYear = moment(aMoment).format('YYYY');
            sMonth = moment(aMoment).format('MM');
            sDay = moment(aMoment).format('DD');
            ht = moment(aMoment).format('HH');
            mt = moment(aMoment).format('mm');
            st = moment(aMoment).format('ss');
            sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
        }
        aDay = sYear + "-" + sMonth + "-" + sDay;
    }
    let result = new Array(4);
    result[0] = AoA1stdays;
    result[1] = AoAHlines;
    let arr1 = AoAHlines.slice(0);               // clone of AoAHlines
    arr1.splice(0,1);           // remove header
    result[2] = AoA1stdays.concat(arr1);         // Array of concatenated AoA1stdays & AoAHlines
    result[3] = [B, L, dUTCval, gnomonLen];      // Array of calculation parameters

    return result;

}

function Sphere2Decart(Radius, B, L) {
    // Преобразование широты и долготы  (градусы и д.д.) на сфере заданного радиуса в:
    // пространственные прямоугольные  координаты точки  (x-north y- west z- zenith) Правая декартова система.
    // Начало координат в центре сферы.
    let bRad, lRad, x, y, z;
    let resArr = new Array(3);
    bRad = B * Math.PI/ 180;
    lRad = L * Math.PI / 180;
    x = Radius * Math.cos(bRad) * Math.cos(lRad);
    y = Radius * Math.cos(bRad) * Math.sin(lRad);
    z = Radius * Math.sin(bRad);

    resArr[0]=x;
    resArr[1]=y;
    resArr[2]=z;
    return resArr;
}

function DecartRotation(rx, ry, rz, x, y, z) {
//Последовательное вращение вокруг осей правой декартовой системы.  rx, ry, rz - углы вращения по осям старой системы (градусы и д.д.)
//для перевода (x,y,z) из старой системы в новую систему (x3, y3, z3)
//новая координата x1=t11*x+t21*y+t31*z где t-направляющие косинусы новой оси в старой системе
//Справочник..Г.Корн и Т.Корн стр.80. Вращения положительны против часовой стрелки.
//28.10.2013

    let PI, x1, y1, z1, x2, y2, z2, x3, y3, z3, sinz, cosz, siny, cosy, sinx, cosx;
    let resArr = new Array(3);

    PI = Math.PI;
    if ( rz !== 0)    {
        sinz = Math.sin(rz * PI / 180);
        cosz = Math.cos(rz * PI / 180);
        //1 этап вращение вокруг аппликаты против часовой на угол rz
        x1 = cosz * x + sinz * y;
        y1 = -1 * sinz * x + cosz * y;
        z1 = z;
    }
    else {
        x1 = x;
        y1 = y;
        z1 = z;
    }

    if (ry !== 0) {
        siny = Math.sin(ry * PI / 180);
        cosy = Math.cos(ry * PI / 180);
        //2 этап вращение вокруг ординаты против часовой на угол ry
        x2 = cosy * x1 - siny * z1;
        y2 = y1;
        z2 = siny * x1  + cosy * z1;
    }
    else    {
        x2 = x1;
        y2 = y1;
        z2 = z1;
    }
    if ( rx !== 0) {
        sinx = Math.sin(rx * PI / 180);
        cosx = Math.cos(rx * PI / 180);
        //3 этап вращение вокруг абсциссы против часовой на угол rx
        x3 = x2;
        y3 = cosx * y2 + sinx * z2;
        z3 = sinx * y2 + cosx * z2;
    }
    else {
        x3 = x2;
        y3 = y2;
        z3 = z2;
    }
    resArr[0]=x3;
    resArr[1]=y3;
    resArr[2]=z3;

}

function sunShadowMaker(AoAxyz, sMoment, lat, lon, dUTC, temp, press ){
// This function is intended for shadow calculation on one land parcel.
// We assume that on horizontal plane exist some point objects. Distance between outside objects less than 1 nautical mile
// Function does:
// Takes: 1. AoAxyz - AoA of [ [x,y,z], [x,y,z] ... ] where x, y are object's Easting, Northing and z is object's height.
//       2. sMoment - Date&Time string "YYYY-MM-DD-hh-mm-ss
//       3. lat     - Latitude in decimal degrees  (of central point of parcel)
//       4. lon     - Longitude in decimal degrees (of central point of parcel)
//       5. dUTC    - difference between  LocalTime and UTC in decimal hours
//       6. temp    - ambient temperature in Celsius decimal degrees
//       7. press   - atmosphere's pressure in Hgmm
// Returns: AoA of  [ [x,y,0], [x,y,0] ... ]      where x, y are Easting, Northing of end of each object's shadow.
// Each object drops this shadow from SUN at given Date&Time.
    let nn = AoAxyz.length;
    let minSunHeight = 5;                           // Minimal height of sun above horizon in degrees for calculation
    let options, solar, resArr, Ht0, Az0, i, xs, ys, zs, xp, yp, zp, lp, tt, sunHt, sunAz, rowArray, gnomonLen, maxlen =0;
    let resAoA = new Array(nn);

    for(i=0; i < nn; i++){
        gnomonLen = AoAxyz[i][2];
        if (gnomonLen > maxlen) {maxlen = gnomonLen}
    }

    let aMoment = moment(sMoment, "");
    let sYear =   moment(aMoment).format('YYYY');
    let sMonth =  moment(aMoment).format('MM');
    let sDay =    moment(aMoment).format('DD');
    let ht =      moment(aMoment).format('HH');
    let mt =      moment(aMoment).format('mm');
    let st =      moment(aMoment).format('ss');
    let localTime = +ht+ mt/60+ st/3600;
    let utcTime = (localTime - dUTC);

    options = {
        Lat: lat,
        Lon: lon,
        Day: sDay,
        Month: sMonth,
        Year: sYear,
        UTCTime: utcTime,
        dUTC: dUTC,
        Temp: temp,
        Press: press
    };
    solar = new Solar(options);
    resArr = solar._calculate();           // resArr[5] Uncorrected height of  sun's center
    sunHt = resArr[14];                     // new feature in solarClass - resArr[14]upperEdge
    sunAz = resArr[0];

    for(i=0;  i < nn; i++)  {
        if (sunHt >= minSunHeight ){
            // Calculate orthogonal 3d coordinates of sun, assume that sun is on sphere with radius of 10000 gnomons
            // Assume that Sun'd latitude is Height of Suns UPPER EDGE corrected for refraction
            // Assume that Sun'd longitude is (360-SunAzimuth) count it counterclockwise from NORTH AXIS
            let shadArr = new Array(3);

            gnomonLen= AoAxyz[i][2];
            shadArr = Sphere2Decart(gnomonLen*10000, sunHt, (360-sunAz));

            if (shadArr[2] >= 0) {
                xs = shadArr[0];
                ys = shadArr[1];
                zs = shadArr[2];
                tt = -1 * gnomonLen / (zs - gnomonLen);
                zp = 0;

                yp = xs * tt;                     // y = x
                xp = -1 * (ys * tt);              // x = -y     Rotate North UP


                lp = Math.sqrt(xp * xp + yp * yp); //shadow length
            }
            else { xp=yp=lp=0;}
        }
        else  { xp=yp=lp=0;}

        rowArray = new Array(3);

        rowArray[0] = AoAxyz[i][0] + xp;
        rowArray[1] = AoAxyz[i][1] + yp;
        rowArray[2] = lp;
        resAoA[i] = rowArray;

    }
    return resAoA;
}

function sunShadowMaker3D(params){
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This function is intended for shadow calculation on one land parcel.
// We assume that on horizontal plane exist one polygonal object. Plane dimension of object less than 1 nautical mile
// ( lat, lon are given for center of object and we not take into account parallax if object will be not very big)
// Assume that plane height equals 0.
//
// Function sunShadowMaker3D() Takes:
//      1. AoAxyz - AoA of [ [x, y, zLow, zUp], [x, y, zLow, zUp] ... ]
//                    Each   [x, y, zLow, zUp] describe one point of object where x, y are object's Easting, Northing,
//                    zLow is point's lower height, zUp is point's upper height.
//                    Assume that lower and upper z have the same x,y. It is the same one point in plane.
//       2. sMoment     - Date&Time string "YYYY-MM-DD-hh-mm-ss
//       3. lat         - Latitude in decimal degrees  (of central point of object)
//       4. lon         - Longitude in decimal degrees (of central point of object)
//       5. dUTC        - Difference between  LocalTime and UTC in decimal hours
//       6. temp        - Ambient temperature in Celsius decimal degrees
//       7. press       - Atmosphere's pressure in Hgmm
//       8. minSunHeight- Minimal height of sun above horizon in degrees for calculation.
//                        if sunHt < minSunHeight return will be xp=yp=lp=0;
//
// Function sunShadowMaker3D()  Returns: AoA of  [ [xLow, yLow, lLow, xUp, yUp, lUp], [], ..., sunHt ]
//                              where: xLow, yLow are Easting and Northing of the end of shadow from Low point's height.
////                                   xUp, yUp are Easting and Northing of the end of shadow from Upper point's height.                                     z of each point's shadow always = 0 (shadow is on the plane) and we not return it
//                                   lLow, lUp - length of each shadow on plane IF lUp=0 SUN IS UNDER HORIZON
//                                   Each object drops this shadow from SUN at given local time sMoment (Date&Time).
//   sunHt - (the last value in return array) is the Sun's height at sMoment (we use it for coloring twilight when draw)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let AoAxyz = params.AoAxyz;
    let sMoment = params.sMoment;
    let lat = params.lat;
    let lon = params.lon;
    let dUTC = params.dUTC;
    let temp = params.temp;
    let press = params.press;
    let minSunHeight = params.minSunHeight;

    let numPnt = AoAxyz.length;
    let options, solar, resArr, i, sunHt, sunAz, rowArray;
    let xs1, ys1, zs1, xp1, yp1, zp1, lp1, tt1, xs2, ys2, zs2, xp2, yp2, zp2, lp2, tt2;
    let gnomonLenLow, gnomonLenUp;
    let resAoA = new Array(numPnt);

    // for(i=0; i < numPnt; i++){
    //     gnomonLenLow = AoAxyz[i][2];
    //     gnomonLenUp =  AoAxyz[i][3];
    // }

    let aMoment = moment(sMoment, "");
    let sYear =   moment(aMoment).format('YYYY');
    let sMonth =  moment(aMoment).format('MM');
    let sDay =    moment(aMoment).format('DD');
    let ht =      moment(aMoment).format('HH');
    let mt =      moment(aMoment).format('mm');
    let st =      moment(aMoment).format('ss');
    let localTime = +ht+ mt/60+ st/3600;
    let utcTime = (localTime - dUTC);

    options = {
        Lat: lat,
        Lon: lon,
        Day: sDay,
        Month: sMonth,
        Year: sYear,
        UTCTime: utcTime,
        dUTC: dUTC,
        Temp: temp,
        Press: press
    };
    solar = new Solar(options);
    resArr = solar._calculate();
    sunHt = resArr[14];                     // new feature in solarClass - solar's upperEdge
    sunAz = resArr[0];

    for(i=0;  i < numPnt; i++)  {
        if (sunHt >= minSunHeight ){
            // Calculate orthogonal 3d coordinates of sun, assume that sun is on sphere with radius of 10000 gnomons
            // Assume that Sun'd latitude is Height of Suns UPPER EDGE corrected for refraction
            // Assume that Sun'd longitude is (360-SunAzimuth) count it counterclockwise from NORTH AXIS
            gnomonLenLow = AoAxyz[i][2];
            gnomonLenUp =  AoAxyz[i][3];
            let shadArrLow = new Array(3);
            gnomonLenLow = AoAxyz[i][2];
            shadArrLow = Sphere2Decart(gnomonLenLow*10000, sunHt, (360-sunAz));

            let shadArrUp = new Array(3);
            gnomonLenUp  = AoAxyz[i][3];
            shadArrUp = Sphere2Decart(gnomonLenUp*10000, sunHt, (360-sunAz));

            if (Math.abs(shadArrLow[2] - 0) > 0.000001 ) {  //we have shadow from low height of object's point
                xs1 = shadArrLow[0];
                ys1 = shadArrLow[1];
                zs1 = shadArrLow[2];
                tt1 = -1 * gnomonLenLow / (zs1 - gnomonLenLow);
                zp1 = 0;
                yp1 = xs1 * tt1;                                // y = x
                xp1 = -1 * (ys1 * tt1);                         // x = -y     Rotate North UP
                lp1 = Math.sqrt(xp1 * xp1 + yp1 * yp1);      // Low shadow length
            }
            else { xp1=yp1=lp1=0; }

            if (Math.abs(shadArrUp[2] - 0) > 0.000001 ) {  //we have shadow from upper height of object's point
                xs2 = shadArrUp[0];
                ys2 = shadArrUp[1];
                zs2 = shadArrUp[2];
                tt2 = -1 * gnomonLenUp / (zs2 - gnomonLenUp);
                zp2 = 0;
                yp2 = xs2 * tt2;                                // y = x
                xp2 = -1 * (ys2 * tt2);                         // x = -y     Rotate North UP
                lp2 = Math.sqrt(xp2 * xp2 + yp2 * yp2);      // Upper shadow length
            }
            else { xp2=yp2=lp2=0;}
        }
        else  { xp1=yp1=lp1=0; xp2=yp2=lp2=0;}    //sunHt < minSunHeight

        rowArray = new Array(6);

        let pntx = AoAxyz[i][0];
        let pnty = AoAxyz[i][1];
        rowArray[0] = pntx + xp1;
        rowArray[1] = pnty + yp1;
        rowArray[2] = lp1;
        rowArray[3] = pntx + xp2;
        rowArray[4] = pnty + yp2;
        rowArray[5] = lp2;

        resAoA[i] = rowArray;
    }
    resAoA.push(sunHt);             //sunHt - (the last value in return array)
    return resAoA;                  //Returns: AoA of  [ [xLow, yLow, lLow, xUp, yUp, lUp], [], ..., sunHt ]
}

function calcObjectsShadow3D(options) {
    // Function takes: AoA,aMoment.......
    // Each 1-st level element of global AoA describes one object.   It has index of 1-st level in global AoA
    // 2-d level elements are arrays of [x,y,z] that describes each point of one object. It has index of 2-nd level in global AoA
    // Each point describes by 3 coordinates x,y,z  as elements with index of 3-d level in global AoA
    // Example:
    // [  [  [x,y,zLow,zUp], [x,y,zLow zUp], [x,y,zLow,zUp], [x,y,zLow,zUp] ],- object constructed from 4 points.
    //    [  [x,y,zLow,zUp], [x,y,zLow,zUp], [x,y,zLow,zUp          ],        - object constructed from 3 points.
    //    [  [x,y,zLow,zUp, [x,y,zLow,zUp],                  ]  ]             - object constructed from 2 points.
    //
    //   Points of each objects must be written consequently clock-wise
    //
    // Function returns: AoA of shadow's end of input objects in the same coordinate system as input
    //
    //        [xLow, yLow, lLow, xUp, yUp, lUp], [xLow, yLow, lLow, xUp, yUp, lUp]   - object constructed from 2 points.

    let AoAobj = options.AoA;               // Array of some objects
    let sMoment = options.aMoment;
    let lat = options.Latitude;
    let lon = options.Longitude;
    let dUTCval = options.dUTCval;
    let temp = options.Temperature;
    let press = options.Pressure;
    let minSunHeight = options.minSunHeight;

    let tx, ty, txp, typ, ox, oy, txsp, tysp, ob1, sh1;
    let tx2, ty2, txp2, typ2, txsp2, tysp2;



    let numObj = AoAobj.length;                            //Amount of objects in array
    let shadowsOne = [];                                   //Empty array of shadows of one object
    let shadowsAll = [];                                   //Empty array of shadows of one object

    for (let j = 0; j < numObj; j++) {

        let AoAxyz = AoAobj[j];                             // one object in initial coordinates
            options = {
                AoAxyz: AoAxyz,
                sMoment: sMoment,
                lat: lat,
                lon: lon,
                dUTC: dUTCval,
                temp: temp,
                press: press,
                minSunHeight: minSunHeight
            };
            shadowsOne= sunShadowMaker3D(options);
        shadowsAll.push( shadowsOne )
    }
    return shadowsAll;

}


window.Utils.dataDeliveryDay = dataDeliveryDay;
window.Utils.dataDeliveryYear = dataDeliveryYear;
window.Utils.dataDeliveryDay2AoA = dataDeliveryDay2AoA;
window.Utils.dataDeliveryYear2AoA = dataDeliveryYear2AoA;
window.Utils.sunDials2AoA = sunDials2AoA;
window.Utils.sunShadowMaker = sunShadowMaker;
window.Utils.sunShadowMaker3D = sunShadowMaker3D;
window.Utils.calcObjectsShadow3D = calcObjectsShadow3D;