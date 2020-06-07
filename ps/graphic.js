//////////////////////////////////////////////////////
////////PAPERSCRIPT (var instead of let/const)////////
//////////////////////////////////////////////////////
;(function () {

    var graphicContainer = document.getElementById("graphicContainer");
    var calcContainer = document.getElementById("calcContainer");
    var latGrad = document.getElementById("latGrad");
    var latMin = document.getElementById("latMin");
    var latSec = document.getElementById("latSec");
    var lonGrad = document.getElementById("lonGrad");
    var lonMin = document.getElementById("lonMin");
    var lonSec = document.getElementById("lonSec");
    var dateYear = document.getElementById("dateYear");
    var dateMonth = document.getElementById("dateMonth");
    var dateDay = document.getElementById("dateDay");
    var timeHour = document.getElementById("timeHour");
    var timeMin = document.getElementById("timeMin");
    var timeSec = document.getElementById("timeSec");
    var dUTC = document.getElementById("dUTC");
    var sDay = dateDay.value;
    var sMonth = dateMonth.value;
    var sYear = dateYear.value;
    var sDay3M = sDay;                 //Variable for changing in function show3Month
    var sMonth3M = sMonth;              //Variable for changing in function show3Month
    var sYear3M = sYear;                //Variable for changing in function show3Month
    var ht = timeHour.value;
    var mt = timeMin.value;
    var st = timeSec.value;
    var dUTCval = +dUTC.value;
    var curTime = Utils.grad_textGMS2number(ht, mt, st);
    var utcTime = curTime - Utils.grad_textGMS2number(dUTCval, "0", "0");
    var axisColor = new Color(0.6);
    var fontSunColor = 'red';
    var sunColor = 'yellow';
    var sunColorDark = 'blue';
    var axisFont = 'Courier New';
    var fontAxisColor = new Color(0.6);
    var axisFontWeight = 'normal';
    var sunFont = 'Arial';
    var sunFontWeight = 'normal';
    var whiteColor = 'white';
    var blackColor =  new Color(0.4);
    // var nightFillColor = new Color(0.9);
    var civilTwilightColor = new Color(0.8);
    var nauticalTwilightColor = new Color(0.6);
    var astronomicTwilightColor = new Color(0.1);

    var nightFillColor = new Color(0, 0, 1, 0.1);
    // var civilTwilightColor = new Color(0, 0, 1, 0.3);
    // var nauticalTwilightColor = new Color(0, 0, 1, 0.7);
    // var astronomicTwilightColor = new Color(0, 0, 1, 1);


    var skyColor = new Color(0, 0, 1, 0.3);
    //skyColor = 'white';
    var yearPathColor = new Color(1, 0, 0, 0.5);
    yearPathColor ='magenta';

    var delimiter1 = document.getElementById("delmGMS");
    var delm = delimiter1.value;
    var delimiter2 = document.getElementById("delmHMS");
    var delm2 = delimiter2.value;

    ////////////////////////////////          DEFINE DRAW DIMENSIONS window.Utils.defineDimensions                /////////
    // MAXIMUM DIMENSIONS on Azimuth (X axis) will be 360 pixel. At Height (Y axis) From +90° to -90° = 180° ) Thus Scale will be:
    var tic, ox, oy, tx, ty, s, lx, ly, less, xt1, yt1, text;
    var from, to, axisX, axisY, boundRect, civilTwilight, nauticalTwilight, astronomicTwilight ;
    var width, height, hFont, SunRadius, TicRadius;
    var gap = 4;                        //Pixels from screen edge to sketch
    var dx = 360;                       //range on axis  X-azimuth
    var dy = 180;                       //range on axis  Y-height


    window.Utils.defineDimensions = function () {
        /////////////////////////////////////////////////      DEFINE DRAW DIMENSIONS          /////////////////////////////////

        // MAXIMUM DIMENSIONS on Azimuth (X axis) will be 360 pixel. At Height (Y axis) From +90° to -90° = 180° ) Thus Scale will be:
        //var tic, ox, oy, s, lx, ly, less;
        //var from, to, axisX, axisY, boundRect;

        paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
        width = paper.view.viewSize.width;
        height = paper.view.viewSize.height;

        tx = (width - 2 * gap) / dx;    //scale on axis X
        ty = (height - 2 * gap) / dy;   //scale on axis Y
        if (tx > ty) less = ty;             // Take smallest scale for proportional draw (the same scale on both axises)
        else less = tx;
        s = less;                           // s - is a scale: Pixels amount in one Degree°
        ox = width / 2;                     // Origin of X axis in pixels
        oy = height / 2;                    // Origin of Y axis in pixels
        lx = dx * s / 2;                    // Half length of X axis in pixels (the same scale on both axises)
        ly = dy * s / 2;                    // Half length of Y axis in pixels (the same scale on both axises)
        tic = less;                         // length of tics on axis

        hFont = less * 2.5;
        if (hFont < 12) hFont = 12;

    };


////////////////////////////////////////////      HIDE GRAPHICS    //////////////////////////
    window.Utils.hideGraphic = function () {
        !graphicContainer.classList.contains("hidden") && graphicContainer.classList.toggle("hidden");
        calcContainer.classList.contains("hidden") && calcContainer.classList.toggle("hidden");
        window.currentAction = "calc";
        paper.project._activeLayer.clear();
        var layers = paper.project.layers;
        for (i = 0; i < layers.length - 1; i++) {
            layers[i].clear();
        }
    };

///////////   SHOW GRAPHIC   SHOW GRAPhIC   SHOW GRAPHIC   SHOW GRAPhIC SHOW GRAPHIC   SHOW GRAPhIC   SHOW GRAPHIC  ////
/////////////////////////////////////////////        SUN PATH AT GIVEN DAY          ////////////////////////////////////
    window.Utils.showGraphic = function (redraw) {
        window.Utils.calcSunRise();           // to calculate polarDay for gradient
        window.Utils.showDayDuration();       // to calculate polarDay for gradient
        window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
        graphicContainer.classList.contains("hidden") && graphicContainer.classList.toggle("hidden");
        !calcContainer.classList.contains("hidden") && calcContainer.classList.toggle("hidden");
        window.currentAction = "graphic";
        var axisLayer = new Layer();
        axisLayer.name = "axisLyr";

        //////////////////////////////////////      CLEAR ALL LAYERS BEFORE DRAWING
        var layers = paper.project.layers;
        for (i = 0; i < layers.length - 1; i++) {
            layers[i].clear();
            //console.log("Layer2Clear= "+layers[i].name);
        }
        paper.project._activeLayer.clear();

        Utils.calcSunRise();                      // force max.heigt calculation
        Utils.show_results();                     // fill main page after .this return

        ////////////////////////////////          DEFINE DRAW DIMENSIONS
        window.Utils.defineDimensions();
        //////////////////////////////////////      DRAW AXIS
        window.Utils.drawAxis();

        /////////////////////////////////////////////         DAY PATH            //////////////////////////////////////////
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        sDay3M = sDay;
        sMonth3M = sMonth;
        sYear3M = sYear;

        var dayPathLayer = new Layer();
        dayPathLayer.name = "dayPathLyr";
        options = {Day: sDay, Month: sMonth, Year: sYear, Scale: s, xOrigin: ox, yOrigin: oy, isPrint: false};
        window.Utils.dayPath(options);

        ///////////////////////////////////////////////         DAY  ANIMATION; TEXT;         //////////////////////////////
        var dayAnimLayer = new Layer();
        dayAnimLayer.name = "dayAnimLyr";
        options = {Day: sDay, Month: sMonth, Year: sYear, Scale: s, xOrigin: ox, yOrigin: oy};
        window.Utils.dayAnimation(options);

        ////////////////////////////////////////////      YEAR PATH AT  90° x 180° RESOLUTION     //////////////////////////

        var yearPathLayer = new Layer();
        yearPathLayer.name = "yearPathLyr";
        ht = timeHour.value;
        mt = timeMin.value;
        st = timeSec.value;
        options = {
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            Hour: ht,
            Minute: mt,
            Second: st,
            dUTC: dUTCval,
            Scale: s,
            xOrigin: ox,
            yOrigin: oy
        };
        window.Utils.yearPath(options);

        ////////////////////////////     YEAR ANIMATION; TEXT;    /////////////////////////////
        var yearAnimLayer = new Layer();
        yearAnimLayer.name = "yearAnimLyr";
        options = {
            Day: sDay,
            Month: sMonth,
            Year: sYear,
            Hour: ht,
            Minute: mt,
            Second: st,
            dUTC: dUTCval,
            Scale: s,
            xOrigin: ox,
            yOrigin: oy
        };
        window.Utils.yearAnimation(options);

    };

    var debouncedShowGraphic = window._.debounce(window.Utils.showGraphic, 300);

    paper.view.onResize = function () {
        if (window.currentAction === 'graphic') debouncedShowGraphic();
    };

////////////////////////////////////////////            TOGGLE PAUSING ONCLICK    //////////////////////////////////////
    var isPaused = false;
    tool.onMouseDown = function (event) {
        // Pause/Unpause View at mouse click
        if (isPaused) {
            isPaused = false;
            view.play();
        } else {
            isPaused = true;
            view.pause();
        }
    };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    window.Utils.drawAxis = function (options) {

        //console.log('From drawAxis','width=',width, 'height=',height, 'ox=', ox, 'oy=',oy, 'lx=',lx,'gap=',gap,'tic=',tic);
        from = new Point(gap, gap);   // BOUNDARY RECT EMPTY
        to = new Point(width - gap, height - gap);
        boundRect = new Path.Rectangle(from, to);
        //boundRect.strokeColor = whiteColor;
        //boundRect.fillColor = skyColor;


        //////////////////////////////////   NIGHT RECTANGLES FILLING   //////////////////////////////////////
        {
            from = new Point(ox - lx, oy);
            to = new Point(ox + lx, height - gap);
            boundRect = new Path.Rectangle(from, to);
            boundRect.strokeColor = whiteColor;
            boundRect.fillColor = 'black';

            from = new Point(ox - lx, oy);
            to =   new Point(ox + lx, oy + 18 * s);
            var gradTop = new Point(ox , oy);
            var gradBottom = new Point(ox , oy + 18 * s);

            if (window.varsValue.commonDay) {
                var path = new Path.Rectangle({
                    topLeft: from,
                    bottomRight: to,
                    // Fill the path with a gradient of 4 color stops, that runs between the two points we defined earlier:
                    fillColor: {
                        gradient: {
                            stops: ['yellow', 'red', 'blue', 'black']
                        },
                        origin: gradTop,
                        destination: gradBottom
                    }
                });
            }
            else {

            }
        }

        ////////////////////////////////////////////////   AXIS X   ////////////////////////////////////////////////
        {
            axisX = new Path({strokeColor: axisColor, strokeWidth: 1});
            axisX.add(new Point(ox - lx, oy), new Point(ox + lx, oy));         // axis X
            text = new PointText({
                point: [ox - lx, oy - tic * 1.5],
                content: window.locales['northLb'],
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });
            axisY = new Path({strokeColor: axisColor, strokeWidth: 1});
            axisY.add(new Point(ox, oy - ly), new Point(ox, oy + ly));        // axis Y

            //Tics on X axis every 10 degrees
            for (i = 0; i < 36; i++) {
                axisX = new Path({strokeColor: axisColor});
                axisX.add(new Point((ox + 180 * s) - (10 * i * s), oy - tic / 2));                     //North 0
                axisX.add(new Point((ox + 180 * s) - (10 * i * s), oy + tic / 2));
            }

            axisX = new Path({strokeColor: axisColor});
            axisX.add(new Point(ox - 180 * s, oy - tic));                     //North 0
            axisX.add(new Point(ox - 180 * s, oy + tic));
            text = new PointText({
                point: [ox - lx, oy + tic * 3],
                content: '0°',
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });

            axisX = new Path({strokeColor: axisColor});
            axisX.add(new Point(ox - 90 * s, oy - tic));                      //East 90
            axisX.add(new Point(ox - 90 * s, oy + tic));
            text = new PointText({
                point: [ox - 90 * s, oy - tic * 1.5],
                content: window.locales['eastLb'],
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                justification: 'center'
            });
            text = new PointText({
                point: [ox, oy - tic * 1.5],
                content: window.locales['southLb'],
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                justification: 'center'
            });

            axisX = new Path({strokeColor: axisColor});
            axisX.add(new Point(ox + 90 * s, oy - tic));                     //West 270
            axisX.add(new Point(ox + 90 * s, oy + tic));
            text = new PointText({
                point: [ox + 90 * s, oy - tic * 1.5],
                content: window.locales['westLb'],
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                justification: 'center'
            });

            axisX = new Path({strokeColor: axisColor});
            axisX.add(new Point(ox + 180 * s, oy - tic));                    //North 360
            axisX.add(new Point(ox + 180 * s, oy + tic));
            text = new PointText({
                point: [ox + 180 * s, oy - tic * 1.5],
                content: window.locales['northLb'],
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                justification: 'right'
            });
            text = new PointText({
                point: [ox + 180 * s, oy + tic * 3],
                content: '360°',
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                justification: 'right'
            });
            //Arrow on X axis
            axisX = new Path({strokeColor: axisColor});
            axisX.add(new Point(ox + 180 * s, oy));                          //move 2 arrow
            axisX.add(new Point(ox + 180 * s - tic * 2, oy - tic));          //arrow X up
            axisX.add(new Point(ox + 180 * s - tic * 2, oy + tic));          //arrow X down
            axisX.add(new Point(ox + 180 * s, oy));                          //arrow X low
        }

        ////////////////////////////////// TWILIGHT  TEXT //////////////////////////////////////////
        {
            text = new PointText({
                point: [ox + tic, oy + 6 * s - 1.5*tic],
                content: window.locales['civilLb'],
                fillColor: 'yellow',
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });

            text = new PointText({
                point: [ox + tic, oy + 12 * s - 1.5*tic],
                content: window.locales['nauticalLb'],
                fillColor: civilTwilightColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });
            text = new PointText({
                point: [ox + tic, oy + 18 * s - 1.5*tic],
                content: window.locales['astronomicLb'],
                fillColor: 'white',
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });

        }

        ////////////////////////////////////////////////   AXIS Y ////////////////////////////////////////////////
        {
            //Tics on Y axis every 10 degrees
            for (i = 0; i < 18; i++) {
                axisY = new Path({strokeColor: axisColor});
                axisY.add(new Point(ox - tic / 2, (oy - 90 * s) + i * 10 * s));                     //North 0
                axisY.add(new Point(ox + tic / 2, (oy - 90 * s) + i * 10 * s));
            }
            axisY = new Path({strokeColor: axisColor});
            axisY.add(new Point(ox - tic, oy - 90 * s));
            axisY.add(new Point(ox + tic, oy - 90 * s));                     //zenith tic
            text = new PointText({
                point: [ox - tic * 8, oy - 90 * s + tic * 2],
                content: '+90°',
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });
            text = new PointText({
                point: [ox + tic * 3, oy - 90 * s + tic * 2],
                content: window.locales['zenithLb'],
                fillColor: fontAxisColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });

            axisY = new Path({strokeColor: axisColor});
            axisY.add(new Point(ox - tic, oy + 90 * s));
            axisY.add(new Point(ox + tic, oy + 90 * s));                     // nadir tic
            text = new PointText({
                point: [ox - tic * 8, oy + 90 * s - tic],
                content: '-90°',
                fillColor: nightFillColor,
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });
            text = new PointText({
                point: [ox + tic * 3, oy + 90 * s - tic],
                content: window.locales['nadirLb'],
                fillColor: 'lightgrey',
                fontFamily: axisFont,
                fontWeight: axisFontWeight,
                fontSize: hFont
            });

            //Arrow on Y axis
            axisY = new Path({strokeColor: axisColor});
            axisY.add(new Point(ox, oy - 90 * s));
            axisY.add(new Point(ox + tic, oy - 90 * s + tic * 2));           //arrow Y right
            axisY.add(new Point(ox - tic, oy - 90 * s + tic * 2));           //arrow Y left
            axisY.add(new Point(ox, oy - 90 * s));                     //arrow Y up
        }
    };

    window.Utils.dayPath = function (options) {
        var sYear = options.Year;
        var sMonth = options.Month;
        var sDay = options.Day;
        var s = options.Scale;
        var ox = options.xOrigin;
        var oy = options.yOrigin;
        var isPrintMoment = options.isPrint;

        var params = {Day: sDay, Month: sMonth, Year: sYear};
        var res = Utils.dataDeliveryDay(params);    //Array of 3 Arrays of Results
        var dayArr = res[0];    //Array of 1440 pairs of Ht,Az;Every 2 minute during a day. Starts from given time.
        var aTime = res[2];    //Array  of Time 2 for pairs of Ht,Az

        var pathD, tx2, diff, du, i, ct, text, localTime, jump, cur3month;
        var hFont, SunRadius, TicRadius, do0 = true, do6 = true, do12 = true, do18 = true, do24 = true;
        hFont = less * 2.5;
        SunRadius = less;
        TicRadius = less / 2;
        if (hFont < 12) hFont = 12;

        pathD = new Path({strokeColor: 'red'});
        //tx2 = dayArr[1];
        tx2 = ox - 180 * s + dayArr[1] * s;

        for (i = 0; i < (dayArr.length - 2); i = i + 2) {
            tx = ox - 180 * s + dayArr[i + 1] * s;
            ty = oy - dayArr[i] * s;
            // diff = Math.abs(dayArr[i + 1] - tx2);
            // tx2 = dayArr[i + 1];
            diff = Math.abs(tx - tx2);
            tx2 = tx;
            localTime = aTime[i / 2];
            //console.log("tx=" + tx.toFixed(2) + " ty=" + ty.toFixed(2) + " localTime=" + Utils.grad_number2text(localTime, 0, ":: ")+" diff= "+ diff.toFixed(0));
            // if (diff < 330) {
            if (diff < width/2 && diff < height/2) {
                pathD.add(new Point(tx, ty));
            } else {                                 //Not 2Draw strait line when Azimuth jumps from 360° to 0° !!!!
                pathD = new Path({strokeColor: 'red'});
                jump = i;
                //console.log("jump=" + jump);
            }
            if (do0 && localTime <= 1 / 60) {
                ct = new Shape.Circle({
                    center: new Point(tx, ty),
                    radius: TicRadius,
                    fillColor: "red",
                    strokeColor: "red"
                });
                text = new PointText({
                    point: [tx + tic / 2 * s, ty],
                    content: '0h',
                    fillColor: fontSunColor,
                    fontFamily: axisFont,
                    fontWeight: axisFontWeight,
                    fontSize: hFont
                });
                do0 = false;
                do24 = false;
            } else if (do6 && Math.abs((localTime - 6)) <= 1.1 / 60) {
                ct = new Shape.Circle({
                    center: new Point(tx, ty),
                    radius: TicRadius,
                    fillColor: "red",
                    strokeColor: "red"
                });
                text = new PointText({
                    point: [tx + tic / 2 * s, ty],
                    content: '6h',
                    fillColor: fontSunColor,
                    fontFamily: axisFont,
                    fontWeight: axisFontWeight,
                    fontSize: hFont
                });
                do6 = false;
            } else if (do12 && Math.abs((localTime - 12)) <= 1.1 / 60) {
                ct = new Shape.Circle({
                    center: new Point(tx, ty),
                    radius: TicRadius,
                    fillColor: "red",
                    strokeColor: "red"
                });
                text = new PointText({
                    point: [tx + tic / 2 * s, ty],
                    content: '12h',
                    fillColor: fontSunColor,
                    fontFamily: axisFont,
                    fontWeight: axisFontWeight,
                    fontSize: hFont
                });
                do12 = false;
            } else if (do18 && Math.abs((localTime - 18)) <= 1.1 / 60) {
                ct = new Shape.Circle({
                    center: new Point(tx, ty),
                    radius: TicRadius,
                    fillColor: "red",
                    strokeColor: "red"
                });
                text = new PointText({
                    point: [tx + tic / 2 * s, ty],
                    content: '18h',
                    fillColor: fontSunColor,
                    fontFamily: axisFont,
                    fontWeight: axisFontWeight,
                    fontSize: hFont
                });
                do18 = false;
            } else if (do24 && Math.abs((localTime - 24)) <= 1.1 / 60) {
                ct = new Shape.Circle({
                    center: new Point(tx, ty),
                    radius: TicRadius,
                    fillColor: "red",
                    strokeColor: "red"
                });
                text = new PointText({
                    point: [tx + tic / 2 * s, ty],
                    content: '24h',
                    fillColor: fontSunColor,
                    fontFamily: axisFont,
                    fontWeight: axisFontWeight,
                    fontSize: hFont
                });
                do24 = false;
                do0 = false;
            }
        }
        tx = ox - 180 * s + dayArr[1] * s;     //Draw to first point of Graph to close gap.
        ty = oy - dayArr[0] * s;
        pathD.add(new Point(tx, ty));
        // SHOW CURRENT SUN position   ( ox - 180 * s) = 0° degrees in Azimuth;  oy = 0° degrees in Height;
        var curPointX = ox - 180 * s + dayArr[1] * s;
        var curPointY = oy - dayArr[0] * s, x, y;
        var curPoint = new Point(curPointX, curPointY), rad;
        if (isPrintMoment) {
            rad = 8
        } else {
            rad = 10
        }
        var circle1 = new Shape.Circle({center: curPoint, radius: rad, fillColor: sunColor, strokeColor: fontSunColor});
        if (dayArr[0] < 0) circle1.fillColor = sunColorDark;
        else circle1.fillColor = sunColor;

        if (isPrintMoment) {
            var arr = aTime[1440].split(" ");
            cur3month = new PointText({
                fillColor: fontSunColor, fontFamily: sunFont, fontWeight: axisFontWeight,
                fontSize: hFont, point: [curPointX + 10, curPointY - 10], content: arr[0] + arr[1]
            });
        }
    };

    window.Utils.dayAnimation = function (options) {
        var sYear = options.Year;
        var sMonth = options.Month;
        var sDay = options.Day;
        var s = options.Scale;
        var ox = options.xOrigin;
        var oy = options.yOrigin;

        var params = {Day: sDay, Month: sMonth, Year: sYear};
        var res = Utils.dataDeliveryDay(params);    //Array of 3 Arrays of Results
        var dayArr = res[0];    //Array of 1440 pairs of Ht,Az;Every 2 minute during a day. Starts from given time.
        var aTime = res[2];    //Array  of Time 2 for pairs of Ht,Az
        var nDigits = document.getElementById("nDigits");
        var digits = Number(nDigits.value);

        /////////////////////////////////////////////    DAY ANIMATION AND TEXT   //////////////////////////////
        var grd,min,sec,nLat,lat,nLon,lon;
        grd = latGrad.value;        min = latMin.value;        sec = latSec.value;
        nLat = Utils.grad_textGMS2number(grd, min, sec);
        lat = Utils.grad_number2text(nLat, digits, delm);
        grd = lonGrad.value;        min = lonMin.value;        sec = lonSec.value;
        nLon = Utils.grad_textGMS2number(grd, min, sec);
        lon = Utils.grad_number2text(nLon, digits, delm);
        // debugger
        // lat = latGrad.value + "° " + latMin.value + "' " + latSec.value + '"';
        // lon = lonGrad.value + "° " + lonMin.value + "' " + lonSec.value + '"';

        var textLat = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 20],
            content: window.locales['latLb'] + lat
        });
        var textLon = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 40],
            content: window.locales['lonLb'] + lon
        });
        var textMoment = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 60],
            content: window.locales['momentLb'] + aTime[1440]
        });

        var textSunRiseSunSet = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 80],
            content: window.locales['sunRiseLb'] + Utils.grad_number2text(window.varsValue.sunRiseTime,digits,delm2) +
                " " + window.locales['sunSetLb'] + Utils.grad_number2text(window.varsValue.sunSetTime,digits,delm2) +
                " " +   window.locales['dayDurationLb'] + window.varsValue.dayDuration
        });


        var textDayCulminationTime = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 100],
            content: window.locales['culmTimeLb'] + window.varsValue.dayCulmTime
                + " " +   window.locales['maxHeightLb'] + " " +   window.varsValue.dayCulmHeight
        });

        var textDayTime = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 120]
        });

        /////////////////////  equinox/solstice and Day culmination/duration /////////////
        var textSpringEquinox = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 160],
            content:window.locales['springEquinoxLb']   + " " +  window.varsValue.springEquinox
        });
        var textSummerSolstice = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 180],
            content:window.locales['summerSolsticeLb'] + " " +  window.varsValue.summerSolstice
        });
        var textAutumnEquinox = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 200],
            content: window.locales['autumnEquinoxLb']   + " " +   window.varsValue.autumnEquinox
        });
        var textWinterSolstice = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 220],
            content: window.locales['winterSolsticeLb'] + " " +   window.varsValue.summerSolstice
        });

        //////////////////////////////// MOVING TEXT //////////////////////////
        var textH = new PointText({
            fillColor: fontSunColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont
        });
        var textA = new PointText({
            fillColor: fontSunColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont
        });

        /////////////////////////////////////////////////  DAY ANIMATION function(event)   /////////////////////////
        var curPointX = ox - 180 * s + dayArr[1] * s;
        var curPointY = oy - dayArr[0] * s, x, y;
        var curPoint = new Point(curPointX, curPointY);
        var k = 0;
        var circle1 = new Shape.Circle({center: curPoint, radius: 10, fillColor: sunColor, strokeColor: fontSunColor});
        var sunSetTime = window.varsValue.sunSetTime, sunRiseTime = window.varsValue.sunRiseTime;

        circle1.onFrame = function (event) {
            x = ox - 180 * s + dayArr[k + 1] * s;
            y = oy - dayArr[k] * s;
            circle1.position = new paper.Point(x, y);
            //Change sun to dark color if under horizon
            if (dayArr[k] < 0) {
                circle1.fillColor = sunColorDark;
                textH.fillColor = fontAxisColor;
                textA.fillColor = fontAxisColor;
            } else {
                circle1.fillColor = sunColor;
                textH.fillColor = fontSunColor;
                textA.fillColor = fontSunColor;
            }
            //H A output near moving SUN
            textH.point = new paper.Point(x + tic * 4, y);
            textH.content = "H=" + dayArr[k].toFixed(0) + "°";
            textA.point = new paper.Point(x + tic * 4, y + 14);
            textA.content = "A=" + dayArr[k + 1].toFixed(0) + "°";

            textDayTime.content = window.locales['dayAnimTimeLb'] + Utils.grad_number2text(aTime[k / 2], 0, delm2)
                + " " + window.locales['htRadioLb'] + " " +  dayArr[k].toFixed(1) + "°"
                + " " + window.locales['azRadioLb'] + " " +  dayArr[k + 1].toFixed(0) + "°";

            k = k + 2;
            if (k > dayArr.length - 1) k = 0;
        };

    };

    ////////////////////////////////////////////      YEAR PATH AT  90° x 180° RESOLUTION     //////////////////////////
    window.Utils.yearPath = function (options) {
        var sYear = options.Year;
        var sMonth = options.Month;
        var sDay = options.Day;
        var ht = options.Hour;
        var mt = options.Minute;
        var st = options.Second;
        var dUTCval = options.dUTC;
        var s = options.Scale;
        var ox = options.xOrigin;
        var oy = options.yOrigin;

        params = {Day: sDay, Month: sMonth, Year: sYear, aHour: ht, aMinute: mt, aSecond: st, dUTC: dUTCval};
        var res1 = Utils.dataDeliveryYear(params);   //Array of 2 Arrays of Results
        var yearArr = res1[0];    //Array of 365 pairs of Ht,Az; At this Time every Day in Year; Last 2pairs are: minH,minA,maxH,maxA
        var aDate = res1[1];    //Array  of Time  for each pairs of Ht,Az in res1[0] array
        var xt1, yt1, xt2, yt2, i, diff, pathY;
        pathY = new Path({strokeColor: yearPathColor});

        xt2 = ox - 180 * s + yearArr[1] * s;
        for (i = 0; i < (yearArr.length - 5); i = i + 2) {
            xt1 = ox - 180 * s + yearArr[i + 1] * s;
            yt1 = oy - yearArr[i] * s;
            diff = Math.abs(xt1 - xt2);        //Not 2Draw strait line when Azimuth jumps from 360° to 0° !!!!
            //console.log('diff='+diff.toFixed(1));
            xt2 = xt1;
            if (diff < width/2 && diff < height/2) {
                    pathY.add(new Point(xt1, yt1));
            } else {
                pathY = new Path({strokeColor: yearPathColor});
            }
            //console.log(" i="+ i + " aDate[]="+ aDate[i/2]+" Ht0="+yearArr[i].toFixed(1)+" Az0="+yearArr[i + 1].toFixed(1)+'diff='+diff.toFixed(1));
        }
        pathY.add(new Point(ox - 180 * s + yearArr[1] * s, oy - yearArr[0] * s));    //close line gap to 1-st point
    };

    window.Utils.yearAnimation = function (options) {
        var sYear = options.Year;
        var sMonth = options.Month;
        var sDay = options.Day;
        var ht = options.Hour;
        var mt = options.Minute;
        var st = options.Second;
        var dUTCval = options.dUTC;
        var s = options.Scale;

        params = {Day: sDay, Month: sMonth, Year: sYear, aHour: ht, aMinute: mt, aSecond: st, dUTC: dUTCval};
        var res1 = Utils.dataDeliveryYear(params);   //Array of 2 Arrays of Results
        var yearArr = res1[0];    //Array of 365 pairs of Ht,Az; At this Time every Day in Year; Last 2pairs are: minH,minA,maxH,maxA
        var aDate = res1[1];    //Array  of Time  for each pairs of Ht,Az in res1[0] array
        var curPoint, i, x, y;
        x = ox - 180 * s + yearArr[1] * s;
        y = oy - yearArr[0] * s;
        curPoint = new paper.Point(xt1, yt1);

        var textYearTime = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 140]
        });

        i = 0;
        var circle2 = new Shape.Circle({center: curPoint, radius: 6, fillColor: sunColor, strokeColor: fontSunColor});
        circle2.onFrame = function (event) {
            x = ox - 180 * s + yearArr[i + 1] * s;
            y = oy - yearArr[i] * s;
            circle2.position = new paper.Point(x, y);
            //Change sun to dark color if under horizon
            if (yearArr[i] < 0) {
                circle2.fillColor = sunColorDark; //textH.fillColor = fontAxisColor; textA.fillColor = fontAxisColor;
            } else {
                circle2.fillColor = sunColor; //textH.fillColor = fontSunColor; textA.fillColor = fontSunColor;
            }
            //H A output
            //textHYear.content = window.locales['yearHtLb'] + yearArr[i].toFixed(0) + "°";
            //textAYear.content = window.locales['yearAzLb'] + yearArr[i + 1].toFixed(0) + "°";
            textYearTime.content = window.locales['yearAnimTimeLb'] + aDate[i / 2]
                + " " + window.locales['htRadioLb'] + " " + yearArr[i].toFixed(0) + "°"
                + " " + window.locales['azRadioLb'] + " " + yearArr[i + 1].toFixed(0) + "°";

            i = i + 2;
            //console.log(" i="+ i + " aDate[]="+ aDate[i/2]+" Ht0="+yearArr[i].toFixed(1)+" Az0="+yearArr[i + 1].toFixed(1));
            if (i > yearArr.length - 5) i = 0;
        };

    };

    window.Utils.show3Month = function () {
        var options = {Day: sDay3M, Month: sMonth3M, Year: sYear3M};
        var res = Utils.dataDeliveryDay(options);    //Array of 3 Arrays of Results
        var dayArr = res[0];    //Array of 1440 pairs of Ht,Az;Every 2 minute during a day
        var aTime = res[2];    //Array  of Time 2 for pairs of Ht,Az

        var sMoment, aMoment;

        window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
        graphicContainer.classList.contains("hidden") && graphicContainer.classList.toggle("hidden");
        ///////////////////////////////////            DEFINE A MOMENT 3 MONTH LATER then GIVEN            ///////////
        var curYear = sYear3M;
        sMoment = sYear3M + "-" + sMonth3M + "-" + sDay3M + " " + ht + ":" + mt + ":" + st;
        aMoment = moment(sMoment, "").add(3, 'month');

        sYear3M = moment(aMoment).format('YYYY');
        if (sYear3M !== curYear) sYear3M = curYear;             // NOT JUMP TO NEXT YEAR !!
        sMonth3M = moment(aMoment).format('MM');
        sDay3M = moment(aMoment).format('DD');
        params = {Day: sDay3M, Month: sMonth3M, Year: sYear3M};
        res = Utils.dataDeliveryDay(params);    //Array of 3 Arrays of Results;
        dayArr = res[0];    //Array of 1440 pairs of Ht,Az;Every 2 minute during a day
        aTime = res[2];     //Array  of Time 2 for pairs of Ht,Az

        var month3Layer = new Layer();
        month3Layer.name = "month3Lyr";
        options = {Day: sDay3M, Month: sMonth3M, Year: sYear3M, Scale: s, xOrigin: ox, yOrigin: oy, isPrint: true};
        window.Utils.dayPath(options);

    };

    window.Utils.show3D = function () {
        var counter = 0;
        var aDuration = 2000; //timelaps in miliseconds
        graphicContainer.classList.contains("hidden") && graphicContainer.classList.toggle("hidden");
        // Take input values
        var g = latGrad.value;
        m = latMin.value;
        s = latSec.value;
        var Lat = Utils.grad_textGMS2number(g, m, s);
        g = lonGrad.value;
        m = lonMin.value;
        s = lonSec.value;
        var Lon = Utils.grad_textGMS2number(g, m, s);

        var params = {Day: sDay, Month: sMonth, Year: sYear};
        var res = Utils.dataDeliveryDay(params);    //Array of 4 Arrays of Results
        var dayArr = res[0];    //Array of 1440 pairs of Ht,Az;Every 2 minute during a day. Starts from given time.
        var aTime = res[2];     //Array  of Time 2 for pairs of Ht,Az
        var minMax = res[3];
        //console.log(minMax[0],minMax[1],minMax[2],minMax[3], minMax[4]);
        paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
        width = paper.view.viewSize.width;
        height = paper.view.viewSize.height;
        //////////////////////////////////////      CLEAR ALL LAYERS BEFORE DRAWING
        var layers = paper.project.layers;
        for (i = 0; i < layers.length - 1; i++) {
            layers[i].clear();
            //console.log("Layer2Clear= "+layers[i].name);
        }
        paper.project._activeLayer.clear();
        var lyr3D = new Layer();
        lyr3D.name = "lyr3D";

        var a = width / 2 - gap * 8;
        b = a / 2;
        var center = new Point(ox - a / 2, oy - b / 2);
        var rectangle = new Rectangle(center, new Size(a, b));
        var path = new Path.Ellipse(rectangle);
        path.strokeColor = fontAxisColor;
        // Get ephemeris
        var EphArr = Utils.ReadDataFromResourceString(sDay, sMonth, sYear, (12 - dUTCval), Lon, dUTCval);
        var Decl = EphArr[3];
        var path2 = path.clone();
        //debugger
        path2.rotate(-1 * ((90 - Lat) + Decl));  // Sun culmination height = 90°- Latitude + Declination
        //path2.translate(100, -100);
        path2.strokeColor = fontSunColor;


        var amount = 1440;
        var length = path2.length;
        var offset, point, circle, x, y;
        var ArrX = new Array(amount);
        var ArrY = new Array(amount);
        // Fill Array with x,y points  of path
        for (var i = 0; i < amount + 1; i++) {
            offset = i / amount * length;
            // Find the point on the path at the given offset:
            point = path2.getPointAt(offset);
            ArrX [i] = point.x;
            ArrY [i] = point.y;
            //console.log(i, ArrX [i].toFixed(0), ArrY [i].toFixed(0), offset.toFixed(0));
        }

        point = new Point(ArrX [0], ArrY [0]);
        circle = new Shape.Circle({center: point, radius: 10, fillColor: sunColor, strokeColor: fontSunColor});
        var k = 0;
        circle.onFrame = function (event) {
            x = ArrX [k];
            y = ArrY [k];
            circle.position = new paper.Point(x, y);
            //Change sun to dark color if under horizon    TODO FIND CORRELATION WITH offset
            if (dayArr[k * 2] < 0) {
                circle.fillColor = sunColorDark;            //TODO IN DATADELIVERY MAKE SEPARATE ARRAYS OF HT AZ
            } else {
                circle.fillColor = sunColor;
            }
            k = k + 1;
            if (k > ArrX.length - 1) k = 0;

        };
    };

    ///////////////////////////////////////////////////////  DRAWING SUNDIALS   ///////////////////////////////
    window.Utils.showGraphic2 = function (redraw) {
        var minx=0, maxx=0, miny=0, maxy=0;
        var tic2, ox2, oy2, xscl, yscl, s2, lx2, ly2, less2, hFont2, time;
        var width, height, tx, ty, txp, typ, month, hr;
        var arr = Utils.sunDials2AoA();               //Return Array of  Arrays of SunDial results
        var ws1 = arr[0], i;

        for (i=1; i < ws1.length-1 ; i++){
            if (ws1[i][6] < minx) {minx = ws1[i][6]}        // ws1[i][6] x dimentions
            if (ws1[i][6] > maxx) {maxx = ws1[i][6]}
        }
        for (i=1; i < ws1.length-1 ; i++){
            if (ws1[i][7] < miny) {miny = ws1[i][7]}        // ws1[i][7] y dimentions
            if (ws1[i][7] > maxy) {maxy = ws1[i][7]}
        }
        var dx2 = maxx-minx;                       //range on axis x at SunDials
        var dy2 = maxy-miny;                       //range on axis y at SunDials

        var sunDialLayer = new Layer();
        sunDialLayer.name = "sunDial";

        //////////////////////////////////////      CLEAR ALL LAYERS BEFORE DRAWING
        var layers = paper.project.layers;
        for (i = 0; i < layers.length - 1; i++) {
            layers[i].clear();
            // console.log("Layer2Clear= "+layers[i].name);
        }
        paper.project._activeLayer.clear();

        /////////////////////////////////////////////////      DEFINE SUNDIAL DRAW DIMENSIONS          /////////////////////////////////
        paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
        width = paper.view.viewSize.width;
        height = paper.view.viewSize.height;
        var col, r=0, g=0 , b=0;
        var mcol = ['blue', 'grey', 'green', 'red', 'yellow', 'blue', 'grey', 'green', 'red', 'yellow','blue', 'grey'];
        // col = new Color(0, 1, 1);
        // var mcol = [col];
        // for(i=0; i<11; i++){
        //     r =  0.1*i;
        //     g =  0.1*i;
        //     b =  0.1*i;
        //     col = new Color(r, g, b);
        //     mcol.push(col);
        // }

        xscl = (width - 2 * gap) / dx2;    // scale on axis X
        yscl = (height - 2 * gap) / dy2;   // scale on axis Y
        if (xscl > yscl) less2 = yscl;     // Take smallest scale for proportional draw (the same scale on both axises)
        else less2 = xscl;
        s2 = less2;                        // s - is a scale: Pixels amount in one Degree°
        ox2 = width / 2;                   // Origin of X axis in pixels
        oy2 = height / 2;                  // Origin of Y axis in pixels
        lx2 = dx2 * s2 / 2;                // Half length of X axis in pixels (the same scale on both axises)
        ly2 = dy2 * s2 / 2;                // Half length of Y axis in pixels (the same scale on both axises)
        tic2 = less2;                      // length of tics on axis

        hFont2 = less2 * 2.5;
        if (hFont2 < 12) hFont2 = 12;

        //////////////////////////////////////      DRAW CADRAN's ANNALEMAS
        var pathA = new Path({strokeColor: mcol[0]});
        var grd="", min="", sec="";
        var hr1 = ws1[1][1];
        var month1 = ws1[1][9];
        hr1 = hr1.split(":");
        grd= hr1[0];
        min= hr1[1];
        sec= hr1[2];
        hr1 = Utils.grad_textGMS2number(grd, min, sec);

        for (i=1; i < ws1.length-1 ; i++){
            month = ws1[i][9];
            time = ws1[i][1].split(":");
            grd= time[0];
            min= time[1];
            sec= time[2];
            hr = Utils.grad_textGMS2number(grd, min, sec);

            tx = ws1[i][6];
            ty = ws1[i][7];
            txp = ox2   + tx  * s2;
            typ = oy2 + ly2/4 - ty  * s2;
            //console.log(i, tm, month, tx, ty );
            if (hr === hr1) {
                if (tx !== 0 && ty !== 0 )   {
                    if (month === month1) {
                        pathA.add(new Point(txp, typ));
                    }
                    else{
                        pathA.add(new Point(txp, typ));
                        month1 = month;
                        pathA = new Path({strokeColor: mcol[month]}); //next month starts
                        pathA.add(new Point(txp, typ));
                    }
                }
            }
            else {             // no lines between hours analemma
                hr1 = hr;
                pathA = new Path({strokeColor: mcol[0]}); //next hour starts
                if (tx !== 0 && ty !== 0 )   {
                    pathA.add(new Point(txp, typ));
                }
            }
        }
        var curPoint = new paper.Point(ox2, oy2 + ly2/4);
        var circle2 = new Shape.Circle({center: curPoint, radius: 6, fillColor: sunColor, strokeColor: fontSunColor});


    };


})();
