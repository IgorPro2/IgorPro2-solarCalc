;(function () {
    'use strict';
    let latGrad = document.getElementById("latGrad");
    let latMin = document.getElementById("latMin");
    let latSec = document.getElementById("latSec");

    let eclipticAngle = Utils.calcEquinoxSolstice();
    let NorthCircleLat = Utils.grad_number2text((90-eclipticAngle), undefined, undefined, undefined, true);
    let NorthTropicLat = Utils.grad_number2text(eclipticAngle, undefined, undefined, undefined, true);
    let SouthCircleLat = Utils.grad_number2text((eclipticAngle-90), undefined, undefined, undefined, true);
    let SouthTropicLat = Utils.grad_number2text((eclipticAngle*-1), undefined, undefined, undefined, true);

    let userB= document
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
            let B,L;
            B = window.varsValue.B;
            L = window.varsValue.L;
            B = Utils.grad_number2text(B, nDigits, undefined, undefined, true);
            latGrad.value = B[3]+B[0];        latMin.value =  B[1];        latSec.value =  B[2];
            L = Utils.grad_number2text(L, nDigits, undefined, undefined, true);
            lonGrad.value = L[3]+L[0];        lonMin.value =  L[1];        lonSec.value =  L[2];
            Utils.showGraphic();

        };
        this.setNorthPole = function (target) {
            latGrad.value = "90";            latMin.value = "00";            latSec.value = "00";
            Utils.showGraphic();
        };
        this.setSouthPole = function (target) {
            latGrad.value = "-90";            latMin.value = "00";            latSec.value = "00";
            Utils.showGraphic();
        };
        this.setEquator = function (target) {
            latGrad.value = "00";            latMin.value = "00";            latSec.value = "00";
            Utils.showGraphic();
        };
        this.setNorthCircle = function (target) {
            latGrad.value = NorthCircleLat[0];  latMin.value = NorthCircleLat[1];  latSec.value = NorthCircleLat[2];
            Utils.showGraphic();
        };
        this.setNorthTropic = function (target) {
            latGrad.value = NorthTropicLat[0];  latMin.value = NorthTropicLat[1];  latSec.value = NorthTropicLat[2];
            Utils.showGraphic();
        };
        this.setSouthCircle = function (target) {
            latGrad.value = SouthCircleLat[3]+SouthCircleLat[0];  latMin.value = SouthCircleLat[1];  latSec.value = SouthCircleLat[2];
            Utils.showGraphic();
        };
        this.setSouthTropic = function (target) {
            latGrad.value = SouthTropicLat[3]+SouthTropicLat[0];  latMin.value = SouthTropicLat[1];  latSec.value = SouthTropicLat[2];
            Utils.showGraphic();
        };
        this.setHerePlace = function (target) {
            Utils.getLocation(function (err) {
                if (err) return console.error(err);
                Utils.showGraphic();
            });
        };

    }

    let graphicsButtons = document.getElementById('topRightGraphicsButtons');
    let mainPageButtons = document.getElementById('mainPageButtons');

    let graphicButtonsHandler = new ButtonHandler(graphicsButtons);
    let mainPageButtonsHandler = new ButtonHandler(mainPageButtons);
})();