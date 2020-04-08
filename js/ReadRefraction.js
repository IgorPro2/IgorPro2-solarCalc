;(function () {
//-- SOURCE is Russian Nautical Handbook "MT-75" -->
//--each string contain: HEIGHT IN DEGREES, VERTICAL REFRACTION IN MINUTES -->
//-- 163 lines -->   string name="RefractionTP">
    let RefractionTP =
        "0.000000000000,34.5," +
        "0.050000000000,33.8," +
        "0.100000000000,33.2," +
        "0.150000000000,32.5," +
        "0.200000000000,31.9," +
        "0.250000000000,31.4," +
        "0.300000000000,30.8," +
        "0.350000000000,30.2," +
        "0.400000000000,29.7," +
        "0.450000000000,29.2," +
        "0.500000000000,28.7," +
        "0.550000000000,28.2," +
        "0.600000000000,27.7," +
        "0.650000000000,27.2," +
        "0.700000000000,26.8," +
        "0.750000000000,26.3," +
        "0.800000000000,25.9," +
        "0.850000000000,25.5," +
        "0.900000000000,25.1," +
        "0.950000000000,24.7," +
        "1.000000000000,24.3," +
        "1.050000000000,23.9," +
        "1.100000000000,23.5," +
        "1.150000000000,23.2," +
        "1.200000000000,22.8," +
        "1.250000000000,22.5," +
        "1.300000000000,22.2," +
        "1.350000000000,21.8," +
        "1.400000000000,21.5," +
        "1.450000000000,21.2," +
        "1.500000000000,20.9," +
        "1.583333333333,20.4," +
        "1.666666666667,19.9," +
        "1.750000000000,19.5," +
        "1.833333333333,19," +
        "1.916666666667,18.6," +
        "2.000000000000,18.2," +
        "2.083333333333,17.8," +
        "2.166666666667,17.5," +
        "2.250000000000,17.1," +
        "2.333333333333,16.7," +
        "2.416666666667,16.4," +
        "2.500000000000,16.1," +
        "2.583333333333,15.8," +
        "2.666666666667,15.5," +
        "2.750000000000,15.2," +
        "2.833333333333,14.9," +
        "2.916666666667,14.6," +
        "3.000000000000,14.3," +
        "3.083333333333,14.1," +
        "3.166666666667,13.8," +
        "3.250000000000,13.6," +
        "3.333333333333,13.4," +
        "3.416666666667,13.1," +
        "3.500000000000,12.9," +
        "3.583333333333,12.7," +
        "3.666666666667,12.5," +
        "3.750000000000,12.3," +
        "3.833333333333,12.1," +
        "3.916666666667,11.9," +
        "4.000000000000,11.7," +
        "4.083333333333,11.5," +
        "4.166666666667,11.4," +
        "4.250000000000,11.2," +
        "4.333333333333,11," +
        "4.416666666667,10.9," +
        "4.500000000000,10.7," +
        "4.583333333333,10.5," +
        "4.666666666667,10.4," +
        "4.750000000000,10.3," +
        "4.833333333333,10.1," +
        "4.916666666667,10," +
        "5.000000000000,9.8," +
        "5.083333333333,9.7," +
        "5.166666666667,9.6," +
        "5.250000000000,9.4," +
        "5.333333333333,9.3," +
        "5.416666666667,9.2," +
        "5.500000000000,9.1," +
        "5.583333333333,9," +
        "5.666666666667,8.9," +
        "5.750000000000,8.8," +
        "5.833333333333,8.6," +
        "5.916666666667,8.5," +
        "6.000000000000,8.4," +
        "6.166666666667,8.2," +
        "6.333333333333,8.1," +
        "6.500000000000,7.9," +
        "6.666666666667,7.7," +
        "6.833333333333,7.5," +
        "7.000000000000,7.4," +
        "7.166666666667,7.2," +
        "7.333333333333,7.1," +
        "7.500000000000,6.9," +
        "7.666666666667,6.8," +
        "7.833333333333,6.7," +
        "8.000000000000,6.5," +
        "8.166666666667,6.4," +
        "8.333333333333,6.3," +
        "8.500000000000,6.2," +
        "8.666666666667,6.1," +
        "8.833333333333,6," +
        "9.000000000000,5.9," +
        "9.166666666667,5.8," +
        "9.333333333333,5.7," +
        "9.500000000000,5.6," +
        "9.666666666667,5.5," +
        "9.833333333333,5.4," +
        "10.000000000000,5.3," +
        "10.116666666667,5.25," +
        "10.316666666667,5.15," +
        "10.533333333333,5.05," +
        "10.750000000000,4.95," +
        "10.966666666667,4.85," +
        "11.216666666667,4.75," +
        "11.466666666667,4.65," +
        "11.716666666667,4.55," +
        "11.983333333333,4.45," +
        "12.266666666667,4.35," +
        "12.550000000000,4.25," +
        "12.866666666667,4.15," +
        "13.183333333333,4.05," +
        "13.516666666667,3.95," +
        "13.866666666667,3.85," +
        "14.233333333333,3.75," +
        "14.616666666667,3.65," +
        "15.033333333333,3.55," +
        "15.450000000000,3.45," +
        "15.916666666667,3.35," +
        "16.383333333333,3.25," +
        "16.883333333333,3.15," +
        "17.416666666667,3.05," +
        "17.983333333333,2.95," +
        "18.583333333333,2.85," +
        "19.233333333333,2.75," +
        "19.916666666667,2.65," +
        "20.633333333333,2.55," +
        "21.416666666667,2.45," +
        "22.250000000000,2.35," +
        "23.150000000000,2.25," +
        "24.116666666667,2.15," +
        "25.166666666667,2.05," +
        "26.300000000000,1.95," +
        "27.533333333333,1.85," +
        "28.866666666667,1.75," +
        "30.316666666667,1.65," +
        "31.916666666667,1.55," +
        "33.666666666667,1.45," +
        "35.583333333333,1.35," +
        "37.716666666667,1.25," +
        "40.050000000000,1.15," +
        "42.650000000000,1.05," +
        "45.516666666667,0.95," +
        "48.700000000000,0.85," +
        "52.216666666667,0.75," +
        "56.100000000000,0.65," +
        "60.383333333333,0.55," +
        "65.050000000000,0.45," +
        "70.116666666667,0.35," +
        "75.516666666667,0.25," +
        "81.183333333333,0.15," +
        "87.033333333333,0.05," +
        "90.000000000000,0";

//string name="dRefractionT">
//-- first row contain: Ambient Temperature in decimal DEGREES -->
//-- left column contain: Height in decimal DEGREES -->
//-- other values are appropriate corrections for VERTICAL REFRACTION in decimal MINUTES -->
    let dRefractionT = "-40,-40,-35,-30,-25,-20,-15,-10,-5,0,5,10,15,20,25,30,35,40," +
        "    0.0,-13.6,-11.9,-10.2,-8.7,-7.3,-5.9,-4.6,-3.4,-2.2,-1.1,0,1,2,2.9,3.8,4.6,5.5," +
        "    0.3,-11.3,-9.8,-8.5,-7.2,-6,-4.9,-3.8,-2.8,-1.8,-0.9,0,0.8,1.7,2.4,3.2,3.9,4.6," +
        "    0.7,-9.5,-8.3,-7.2,-6.1,-5.1,-4.2,-3.2,-2.4,-1.6,-0.8,0,0.7,1.4,2.1,2.7,3.3,3.9," +
        "    1.0,-8.1,-7.1,-6.1,-5.2,-4.4,-3.6,-2.8,-2,-1.3,-0.6,0,0.6,1.2,1.8,2.3,2.8,3.4," +
        "    1.3,-7,-6.1,-5.3,-4.5,-3.8,-3.1,-2.4,-1.8,-1.2,-0.6,0,0.5,1.1,1.6,2,2.5,2.9," +
        "1.7,-6.1,-5.3,-4.6,-4,-3.3,-2.7,-2.1,-1.5,-1,-0.5,0,0.5,0.9,1.4,1.8,2.2,2.6," +
        "2,-5.4,-4.7,4.1,-3.5,-2.9,-2.4,-1.9,-1.4,-0.9,-0.4,0,0.4,0.8,1.2,1.6,1.9,2.3," +
        "3,-3.9,-3.4,-2.9,-2.5,-2.1,-1.7,-1.4,-1,-0.6,-0.3,0,0.3,0.6,0.9,1.2,1.4,1.7," +
        "4,-3,-2.6,-2.3,-2,-1.6,-1.3,-1,-0.8,-0.5,-0.2,0,0.2,0.5,0.7,0.9,1.1,1.3," +
        "5,-2.4,-2.1,-1.8,-1.6,-1.3,-1.1,-0.8,-0.6,-0.4,-0.2,0,0.2,0.4,0.6,0.7,0.9,1," +
        "6,-2,-1.8,-1.5,-1.3,-1.1,-0.9,-0.7,-0.5,-0.3,-0.2,0,0.2,0.3,0.5,0.6,0.8,0.9," +
        "7,-1.7,-1.5,-1.3,-1.1,-1,-0.8,-0.6,-0.4,-0.3,-0.1,0,0.1,0.3,0.4,0.5,0.6,0.8," +
        "8,-1.5,-1.3,-1.2,-1,-0.8,-0.7,-0.5,-0.4,-0.3,-0.1,0,0.1,0.2,0.4,0.5,0.6,0.7," +
        "9,-1.3,-1.2,1,-0.9,-0.7,-0.6,-0.5,-0.3,-0.2,-0.1,0,0.1,0.2,0.3,0.4,0.5,0.6," +
        "10,-1.2,-1.1,-0.9,-0.8,-0.7,-0.5,-0.4,-0.3,-0.2,-0.1,0,0.1,0.2,0.3,0.4,0.4,0.5," +
        "20,-0.6,-0.5,-0.5,-0.4,-0.3,-0.3,-0.2,-0.2,-0.1,0,0,0,0.1,0.1,0.2,0.2,0.3," +
        "30,-0.4,-0.3,-0.3,-0.2,-0.2,-0.2,-0.1,-0.1,-0.1,0,0,0,0.1,0.1,0.1,0.1,0.2," +
        "40,-0.3,-0.2,-0.2,-0.2,-0.1,-0.1,-0.1,-0.1,-0.1,0,0,0,0,0.1,0.1,0.1,0.1," +
        "50,-0.2,-0.1,-0.1,-0.1,0.1,-0.1,-0.1,-0.1,0,0,0,0,0,0.1,0.1,0.1,0.1," +
        "60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";

//string name="dRefractionP">
//-- first row contain: Atmospheric Pressure in mm Hg -->
//-- left column contain: Height in decimal DEGREES -->
//-- other values are appropriate corrections for VERTICAL REFRACTION in decimal MINUTES -->
    let dRefractionP = "720,720,725,730,735,740,745,750,755,760,765,770,775,780,785,790," +
        "    0,2,1.7,1.5,1.2,1,0.7,0.5,0.2,0,-0.2,-0.5,-0.7,-1,-1.2,-1.5," +
        "    1,1.3,1.2,1,0.8,0.7,0.5,0.3,0.2,0,-0.2,-0.3,-0.5,-0.7,-0.8,-1," +
        "    2,1,0.9,0.7,0.6,0.5,0.4,0.2,0.1,0,-0.1,-0.2,-0.4,-0.5,-0.6,-0.7," +
        "    3,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1,0,-0.1,-0.2,-0.3,-0.4,-0.5,-0.6," +
        "    4,0.6,0.6,0.5,0.4,0.3,0.2,0.2,0.1,0,-0.1,-0.2,-0.2,-0.3,-0.4,-0.5," +
        "    5,0.5,0.5,0.4,0.3,0.3,0.2,0.1,0.1,0,-0.1,-0.1,-0.2,-0.3,-0.3,-0.4," +
        "6,0.4,0.4,0.3,0.3,0.2,0.2,0.1,0.1,0,-0.1,-0.1,-0.2,-0.2,-0.3,-0.3," +
        "7,0.4,0.3,0.3,0.2,0.2,0.2,0.1,0,0,0,-0.1,-0.2,-0.2,-0.3,-0.3," +
        "8,0.4,0.3,0.3,0.2,0.2,0.1,0.1,0,0,0,-0.1,-0.1,-0.2,-0.2,-0.3," +
        "9,0.3,0.3,0.2,0.2,0.2,0.1,0.1,0,0,0,-0.1,-0.1,-0.2,-0.2,-0.2," +
        "10,0.3,0.2,0.2,0.2,0.1,0.1,0.1,0,0,0,-0.1,-0.1,-0.1,-0.2,-0.2," +
        "20,0.1,0.1,0.1,0.1,0.1,0,0,0,0,0,0,0,-0.1,-0.1,-0.1," +
        "30,0.1,0.1,0.1,0.1,0,0,0,0,0,0,0,0,0,-0.1,-0.1," +
        "40,0.1,0.1,0.1,0,0,0,0,0,0,0,0,0,0,0,-0.1," +
        "50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";

//  filling 2D Arrays of Refraction 4 use in ReadRefraction class
    let dref;
    let wordsR, wordsT, wordsP; //Arrays
    let RefArr = matrixArray(163, 2);
    let dTArr = matrixArray(21, 18);
    let dPArr = matrixArray(16, 16);
    let row, col, i;
//Utils.grad_textGMS2number(g, m, s)
    wordsR = RefractionTP.split(",");
    i = 0;
    for (row = 0; row < 163; row++) {
        for (col = 0; col < 2; col++) {
            dref = Utils.grad_textGMS2number(wordsR[i]);
            RefArr[row][col] = dref;
            i++;
        }
    }
    wordsT = dRefractionT.split(",");
    i = 0;
    for (row = 0; row < 21; row++) {
        for (col = 0; col < 18; col++) {
            dref = Utils.grad_textGMS2number(wordsT[i]);
            dTArr[row][col] = dref;
            i++;
        }
    }
    wordsP = dRefractionP.split(",");
    i = 0;
    for (row = 0; row < 16; row++) {
        for (col = 0; col < 16; col++) {
            dref = Utils.grad_textGMS2number(wordsP[i]);
            dPArr[row][col] = dref;
            i++;
        }
    }

// Return vertical Refraction at (HeightDD) in DecimalDegrees in form of ResultsArray where:
// Result[0] = FinalRefraction;  Result[1] = NormalRefraction; Result[2] = correction for Temperature; Result[3] = correction for Pressure;
//static float RefArr[] [] = new float[163] [2];      //Arrays for refraction values was declared in MainActivity as static
//static float dTArr[] [] = new float[21] [18];
//static float dPArr[] [] = new float[16] [16];
    function getRefractionTP(HeightDD, SunRadius, Temp, Press) {
        // HeightDD;                     must be in degrees
        // SunRadius;                    must be in degrees
        // Temp;                         must be in decimal degrees
        // Pres;                         must be in millimeters of mercury
        let hh;
        let Result = [];
        let Hprev, Hhere, Rprev, Rhere, Hdiff;
        let Refraction = 0, RefractionTP, dRTemp = 0, dRPress = 0, atLowTemp, atUpTemp, lowTemp = 0, upTemp = 0, grade,
            valPrev, valHere;
        let lowPress = 0, upPress = 0, atLowPress, atUpPress, UnderHrz;
        let i, aRowT, aRowP, aColT = 0, aColP = 0;
        //////////////////////////////////////////////For Temperature Correction
        hh = HeightDD;
        if (Temp < -40) Temp = -40;          //MT-75 limitation
        if (Temp > 40) Temp = 40;
        aRowT = 0;
        for (i = 0; i < 21; i++) {           //Find upper H  for Temp correction
            if (hh <= dTArr[i][0]) {
                aRowT = i;                    //Row where given hh less than H value in 1-st column of dTArr[]
                break;
            }
        }
        if (aRowT > 0) {
            for (i = 1; i <= 17; i++) {              //Find upper Temp
                if (Temp === -40) {
                    aColT = i + 1;
                    break;
                } else if (Temp <= dTArr[0][i]) {    //header string of temperature 1-st row of dTArr[]
                    aColT = i;                     // Column where T in  TempCorrection table is higher(or equal) than given Temp
                    break;                         // Now we'll find correction in 4 adjacent cells, and cell (aRowT,aColT) is rightlowest one
                }
            }
            upTemp = dTArr[0][aColT];
            lowTemp = dTArr[0][aColT - 1];
        } else dRTemp = 0;                      //' hh > 60°
        ///////////////////////////////////////////For Pressure Correction
        if (Press < 720) Press = 720;
        if (Press > 790) Press = 790;          //MT-75 limitation
        aRowP = 0;
        for (i = 1; i < 16; i++) {           //Find upper H  for Pressure correction
            if (hh <= dPArr[i][0]) {
                aRowP = i;                    //Row where given hh less than H value in 1-st column of dPArr[]
                break;
            }
        }
        if (aRowP > 0) {
            for (i = 1; i < 16; i++) {              //Find upper Press
                if (Press === 720) {
                    aColP = i + 1;
                    break;
                } else if (Press <= dPArr[0][i]) {    //header string of Presserature 1-st row of dTArr[]
                    aColP = i;                     // Column where Pressure in  table is higher(or equal) than given Pressure
                    break;                         // Now we'll find correction in 4 adjacent cells, and cell (aRowP,aColP) is rightlowest one
                }
            }
            upPress = dPArr[0][aColP];
            lowPress = dPArr[0][aColP - 1];
        } else dRPress = 0;                      //' hh > 50°
        //////////////////////// Block for UnderHrz ////////////////////////
        if ((hh <= 0) && (dRTemp !== 0)) {
            atLowTemp = dTArr[1][aColT - 1];
            atUpTemp = dTArr[1][aColT];
            grade = (Temp - lowTemp) / (upTemp - lowTemp);
            dRTemp = atLowTemp + (atUpTemp - atLowTemp) * grade;
            dRTemp = dRTemp * -1;
        }
        if ((hh <= 0) && (dRPress !== 0)) {
            atLowPress = dPArr[1] [aColP - 1];
            atUpPress = dPArr[1] [aColP];
            grade = (Press - lowPress) / (upPress - lowPress);
            dRPress = atLowPress + (atUpPress - atLowPress) * grade;
            dRPress = dRPress * -1;
        }
        UnderHrz = ((35.4 / 60) + dRTemp / 60 + dRPress / 60) * -1;   //Limit for UpperEdge of Sun  correction.  IT WAS: (-36f / 60)

        //////////////////       Main part of refraction   //////////////////
        for (i = 0; i < 163; i++) {
            if (hh <= 0 && hh >= (UnderHrz - SunRadius)) {
                // Assume that Solar Center somewhere between horizon and (SunRadius+UnderHrz) under horizon. We pull it up on ~35.4'(at normal meteo)
                // At the moments of dusk and dawn to SunRadius may be added Inclination of apparent horizon (to see the edge of Sun from given altitude)
                Refraction = 35.4;

                atLowTemp = dTArr[1] [aColT - 1];
                atUpTemp = dTArr[1] [aColT];
                grade = (Temp - lowTemp) / (upTemp - lowTemp);
                dRTemp = atLowTemp + (atUpTemp - atLowTemp) * grade;     //interpolation by Temperature at height = 0°
                dRTemp = dRTemp * -1;                                    //2change sign, cause we calc Refraction for substraction from Height !!

                atLowPress = dPArr[1] [aColP - 1];
                atUpPress = dPArr[1] [aColP];
                grade = (Press - lowPress) / (upPress - lowPress);
                dRPress = atLowPress + (atUpPress - atLowPress) * grade; //interpolation by Temperature at height = 0°
                dRPress = dRPress * -1;                                  //2change sign, cause we calc Refraction for substraction from Height !!

                RefractionTP = Refraction + dRTemp + dRPress;
                Result[0] = RefractionTP / 60;                  // ALL RESULTS IN DEGREES
                Result[1] = Refraction / 60;
                Result[2] = dRTemp / 60;
                Result[3] = dRPress / 60;
                return Result;
            } else if (hh < (UnderHrz - SunRadius)) {              //  Sun is under horizon
                Result[0] = 0;
                Result[1] = 0;
                Result[2] = 0;
                Result[3] = 0;
                return Result;
            } else if (hh < RefArr[i] [0]) {                       // INTERPOLATION IN MAIN PART OF REFRACTION.
                Hprev = RefArr[i - 1][0];
                Rprev = RefArr[i - 1][1];
                Hhere = RefArr[i]    [0];
                Rhere = RefArr[i]    [1];
                Hdiff = (hh - Hprev) / (Hhere - Hprev);
                Refraction = Rprev + (Rhere - Rprev) * Hdiff;   //We skip minus sign in Table values, cause we calc Refraction for substraction from Height !!
                break;
            } else if (hh === RefArr[i] [0]) {
                Refraction = RefArr[i] [1];                     //Exact table value when height = hh
                break;
            }
        }

        /////////////////////// Temperature correction ////////////////////////////////////
        if (aRowT > 0) {
            //interpolation by Height at lowest Temperature
            Hprev = dTArr[aRowT - 1] [0];
            Hhere = dTArr[aRowT] [0];
            valPrev = dTArr[aRowT - 1] [aColT - 1];
            valHere = dTArr[aRowT] [aColT - 1];
            grade = (hh - Hprev) / (Hhere - Hprev);
            atLowTemp = valPrev + (valHere - valPrev) * grade;
            //interpolation by Height at highest Temperature
            valPrev = dTArr[aRowT - 1] [aColT];
            valHere = dTArr[aRowT] [aColT];
            atUpTemp = valPrev + (valHere - valPrev) * grade;
            grade = (Temp - lowTemp) / (upTemp - lowTemp);
            dRTemp = atLowTemp + (atUpTemp - atLowTemp) * grade;     //interpolation by Temperature
            dRTemp = dRTemp * -1;                                    //2change sign, cause we calc Refraction for substraction from Height
        }
        /////////////////////// Pressure correction ////////////////////////////////////
        if (aRowP > 0) {
            //interpolation by Height at lowest Pressure
            Hprev = dPArr[aRowP - 1] [0];
            Hhere = dPArr[aRowP] [0];
            valPrev = dPArr[aRowP - 1] [aColP - 1];
            valHere = dPArr[aRowP] [aColP - 1];
            grade = (hh - Hprev) / (Hhere - Hprev);
            atLowPress = valPrev + (valHere - valPrev) * grade;
            //interpolation by Height at highest Pressure
            valPrev = dPArr[aRowP - 1] [aColP];
            valHere = dPArr[aRowP] [aColP];
            atUpPress = valPrev + (valHere - valPrev) * grade;
            grade = (Press - lowPress) / (upPress - lowPress);
            dRPress = atLowPress + (atUpPress - atLowPress) * grade;    //interpolation by Pressure
            dRPress = dRPress * -1;                                    //2change sign, cause we calc Refraction for substraction from Height
        }
        RefractionTP = Refraction + dRTemp + dRPress;   // ALL RESULTS IN DEGREES
        Result[0] = RefractionTP / 60;
        Result[1] = Refraction / 60;
        Result[2] = dRTemp / 60;
        Result[3] = dRPress / 60;
        return Result;
    }

// function for declaring 2D Arrays
    function matrixArray(rows, columns) {
        let arr = [];
        for (let i = 0; i < rows; i++) {
            arr[i] = [];
            for (let j = 0; j < columns; j++) {
                arr[i][j] = null;  //вместо i+j+1 пишем любой наполнитель. В простейшем случае - null
            }
        }
        return arr;
    }

    window.Utils.getRefractionTP = getRefractionTP;

//var myMatrix = matrixArray(3,3);
})();