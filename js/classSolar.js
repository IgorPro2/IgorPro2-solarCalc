function Solar(options) {
    //options ={Lat:B, Lon:L, Day:sDay, Month:sMonth, Year:sYear, dUTC:dUTCval, Temp:temp, Press:press, isAM: isAM, sunHeight: givenHt, sunAzimuth:givenAz};
    let Latitude = options.Lat;                    //Decimal degrees
    let Longitude = options.Lon;                   //Decimal degrees
    let sDay = options.Day ;                       //String
    let sMonth = options.Month ;                   //String
    let sYear = options.Year ;                     //String
    let timeUTC = options.UTCTime;                 //Decimal hours    Time for position calculation. MUST BE IN UTC!!!
    let dUTCval = options.dUTC;                    //Decimal hours =  (LocalTime - UTCTime)
    let tempC = options.Temp;                      //Ambient temperature in Celsius degrees
    let pressP = options.Press;                    //Ambient pressure in Hmm
    let isBeforeNoon = options.isAM;               //Boolean true to find Time is BeforeNoon
    let givenH = options.sunHeight;                // Given sun height Decimal degrees
    let givenA = options.sunAzimuth;               // Given sun azimuth Decimal degrees

    let givHg = document.getElementById("givHg");
    let givHm = document.getElementById("givHm");
    let givHs = document.getElementById("givHs");
    let givAg = document.getElementById("givAg");
    let givAm = document.getElementById("givAm");
    let givAs = document.getElementById("givAs");

    let timeHour = document.getElementById("timeHour");
    let timeMin = document.getElementById("timeMin");
    let timeSec = document.getElementById("timeSec");


    // Define class method _calculate
    this._calculate = function () {
        let Declination,Equation,SunRadius;

        if (timeUTC > 24) {                                         //TODO use moment.js instead
            sDay = parseInt(sDay) + Math.floor((timeUTC / 24));
            timeUTC = timeUTC % 24;
        }

        // Get ephemeris
        let EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, timeUTC, Longitude, dUTCval);
        Declination = EphArr[11];  Equation = EphArr[12];   SunRadius = EphArr[13];

        let Results = new Array(14);
        let tT, p, p1, Ar, SunA, SunH, SunHcor, aRef = 0.0, Parallax, HzParallax;
        let Res = new Array(3);
        // Hour Angle of Sun
        tT = (timeUTC + Equation) * 15 + Longitude;
        if (tT > 360) tT = tT % 360;
        tT = Utils.toRadians(tT);
        Declination = Utils.toRadians(Declination);
        Equation = Utils.toRadians(Equation);
        Latitude = Utils.toRadians(Latitude);

        p = Math.sin(Latitude) / Math.tan(tT);
        p1 = Math.cos(Latitude) * Math.tan(Declination) / Math.sin(tT);
        Ar = p - p1;
        SunA = Utils.toDegrees(Math.atan((1 / Ar)));
        if (Utils.toDegrees(tT) < 180) {
            if (Ar > 0) SunA = 180 + Math.abs(SunA);    // III
            else SunA = 360 - Math.abs(SunA);    // IV
        } else if (Ar > 0) SunA = 0 + SunA;           // I
        else SunA = 180 - Math.abs(SunA);    // II

        SunH = Math.sin(Latitude) * Math.sin(Declination) + Math.cos(Latitude) * Math.cos(Declination) * Math.cos(tT);
        SunH = Math.atan(SunH / Math.sqrt(-1 * SunH * SunH + 1));

        //Calculate parallax to SunHeight
        HzParallax = (8.79 / 3600 * Math.PI / 180);
        Parallax = HzParallax * Math.cos(SunH);
        Parallax = Utils.toDegrees(Parallax);

        SunH = Utils.toDegrees(SunH);
        SunHcor = SunH;

        //Apply refraction to SunHeight
        let TC=+tempC, Pmm=+pressP;
        if ((TC !== 0) && (Pmm !== 0)) {
            Res = Utils.getRefractionTP(SunHcor, SunRadius, TC, Pmm);
            aRef = Res[0];
            SunHcor = SunHcor + aRef;        //Sun height corrected for Refraction
        }

        ///////////////Return values ALL in DECIMAL DEGREES at given UTCTime //////////////////////
        Results[0] = SunA;                  // Sun Azimuth from North counted clockwise
        Results[1] = SunHcor;               // Corrected for refraction height of  sun's center
        Results[2] = Utils.toDegrees(tT);   // Hour Angle of Sun
        Results[3] = aRef;                  // Refraction corrected for meteoParameters
        Results[4] = Parallax;              // Parallax
        Results[5] = SunH;                  // Uncorrected height of  sun's center

        Results[6] = Res[1];                // Main part of refraction
        Results[7] = Res[2];                // correction for temperature
        Results[8] = Res[3];                // correction for pressure

        Results[9] =  Utils.toDegrees(Declination);
        Results[10] = Utils.toDegrees(Equation);
        Results[11] = timeUTC;                        //UTC time in DECIMAL HOURS
        Results[12] = Longitude;
        Results[13] = Latitude;

        return Results;
    };

    //////   HEIGHT       HEIGHT       HEIGHT     HEIGHT       HEIGHT       HEIGHT     HEIGHT       HEIGHT       HEIGHT
    // Class Method _timeAtSunPositionH calculate and return Local Time (in hours) and Refraction(degrees)
    // when Sun is at given HEIGHT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this._timeAtSunPositionH = function () {

        let Results = new Array(2);                 // Array of results

        let Tfit=0, dTfit=0, aRefr=0;
        let fitD, fitE, SunRadius, culmTime;
        let T1, T2, mSolar, tResult, SunH1, SunH2, aSolution, params;
        // Any time. 12.0, simply to calculate CULMINATION TIME at given Date
        let EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 12.0, Longitude, dUTCval);
        culmTime = EfArr[14];           //Время верхней кульминации исправленное за долготу точки наблюдения
        if (isBeforeNoon)   T1 = culmTime-11.9999999;       // Find H before noon
        else                T1 = culmTime+11.9999999;       // Find H after noon
        T2= culmTime;

        params ={Lat:Latitude, Lon:Longitude, Day:sDay, Month:sMonth, Year:sYear, UTCTime:(T1-dUTCval), dUTC:dUTCval, Temp:tempC, Press:pressP};
        mSolar = new Solar(params);
        tResult= mSolar._calculate();
        SunH1= tResult[1];               //Sun's height at beginning or end of day

        params ={Lat:Latitude, Lon:Longitude, Day:sDay, Month:sMonth, Year:sYear, UTCTime:(T2-dUTCval), dUTC:dUTCval, Temp:tempC, Press:pressP};
        mSolar = new Solar(params);
        tResult= mSolar._calculate();
        SunH2= tResult[1];               //Sun's height at noon

        if (( givenH < SunH2 ) && ( givenH > SunH1 )) {
            Tfit= (T2 + T1) / 2;
            dTfit= Tfit/2;             // Iteration's limit
            aSolution = true;
            givHg.classList.remove("invalidVal") ;
            givHm.classList.remove("invalidVal") ;
            givHs.classList.remove("invalidVal") ;
        }
        else {
            aSolution = false;          //NO SOLUTION 4 THAT HEIGHT
            givHg.classList.add("invalidVal") ;
            givHm.classList.add("invalidVal") ;
            givHs.classList.add("invalidVal") ;
        }

        while  ( aSolution ) {   // Here we iterate while Time difference 'dTfit' will be less than 0.001 second in Sun's height
            // (or till we understand that solution absent (dTfit < 0.000001)-:(
            //UTC of calculated moment (Tfit)
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, (Tfit), Longitude, dUTCval);
            fitD = EfArr[11];            fitE = EfArr[12];            SunRadius= EfArr[13];

            params ={Lat:Latitude, Lon:Longitude, Day:sDay, Month:sMonth, Year:sYear, UTCTime:(Tfit-dUTCval), dUTC:dUTCval, Temp:tempC, Press:pressP};
            mSolar = new Solar(params);
            tResult= mSolar._calculate();
            if (givenH > 0)     SunH1= tResult[1];         //height of Sun's center corrected for Refraction
            else                SunH1= tResult[5];         //height of Sun's center uncorrected  (WHEN WE FIND ANY POSITION UNDER HORIZON)

            aRefr= tResult[3];               //Refraction

            if (Math.abs( SunH1 - givenH) < (0.00001/3600) )
                break;
            else {
                if (dTfit < 0.00000001) {
                    aSolution = false;
                }
                else {
                    if (givenH > SunH1) T1= Tfit;
                    else T2 = Tfit;
                    Tfit = (T2+T1)/2;
                    dTfit = Math.abs(T2-T1);
                }
            }
        }
        Results[1]= Tfit-dUTCval; // Local time (in hours) when Sun is at givenH
        Results[0]= aRefr;        // Refraction at this givenH
        return Results;

    };

    ////      AZIMUTH     AZIMUTH     AZIMUTH     AZIMUTH     AZIMUTH     AZIMUTH     AZIMUTH     AZIMUTH     AZIMUTH
    // Class Method _timeAtSunPositionA calculate and return Local Time (in hours) and Refraction(degrees)
    // when Sun is at given AZIMUTH;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this._timeAtSunPositionA = function () {

        let Results = new Array(2);                 // Array of results

        let Tfit, dTfit;
        let culmTime, culmTimeN, lowculmTime ;
        let T1, T2, mSolar, tResult, SunA1, SunA2, aSolution, params;
        let sMoment, aMoment, nYear, nMonth, nDay ;

        // Any time. 12.0, simply to calculate CULMINATION TIME at given Date
        let EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 12.0, Longitude, dUTCval);
        culmTime = EfArr[14];           // LOCAL TIME
        // Find time of low culmination
        sMoment = sYear+"-"+ sMonth+"-"+sDay;
        aMoment = moment(sMoment, "").add(1,'day');
        nYear = moment(aMoment).format('YYYY'); nMonth = moment(aMoment).format('MM');  nDay = moment(aMoment).format('DD');
        EfArr = Utils.ReadDataFromResourceString(nDay, nMonth, nYear, 12.0, Longitude, dUTCval);
        culmTimeN = EfArr[14];        //CULMINATION TIME at NEXT Day from given    LOCAL TIME

        lowculmTime = (culmTimeN + culmTime)/2 - 12;        // LOW CULMINATION TIME AT GIVEN DAY
        //EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 12.0, Longitude, dUTCval);

        if (givenA <= 180) {        // Find A 0 -180
            T1 = lowculmTime;
            T2 = culmTime;          // LOCAL TIME
        }
        else {
            T1 = culmTime;          // Find A 180 -360
            T2 = lowculmTime+24;
        }
        params = {Lat: Latitude, Lon: Longitude, Day: sDay, Month: sMonth, Year: sYear, UTCTime: (T1-dUTCval), dUTC: dUTCval, Temp: tempC, Press: pressP };
        mSolar = new Solar(params);
        tResult = mSolar._calculate();
        SunA1 = tResult[0];                   //Sun's azimuth at time T1 BEFORE;

        // if (T2 > 24) {
        //     sMoment = sYear + "-" + sMonth + "-" + sDay;
        //     aMoment = moment(sMoment, "").add(1, 'day');
        //     nYear = moment(aMoment).format('YYYY');
        //     nMonth = moment(aMoment).format('MM');
        //     nDay = moment(aMoment).format('DD');
        //     params ={Lat:Latitude, Lon:Longitude, Day:nDay, Month:nMonth, Year:nYear, UTCTime:(T2-24-dUTCval), dUTC:dUTCval, Temp:tempC, Press:pressP};
        //
        // }
        // else {
        //     params ={Lat:Latitude, Lon:Longitude, Day:sDay, Month:sMonth, Year:sYear, UTCTime:(T2-dUTCval), dUTC:dUTCval, Temp:tempC, Press:pressP};
        //     }
        //
        // //params ={Lat:Latitude, Lon:Longitude, Day:sDay, Month:sMonth, Year:sYear, UTCTime:(T2-dUTCval), dUTC:dUTCval, Temp:tempC, Press:pressP};
        //
        // mSolar = new Solar(params);
        // tResult = mSolar._calculate();
        // SunA2 = tResult[0];                    //Sun's azimuth at at time T2 AFTER;

        aSolution = true;
        Tfit = (T2+T1)/2;
        dTfit = Tfit / 2;              // Iteration's limit
        while  ( aSolution ) {
            params ={Lat:Latitude, Lon:Longitude, Day:sDay, Month:sMonth, Year:sYear, UTCTime:(Tfit-dUTCval), dUTC:dUTCval, Temp:tempC, Press:pressP};
            mSolar = new Solar(params);
            tResult= mSolar._calculate();

            SunA1= tResult[0];

            if (Math.abs( SunA1 - givenA) < (0.001/3600) )
                break;
            else {
                if (dTfit < 0.000000001) {
                    aSolution = false;
                }
                else {
                    //console.log('givenA='+givenA.toFixed(4)+'SunA1='+SunA1.toFixed(4))
                    if (SunA1 > 359 && givenA < 1) { SunA1 = SunA1-360 }                 //When iterations cross 0-360
                    if (givenA > SunA1) {
                        T1 = Tfit;
                    }
                    else {
                        T2 = Tfit;
                    }
                    Tfit = (T2 + T1) / 2;
                    dTfit = Math.abs(T2 - T1);
                }
            }
        }
        if (aSolution) {
            Results[1] = Tfit;         // Local time (in hours) when Sun is at givenA
            givAg.classList.remove("invalidVal") ;
            givAm.classList.remove("invalidVal") ;
            givAs.classList.remove("invalidVal") ;
        }
        else {
            //givAg.value = 999;
            givAg.classList.add("invalidVal") ;
            givAm.classList.add("invalidVal") ;
            givAs.classList.add("invalidVal") ;
            Results[1] = 0;
        }
        return Results;
    }

}


