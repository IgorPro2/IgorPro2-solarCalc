;(function () {
    function grad_textGMS2number(gStr, mStr, sStr) {
        let sg = 1, g, m, s, ddGrad;
        g = Number(gStr);
        m = Number(mStr) / 60;
        s = Number(sStr) / 3600;
        if (g < 0 || m < 0 || s < 0) {
            sg = -1
        }         //latGrad.style.background="green"
        if (isNaN(g)) {
            g = 0
        }
        if (isNaN(m)) {
            m = 0
        }
        if (isNaN(s)) {
            s = 0
        }
        ddGrad = sg * (Math.abs(g) + Math.abs(m) + Math.abs(s));
        return ddGrad;
    }

    function grad_number2text(dmsNum, numSigns = 2, strDel = "°'\"",  spc = " ", returnArray) {
        let sign = Math.sign(dmsNum);
        let delLength = (strDel).length;
        let SignStr = "";
        if (sign < 0) SignStr = "-";
        let module = Math.abs(dmsNum);
        let result = "";
        let g, m, s, allmin, allsec, smod, nDig = numSigns;

        switch (delLength) {
            case 1:
                smod = module.toFixed(nDig);
                module = +smod;
                g = module.toFixed(nDig);
                if ( +g < 10 ) g="0"+g;
                result = SignStr + g + strDel.charAt(0);
                break;
            case 2:
                smod = (module*60).toFixed(nDig);
                module = +smod/60;
                g = Math.floor(module);
                if ( +g < 10 ) g="0"+g;
                allmin = Math.abs(module - g) * 60;
                m = allmin.toFixed(nDig);
                if ( +m < 10 ) m="0"+m;
                result = SignStr + g.toString() + strDel.charAt(0) + spc + m + strDel.charAt(1);
                break;
            case 3:
                smod = (module*3600).toFixed(nDig);
                module = +smod/3600;
                g = Math.floor(module);
                if ( +g < 10 ) g="0"+g;
                allmin = (module - g) * 60;
                smod = (allmin*60).toFixed(nDig);
                smod = +smod/60;
                m = Math.floor(smod);
                if ( +m < 10 ) m="0"+m;
                allsec = Math.abs(allmin - m) * 60;
                s = allsec.toFixed(nDig);
                if ( +s < 10 ) s="0"+s;
                result = SignStr + g.toString() + strDel.charAt(0) + spc + m.toString() + strDel.charAt(1) + spc + s + strDel.charAt(2);
                break;
        }
        if (returnArray) return [g || 0, m || 0, s || 0, SignStr ];
        return result
    }
    function precise_round(num, dec){
        if ((typeof num !== 'number') || (typeof dec !== 'number'))
            return false;
        var num_sign = num >= 0 ? 1 : -1;
        return (Math.round((num*Math.pow(10,dec))+(num_sign*0.0001))/Math.pow(10,dec)).toFixed(dec);
    }
    function precise_roundNum(num, dec){
        if ((typeof num !== 'number') || (typeof dec !== 'number'))
            return false;
        var num_sign = num >= 0 ? 1 : -1;
        return (Math.round((num*Math.pow(10,dec))+(num_sign*0.0001))/Math.pow(10,dec));
    }

    function toDegrees(p) {
        return p * 180 / Math.PI;
    }

    function toRadians(p) {
        return p / 180 * Math.PI;
    }

    /**
     * @return {number}
     */
    function CharDigits2Number(dms_chr) {
        // convert string of symbols without spaces to decimal degrees
        // format of string is: gggmmss.ss  if string has "-" then return negative value
        // Example:  1953036.36 -> 195.05101;  -36 -> -0.01
        let degrees = 0, d, m, s;
        let sg = 1, len, dotpos;
        let pdms_chr, sdeg, smin, ssec;

        // if anywhere in dms_chr present char "-" we assume negative values
        if (~dms_chr.indexOf("-"))
            sg = -1;
        pdms_chr = dms_chr.replace("-", "");        // delete char "-"

        // Select only "digital" srtings    JAVA was
        //Pattern pat1= Pattern.compile("[0-9].");
        //Matcher mat1 = pat1.matcher(pdms_chr);
        //if (!mat1.find())
        //    return (0);

        //if (!dms_chr.match(/^[\-]{0,1}[0-9]{1,7}\.[0-9]{1,4}$/)) return 0;        //TODO add dot sign  !!!!!!!
        if (!dms_chr.match  (/^[\-]?[0-9]{1,7}\.[0-9]{1,4}$/)){
            //alert( "Dot absent" );
        }

        dotpos = pdms_chr.indexOf(".");            // find dot position (-1 if no dot)
        if (dotpos < 0) pdms_chr = pdms_chr + ".";   // add "." to the end of (pdms_chr)
        len = pdms_chr.length;                       // length of string
        dotpos = pdms_chr.indexOf(".");            // find inserted dot position
        for (let i = 0; (i < 7 - dotpos); i++) {       // add "0" to the begining of (pdms_chr) formatting it as "dddmmss.ss...."
            pdms_chr = "0" + pdms_chr;
        }
        len = pdms_chr.length;                   // length of formatted string

        sdeg = pdms_chr.substring(0, 3);
        smin = pdms_chr.substring(3, 5);
        ssec = pdms_chr.substring(5, len);

        d = sg * +sdeg;
        m = sg * +smin;
        s = sg * +ssec;
        degrees = d + m / 60 + s / 3600;
        return (degrees);

    }

    window.Utils.CharDigits2Number = CharDigits2Number;
    window.Utils.toRadians = toRadians;
    window.Utils.toDegrees = toDegrees;
    window.Utils.grad_number2text = grad_number2text;
    window.Utils.grad_textGMS2number = grad_textGMS2number;
    window.Utils.precise_roundNum = precise_roundNum;
    window.Utils.precise_round = precise_round;

})();