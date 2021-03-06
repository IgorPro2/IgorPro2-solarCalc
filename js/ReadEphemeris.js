;(function () {
    Object.defineProperty(window.ephemeris, 'getEphemerisArray', {
        value: function (year) {

            //Get array of keys(years) in object {window.ephemeris}
            let years = Object.keys(this);
            //                                                      KEY          STRING ARRAY          OBJECT
            // window.ephemeris object consist    window.ephemeris[2020] = { eph: 'year data', mom: {year moments}}
            // Declare Array with values from FIRST given (2018.js) file
            let lastYearGiven = [years[years.length - 1], this[years[years.length - 1]].eph, this[years[years.length - 1]].mom];

            // Declare Array with values from LAST given (2020.js) file[year, year data, year moments]
            let firstYearGiven = [years[0], this[years[0]].eph, this[years[0]].mom];

            // if this function was called without argument-year we return Array'lastYearGiven'
            if (!year) return lastYearGiven;

            //CHECK IF USER GAVE US VALID YEAR
            if (!String(year).match(/^[0-9]{4}$/)) return lastYearGiven;  //user give us invalid year, we return Array'lastYearGiven'

            //RETURN DATA IF WE HAVE THAT YEAR,
            if (this[+year]) return [year, this[+year].eph, this[+year].mom];

            // user give us valid year but we have not appropriate *.js ephemeris file
            years.push(year);                                       // insert given year in Array'years'
            years.sort(function (a, b) {     // sort Array'years' in ascending order
                return a - b;
            });
            let ind = years.indexOf(year);    // get index of inserted (user)year in sorted Array'years'
            if (!ind) return firstYearGiven;  // index=0 (this year is first, !0 = false), we return Array'firstYearGiven'
            return lastYearGiven;             // index=years.len (this year is last in sorted Array'years') we return Array'lastYearGiven'
        },
    });
// http://space.univ.kiev.ua/eph/17a/Su1.html
// Jan,6,190534.399,-223451.19,17.164,1617.56,523.405,-1.1109,120536.79,1.101,
// Ephemeris table. Each row contains at 0h of Time Dynamical Terrestrial:
//  Month, 	Day, 	Apparent right ascension (hours, minutes, seconds), 	Apparent declination (degrees, minutes, seconds),
//   Jan,    6,               190534.399,                                          -223451.19,
//  Hour difference of declination (seconds), 	Apparent radius (minutes, seconds), 	Equation of time (hours, minutes, seconds),
//           17.164,                                      1617.56,                                  523.405
//  Hour difference of equation of time (seconds),	Time of upper culmination of Sun (hours, minutes, seconds),
//                -1.1109,                                             120536.79
//  Change in moment of upper culmination when longitude changes on 1 hour to west (seconds).
//                  1.101,

    function ReadDataFromResourceString(aDay, aMonth, aYear, utcTime, Longitude, LocalMinusUTC) {
        /* ReadDatafromResourceString ( string aDay, string aMonth, string aYear, double aTime, double Longitude, double LocalMinusUTC)
        aTime - UTC Time in hours.dd      LocalMinusUTC - Difference to Local time from UTC in hours.dd
        2017-11-06(4JAVA)   double aTime instead string aTime. Must be  UTC decimal degrees!!!
        Arrays Ephemeris[year] declare in index_en.html [2020.js...] when script starts;
        Each row in Ephemeris[year]  contains at 0h of Time Dynamical Terrestrial: 10 values separated with comma;
        Return Results[15] array with values:
        Results [0-9] are table values at 0h UTC:
        Results [10-14] are values at GIVEN TIME at GIVEN DATE:
        Values calculated at given aDate and aTime (and Tuc(TimeOfUpperCulmination) at given Latitude in degrees)
        */
        //Набор целочисленных значений для года, месяца и дня. Например: var Xmas95 = new Date(1995, 11, 25)
        let aMonth0 = String(+aMonth - 1);   //system Month starts from 0
        let aDate = new Date(aYear, +aMonth0, aDay);
        let DayNum = moment(aDate).dayOfYear();
        let TimeUTC = utcTime;

        // WE GET ARRAY ['yearOut'YEAR, 'words'EPHEMERIS(ARRAY), 'yearMoments'(OBJECT KEY:VALUE)] FOR GIVEN aYear
        let wordsArray = window.ephemeris.getEphemerisArray(aYear);
        let yearOut = wordsArray[0];//get a year value of ephemeris
        let words = wordsArray[1];
        let yearMoments = wordsArray[2];
        //console.log(words);
        //console.log(yearMoments);
        window.varsValue.eclipticDeclination = yearMoments.eclipticDeclination;
        window.varsValue.springEquinox = yearMoments.springEquinox;
        window.varsValue.summerSolstice = yearMoments.summerSolstice;
        window.varsValue.autumnEquinox = yearMoments.autumnEquinox;
        window.varsValue.winterSolstice = yearMoments.winterSolstice;

        let i = (DayNum * 10) - 10;          //1-st index of Day (10 values) in array words[] (one day - one string in file)
        let Results = new Array(16);

        Results[0] = (words[i]);                        //Month (char)
        Results[1] = +(words[i + 1]);                   //Day of month
        Results[2] = Utils.CharDigits2Number(words[i + 2]);   //Apparent right ascension (hours, minutes, seconds)            Asc
        Results[3] = Utils.CharDigits2Number(words[i + 3]);   //Apparent declination (degrees, minutes, seconds)              Dcl
        Results[4] = Utils.CharDigits2Number(words[i + 4]);   //Hour difference of declination (seconds)                      dD
        Results[5] = Utils.CharDigits2Number(words[i + 5]);   //Apparent radius (minutes, seconds)                            Rds
        Results[6] = Utils.CharDigits2Number(words[i + 6]);   //Equation of time (hours, minutes, seconds)                    Eqt
        Results[7] = Utils.CharDigits2Number(words[i + 7]);   //Hour difference of equation of time (seconds)                 dE
        Results[8] = Utils.CharDigits2Number(words[i + 8]);   //Time of upper culmination of Sun at Greenwich (hr, min, sec)  Tuc
        Results[9] = Utils.CharDigits2Number(words[i + 9]);   //Change in moment of upper culmination when longitude changes on 1 hour to west (seconds)

        // Calculated values on given moment
        let Asc = Utils.CharDigits2Number(words[i + 12]);                        //Apparent right ascension at Next day
        Results[10] = Results[2] + (Asc - Results[2]) / 24 * TimeUTC;

        let dD = Utils.CharDigits2Number(words[i + 4]);                          //Hour difference of declination
        let dD1 = Utils.CharDigits2Number(words[i + 14]);                        //Hour difference of declination at Next day
        Results[11] = Results[3] + TimeUTC * (dD + TimeUTC / 48 * (dD1 - dD));

        let dE = Utils.CharDigits2Number(words[i + 7]);                          //Hour difference of equation of time
        let dE1 = Utils.CharDigits2Number(words[i + 17]);                        //Hour difference of equation of time at Next day
        let E = Results[6] - TimeUTC * (dE + TimeUTC / 48 * (dE1 - dE));          // Minus because dE has another sign in   SUNefemerida table
        let nau = E;
        E = 12 - nau;                                       //Приводим к виду советского АЕ (Уравнение времени nau и вспомогательная величина Е= (ист.-сред.)+12)
        Results[12] = E;

        let Rds = Utils.CharDigits2Number(words[i + 15]);                        //Apparent radius  at Next day
        Results[13] = Results[5] + (Rds - Results[5]) / 24 * TimeUTC;            //Apparent radius at  given TimeUTC

        let Tculm = Results[8] - (Longitude / 15) * Results[9];                               //Time of upper culmination corrected at given Longitude (Minus to EAST from Greenwich!)
        let deltaT = LocalMinusUTC - Math.round(Longitude / 15);                              //Difference between LocalTimeShift and TimeZoneNumber
        Results[14] = Tculm + deltaT + (Math.round(Longitude / 15) * 15 - Longitude) / 15;  //Time of upper culmination at LocalTime corrected at given Longitude
        Results[15] = yearOut;          //  Year returned by window.ephemeris.getEphemerisArray(aYear),  nearest year for what  we have ephemeris
        return Results
    }

    window.Utils.ReadDataFromResourceString = ReadDataFromResourceString;
    /*
    // function from StackOverflow. Instead we use library moments.js
    function getDayOfYear(date) {
        let month = date.getMonth();
        let year = date.getFullYear();
        let days = date.getDate();
        for (let i = 0; i < month; i++) {
            days += new Date(year, i + 1, 0).getDate();
        }
        return days;
    }

     */
})();