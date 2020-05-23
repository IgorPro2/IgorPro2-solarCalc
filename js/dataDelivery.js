
function dataDeliveryDay(params) {
    //params = {Day: sDay, Month: sMonth, Year: sYear};
    // 2020-05-18 adding AoA for output to xlx
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

function dataDeliveryDay2AoA(params) {
    //params = {Day: sDay, Month: sMonth, Year: sYear};
    // 2020-05-18 adding AoA for output to xlx
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
    let delm2=delim2.value;
    let delm1=delim1.value;
    let nDig = 1*nDigits.value;

    let sYear = params.Year;
    let sMonth = params.Month;
    let sDay = params.Day;
    let g, m, s, B, L, resArr, dUTCval, options, solar;
    let ht, mt, st;
    let utcTime,  i;
    let aDay = sYear + "-" + sMonth + "-" + sDay+ " ";


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

    let rowArray;
    let tableAoA = new Array(700);
    utcTime = -2/60;
    for (i = 0; i < 720; i++) {
        utcTime = (utcTime + 2/60);     //UTC time each 2-minutes starts from current time
        //console.log("utcTime="+Utils.grad_number2text(utcTime, nDig,delm2));
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

        rowArray = new Array(6);
        rowArray[0] = utcTime;
        rowArray[1] = resArr[1];
        rowArray[2] = resArr[0];
        rowArray[3] = aDay + Utils.grad_number2text( utcTime, nDig, delm2);
        rowArray[4] = Utils.grad_number2text(resArr[1], nDig, delm1, " ");
        rowArray[5] = Utils.grad_number2text(resArr[0], nDig, delm1, " ");

        tableAoA[i] = rowArray;
        console.log(rowArray);

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
    let EphArr, ExistYear, aMoment, sMoment, minH = -90, maxH = 90, minA = 0, maxA = 360;

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

window.Utils.dataDeliveryDay = dataDeliveryDay;
window.Utils.dataDeliveryYear = dataDeliveryYear;
window.Utils.dataDeliveryDay2AoA = dataDeliveryDay2AoA;