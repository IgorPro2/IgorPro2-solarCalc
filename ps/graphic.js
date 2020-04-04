//////////////////////////////////////////////////////
////////PAPERSCRIPT (var instead of let/const)////////
//////////////////////////////////////////////////////
;(function () {

    var graphicContainer = document.getElementById("graphicContainer");
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
    var sDay = dateDay.value;
    var sMonth = dateMonth.value;
    var sYear = dateYear.value;
    var ht = timeHour.value;
    var mt = timeMin.value;
    var st = timeSec.value;
    var dUTCval = +dUTC.value;
    var curTime = Utils.grad_textGMS2number(ht, mt, st);
    var utcTime = curTime - Utils.grad_textGMS2number(dUTCval, "0", "0");
    var axisColor = 'grey';
    var fontSunColor = 'red';
    var sunColor = 'yellow';
    var sunColorDark = 'blue';
    var axisFont = 'Courier New';
    var fontAxisColor = 'grey';
    var axisFontWeight = 'normal';
    var sunFont = 'Arial';
    var sunFontWeight = 'normal';
    var nightFillColor = 'lightgrey';
/////////////////////////////////////////////////      DEFINE DRAW DIMENSIONS          /////////////////////////////////

    // MAXIMUM DIMENSIONS on Azimuth (X axis) will be 360 pixel. At Height (Y axis) From +90° to -90° = 180° ) Thus Scale will be:
    var s, sx, sy, tic, ox, oy, lx, ly, less;
    var from, to, to2, to3, axisX, axisY, boundRect;

    paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
    var width = paper.view.viewSize.width;
    var height = paper.view.viewSize.height;
    var gap = 4;                        //Pixels from screen edge to sketch
    var dx = 360;                       //range on axis  X-azimuth
    var dy = 180;                       //range on axis  Y-height
    var tx = (width - 2 * gap) / dx;    //scale on axis X
    var ty = (height - 2 * gap) / dy;   //scale on axis Y

    if (tx > ty) less = ty;             // Take smallest scale for proportional draw (the same scale on both axises)
    else less = tx;
    s = less;                           // s - is a scale: Pixels amount in one Degree°
    ox = width / 2;                             // Origin of X axis in pixels
    oy = height / 2;                            // Origin of Y axis in pixels
    lx = dx * s / 2;                              // Half length of X axis in pixels (the same scale on both axises)
    ly = dy * s / 2;                             // Half length of Y axis in pixels (the same scale on both axises)
    tic = less;                                // length of tics on axis

    var xt1, yt1, xt2, yt2, line2, i, text, options;
    var hFont, SunRadius, TicRadius;
    hFont = less * 2.5;
    SunRadius = less;
    TicRadius = less / 2;
    if (hFont < 12) hFont = 12;

///////////   SHOW GRAPHIC   SHOW GRAPhIC   SHOW GRAPHIC   SHOW GRAPhIC SHOW GRAPHIC   SHOW GRAPhIC   SHOW GRAPHIC  ////
/////////////////////////////////////////////        SUN PATH AT GIVEN DAY          ////////////////////////////////////
    window.Utils.showGraphic = function () {
        window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
        graphicContainer.classList.contains("hidden") && graphicContainer.classList.toggle("hidden");

        //////////////////////////////////////      CLEAR ALL LAYERS BEFORE DRAWING
        var layers = paper.project.layers;
        for (i = 0; i < layers.length - 1; i++) {
            layers[i].clear();
        }
        //paper.project._activeLayer.clear();
        //////////////////////////////////////      DRAW AXIS
        var axisLayer = new Layer();
        axisLayer.name = "axisLyr";
        window.Utils.drawAxis();

    /////////////////////////////////////////////         DAY PATH            //////////////////////////////////////////
        sDay = dateDay.value;
        sMonth = dateMonth.value;
        sYear = dateYear.value;
        var params = {Day: sDay, Month: sMonth, Year: sYear};
        var res = Utils.dataDeliveryDay(params);    //Array of 3 Arrays of Results
        var dayArr = res[0];    //Array of 1440 pairs of Ht,Az;Every 2 minute during a day. Starts from given time.
        var aTime = res[2];    //Array  of Time 2 for pairs of Ht,Az
        var dayPathLayer = new Layer();
        dayPathLayer.name = "dayPathLyr";

        options = {Arr1: dayArr, Arr2: aTime, isPrint: false};
        window.Utils.dayPath(options);

    ///////////////////////////////////////////////       DAY ANIMATION ADN  TEXT         //////////////////////////////
        var dayAnimLayer = new Layer();
        dayAnimLayer.name = "dayAnimLyr";

        options = {Arr1: dayArr, Arr2: aTime};
        window.Utils.dayAnimation(options);

    ////////////////////////////////////////////      YEAR PATH AT  90° x 180° RESOLUTION     //////////////////////////
        var res1 = Utils.dataDeliveryYear();   //Array of 2 Arrays of Results
        var yearArr = res1[0];    //Array of 365 pairs of Ht,Az; At this Time every Day in Year; Last 2pairs are: minH,minA,maxH,maxA
        var aDate = res1[1];    //Array  of Time  for each pairs of Ht,Az in res1[0] array
        var yearPathLayer = new Layer();
        yearPathLayer.name = "yearPathLyr";

        //Define analemma H,A dimensions
        //var maxH = yearArr[732], minH = yearArr[730], maxA = yearArr[733], minA = yearArr[731];
        // var dH = maxH - minH;
        // var dA = maxA - minA;
        xt1 = ox - 180 * s + yearArr[1] * s;
        yt1 = oy - yearArr[0] * s;
        curPoint=new paper.Point(xt1, yt1);
        xt2 = ox - 180 * s + yearArr[3] * s;
        yt2 = oy - yearArr[2] * s;
        line2 = new Path.Line(new Point(xt1, yt1), new Point(xt2, yt2));
        line2.style.strokeColor = "magenta";
        for (i = 4; i < (yearArr.length - 5); i = i + 2) {
            xt1 = ox - 180 * s + yearArr[i + 1] * s;
            yt1 = oy - yearArr[i] * s;
            line2.lineTo(new Point(xt1, yt1));    // lineBy  relative coordinate;   line1.lineTo absolute coordinate;
        }
        line2.lineTo(new Point(ox - 180 * s + yearArr[1] * s, oy - yearArr[0] * s));    //close line gap to 1-st point

    //////////////////////////////     YEAR ANIMATION AT 90° x 180° RESOLUTION    /////////////////////////////
        var yearAnimLayer = new Layer();
        yearAnimLayer.name = "yearAnimLyr";
        var textYearTime = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 140]
        });
        var textHYear = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 160]
        });
        var textAYear = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 180]
        });

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
            textHYear.content = "Year Height  = " + yearArr[i].toFixed(0) + "°";
            textAYear.content = "Year Azimuth = " + yearArr[i + 1].toFixed(0) + "°";
            textYearTime.content = "Year Animation Local Time= " + aDate[i / 2];
            i = i + 2;
            if (i > yearArr.length - 5) i = 0;
        };


    };
