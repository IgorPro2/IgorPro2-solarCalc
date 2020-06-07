
///////////////////////////////////////////////////   RANDOM ANIMATION EXAMPLE    ///////////////////////
// var point = new Point(350, 350);
// var circle = new Shape.Circle({
//     center: point,
//     radius: 20
// });
// circle.style.strokeColor = "blue";
// var waypoints = [new Point(350, 350),new Point(675, 950),new Point(780, 450),new Point(680, 760),new Point(180, 80),new Point(670, 880),new Point(960, 960),];
// var currentIndex = 0;
// circle.onFrame = function (event) {
//     if (event.count % 40 === 0) {
//         //circle.position = waypoints[currentIndex];
//         circle.tween({
//             'position.x': Math.random() * width,
//             'position.y': Math.random() * height,
//         }, {
//             easing: 'linear',
//             duration: 500
//         });
//         //circle.position = paper.view.center;
//         currentIndex++;
//         if (currentIndex > waypoints.length - 1) currentIndex = 0;
//     }
// };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////           YEAR PATH  FULL SCREEN   ///////////////////////////////////
//         //Define analemma H,A dimensions instead 180 & 360
//         var maxH = yearArr[732],  minH = yearArr[730], maxA = yearArr[733],  minA = yearArr[731];
//         var dH = maxH - minH;
//         var dA = maxA - minA;
//         // console.log("    dH="+ dH);
//         // console.log("    dA="+ dA);
//         xt1=     (yearArr[1]- minA)/dA*width;
//         yt1= height-((yearArr[0]- minH)/dH*height);
//         xt2=     (yearArr[3]- minA)/dA*width;
//         yt2= height-((yearArr[2]- minH)/dH*height);
//         // console.log("xt1="+ xt1);
//         // console.log("yt1="+ yt1);
//         // console.log("xt2="+ xt2);
//         // console.log("yt2="+ yt2);
//         line2 = new Path.Line(new Point(xt1,yt1),new Point(xt2,yt2));
//         line2.style.strokeColor = "green";
//         for ( i=4; i < (yearArr.length - 5); i=i+2 ) {
//             xt1=     (yearArr[i+1]- minA)/dA*width;
//             yt1= height-((yearArr[i]  - minH)/dH*height);
//             line2.lineTo(new Point(xt1,yt1));    // lineBy  relative coordinate;   line1.lineTo absolute coordinate;
//         }
/////////////////////////////////////////////////  SUN YEAR ANIMATION  FULL SCREEN /////////////////////////////////
//         var point2 = new Point((yearArr[1]- minA)/dA*width, height-((yearArr[0]  - minH)/dH*height));
//         var circle2 = new Shape.Circle({ center: point2,    radius: 10, fillColor: "yellow", strokeColor: "red"   });
//         i = 0;
//         circle2.onFrame = function (event) {
//             if (event.count % 10 === 0) {
//                 circle2.tween({
//                     'position.x':     (yearArr[i+1]- minA)/dA*width,
//                     'position.y': height-((yearArr[i]  - minH)/dH*height),
//
//                 }, {
//                     easing: 'linear',
//                     duration: 500,
//                 });
//                 i=i+2;
//                 if (i > yearArr.length - 5) i = 0;
//             }
//         };



