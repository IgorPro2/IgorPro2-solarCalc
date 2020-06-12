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

    let sMoment, aMoment, curTime;


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
        this.sunDial = function (target) {
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
        this.showSunDial = function (target){
            Utils.drawSunDial();
        };
        this.shadowMap = function (target){
            let AoAxyz =[ [5342.63,4624.05,6.00],[5349.48,4622.49,6.00],[5348.64,4619.01,6.00],[5349.72,4618.77,6.00],[5348.85,4615.02,6.00],[5347.76,4615.19,6.00],[5346.96,4611.76,6.00],[5340.15,4613.37,6.00],[5345.89,4623.33,10.00],[5343.46,4612.57,10.00],[5349.31,4616.99,10.00],[5344.77,4617.92,10.00] ];
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

            let options = {
                AoA: AoAxyz,
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
            };

            Utils.drawShadow(options);
        };

        }

    let graphicsButtons = document.getElementById('topRightGraphicsButtons');
    let mainPageButtons = document.getElementById('mainPageButtons');

    let graphicButtonsHandler = new ButtonHandler(graphicsButtons);
    let mainPageButtonsHandler = new ButtonHandler(mainPageButtons);
})();