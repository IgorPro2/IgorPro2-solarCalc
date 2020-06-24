// THIS MODULE HANDLES ACTIONS CALLED BY DROPDOWN BUTTONS ON GRAPHIC PAGE
;(function () {
    'use strict';
    let latGrad = document.getElementById("latGrad");
    let latMin = document.getElementById("latMin");
    let latSec = document.getElementById("latSec");
    let lonGrad = document.getElementById("lonGrad");
    let lonMin = document.getElementById("lonMin");
    let lonSec = document.getElementById("lonSec");
    let dateYear = document.getElementById("dateYear");
    let dateMonth = document.getElementById("dateMonth");
    let dateDay = document.getElementById("dateDay");
    let timeHour = document.getElementById("timeHour");
    let timeMin = document.getElementById("timeMin");
    let timeSec = document.getElementById("timeSec");
    let nDigits = document.getElementById("nDigits");
    let dUTC = document.getElementById("dUTC");
    let sDay = dateDay.value;
    let sMonth = dateMonth.value;
    let sYear = dateYear.value;
    let ht = timeHour.value;
    let mt = timeMin.value;
    let st = timeSec.value;
    let dUTCval = +dUTC.value;

    let Home = [ [5342.27,4624.58,0,6],[5346.09,4623.70,0,9.5],[5349.99,4622.80,0,6],[5349.18,4619.38,0,6],
        [5350.11,4619.160,0,6],[5349.55,4616.83,0,9.5],[5348.98,4614.48,0,6],[5348.08,4614.71,0,6],
        [5347.27,4611.28,0,6],[5343.45,4612.16,0,9.5],[5338.90,4613.22,0,5.44],[5340.09,4618.24,0,5.44], [5340.83,4618.09,0,6]  ];
    let Roof = [ [5346.09,4623.70,0,9.5], [5344.77,4617.92,0,9.5], [5349.55,4616.83,0,9.5], [5344.77,4617.92,0,9.5], [5343.45,4612.16,0,9.5]];
    let Fence1 = [ [5345.26,4633.94,1.8], [5346.27,4631.93,1.8], [5354.45,4629.62,1.8], [5354.40,4629.43,1.8], [5346.11,4631.77,1.8], [5345.14,4633.71,1.8]];
    let Fence2 = [ [5340.79,4635.33,0,2.1], [5345.26,4633.94,0,2.1], [5345.19,4633.70,0,2.1], [5340.72,4635.09,0,2.1] ];
    let Fence3 = [ [5338.92,4627.15,0,2.15], [5339.50,4629.70,0,2.15], [5339.75,4629.66,0,2.15], [5339.17,4627.10,0,2.15] ];
    let Fence4 = [ [5338.33,4624.53,0,2.35], [5338.92,4627.15,0,2.35], [5339.17,4627.10,0,2.35], [5338.57,4624.490,0,2.35] ];
    let Fence5 = [ [5337.74,4621.94,0,2.55], [5338.33,4624.53,0,2.55], [5338.57,4624.49,0,2.55], [5337.99,4621.89,0,2.55] ];
    let Fence6 = [ [5337.16,4619.35,0,2.75], [5337.74,4621.94,0,2.75], [5337.99,4621.890,0,2.75], [5337.40,4619.30,0,2.75] ];
    let Fence7 = [ [5343.63,4609.99,0,2.00], [5339.85,4611.25,0,2.00], [5339.93,4611.49,0,2.00], [5343.71,4610.23,0,2.00] ];
    let Fence8 = [ [5339.85,4611.25,0,3.00], [5336.67,4612.320,0,3.00], [5338.71,4618.51,0,3.00], [5338.96,4618.46,0,3.00], [5336.99,4612.47,0,3.00], [5339.93,4611.49,0,3.00] ];



    // let Home4corners3d = [ [5342.27,4624.58,5.9,6],[5349.99,4622.80,5.9,6], [5347.27,4611.28,5.9,6],[5338.90,4613.22,5.9,6] ];
    // let Foot4corners3d = [ [5342,4620,0,6], [5343,4620,0,6], [5343,4619,0,6],[5342,4619,0,6] ];

    let objects4shadow = [ Home, Roof, Fence1, Fence2, Fence3, Fence4, Fence5, Fence6, Fence7, Fence8];
    //let objects4shadow = [ Home4corners3d, Foot4corners3d ];

    let sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;

    let lat = Utils.grad_textGMS2number(latGrad.value, latMin.value , latSec.value);
    let lon = Utils.grad_textGMS2number(lonGrad.value, lonMin.value , lonSec.value);
    let temp = document.getElementById("temp").value;
    let press = document.getElementById("press").value;



    let eclipticAngle;
    Utils.takeEquinoxSolsticeAE();
    eclipticAngle = window.varsValue.eclipticDeclination;

    let NorthCircleLat = Utils.grad_number2text((90-eclipticAngle), 2, undefined, undefined, true);
    let NorthTropicLat = Utils.grad_number2text(eclipticAngle, 2, undefined, undefined, true);
    let SouthCircleLat = Utils.grad_number2text((eclipticAngle-90), 2, undefined, undefined, true);
    let SouthTropicLat = Utils.grad_number2text((eclipticAngle*-1), 2, undefined, undefined, true);

    let springTime = window.varsValue.springEquinox;
    let summerTime = window.varsValue.summerSolstice;
    let autumnTime = window.varsValue.autumnEquinox;
    let winterTime = window.varsValue.winterSolstice;

    let aMoment, curTime;


    //Button Handler Class
    function ButtonHandler(elem) {
        ////////////////
        //INITIALIZATION
        ////////////////
        let self = this;
        if (elem.addEventListener) {
            elem.addEventListener("click", changeTool);
        } else { // IE8-
            elem.attachEvent("onclick", changeTool);
        }

        function changeTool(e) {
            let target = e.target;
            let action = target.getAttribute('data-action');
            action && target.blur();        //blur only elements with actions
            if (action) {
                self[action](target);
            }
        }

        ////////////////
        //HANDLERS
        ////////////////
        ////////////////
        //MAIN BUTTONS
        /////////////////

        this.showResults = function (target) {
            Utils.show_results();
        };
        this.showResultTimer = function (target) {
            Utils.showResultTimer();
        };
        this.showGraphic = function (target) {
            Utils.showGraphic();
        };
        this.calcTimeAtGivenHA = function (target) {
            Utils.calcTimeAtGivenHA();
        };


        ////////////////
        //GRAPHIC BUTTONS
        /////////////////


        this.setGivenPlace = function (target) {
            //Utils.show3D();
            let B, L;
            B = window.varsValue.B;
            L = window.varsValue.L;
            B = Utils.grad_number2text(B, nDigits, undefined, undefined, true);
            latGrad.value = B[3] + B[0];
            latMin.value = B[1];
            latSec.value = B[2];
            L = Utils.grad_number2text(L, nDigits, undefined, undefined, true);
            lonGrad.value = L[3] + L[0];
            lonMin.value = L[1];
            lonSec.value = L[2];
            Utils.showGraphic();

        };
        this.setNorthPole = function (target) {
            latGrad.value = "90";
            latMin.value = "00";
            latSec.value = "00";
            Utils.showGraphic();
        };
        this.setSouthPole = function (target) {
            latGrad.value = "-90";
            latMin.value = "00";
            latSec.value = "00";
            Utils.showGraphic();
        };
        this.setEquator = function (target) {
            latGrad.value = "00";
            latMin.value = "00";
            latSec.value = "00";
            Utils.showGraphic();
        };
        this.setNorthCircle = function (target) {
            latGrad.value = NorthCircleLat[0];
            latMin.value = NorthCircleLat[1];
            latSec.value = NorthCircleLat[2];
            Utils.showGraphic();
        };
        this.setNorthTropic = function (target) {
            latGrad.value = NorthTropicLat[0];
            latMin.value = NorthTropicLat[1];
            latSec.value = NorthTropicLat[2];
            Utils.showGraphic();
        };
        this.setSouthCircle = function (target) {
            latGrad.value = SouthCircleLat[3] + SouthCircleLat[0];
            latMin.value = SouthCircleLat[1];
            latSec.value = SouthCircleLat[2];
            Utils.showGraphic();
        };
        this.setSouthTropic = function (target) {
            latGrad.value = SouthTropicLat[3] + SouthTropicLat[0];
            latMin.value = SouthTropicLat[1];
            latSec.value = SouthTropicLat[2];
            Utils.showGraphic();
        };
        this.setHerePlace = function (target) {
            Utils.getLocation(function (err) {
                if (err) return console.error(err);
                Utils.showGraphic();
            });
        };
        this.showNow = function (target) {
            Utils.getNow();
            Utils.showGraphic();
        };
        this.showSpring = function (target) {
            sMoment = springTime;
            setInput(sMoment);
            Utils.showGraphic();
        };
        this.showSummer = function (target) {
            sMoment = summerTime;
            setInput(sMoment);
            Utils.showGraphic();
        };
        this.showAutumn = function (target) {
            sMoment = autumnTime;
            setInput(sMoment);
            Utils.showGraphic();
        };
        this.showWinter = function (target) {
            sMoment = winterTime;
            setInput(sMoment);
            Utils.showGraphic();
        };
        this.plus1month = function (target) {
            sDay = dateDay.value;
            sMonth = dateMonth.value;
            sYear = dateYear.value;
            ht= timeHour.value;
            mt= timeMin.value;
            st= timeSec.value;
            curTime = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":"+ mt + ":" + st;
            aMoment = moment(curTime, "").add(1, 'month');
            sMoment = moment(aMoment).format('YYYY MM DD HH:mm:ss');
            setInput(sMoment);
            Utils.showGraphic();
        };

        function setInput(aTime) {
            sMoment = aTime;
            aMoment = moment(sMoment, "");
            sYear = moment(aMoment).format('YYYY');
            sMonth = moment(aMoment).format('MM');
            sDay = moment(aMoment).format('DD');
            ht = moment(aMoment).format('HH');
            mt = moment(aMoment).format('mm');
            st = moment(aMoment).format('ss');
            dateYear.value = sYear;
            dateMonth.value = sMonth;
            dateDay.value = sDay;
            timeHour.value = ht;
            timeMin.value = mt;
            timeSec.value = st;
        }

        this.dayTable = function (target) {
            let dayArr = Utils.dataDeliveryDay2AoA();    //Return Array of  Arrays of results
            let ws = XLSX.utils.aoa_to_sheet(
                // [
                //     ['#', 'Name', 'Age'],
                //     [1, 'John', 32],
                //     [2, 'Phil', 43]
                // ]
                dayArr
            );
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'SunDayValues');

            //create and downloading workbook
            XLSX.writeFile(wb, 'DaysValue.xlsx');


        };
        this.yearTable = function (target) {
            let yearArr = Utils.dataDeliveryYear2AoA();   //Return Array of  Arrays of results
            let ws = XLSX.utils.aoa_to_sheet(yearArr);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'SunYearValues');
            //create and downloading workbook
            XLSX.writeFile(wb, 'YearsValue.xlsx');

        };
        this.sunDialTable = function (target) {
            let arr = Utils.sunDials2AoA();     //Return Array of  Arrays of results
            // let ws1 = XLSX.utils.aoa_to_sheet(arr[0]);
            // let ws2 = XLSX.utils.aoa_to_sheet(arr[1]);
            let ws3 = XLSX.utils.aoa_to_sheet(arr[2]);
            // let wb = XLSX.utils.book_new();
            // XLSX.utils.book_append_sheet(wb, ws1, 'Annalemas');
            // XLSX.utils.book_append_sheet(wb, ws2, 'HourLines');
            // XLSX.utils.book_append_sheet(wb, ws3, 'allSunDial');
            // //create and downloading workbook
            // XLSX.writeFile(wb, 'SunDial.xlsx');
            let wbcsv = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wbcsv, ws3, 'all');
            XLSX.writeFile(wbcsv, 'SunDialAll.csv');

        };
        this.showCadran = function (target){
            Utils.drawSunDial();
        };

        this.csvObjectImport = function (target){
            //stub
        };

        this.shadowMap = function (target){
            let sYear = document.getElementById("dateYear").value;
            let sMonth  = document.getElementById("dateMonth").value;
            let sDay = document.getElementById("dateDay").value;
            let ht = document.getElementById("timeHour").value;
            let mt = document.getElementById("timeMin").value;
            let st = document.getElementById("timeSec").value;
            let sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
            let lat = Utils.grad_textGMS2number(latGrad.value, latMin.value , latSec.value);
            let lon = Utils.grad_textGMS2number(lonGrad.value, lonMin.value , lonSec.value);
            let dUTCval = document.getElementById("dUTC").value;
            let temp = document.getElementById("temp").value;
            let press = document.getElementById("press").value;

            //if ( window.varsValue.userObjects) objects4shadow = window.varsValue.userObjects;

            let resArr = Utils.scaleAoA4Drawing(objects4shadow[0], 4);   //define scales from first object
            let scale =resArr [1];
            scale = scale/ 3;
            let minx = resArr [2];
            let maxx = resArr [3];
            let miny = resArr [4];
            let maxy = resArr [5];

            let options = {
                AoA: objects4shadow,                   //[ AoAxyz,  AoAxyz2 ],
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                Scale: scale,
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy,
            };
            let resArr2 = Utils.calcObjectShadow (options);

            let options2 = {
                AoA: resArr2
            };

            Utils.drawShadow(options2);
        };

        this.shadowMap3D = function (objectsAoA){
            let sYear = document.getElementById("dateYear").value;
            let sMonth  = document.getElementById("dateMonth").value;
            let sDay = document.getElementById("dateDay").value;
            let ht = document.getElementById("timeHour").value;
            let mt = document.getElementById("timeMin").value;
            let st = document.getElementById("timeSec").value;
            let sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
            let lat = Utils.grad_textGMS2number(latGrad.value, latMin.value , latSec.value);
            let lon = Utils.grad_textGMS2number(lonGrad.value, lonMin.value , lonSec.value);
            let dUTCval = document.getElementById("dUTC").value;
            let temp = document.getElementById("temp").value;
            let press = document.getElementById("press").value;
            let minSunHeight = 5;

            let options = {
                AoA: objects4shadow,               // Array of objects  [x,y,zLow,zUp], [x,y,zLow zUp],........
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                minSunHeight: minSunHeight
            };
            let shadArr = Utils.calcObjectsShadow3D (options);

            let options2 = {
                AoAshadows: shadArr,
                AoAobjects: objects4shadow,        // [ Home3d,  Roof3d,  Fence23d ]
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                minSunHeight: minSunHeight
            };

            Utils.drawShadow3D(options2 );
        };

        this.dayShadowAnim = function (target){
            let sYear = document.getElementById("dateYear").value;
            let sMonth  = document.getElementById("dateMonth").value;
            let sDay = document.getElementById("dateDay").value;
            let ht = document.getElementById("timeHour").value;
            let mt = document.getElementById("timeMin").value;
            let st = document.getElementById("timeSec").value;
            let sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
            let lat = Utils.grad_textGMS2number(latGrad.value, latMin.value , latSec.value);
            let lon = Utils.grad_textGMS2number(lonGrad.value, lonMin.value , lonSec.value);
            let dUTCval = document.getElementById("dUTC").value;
            let temp = document.getElementById("temp").value;
            let press = document.getElementById("press").value;
            let minSunHeight = 5;

            let options = {
                AoA: objects4shadow,                     //[ AoAxyz,  AoAxyz2 ],
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                minSunHeight: minSunHeight,
            };
            Utils.shadowAnimationDay3D(options);
        };

        this.yearShadowAnim = function (target){
            let sYear = document.getElementById("dateYear").value;
            let sMonth  = document.getElementById("dateMonth").value;
            let sDay = document.getElementById("dateDay").value;
            let ht = document.getElementById("timeHour").value;
            let mt = document.getElementById("timeMin").value;
            let st = document.getElementById("timeSec").value;
            let sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
            let lat = Utils.grad_textGMS2number(latGrad.value, latMin.value , latSec.value);
            let lon = Utils.grad_textGMS2number(lonGrad.value, lonMin.value , lonSec.value);
            let dUTCval = document.getElementById("dUTC").value;
            let temp = document.getElementById("temp").value;
            let press = document.getElementById("press").value;
            let minSunHeight = 5;

            let options = {
                AoA: objects4shadow,                     //[ AoAxyz,  AoAxyz2 ],
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                minSunHeight: minSunHeight,
            };
            Utils.shadowAnimationYear3D(options);
        };



    }

    let graphicsButtons = document.getElementById('topRightGraphicsButtons');
    let mainPageButtons = document.getElementById('mainPageButtons');

    let graphicButtonsHandler = new ButtonHandler(graphicsButtons);
    let mainPageButtonsHandler = new ButtonHandler(mainPageButtons);
})();