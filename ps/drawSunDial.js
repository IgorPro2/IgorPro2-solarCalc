;(function () {

    var graphicContainer2 = document.getElementById("graphicContainer2");
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




///////////   SHOW GRAPHIC   SHOW GRAPhIC   SHOW GRAPHIC   SHOW GRAPhIC SHOW GRAPHIC   SHOW GRAPhIC   SHOW GRAPHIC  ////

    window.Utils.showGraphic2 = function (redraw) {
        var axisLayer = new Layer();
        axisLayer.name = "axisLyr";

        //////////////////////////////////////      CLEAR ALL LAYERS BEFORE DRAWING
        var layers = paper.project.layers;
        for (i = 0; i < layers.length - 1; i++) {
            layers[i].clear();
            //console.log("Layer2Clear= "+layers[i].name);
        }
        paper.project._activeLayer.clear();

        /////////////////////////////////////////////////      DEFINE SUNDIAL DRAW DIMENSIONS          /////////////////////////////////

        var arr = Utils.sunDials2AoA();               //Return Array of  Arrays of SunDial results
        var ws1 = arr[0];
        var minx=0, maxx=0, miny=0, maxy=0;
        var dx2 = maxx-minx;                       //range on axis x at SunDials
        var dy2 = maxy-miny;                       //range on axis y at SunDials
        var tic2, ox2, oy2, tx2, ty2, s2, lx2, ly2, less2;

        for (i=1; i < ws1.length+1 ; i++){
            if (ws1[i][6] < minx) {minx = ws1[i][6]}        // ws1[i][6] x dimentions
            if (ws1[i][6] > maxx) {maxx = ws1[i][6]}
        }
        for (i=1; i < ws1.length+1 ; i++){
            if (ws1[i][7] < miny) {miny = ws1[i][7]}        // ws1[i][7] y dimentions
            if (ws1[i][7] > maxy) {maxy = ws1[i][7]}
        }

        paper.view.viewSize = new Size(window.innerWidth, window.innerHeight);
        width = paper.view.viewSize.width;
        height = paper.view.viewSize.height;

        tx2 = (width - 2 * gap) / dx2;    //scale on axis X
        ty2 = (height - 2 * gap) / dy2;   //scale on axis Y
        if (tx2 > ty2) less2 = ty2;             // Take smallest scale for proportional draw (the same scale on both axises)
        else less2 = tx2;
        s2 = less2;                           // s - is a scale: Pixels amount in one Degree°
        ox2 = width / 2;                     // Origin of X axis in pixels
        oy2 = height / 2;                    // Origin of Y axis in pixels
        lx2 = dx2 * s2 / 2;                    // Half length of X axis in pixels (the same scale on both axises)
        ly2 = dy2 * s2 / 2;                    // Half length of Y axis in pixels (the same scale on both axises)
        tic2 = less2;                         // length of tics on axis

        hFont2 = less2 * 2.5;
        if (hFont2 < 12) hFont2 = 12;

        //////////////////////////////////////      DRAW AXIS
        window.Utils.drawAxis();


    };

    var debouncedShowGraphic = window._.debounce(window.Utils.showGraphic2, 300);
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

    window.Utils.drawAxis2 = function (options) {

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

})();
