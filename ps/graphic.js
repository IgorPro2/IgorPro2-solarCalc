//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
////////PAPERSCRIPT (var instead of var/const)////////
//////////////////////////////////////////////////////
;(function () {
    window.paper= paper;
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
    var civilTwilight = -6;
    var nauticalTwilight = -12;
    var astronomicTwilight = -18;
    var civilTwilightColor = new Color(0.8);
    var nauticalTwilightColor = new Color(0.6);
    var astronomicTwilightColor = new Color(0.1);
    var nightFillColor = new Color(0, 0, 1, 0.1);
    // var civilTwilightColor = new Color(0, 0, 1, 0.3);
    // var nauticalTwilightColor = new Color(0, 0, 1, 0.7);
    // var astronomicTwilightColor = new Color(0, 0, 1, 1);
    var mcol = ['#6307FF','#0A9CFF','#0919FF','#2E2E2E',
        '#FF951D','#0CEB13','#FF4E04','#FF0507',
        '#FF0BA9','#FF02E4','#FF8D07','#A994FF','#CB7CFF'];

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
    var from, to, axisX, axisY, boundRect;
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
        window.varsValue.width = width;
        window.varsValue.height = height;

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
        clearTimeout(window.varsValue.yearTimeOut) ;        //2stop  shadowAnimationYear
        clearTimeout(window.varsValue.dayTimeOut) ;         //2stop  shadowAnimationDay
    };

/////////////////////////////////////////////        SUN PATH AT GIVEN DAY          ////////////////////////////////////
    window.Utils.showGraphic = function (redraw) {
        window.Utils.calcSunRise();           // to calculate polarDay for gradient
        window.Utils.showDayDuration();       // to calculate polarDay for gradient
        window.timerIsOn = false;             // to stop showTimer() in function showResultTimer()
        window.currentAction = "graphic";
        window.varsValue.animationYearWorks = false;
        window.varsValue.animationDayWorks  = false;
        window.varsValue.drawShadowWorks  =  false;
        window.varsValue.showGraphicWorks  =  true;

        graphicContainer.classList.contains("hidden") && graphicContainer.classList.toggle("hidden");
        !calcContainer.classList.contains("hidden") && calcContainer.classList.toggle("hidden");
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
        Utils.showResult();                     // fill main page after .this return

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

    window.Utils.defineDrawScale= function (options){
        // Function takes: AoA of objects 3D coordinates.
        // Each 1-st level element of global AoA describes one object.   It has index of 1-st level in global AoA
        // 2-d level elements are arrays of [x,y,z] that describes each point of one object. It has index of 2-nd level in global AoA
        // Each point describes by 3 coordinates x,y,z  as elements with index of 3-d level in global AoA
        // Example of AoA:
        // [  [  [x,y,zLow,zUp], [x,y,zLow zUp], [x,y,zLow,zUp], [x,y,zLow,zUp] ],    - object constructed from 4 points.
        //    [  [x,y,zLow,zUp], [x,y,zLow,zUp], [x,y,zLow,zUp]                 ],    - object constructed from 3 points.
        //    [  [x,y,zLow,zUp, [x,y,zLow,zUp],                                 ]  ]  - object constructed from 2 points.
        //
        //Function return: SCALE 4 drawing objects in widow window.varsValue.width;var height = window.varsValue.height;
        //                 max&min x,y from all objects of AoAobj


        var AoAobj = options.AoA;
        var resArr = Utils.scale1Object4Drawing3D(AoAobj[0] , gap);
        var scale;
        var minx = resArr [2];
        var maxx = resArr [3];
        var miny = resArr [4];
        var maxy = resArr [5];
        //console.log( "AoAobj[0]: scale="+scale+" minx="+minx+" maxx="+maxx+" miny="+miny+"maxy="+maxy);
        var tminx , tmaxx , tminy, tmaxy;
        for (var j = 1; j < AoAobj.length; j++) {
            resArr = Utils.scale1Object4Drawing3D(AoAobj [j], gap);
            tminx = resArr [2];
            tmaxx = resArr [3];
            tminy = resArr [4];
            tmaxy = resArr [5];
            //if (tscale < scale) scale = tscale;
            if (tminx < minx)   minx = tminx;
            if (tmaxx > maxx)   maxx = tmaxx;
            if (tminy < miny)   miny = tminy;
            if (tmaxy > maxy)   maxy = tmaxy;
        }
        var width  = paper.view.viewSize.width;
        var height = paper.view.viewSize.height;
        var dx = maxx-minx;                 //range on axis x for all objects in AoA
        var dy = maxy-miny;                 //range on axis y for all objects in AoA
        var xscl = (width - 2 * gap) / dx;  // scale on axis X
        var yscl = (height - 2 * gap) / dy; // scale on axis Y
        if (xscl > yscl) scale = yscl;      // Take smallest scale for proportional draw (the same scale on both axises)
        else scale = xscl;

        scale = scale/2;                   // To show some shadows around objects

        var ox = width / 2;                          // Origin of X axis in pixels at the center of view
        var oy = height / 2;                         // Origin of Y axis in pixels at the center of view
        ox = ox - dx / 2 * scale;                // Low left corner of all objects extent at X-axis on screen
        oy = oy + dy / 2 * scale;                // Low left corner of all objects exten at Y-axis on screen
        var originPoint = new Point(ox,oy);


        //console.log( "Final: scale="+scale+" minx="+minx+" maxx="+maxx+" miny="+miny+"maxy="+maxy)
        var retArr = Array(6);
        retArr[0] = scale;
        retArr[1] = minx;
        retArr[2] = maxx;
        retArr[3] = miny;
        retArr[4] = maxy;
        retArr[5] = originPoint;
        return retArr;
    };
    window.Utils.scale1Object4Drawing3D = function (AoAxyz, gap, scale, minx, maxx, miny, maxy, originPoint) {
        // Takes:  1. AoAxyz( ONLY ONE OBJECT!!!!!) - AoA of
        //            [  [x,y,zLow,zUp], [x,y,zLow,zUp], [x,y,zLow,zUp] ]   - object constructed from 3 points.
        //            Each   [x, y, zLow, zUp] describe one point of object where x, y are object's Easting, Northing,
        //            zLow is point's lower height, zUp is point's upper height.
        //            We use  OBJECT for initial scaling 2define Scale  (in that case height scaled too but useless)
        //   OR
        // Takes:  1. AoAxyz(ONE SHADOW) - AoA of [ [xLow, yLow, lLow, xUp, yUp, lUp], [], ... , sunHt ]
        //            where xLow, yLow, are object's Low shadows Easting&Northing and lLow is Low shadow Length.
        //            xUp, yUp, are object's Up shadows Easting&Northing and lUp is Up shadow Length.
        //            We use  SHADOWS for scaling shadow's length and drawing it later

        //         2. gap - amount of pixels between viewSize border and drawing
        //         3. scale, minx, maxx, miny, maxy - IF THEY ARE ABSENT WE CALCULATE IT, IF PRESENT USE GIVEN  !!!!!!!

        // Return: 1. AoA of [ [xLow, yLow, lLow, xUp, yUp, lUp], [],...] where Easting&Northing&Lenght
        //                                 REDUCED  to it's minimal values AND SCALED to draw on paper.view.viewSize
        //         2. Scale for multiplying xc,yc for correct drawing on current paper.view.viewSize
        //         3. Min&Max values for all x,y in AoA
        //                    SCALE is Pixels amount in 1 original x,y unit (The bigger x,y range the smaller is SCALE)

        //  20201026   - Adding PARAMETERS:   originPoint - MassCenter of drawing on screen  (for moving drawing with mouse)
        //                                    originPoint - Point to which all scaled coordinates added

        var xscl, yscl;
        var width, height, ox, oy;

        var Size1 = AoAxyz.length;
        var sclArr = new Array(Size1);
        var resArr = new Array(7);

        paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
        width = paper.view.viewSize.width;
        height = paper.view.viewSize.height;
        window.varsValue.width = width;
        window.varsValue.height = height;

        if (!minx || !miny) {

            minx = AoAxyz[0][0];
            maxx = AoAxyz[0][0];

            for (i = 0; i < Size1; i++) {
                if (AoAxyz[i][0] < minx) {
                    minx = AoAxyz[i][0]
                }
                if (AoAxyz[i][0] > maxx) {
                    maxx = AoAxyz[i][0]
                }
            }
            miny = AoAxyz[0][1];
            maxy = AoAxyz[0][1];
            for (i = 0; i < Size1; i++) {
                if (AoAxyz[i][1] < miny) {
                    miny = AoAxyz[i][1]
                }
                if (AoAxyz[i][1] > maxy) {
                    maxy = AoAxyz[i][1]
                }
            }
        }


        var dx = maxx-minx;                       //range on axis x for all points of one object in AoA
        var dy = maxy-miny;                       //range on axis y for all points of one object in AoA


        if (!scale) {
            xscl = (width - 2 * gap) / dx;     // scale on axis X
            yscl = (height - 2 * gap) / dy;    // scale on axis Y
            if (xscl > yscl) scale = yscl;     // Take smallest scale for proportional draw (the same scale on both axises)
            else scale = xscl;
        }

        if (!originPoint) {
            ox = width / 2;                          // Origin of X axis in pixels at the center of view
            oy = height / 2;                         // Origin of Y axis in pixels at the center of view
            ox = ox - dx / 2 * scale;                // Low left corner of all objects extent at X-axis on screen
            oy = oy + dy / 2 * scale;                // Low left corner of all objects extent at Y-axis on screen
            originPoint = new Point(ox,oy);          // From this originPoint Center of all objects extent will be in center of drawing window

        }
        else{
            ox = originPoint.x;             //we already have originPoint
            oy = originPoint.y;
        }


        for (i=0; i < Size1 ; i++){
            var rowArr = new Array(6);

            rowArr[0] = ox + (AoAxyz[i][0] - minx) * scale;
            rowArr[1] = oy - (AoAxyz[i][1] - miny) * scale;
            rowArr[2] =       AoAxyz[i][2] * scale;               // scaling low shadow length
            rowArr[3] = ox + (AoAxyz[i][3] - minx) * scale;
            rowArr[4] = oy - (AoAxyz[i][4] - miny) * scale;
            rowArr[5] =       AoAxyz[i][5] * scale;               // scaling  Up shadow length

            sclArr[i] = rowArr;
        }
        resArr[0] = sclArr;         // Array of scaled x,y and the scaled shadows length (or height if object was in input)
        resArr[1] = scale;          // scale is Pixels amount in 1 initial x,y unit
        resArr[2] = minx;
        resArr[3] = maxx;
        resArr[4] = miny;
        resArr[5] = maxy;
        resArr[6] = originPoint;

        return resArr;           // Array of scaled x,y and the scaled shadows
    };

////////////////////////////////////////////            TOGGLE PAUSING ONCLICK    //////////////////////////////////////
    var mouseDown, mouseUp;
    var isPaused = false;
    var textPaused= new PointText({
        fillColor: fontAxisColor,
        fontFamily: sunFont,
        fontWeight: axisFontWeight,
        fontSize: hFont,
        point: [20, 120],
    });
    tool.onMouseDown = function (event) {
        mouseDown = event.point;
        // Pause/Unpause View at mouse click
        if(window.varsValue.animationDayWorks || window.varsValue.animationYearWorks) {
            if (isPaused) {
                isPaused = false;
                textPaused.content = "Pausing...(click mouse to play)";
                view.play();
            } else {
                isPaused = true;
                textPaused.content = "Playing...(click mouse to stop)";
                view.pause();
            }
        }
        else {textPaused.content = ""}
    };

    tool.onMouseUp = function (event) {
        mouseUp = event.point;
        var mouseVector = mouseUp - mouseDown;
        var origPoint = window.varsValue.originPoint;
        window.varsValue.originPoint = origPoint + mouseVector;
        if (!window.varsValue.animationDayWorks && !window.varsValue.animationYearWorks) {
            Utils.drawShadowMap();
        }
    };
////////////////////////////////////////////      CHANGE ZOOM WITH MOUSE WHEEL    //////////////////////////////////////
    window.Utils.defineDimensions();                    //define width,height
    var mousePoint = new Point(width/2, height/2);
    var options = {
        AoA: window.varsValue.objects4shadow,
    };
    var resArr = window.Utils.defineDrawScale(options);
    var scale = resArr[0];
    var scale1 = resArr[0];
    window.varsValue.scale = scale1;
    window.varsValue.scale1 = scale1;
    var newOrigin  =  resArr[5];
    var newOrigin1 =  resArr[5];
    window.varsValue.originPoint = newOrigin;
    window.varsValue.originPoint1 = newOrigin;
    graphicContainer.onwheel = scaleChange;
    //var wheelDir,willScale,originPoint,m2o,m2oLen,newLen,m2oNew;
    function scaleChange(event){
        event.preventDefault();
        //console.log(" ");
        //console.log("event.deltaY=  "+event.deltaY + " width="+width+" height="+height);
        wheelDir = Math.sign(event.deltaY);
        var scale = window.varsValue.scale;
        var willScale;
        if (wheelDir < 0) {willScale = scale *1.2 }     //1.2 scale step
        else              {willScale = scale /1.2 }
        mousePoint =  new Point( event.x, event.y);  //change drawing center to stay picture after zoom in place where mouse wheel rotation happens
        var originPoint  = window.varsValue.originPoint;
        var m2o = originPoint- mousePoint;          //vector from mouse to origin
        var m2oLen = m2o.length;
        var newLen = m2oLen * (willScale/scale);    //new length accordingly to willScale
        var m2oNew = m2o * (newLen/m2oLen);         //vector from mouse to newOrigin
        newOrigin = mousePoint + m2oNew;            // find new originPoint
        //  var op = new Path.Circle( originPoint, 10 ); op.fillColor = "red";
        // var nop = new Path.Circle( newOrigin, 8);   nop.fillColor = "blue";
        console.log("wheelDir=" + wheelDir +" m2o=" + m2o  +" m2oLen=" + m2oLen + " newLen=" + newLen+ " m2oNew=" + m2oNew+ " scale="+scale+" willScale=" + willScale);
        console.log("mousePoint=" + mousePoint+ "originPoint" + originPoint +" newOrigin= " + newOrigin) ;
        window.varsValue.originPoint = newOrigin;
        window.varsValue.scale = willScale;
        if(!window.varsValue.animationDayWorks && !window.varsValue.animationYearWorks){
            Utils.drawShadowMap();      //zoom when no animation
        }
    }

    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        switch (event.key) {
            case "Space": // IE/Edge specific value
            case " ":
                // Do something for "down arrow" key press.
                console.log("Space pressed");
                window.varsValue.originPoint = newOrigin1;
                window.varsValue.scale = scale1;
                if(!window.varsValue.animationDayWorks && !window.varsValue.animationYearWorks){
                    Utils.drawShadowMap();      //Draw with initial zoom when no animation
                }
                break;
            case "+":
                scale = window.varsValue.scale;
                willScale = scale *1.2;
                window.varsValue.scale = willScale;
                if(!window.varsValue.animationDayWorks && !window.varsValue.animationYearWorks){
                    Utils.drawShadowMap();      //Draw with initial zoom when no animation
                }
                break;
            case "-":
                scale = window.varsValue.scale;
                willScale = scale /1.2;
                window.varsValue.scale = willScale;
                if(!window.varsValue.animationDayWorks && !window.varsValue.animationYearWorks){
                    Utils.drawShadowMap();      //Draw with initial zoom when no animation
                }
                break;
            case "Down": // IE/Edge specific value
            case "ArrowDown":
                break;
            case "Up": // IE/Edge specific value
            case "ArrowUp":
                // Do something for "up arrow" key press.
                break;
            case "Left": // IE/Edge specific value
            case "ArrowLeft":
                // Do something for "left arrow" key press.
                break;
            case "Right": // IE/Edge specific value
            case "ArrowRight":
                // Do something for "right arrow" key press.
                break;
            case "Enter":
                // Do something for "enter" or "return" key press.
                break;
            case "Esc": // IE/Edge specific value
            case "Escape":
                // Do something for "esc" key press.
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    window.Utils.drawShadowMap = function() {
        var sYear = document.getElementById("dateYear").value;
        var sMonth = document.getElementById("dateMonth").value;
        var sDay = document.getElementById("dateDay").value;
        var ht = document.getElementById("timeHour").value;
        var mt = document.getElementById("timeMin").value;
        var st = document.getElementById("timeSec").value;
        var sMoment = sYear + "-" + sMonth + "-" + sDay + " " + ht + ":" + mt + ":" + st;
        var lat = Utils.grad_textGMS2number(latGrad.value, latMin.value, latSec.value);
        var lon = Utils.grad_textGMS2number(lonGrad.value, lonMin.value, lonSec.value);
        var dUTCval = document.getElementById("dUTC").value;
        var temp = document.getElementById("temp").value;
        var press = document.getElementById("press").value;
        var AoA;
        if (window.varsValue.userObj4shadow) {
            AoA = window.varsValue.userObj4shadow;
        } else {
            AoA = window.varsValue.objects4shadow;
        }
        var gap = 4;                        //Pixels from screen edge to sketch

        var options3 = {
            AoA: AoA,
        };
        var resArr = Utils.defineDrawScale(options3);
        //var scale = resArr[0];
        var minx = resArr[1];
        var maxx = resArr[2];
        var miny = resArr[3];
        var maxy = resArr[4];


        var options = {
            AoA: AoA,               // Array of objects  [x,y,zLow,zUp], [x,y,zLow zUp],........
            aMoment: sMoment,
            Latitude: lat,
            Longitude: lon,
            dUTCval: dUTCval,
            Temperature: temp,
            Pressure: press,
            minSunHeight: window.varsValue.minSunHeight
        };
        var shadArr = Utils.calcObjectsShadow3D(options);

        scale = window.varsValue.scale;

        var originPoint;
        if (!window.varsValue.originPoint){
            originPoint =resArr[5];
        }
        else {
            originPoint = window.varsValue.originPoint;
        }

        var options2 = {
            AoAshadows: shadArr,
            AoAobjects: AoA,
            aMoment: sMoment,
            Latitude: lat,
            Longitude: lon,
            dUTCval: dUTCval,
            Temperature: temp,
            Pressure: press,
            minSunHeight: window.varsValue.minSunHeight,
            scale: scale,
            minx: minx,
            maxx: maxx,
            miny: miny,
            maxy: maxy,
            orgPoint: originPoint
        };

        //console.log("drawShadowMap()-> orgPoint:" + originPoint + " scale="+scale);

        clearTimeout(window.varsValue.yearTimeOut);        //2stop  shadowAnimationYear
        clearTimeout(window.varsValue.dayTimeOut);         //2stop  shadowAnimationDay
        window.varsValue.animationYearWorks = false;
        window.varsValue.animationDayWorks  = false;
        window.varsValue.drawShadowWorks  =   true;
        window.varsValue.showGraphicWorks  =  false;

        Utils.drawShadow(options2);
    };

    window.Utils.drawShadow= function (options) {
        // This function DRAW on paper.js canvas given objects  and its shadows from SUN
        //////////////////////////////////////      CLEAR ALL LAYERS BEFORE DRAWING   //////////////////////////
        var shadowLayer = new Layer();
        shadowLayer.name = "shadows";
        var layers = paper.project.layers;
        for (i = 0; i < layers.length - 1; i++) {
            layers[i].clear();
            // console.log("Layer2Clear= "+layers[i].name);
        }
        paper.project._activeLayer.clear();
        //////////////////////////////////////    DRAW    BOUNDARY    RECTANGLE ////////////////////////////
        // window.varsValue.animationYearWorks = false;
        // window.varsValue.animationDayWorks  = false;
        window.varsValue.drawShadowWorks  =  true;
        // window.varsValue.showGraphicWorks  =  false;
        paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
        width = paper.view.viewSize.width;
        height = paper.view.viewSize.height;
        from = new Point(gap, gap);                             // BOUNDARY RECT EMPTY
        to = new Point(width - gap, height - gap);
        boundRect = new Path.Rectangle(from, to);
        boundRect.strokeColor = fontAxisColor;
        var lat = window.varsValue.B;
        var lon = window.varsValue.L;

        var shadowsAoA = options.AoAshadows;     // AoA of shadows in world coordinate
        var objectsAoA = options.AoAobjects;     // AoA of objects in world coordinate
        var sMoment = options.aMoment;
        var dUTC = options.dUTCval;
        var minSunHeight = options.minSunHeight;

        // console.log("drawShadow()  objectsAoA="+objectsAoA[0]);
        // console.log("drawShadow()  shadowsoAoA="+shadowsAoA[0]);

        var scale = options.scale;
        var minx = options.minx;
        var maxx = options.maxx;
        var miny = options.miny;
        var maxy = options.maxy;
        var origPoint = options.orgPoint;

        var xlow,ylow,xup,yup,xup2,yup2,xlow2,ylow2;
        var nightRect;
        var numShad = shadowsAoA.length;                              //Amount of shadows in array
        var r,g,b,c1,c2,d,rc, alf = 0.6;

        //////////////////////////////////////    Drawing shadows   ////////////////////////////////////
        for (var j = 0; j < numShad; j++) {

            var curSunHeight = shadowsAoA[j].pop();   // remove last element from Array before scaling
            if (curSunHeight > minSunHeight) {
                // current object/shadow in screen coordinates
                var resArr3 = Utils.scale1Object4Drawing3D(shadowsAoA[j], gap, scale, minx, maxx, miny, maxy, origPoint );
                var curShad = resArr3[0];
                var numPnt = curShad.length;         // number of points in current shadow

                for (var i = 0; i < numPnt; i++) {  //Draw shadows polygon between 2-points of each line of shadow [LowShadow - UpShadow -nextPointUpShadow - nextPointLowShadow ]
                    xlow = curShad [i][0];
                    ylow = curShad [i][1];
                    xup = curShad [i][3];
                    yup = curShad [i][4];
                    if (i === numPnt - 1) {
                        xup2 = curShad [0][3];     //close to 1-st point
                        yup2 = curShad [0][4];
                        xlow2 = curShad [0][0];
                        ylow2 = curShad [0][1];
                    } else {
                        xup2 = curShad [i + 1][3];
                        yup2 = curShad [i + 1][4];
                        xlow2 = curShad [i + 1][0];
                        ylow2 = curShad [i + 1][1];
                    }

                    var plow = new Point(xlow, ylow);
                    var pup = new Point(xup, yup);
                    var pup2 = new Point(xup2, yup2);
                    var plow2 = new Point(xlow2, ylow2);

                    //////////////////    4debugging   4debugging   4debugging   4debugging  //////////////////
                    // var ct = new Shape.Circle({
                    //     center: plow,
                    //     radius: 2,
                    //     fillColor: mcol[(i*2%11)],
                    // });
                    // var pt = new PointText({
                    //     fillColor: mcol[(i*2%11)],
                    //     fontSize: hFont,
                    //     point: plow + new Point(i*8, i*8),
                    //     content: i.toFixed(0)
                    // });
                    // ct = new Shape.Circle({
                    // center: pup,
                    // radius: 2,
                    // fillColor: mcol[(i*2%11)],
                    // });
                    // pt = new PointText({
                    // fillColor: mcol[(i*2%11)],
                    // fontSize: hFont,
                    // point: pup + new Point(i*8, i*8),
                    // content: i.toFixed(0)
                    // });
                    // ct = new Shape.Circle({
                    //     center: pup2,
                    //     radius: 2,
                    //     fillColor: mcol[(i*2%11)],
                    // });
                    // pt = new PointText({
                    //     fillColor: mcol[(i*2%11)],
                    //     fontSize: hFont,
                    //     point: pup2 + new Point(i*8, i*8),
                    //     content: i.toFixed(0)
                    // });
                    // ct = new Shape.Circle({
                    //     center: plow2,
                    //     radius: 2,
                    //     fillColor: mcol[(i*2%11)],
                    // });
                    // pt = new PointText({
                    //     fillColor: mcol[(i*2%11)],
                    //     fontSize: hFont,
                    //     point: plow2 + new Point(i*8, i*8),
                    //     content: i.toFixed(0)
                    // });
                    //////////////////    4debugging   4debugging   4debugging   4debugging  //////////////////
                    var pathShad = new Path();

                    pathShad.add(plow);
                    pathShad.add(pup);
                    pathShad.add(pup2);
                    pathShad.add(plow2);
                    pathShad.add(plow);
                    pathShad.fillColor = 'lightgrey';
                }

                var pathShadLow = new Path();       //Draw shadows polygon between all points of Low shadow clockwise
                for (i = 0; i < numPnt; i++) {
                    xlow = curShad [i][0];
                    ylow = curShad [i][1];
                    plow = new Point(xlow, ylow);
                    pathShadLow.add(plow)
                }
                pathShadLow.fillColor = 'lightgrey';

            } else {                                   // dawn, twilight, night
                // LABELING
                {
                    function findMiddleColorComponent(comp1, comp2, percentChanged) {
                        return (comp2 - comp1) * percentChanged + comp1;
                    }

                    function findMiddleRGBColor(c1, c2, percentChanged) {
                        return new Color(findMiddleColorComponent(c1.red, c2.red, percentChanged),
                            findMiddleColorComponent(c1.green, c2.green, percentChanged),
                            findMiddleColorComponent(c1.blue, c2.blue, percentChanged));
                    }

                    if (curSunHeight >= 0) {
                        nightRect = new Path.Rectangle(from, to);
                        c1 = new Color(1, 1, 1, alf);
                        c2 = new Color(1, 1, 0, alf);
                        d = (minSunHeight - curSunHeight) / minSunHeight;
                        rc = findMiddleRGBColor(c1, c2, d);                              // white 1,1,1 to yellow 1,1,0
                        //console.log(curSunHeight.toFixed(2),d.toFixed(2),' white to yellow=',rc);
                        nightRect.fillColor = rc;
                    } else if (curSunHeight >= civilTwilight) {
                        nightRect = new Path.Rectangle(from, to);
                        // gradient = new Gradient(['yellow', 'red', 'blue', 'black']);
                        // nightRect.fillColor = new Color(gradient, from, to);
                        c1 = new Color(1, 1, 0, alf);
                        //c1 = window.varsValue.dawnColor;
                        c2 = new Color(1, 0, 0, alf);
                        d = curSunHeight / civilTwilight;
                        rc = findMiddleRGBColor(c1, c2, d);                              // yellow 1,1,0 to red 1,0,0
                        //console.log(curSunHeight.toFixed(2),d.toFixed(2),' yellow to red',rc);
                        nightRect.fillColor = rc;
                        window.varsValue.dawnColor = rc;
                    } else if (curSunHeight >= nauticalTwilight) {
                        nightRect = new Path.Rectangle(from, to);
                        c1 = new Color(1, 0, 0, alf);
                        //c1 = window.varsValue.dawnColor;
                        c2 = new Color(0, 0, 1, alf);
                        d = (curSunHeight - civilTwilight) / (nauticalTwilight - civilTwilight);
                        rc = findMiddleRGBColor(c1, c2, d);                                // red 1,0,0 to blue 0,0,1
                        //console.log(curSunHeight.toFixed(2),d.toFixed(2),' red to blue=',rc);
                        nightRect.fillColor = rc;
                    } else if (curSunHeight >= astronomicTwilight) {
                        nightRect = new Path.Rectangle(from, to);
                        c1 = new Color(0, 0, 1, alf);
                        //c1 = window.varsValue.dawnColor;
                        c2 = new Color(0, 0, 0, alf);
                        d = (curSunHeight - nauticalTwilight) / (astronomicTwilight - nauticalTwilight);
                        rc = findMiddleRGBColor(c1, c2, d);                                // blue 0,0,1 to black ,0,0,0
                        //console.log(curSunHeight.toFixed(2),d.toFixed(2),' blue to black=',rc);
                        nightRect.fillColor = rc;
                    } else if (curSunHeight <= astronomicTwilight) {
                        nightRect = new Path.Rectangle(from, to);
                        nightRect.fillColor = 'black';
                    }
                }
            }
        }
        //////////////////////////////////////    Drawing shadows   ////////////////////////////////////

        //////////////////////////////////////    Drawing objects   ////////////////////////////////////
        var numObj = objectsAoA.length;       //Amount of objects in array
        var txp, typ, ptob, ob1;
        var allPathObj = new CompoundPath();
        for (var l = 0; l < numObj; l++) {
            var resArr2 = Utils.scale1Object4Drawing3D(objectsAoA[l], gap, scale, minx, maxx, miny, maxy, origPoint );
            var sclObj = resArr2[0];
            var pathObj = new Path();
            for (var k = 0; k < sclObj.length; k++) {       //Draw scaled objects polygon
                txp = sclObj [k][0];
                typ = sclObj [k][1];
                ptob = new Point(txp, typ);
                if (k === 0) {
                    ob1 = ptob
                }
                pathObj.add(ptob);
            }
            pathObj.add(ob1);                 //1-st point for closing path
            allPathObj.addChild(pathObj)
        }
        allPathObj.fillColor = '#A994FF';
        allPathObj.strokeColor = 'blue';

        //var op = new Path.Circle( origPoint, 4 ); op.fillColor = "green";

        //////////////////////////////////////    Drawing objects   ////////////////////////////////////

        /////////////////////////////////////  Values in upper-left corner   //////////////////////////
        {
            var textLat = new PointText({
                fillColor: fontAxisColor,
                fontFamily: sunFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                point: [20, 20],
                content: window.locales['latLb'] + Utils.grad_number2text(lat)
            });
            var textLon = new PointText({
                fillColor: fontAxisColor,
                fontFamily: sunFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                point: [20, 40],
                content: window.locales['lonLb'] + Utils.grad_number2text(lon)
            });
            var textMoment = new PointText({
                fillColor: fontAxisColor,
                fontFamily: sunFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                point: [20, 60],
                content: window.locales["timeDropBtLb"] + sMoment +" "+ window.locales["dUTCLb"] +"="+ dUTC+"h"
            });
            var textSunHeight = new PointText({
                fillColor: fontAxisColor,
                fontFamily: sunFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                point: [20, 80],
                content: window.locales["sunHeightUp"] + Utils.grad_number2text(curSunHeight, 0, "°")
            });
            var textPaused= new PointText({
                fillColor: fontAxisColor,
                fontFamily: sunFont,
                fontWeight: axisFontWeight,
                fontSize: hFont,
                point: [20, 120],
            });
            if(window.varsValue.animationDayWorks || window.varsValue.animationYearWorks) {
                if (isPaused) {
                    textPaused.content = "Pausing...(click mouse to play)";
                } else {
                    textPaused.content = "Playing...(click mouse to stop)";
                }
            }
            else {textPaused.content = ""}

        }
        /////////////////////////////////////  Values in upper-left corner   //////////////////////////

    };

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
        var circle1 = new Shape.Circle({center: curPoint, radius: 10, fillColor: sunColor, strokeColor: fontSunColor});
        var sunSetTime = window.varsValue.sunSetTime, sunRiseTime = window.varsValue.sunRiseTime;
        var k = 0;

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

    window.Utils.yearPath = function (options) {
        ////////////////////////////////////////////      YEAR PATH AT  90° x 180° RESOLUTION     //////////////////////////
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

        if(! window.varsValue.showGraphicWorks) return false;  //show lines only with showGraphic()

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
            //Change sun to dark color if under horizon
            if (dayArr[k * 2] < 0) {
                circle.fillColor = sunColorDark;
            } else {
                circle.fillColor = sunColor;
            }
            k = k + 1;
            if (k > ArrX.length - 1) k = 0;

        };
    };

    window.Utils.drawSunDial = function () {
        ///////////////////////////////////////////////////////  DRAWING SUNDIALS   ///////////////////////////////
        var minx=0, maxx=0, miny=0, maxy=0;
        var tic2, ox2, oy2, xscl, yscl, s2, lx2, ly2, less2, hFont2, time;
        var width, height, tx, ty, txp, typ, month, hr;
        var arr = Utils.sunDials2AoA();               //Return Array of  Arrays of SunDial results
        var calcParam = arr[3], i;
        var B = Utils.grad_number2text(calcParam[0], 0);
        var L = Utils.grad_number2text(calcParam[1], 0);
        var dUTC = Utils.grad_number2text(calcParam[2], 2,"h");
        var gnomLen = calcParam[3];
        var ws1 = arr[0];       //Analemmas
        var ws2 = arr[1];       //6 minute's day lines

        for (i=1; i < ws1.length ; i++){
            if (ws1[i][6] < minx) {minx = ws1[i][6]}        // ws1[i][6] x dimentions
            if (ws1[i][6] > maxx) {maxx = ws1[i][6]}
        }
        for (i=1; i < ws1.length ; i++){
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
        from = new Point(gap, gap);   // BOUNDARY RECT EMPTY
        to = new Point(width - gap, height - gap);
        boundRect = new Path.Rectangle(from, to);
        boundRect.strokeColor = fontAxisColor; //whiteColor;
        boundRect.fillColor = whiteColor;
        var col, r=0, g=0 , b=0, labelside;
        // var mcol = ['#6307FF','#0A9CFF','#0919FF','#2E2E2E',
        //     '#FF951D','#0CEB13','#FF4E04','#FF0507',
        //     '#FF0BA9','#FF02E4','#FF8D07','#A994FF','#CB7CFF'];
        //var mnLet = ['J','F','M','A','M','J','J','A','S','O','N','D'];
        var hrB = Math.abs(calcParam[0]) < 24? 8: 9;        //hour for month labels depends of Latitude

        xscl = (width - 2 * gap) / dx2;    // scale on axis X
        yscl = (height - 2 * gap) / dy2;   // scale on axis Y
        if (xscl > yscl) less2 = yscl;     // Take smallest scale for proportional draw (the same scale on both axises)
        else less2 = xscl;
        s2 = less2;                        // s - is a scale: Pixels amount in 1 gnomon
        //console.log("scale="+s2);
        ox2 = width / 2;                   // Origin of X axis in pixels and GNOMON point
        oy2 = height / 2;                  // Origin of Y axis in pixels and GNOMON point
        var gap1 = height/2 - maxy*s2;           // gap from maxy to y_0 of screen
        var gap2 = height/2 + miny*s2;           // gap from miny to y_height of screen, assume miny negative
        if (gap1 > gap2) {oy2 = oy2 - (gap1-gap2)/2 + 2*gap}    //shift oy2 to the center of data
        else {oy2 = oy2 + (gap2-gap1)/2 - 2*gap}

        lx2 = dx2 * s2 / 2;                // Half length of X axis in pixels (the same scale on both axises)
        ly2 = dy2 * s2 / 2;                // Half length of Y axis in pixels (the same scale on both axises)
        tic2 = less2;                      // length of tics on axis

        hFont2 = less2 * 2.5;
        if (hFont2 < 12) hFont2 = 12;

        //////////////////////////////////////      DRAW CADRAN's ANNALEMAS
        var grd="", min="", sec="", pnt, pRadius=1, aDay, aMonth;
        time = ws1[1][1].split(":");
        grd= time[0];
        min= time[1];
        sec= time[2];
        //var hr1 = Utils.grad_textGMS2number(grd, min, sec);
        var sideBshow = B.substr(0,1) !== "-" ? 6: 12;       // Northern hemisphere show hours near near june, Southern near december.
        // Analemmas LOOP
        for (i=1; i < ws1.length ; i++){
            month = ws1[i][9];
            time = ws1[i][1].split(":");
            grd= time[0];
            min= time[1];
            sec= time[2];
            hr = Utils.grad_textGMS2number(grd, min, sec);
            aDay = moment(ws1[i][0]).format("D");
            aMonth = moment(ws1[i][0]).format("MMM");

            tx = ws1[i][6];
            ty = ws1[i][7];
            txp = ox2  + tx  * s2;
            typ = oy2  - ty  * s2;
            //console.log(i, month, hr, tx.toFixed(2), ty.toFixed(2), txp.toFixed(0), typ.toFixed(0), mcol[month] );
            if (tx !== 0 && ty !== 0 )   {
                pnt = new Shape.Circle({
                    center: new Point(txp, typ),
                    radius: pRadius,
                    fillColor: mcol[month],      //draw definite color each month
                });
                if ( month === sideBshow && +aDay === 21) {         //Starts new hour. Print HOUR value near equinox (summer B=N or winter B=S)
                    if (sideBshow === 6 ) {labelside = 4*tic}
                    else {labelside = -4*tic}                       // Southern hemisphere labels upstairs
                    //hr1 = hr;
                    text = new PointText({
                        point: [txp-tic, typ+labelside],
                        content: hr,
                        fillColor: fontAxisColor,
                        fontFamily: axisFont,
                        fontWeight: axisFontWeight,
                        fontSize: hFont
                    });
                }
                if (+aDay === 1 && hr === hrB) {      //New month starts, print Letter on 9hrs
                    text = new PointText({
                        point: [txp, typ],
                        content: aMonth,            // mnLet[month-1],
                        fillColor: mcol[month],
                        fontFamily: axisFont,
                        fontWeight: axisFontWeight,
                        fontSize: hFont
                    });

                }

            }
        }
        //Lines&Labels
        var gnomPointC = new paper.Point(ox2, oy2 ); //GNOMON center
        var circle2;
        circle2 = new Shape.Circle({center: gnomPointC, radius: 6, fillColor: sunColor, strokeColor: fontSunColor});
        circle2 = new Shape.Circle({center: gnomPointC, radius: 1, fillColor: fontSunColor, strokeColor: fontSunColor});
        //GNOMON length
        var tmp = new Point(gnomLen/2*s2, 0);
        var ticy = new Point(0, tic);
        var ticf = new Point(0, 1.5*tic);
        var gnomPoint = new Point(90, 30);
        circle2 = new Shape.Circle({center: gnomPoint, radius: 6, fillColor: sunColor, strokeColor: fontSunColor});
        circle2 = new Shape.Circle({center: gnomPoint, radius: 1, fillColor: fontSunColor, strokeColor: fontSunColor});
        var gnomStart = gnomPoint - tmp;
        var gnomEnd =   gnomPoint + tmp;
        var gnom = new Path.Line(gnomStart ,gnomEnd);
        //GNOMON tics
        var gnomt1 = new Path.Line(gnomStart-ticy , gnomStart+ticy);
        var gnomt2 = new Path.Line(gnomEnd-ticy , gnomEnd+ticy);
        gnom.strokeColor = 'red'; gnomt1.strokeColor = 'red'; gnomt2.strokeColor = 'red';
        // Nort Arrows
        var lineN = new Path.Line(new Point(ox2 , 4*gap) , new Point(ox2 , 4*gap + gnomLen*s2) );
        lineN.strokeColor = 'red';
        lineN = new Path.Line(new Point(ox2 , 4*gap) , new Point(ox2-gap , 8*gap) );
        lineN.strokeColor = 'red';
        lineN = new Path.Line(new Point(ox2 , 4*gap) , new Point(ox2+gap , 8*gap) );
        lineN.strokeColor = 'red';
        // South Arrows
        lineN = new Path.Line(new Point(ox2 , height - 4*gap) , new Point(ox2 , height - 4*gap - gnomLen*s2) );
        lineN.strokeColor = 'red';
        lineN = new Path.Line(new Point(ox2 , height - 4*gap) , new Point(ox2-gap , height - 8*gap) );
        lineN.strokeColor = 'red';
        lineN = new Path.Line(new Point(ox2 , height - 4*gap) , new Point(ox2+gap , height -  8*gap) );
        lineN.strokeColor = 'red';
        text = new PointText({
            point: new Point(ox2 , height - 2*gap),
            content: window.locales['south'],
            fillColor: fontSunColor,
            fontFamily: axisFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            justification: 'center'
        });
        if (window.varsValue.B === -90) {text.content =window.locales['north'] }    //south pole

        text = new PointText({
            point: new Point(ox2 , 3*gap),
            content: window.locales['north'],
            fillColor: fontSunColor,
            fontFamily: axisFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            justification: 'center'
        });
        if (window.varsValue.B === 90) {text.content =window.locales['south'] }    //north pole

        var gl =  window.locales['gnomon'];             //+ "=" + gnomLen.toFixed(2);
        text = new PointText({
            point: gnomPoint - ticf,                       //gnomStart - tic,
            content: gl,
            fillColor: fontSunColor,
            fontFamily: axisFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            justification: 'center'
        });
        text = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 50],
            content: window.locales['latLb'] + B
        });
        text = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 70],
            content: window.locales['lonLb'] + L
        });
        text = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 90],
            content: window.locales['dUTCLb'] + ": "+dUTC
        });
        text = new PointText({
            fillColor: fontAxisColor,
            fontFamily: sunFont,
            fontWeight: axisFontWeight,
            fontSize: hFont,
            point: [20, 110],
            content: window.locales['year'] + sYear
        });

        //6 minute's 1-st day of each month lines LOOP
        for (i=1; i < ws2.length-12 ; i++){     //i=0  Array of HEADER
            month = ws2[i][9];
            //console.log("i="+i+" ws[i][9]="+ws2[i][0]+" "+ws2[i][1]+ws2[i][9]);
            tx = ws2[i][6];
            ty = ws2[i][7];
            txp = ox2  + tx  * s2;
            typ = oy2  - ty  * s2;
            if (tx !== 0 && ty !== 0 )   {
                pnt = new Shape.Circle({
                    center: new Point(txp, typ),
                    radius: pRadius,
                    fillColor: mcol[month],      //draw definite color each month
                });
            }
        }
    };

    window.Utils.shadowAnimationDay = function (options) {
        var AoAobj = options.AoA;       // Array of objects. Each objects described by points arrays.
        var sMoment = options.aMoment;  // Array of objects [  [ [x,y,zLow,zUp], [x,y,zLow zUp] ],........ ]
        var lat = window.varsValue.B;
        var lon = window.varsValue.L;
        var dUTCval = options.dUTCval;
        var temp = options.Temperature;
        var press = options.Pressure;
        var minSunHeight = options.minSunHeight;

        var atMoment;
        var aDuration = 40; //timelaps in miliseconds

        window.varsValue.animationYearWorks = false;
        window.varsValue.animationDayWorks  = true;
        window.varsValue.drawShadowWorks  =   false;
        window.varsValue.showGraphicWorks  =  false;
        clearTimeout(window.varsValue.yearTimeOut) ;        //2stop  shadowAnimationYear

        var options3 = {
            AoA: AoAobj,
        };
        // console.log(AoAobj[0]);
        // console.log(AoAobj[1]);
        var resArr = Utils.defineDrawScale(options3);
        //var scale =resArr[0];
        var minx = resArr[1];
        var maxx = resArr[2];
        var miny = resArr[3];
        var maxy = resArr[4];

        (function delay(duration) {

            if (!isPaused) {
                atMoment = moment(sMoment, "").add(2, "minute");
                sMoment = moment(atMoment, "").format('YYYY-MM-DD HH:mm:ss');
            }

            var options = {
                AoA: AoAobj,               // Array of objects [  [ [x,y,zLow,zUp], [x,y,zLow zUp] ],........ ]
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                minSunHeight: minSunHeight
            };
            var shadArr = Utils.calcObjectsShadow3D(options);
            scale = window.varsValue.scale;     //May be changed with mouse wheel

            var options2 = {
                AoAshadows: shadArr,
                AoAobjects: AoAobj,        // [ Home3d,  Roof3d,  Fence23d ]
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                minSunHeight: minSunHeight,
                scale: scale,
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy,
                orgPoint: window.varsValue.originPoint
            };

            Utils.drawShadow(options2);

            window.varsValue.dayTimeOut = setTimeout(delay, duration, duration);

        })(aDuration);

    };

    window.Utils.shadowAnimationYear = function (options) {
        var AoAobj = options.AoA;   // Array of objects. Each objects described by points arrays.
        var sMoment = options.aMoment;
        var lat = window.varsValue.B;
        var lon = window.varsValue.L;
        var dUTCval = options.dUTCval;
        var temp = options.Temperature;
        var press = options.Pressure;
        var minSunHeight = options.minSunHeight;

        var atMoment;
        var aDuration = 40; //timelaps in miliseconds
        var counter = 0;

        window.varsValue.animationYearWorks = true;
        window.varsValue.animationDayWorks  = false;
        window.varsValue.drawShadowWorks  =  false;
        window.varsValue.showGraphicWorks  =  false;
        clearTimeout(window.varsValue.dayTimeOut) ;         //2stop  shadowAnimationYear

        //Define SCALE 4 drawing here. Finding biggest x,y range from all objects of AoAobj
        var options3 = {
            AoA: AoAobj,
        };
        var resArr = Utils.defineDrawScale(options3);
        //var scale =resArr[0];
        var minx = resArr[1];
        var maxx = resArr[2];
        var miny = resArr[3];
        var maxy = resArr[4];

        (function delay(duration) {

            if (!isPaused) {
                atMoment = moment(sMoment, "").add(1, "day");
                sMoment = moment(atMoment, "").format('YYYY-MM-DD HH:mm:ss');
            }
            scale = window.varsValue.scale;     //May be changed with mouse wheel

            var options = {
                AoA:  AoAobj ,               // Array of objects [  [ [x,y,zLow,zUp], [x,y,zLow zUp] ],........ ]
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                minSunHeight: minSunHeight
            };
            var shadArr = Utils.calcObjectsShadow3D (options);

            var options2 = {
                AoAshadows: shadArr,
                AoAobjects:  AoAobj  ,        // [ Home3d,  Roof3d,  Fence23d ]
                aMoment: sMoment,
                Latitude: lat,
                Longitude: lon,
                dUTCval: dUTCval,
                Temperature: temp,
                Pressure: press,
                minSunHeight: minSunHeight,
                scale: scale,
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy,
                orgPoint: window.varsValue.originPoint
            };

            Utils.drawShadow(options2 );

            window.varsValue.yearTimeOut = setTimeout(delay, duration, duration);

        })(aDuration);

    };



})();
