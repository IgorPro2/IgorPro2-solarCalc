function Solar(B, L, D, E, T, isParallax, Radius, temp, press) {

    this.B = B;     //Define properties of class Solar
    this.E = E;
    this.L = L;
    this.D = D;
    this.T = T;
    this.isParallax = isParallax;
    this.Radius = Radius;

    // Define class method _calculate
    this._calculate = function () {
        let Declination = this.D;                              //Decimal degrees
        let Equation = this.E;                                 //Decimal hours
        let Latitude = this.B;                                 //Decimal degrees
        let Longitude = this.L;                                //Decimal degrees
        let tUTC = this.T;                                     //Decimal hours    Time for position calculation. Must be in UTC!!!
        let useParallax = this.isParallax;                    //Boolean
        let SunRadius = this.Radius;                          //Decimal degrees   SunRadius used only for  refraction calculation under horizon [0° - SunRadius];

        let Results = new Array(14);
        let tT, p, p1, Ar, SunA, SunH, SunHcor, aRef = 0.0, Parallax, HzParallax;
        //GRD = new DegreesConversion();
        //fill (Res,0.0);
        let Res = new Array(3);
        // Hour Angle of Sun
        tT = (tUTC + Equation) * 15 + Longitude;
        if (tT > 360) tT = tT % 360;
        tT = Utils.toRadians(tT);
        Declination = Utils.toRadians(Declination);
        Equation = Utils.toRadians(Equation);
        Latitude = Utils.toRadians(Latitude);

        p = Math.sin(Latitude) / Math.tan(tT);
        p1 = Math.cos(Latitude) * Math.tan(Declination) / Math.sin(tT);
        Ar = p - p1;
        SunA = Utils.toDegrees(Math.atan((1 / Ar)));
        if (Utils.toDegrees(tT) < 180) {
            if (Ar > 0) SunA = 180 + Math.abs(SunA);    // III
            else SunA = 360 - Math.abs(SunA);    // IV
        } else if (Ar > 0) SunA = 0 + SunA;           // I
        else SunA = 180 - Math.abs(SunA);    // II

        SunH = Math.sin(Latitude) * Math.sin(Declination) + Math.cos(Latitude) * Math.cos(Declination) * Math.cos(tT);
        SunH = Math.atan(SunH / Math.sqrt(-1 * SunH * SunH + 1));

        //Apply parallax to SunHeight
        HzParallax = (8.79 / 3600 * Math.PI / 180);
        Parallax = HzParallax * Math.cos(SunH);
        Parallax = Utils.toDegrees(Parallax);
        SunH = Utils.toDegrees(SunH);
        SunHcor = SunH;
        if (useParallax) {
            SunHcor = SunH - Parallax;           //Sun height corrected for Parallax (calculate geocentric height)
        }
        //Apply refraction to SunHeight
        let TC=+temp, Pmm=+press;
        if ((TC !== 0) && (Pmm !== 0)) {
            Res = getRefractionTP(SunHcor, SunRadius, TC, Pmm);
            aRef = Res[0];
            SunHcor = SunHcor + aRef;        //Sun height corrected for Refraction
        }

        //Return values ALL in Decimal degrees
        Results[0] = SunA;            // Sun Azimuth in Decimal degrees
        Results[1] = SunHcor;         // Corrected for refraction height of  sun's center in Decimal degrees
        Results[2] = Utils.toDegrees(tT);   // Hour Angle of Sun
        Results[3] = aRef;            // Refraction corrected for meteoParameters
        Results[4] = Parallax;        // Parallax
        Results[5] = SunH;            // Uncorrected height of  sun's center

        Results[6] = Res[1];            // Main part of refraction
        Results[7] = Res[2];            // correction for temperature
        Results[8] = Res[3];            // correction for pressure

        //4debugging, eliminate later
        Results[9] = Utils.toDegrees(Declination);
        Results[10] = Utils.toDegrees(Equation);
        Results[11] = T;
        Results[12] = B;
        Results[13] = L;

        return Results;
    };

}