////////////////////////////////////////////      HIDE GRAPHICS    //////////////////////////
    window.Utils.hideGraphic = function () {
        !graphicContainer.classList.contains("hidden") && graphicContainer.classList.toggle("hidden");
        paper.project._activeLayer.clear();
        var layers = paper.project.layers;
        for (i = 0; i < layers.length - 1; i++) {
            layers[i].clear();
        }
    };
////////////////////////////////////////////      TOGGLE PAUSING ONCLICK    //////////////////////////
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
/////////////////////////////////////////////      show3Month   SUN PATH AT GIVEN YEAR        ////////////////////////
    window.Utils.show3Month = function () {
        var options = {Day: sDay, Month: sMonth, Year: sYear};
        var res = Utils.dataDeliveryDay(options);    //Array of 3 Arrays of Results
        var dayArr = res[0];    //Array of 1440 pairs of Ht,Az;Every 2 minute during a day
        var curArr = res[1];    //Array  of Ht,Az for Current sun position
        var aTime = res[2];    //Array  of Time 2 for pairs of Ht,Az
        var res1 = Utils.dataDeliveryYear();   //Array of 2 Arrays of Results
        var yearArr = res1[0];    //Array of 365 pairs of Ht,Az; At this Time every Day in Year; Last 2pairs are: minH,minA,maxH,maxA
        var aDate = res1[1];    //Array  of Time  for each pairs of Ht,Az in res1[0] array
        window.timerIsOn = false;       // to stop showTimer() in function showResultTimer()
        graphicContainer.classList.contains("hidden") && graphicContainer.classList.toggle("hidden");
        var latGrad = document.getElementById("latGrad");
        var latMin = document.getElementById("latMin");
        var latSec = document.getElementById("latSec");
        var lonGrad = document.getElementById("lonGrad");
        var lonMin = document.getElementById("lonMin");
        var lonSec = document.getElementById("lonSec");

        var sMoment, aMoment;
        //////////////////////////////////////      CLEAR ALL LAYERS BEFORE DRAWING
        // paper.project._activeLayer.clear();
        // var layers = paper.project.layers;
        // for (i = 0; i < layers.length - 1; i++) {
        //     layers[i].visible = false;
        // }
        //
        // for (i = 0; i < layers.length - 1; i++) {
        //     if (layers[i].name === "axisLyr") layers[i].visible = true;     // SHOW AXIS LAYER
        //     // console.log("layer.id="+layers[i].id);
        //     // console.log("layer.name="+layers[i].name);
        // }

        ///////////////////////////////////            DEFINE A MOMENT 3 MONTH LATER then GIVEN            ///////////
        var curYear = sYear;
        sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
        if (i > 0) {
            aMoment = moment(sMoment, "").add(3, 'month');
        } else aMoment = moment(sMoment, "");
        sYear = moment(aMoment).format('YYYY');
        if (sYear !== curYear) sYear = curYear;             // NOT JUMP TO NEXT YEAR !!
        sMonth = moment(aMoment).format('MM');
        sDay = moment(aMoment).format('DD');
        params = {Day: sDay, Month: sMonth, Year: sYear};
        res = Utils.dataDeliveryDay(params);    //Array of 3 Arrays of Results;
        dayArr = res[0];    //Array of 1440 pairs of Ht,Az;Every 2 minute during a day
        aTime = res[2];     //Array  of Time 2 for pairs of Ht,Az

        var axisLayer = new Layer();
        axisLayer.name = "month3Lyr";
        options = {Arr1: dayArr, Arr2: aTime, isPrint: true};
        window.Utils.dayPath(options);

    };

    window.Utils.drawAxis = function (options) {

        from = new Point(gap, gap);   // BOUNDARY RECT EMPTY
        to = new Point(width - gap, height - gap);
        boundRect = new Path.Rectangle(from, to);
        boundRect.strokeColor = 'white';
        from = new Point(ox - lx, oy);  // NIGHT RECTANGLE FILLED
        to = new Point(ox + lx, height - gap);
        boundRect = new Path.Rectangle(from, to);
        boundRect.strokeColor = 'white';
        boundRect.fillColor = nightFillColor;

        ////////////////////////////////////////////////   AXIS X   ////////////////////////////////////////////////
        axisX = new Path({strokeColor: axisColor, strokeWidth: 1});
        axisX.add(new Point(ox - lx, oy), new Point(ox + lx, oy));         // axis X
        text = new PointText({
            point: [ox - lx, oy - tic * 1.5],
            content: 'North',
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
            content: 'East 90°',
            fillColor: fontAxisColor,
            fontFamily: axisFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            justification: 'center'
        });
        text = new PointText({
            point: [ox, oy - tic * 1.5],
            content: 'South',
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
            content: 'West 270°',
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
            content: 'North',
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

        ////////////////////////////////////////////////   AXIS Y ////////////////////////////////////////////////
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
            content: 'Zenith',
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
            fillColor: fontAxisColor,
            fontFamily: axisFont,
            fontWeight: axisFontWeight,
            fontSize: hFont
        });
        text = new PointText({
            point: [ox + tic * 3, oy + 90 * s - tic],
            content: 'Nadir',
            fillColor: fontAxisColor,
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
    };

    window.Utils.dayPath = function (options) {
        // options= {dayHAArr, aTimeArr}
        var dayArr = options.Arr1;
        var aTime = options.Arr2;
        var isPrintMoment = options.isPrint;

        var pathD, tx2, ty2, diff, du, i, ct, text, localTime, jump, cur3month;
        var hFont, SunRadius, TicRadius, do0 = true, do6 = true, do12 = true, do18 = true, do24 = true;
        hFont = less * 2.5;
        SunRadius = less;
        TicRadius = less / 2;
        if (hFont < 12) hFont = 12;

        pathD = new Path({strokeColor: 'red'});
        tx2 = ox - 180 * s + dayArr[1] * s;

        for (i = 0; i < (dayArr.length - 2); i = i + 2) {
            tx = ox - 180 * s + dayArr[i + 1] * s;    // dayArr Array of 1440 pairs of Ht,Az;Every 2 minute during a day
            ty = oy - dayArr[i] * s;
            diff = Math.abs(tx - tx2);
            tx2 = tx;
            ty2 = ty;
            localTime = aTime[i / 2];
            //console.log("tx=" + tx.toFixed(2) + " ty=" + ty.toFixed(2) + " localTime=" + Utils.grad_number2text(localTime, 0, "", ":::"));
            if (diff < 330 * s) {
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
        if (isPrintMoment) { rad = 8} else { rad = 10}
        var circle1 = new Shape.Circle({center: curPoint, radius: rad, fillColor: sunColor, strokeColor: fontSunColor});
        if (dayArr[0] < 0) circle1.fillColor = sunColorDark;
        else circle1.fillColor = sunColor;

        if (isPrintMoment) {
            var arr= aTime[1440].split(" ");
            cur3month = new PointText({ fillColor: fontSunColor, fontFamily: sunFont,  fontWeight: axisFontWeight,
                fontSize: hFont,  point: [curPointX + 10, curPointY-10],  content: arr[0]+arr[1]
            });
        }
    };

    window.Utils.dayAnimation = function (options){
        // options= {dayHAArr, aTimeArr}
        var dayArr = options.Arr1;
        var aTime  = options.Arr2;
        /////////////////////////////////////////////    DAY ANIMATION ADN  TEXT   //////////////////////////////
        // SHOW CURRENT SUN position   ( ox - 180 * s) = 0° degrees in Azimuth;  oy = 0° degrees in Height;
        // var curPointX = ox - 180 * s + dayArr[1] * s;      var curPointY = oy - dayArr[0] * s, x, y;
        // var curPoint = new Point(curPointX , curPointY);
        // var circle1 =  new Shape.Circle({center:  curPoint, radius: 10, fillColor: sunColor, strokeColor: fontSunColor});
        // if (dayArr[0] < 0) circle1.fillColor = sunColorDark;
        // else circle1.fillColor = sunColor;

        var lat = latGrad.value + "° " + latMin.value + "' " + latSec.value + '"';
        var lon = lonGrad.value + "° " + lonMin.value + "' " + lonSec.value + '"';

        var textLat = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 20],
            content: "Latitude  = " + lat
        });
        var textLon = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 40],
            content: "Longitude = " + lon
        });
        var textMoment = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 60],
            content: "Moment  = " + aTime[1440]
        });

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

        var textDayTime = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 80]
        });
        var textHDay = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 100]
        });
        var textADay = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 120]
        });

        /////////////////////////////////////////////////  DAY ANIMATION function(event)   /////////////////////////
        var curPointX = ox - 180 * s + dayArr[1] * s;      var curPointY = oy - dayArr[0] * s, x, y;
        var curPoint = new Point(curPointX , curPointY);
        var k = 0;
        circle1 = new Shape.Circle({center: curPoint, radius: 10, fillColor: sunColor, strokeColor: fontSunColor});
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
            //H A output
            textH.point = new paper.Point(x + tic * 4, y);
            textH.content = "H=" + dayArr[k].toFixed(0) + "°";
            textA.point = new paper.Point(x + tic * 4, y + 14);
            textA.content = "A=" + dayArr[k + 1].toFixed(0) + "°";
            textHDay.content = "Day Height  = " + dayArr[k].toFixed(0) + "°";
            textADay.content = "Day Azimuth = " + dayArr[k + 1].toFixed(0) + "°";
            textDayTime.content = "Day Animation Local Time= " + Utils.grad_number2text(aTime[k / 2], 0, "", ": ");
            k = k + 2;
            if (k > dayArr.length - 1) k = 0;
        };
    };
})();

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
