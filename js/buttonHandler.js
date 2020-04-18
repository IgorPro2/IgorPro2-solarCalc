;(function () {
    'use strict';
    let latGrad = document.getElementById("latGrad");
    let latMin = document.getElementById("latMin");
    let latSec = document.getElementById("latSec");
    let dateYear = document.getElementById("dateYear");
    let dateMonth = document.getElementById("dateMonth");
    let dateDay = document.getElementById("dateDay");
    let timeHour = document.getElementById("timeHour");
    let timeMin = document.getElementById("timeMin");
    let timeSec = document.getElementById("timeSec");
    var nDigits = document.getElementById("nDigits");
    var digits = Number(nDigits.value);

    let eclipticAngle;
    // if (!window.varsValue.eclipticDeclination) {eclipticAngle = Utils.calcEquinoxSolstice();}
    // else {eclipticAngle = window.varsValue.eclipticDeclination}
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

    let sMoment, aMoment, sYear, sMonth, sDay, ht, mt, st, curTime;


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
            var target = e.target;
            var action = target.getAttribute('data-action');
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
    }

    let graphicsButtons = document.getElementById('topRightGraphicsButtons');
    let mainPageButtons = document.getElementById('mainPageButtons');

    let graphicButtonsHandler = new ButtonHandler(graphicsButtons);
    let mainPageButtonsHandler = new ButtonHandler(mainPageButtons);
})();