///////////////////////////      function calcEquinoxSolstice()     DEPRECATED
{
    function calcEquinoxSolstice() {

        let g, m, s, Lat, Lon, dUTCval, sDay, sMonth, sYear, sMoment, aMoment, sgn1, sgn2, EfArr, myD1, myD2;
        let time_beg, dTime, time_end, EquDay, EquTime, s1, digits = Number(nDigits.value);
        let nDay, nMonth, nYear, nMoment, solstice, SolDay, SolTime, params, solar, resArr;
        let temp = tempC.value, press = pressP.value, eclipticDecl;
        let delimiter1 = document.getElementById("delmGMS");
        let delm = delimiter1.value;
        let delimiter2 = document.getElementById("delmHMS");
        let delm2 = delimiter2.value;

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

        sMoment = sYear + "-03-19";                           //19 March of given Year
        aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        sgn1 = 1;
        sgn2 = 1;
        while (sgn1 === sgn2) {
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 0, Lon, dUTCval);
            myD1 = EfArr[11];
            sgn1 = Math.sign(myD1);
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 24, Lon, dUTCval);
            myD2 = EfArr[11];
            sgn2 = Math.sign(myD2);
            if (sgn1 === sgn2) {                                // Equinox possibly HAPPENS at next day
                aMoment = moment(sMoment, "").add(1, 'day');     //Next day
                sMonth = moment(aMoment).format('MM');
                sDay = moment(aMoment).format('DD')
            }
        }
        time_beg = 0.;
        dTime = 12.;
        while (dTime > 1. / 3600.) {
            time_end = time_beg + dTime;
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, time_end, Lon, dUTCval);
            myD2 = EfArr[11];
            if (myD2 < 0) {
                time_beg = time_end;
            } else {
                dTime = dTime / 2;
            }
        }
        EquDay = sYear + "-" + sMonth + "-" + sDay;
        EquTime = Utils.grad_number2text((time_beg + time_end) / 2., digits, delm2);
        s1 = EquDay + " " + EquTime;
        springEquinox.textContent = s1;
        if(!window.varsValue.springEquinox )        window.varsValue.springEquinox =s1;

        // START FROM 0h 22 SEPTEMBER of given year          AUTUMN EQUINOX
        sMoment = sYear + "-09-22";                           //22 SEPTEMBER of given Year
        aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        sgn1 = 1;
        sgn2 = 1;
        while (sgn1 === sgn2) {
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 0, Lon, dUTCval);
            myD1 = EfArr[11];
            sgn1 = Math.sign(myD1);
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 24, Lon, dUTCval);
            myD2 = EfArr[11];
            sgn2 = Math.sign(myD2);
            if (sgn1 === sgn2) {                                // Equinox possibly HAPPENS at next day
                aMoment = moment(sMoment, "").add(1, 'day');     //Next day
                sMonth = moment(aMoment).format('MM');
                sDay = moment(aMoment).format('DD')
            }
        }
        time_beg = 0.;
        dTime = 12.;
        while (dTime > 1. / 3600.) {
            time_end = time_beg + dTime;
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, time_end, Lon, dUTCval);
            myD2 = EfArr[11];
            if (myD2 > 0) {
                time_beg = time_end;
            } else {
                dTime = dTime / 2;
            }
        }
        EquDay = sYear + "-" + sMonth + "-" + sDay;
        EquTime = Utils.grad_number2text((time_beg + time_end) / 2., digits, delm2);
        s1 = EquDay + " " + EquTime;
        autumnEquinox.textContent = s1;
        if(!window.varsValue.autumnEquinox)    window.varsValue.autumnEquinox =s1;

        sMoment = sYear + "-06-20";                           //20 JUNE of given year
        aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        nMoment = aMoment.add(1, 'day');     //Next day
        nYear = moment(nMoment).format('YYYY');
        nMonth = moment(nMoment).format('MM');
        nDay = moment(nMoment).format('DD');
        sgn1 = 1;
        sgn2 = 1;
        while (sgn1 === sgn2) {          //compare signs of Declination's Hour change!!!
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 0., Lon, dUTCval);
            myD1 = EfArr[4];
            sgn1 = Math.sign(myD1);
            EfArr = Utils.ReadDataFromResourceString(nDay, nMonth, nYear, 0., Lon, dUTCval);
            myD2 = EfArr[4];
            sgn2 = Math.sign(myD2);
            if (sgn1 === sgn2) {                                     // SOLSTICE possibly HAPPENS at next day
                aMoment = nMoment;
                sYear = moment(aMoment).format('YYYY');
                sMonth = moment(aMoment).format('MM');
                sDay = moment(aMoment).format('DD');
                nMoment = aMoment.add(1, 'day');     //Next day
                nYear = moment(nMoment).format('YYYY');
                nMonth = moment(nMoment).format('MM');
                nDay = moment(nMoment).format('DD');
            }
        }
        EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 0., Lon, dUTCval);
        myD1 = EfArr[4];
        EfArr = Utils.ReadDataFromResourceString(nDay, nMonth, nYear, 0., Lon, dUTCval);
        myD2 = EfArr[4];
        solstice = myD1 / (myD1 - myD2) * 24;    //Time when Declination's Hour change equals 0
        //SummerSolDay = moment(aMoment).format("YYYY-MM-DD");
        SolDay = sYear + "-" + sMonth + "-" + sDay;
        SolTime = Utils.grad_number2text(solstice, digits, delm2);
        s1 = SolDay + " " + SolTime;
        summerSolstice.textContent = s1;
        if(!window.varsValue.summerSolstice)  window.varsValue.summerSolstice =s1;
        EfArr = Utils.ReadDataFromResourceString(nDay, nMonth, nYear, SolTime, Lon, dUTCval);
        eclipticDecl = EfArr[3];                  // Declination of Ecliptic to SkyEquator this year

        //Define max height
        EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, (solstice - dUTCval), Lon, dUTCval);
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
        //maxHeight.textContent = s1;
        window.varsValue.summerMaxHeight =s1;

        // START FROM 0h 21 DECEMBER of given year, and find a moment
        // when Time when Declination's Hour change equals 0                  WINTER SOLSTICE
        sMoment = sYear + "-12-21";
        aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY');
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        nMoment = aMoment.add(1, 'day');     //Next day
        nYear = moment(nMoment).format('YYYY');
        nMonth = moment(nMoment).format('MM');
        nDay = moment(nMoment).format('DD');

        sgn1 = 1;
        sgn2 = 1;
        while (sgn1 === sgn2) {          //compare signs of Declination's Hour change!!!
            EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 0., Lon, dUTCval);
            myD1 = EfArr[4];
            sgn1 = Math.sign(myD1);
            EfArr = Utils.ReadDataFromResourceString(nDay, nMonth, nYear, 0., Lon, dUTCval);
            myD2 = EfArr[4];
            sgn2 = Math.sign(myD2);
            if (sgn1 === sgn2) {                                     // SOLSTICE possibly HAPPENS at next day
                aMoment = nMoment;
                sYear = moment(aMoment).format('YYYY');
                sMonth = moment(aMoment).format('MM');
                sDay = moment(aMoment).format('DD');
                nMoment = aMoment.add(1, 'day');     //Next day
                nYear = moment(nMoment).format('YYYY');
                nMonth = moment(nMoment).format('MM');
                nDay = moment(nMoment).format('DD');
            }
        }
        EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, 0., Lon, dUTCval);
        myD1 = EfArr[4];
        EfArr = Utils.ReadDataFromResourceString(nDay, nMonth, nYear, 0., Lon, dUTCval);
        myD2 = EfArr[4];
        solstice = myD1 / (myD1 - myD2) * 24;    //Time when Declination's Hour change equals 0
        //WINTER SolDay = moment(aMoment).format("YYYY-MM-DD");
        SolDay = sYear + "-" + sMonth + "-" + sDay;
        SolTime = Utils.grad_number2text(solstice, digits, delm2);
        s1 = SolDay + " " + SolTime;
        winterSolstice.textContent = s1;
        if(!window.varsValue.winterSolstice)   window.varsValue.winterSolstice =s1;

        //Define min height
        EfArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, (solstice - dUTCval), Lon, dUTCval);
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
        s1=Utils.grad_number2text(resArr[1], digits, delm);
        //minHeight.textContent = s1;
        window.varsValue.winterMaxHeight =s1;
        window.varsValue.eclipticDeclination = eclipticDecl;
        return eclipticDecl;
    }

}