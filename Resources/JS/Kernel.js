$fold = $('.fold');
$fold.on('click', function (e) {
    switch ($(e.target).html()) {
        case 'FOLD':
            $(e.target).parent().siblings().fadeOut(500);
            $(e.target).html('UNFOLD');
            break;
        case 'UNFOLD':
            $(e.target).html('FOLD');
            $(e.target).parent().siblings().fadeIn(500);
            break;
    }
});

$unfold = $('.unfold');
$unfold.on('click', function (e) {
    switch ($(e.target).html()) {
        case 'FOLD':
            $(e.target).parent().siblings().fadeOut(500);
            $(e.target).html('UNFOLD');
            break;
        case 'UNFOLD':
            $(e.target).html('FOLD');
            $(e.target).parent().siblings().fadeIn(500);
            break;
    }
});

$texth = $('.texth');
$container = $('#container');
$('#opacitybar').slider({
    orientation: "vertical",
    min: 0,
    max: 1,
    step: 0.01,
    value: 1,
    slide: function (event, ui) {
        var op = 'rgba(256,256,256,' + ui.value + ')';
        var color = 180 * (1 - ui.value) + 70;
        var co = 'rgba(' + color + ',' + color + ',' + color + ',1)';
        $container.css('background-color', op);
        $texth.css('color', co);
    }
});

var $netinput = $('.netinput');
var $paraset = $('.paraset');
var $default = $('.default');
var $result = $('.result');


var arryadd = function (arry1, arry2) {
    for (var templ = 0; templ < arry1.length; templ++) {
        arry1[templ] += arry2[templ];
    }
    return arry1;
};

/*
----------------------------------------------------
----------------------------------------------------
The First Section
----------------------------------------------------
----------------------------------------------------
*/


var choosebox =
    '<span class="button-dropdown" data-buttons="dropdown"><button class="button button-rounded"\n' +
    'style="background-color: rgba(255,51,72,0.78); color: snow; solid #999; border-radius: 8px;">\n' +
    'SELECT<i class="fa fa-caret-down"></i></button>\n' +
    '<ul class="button-dropdown-list"><li><a style="font-size: 18px; font-weight: 200;">Promote</a></li>\n' +
    '<li class="button-dropdown-divider"><a\nstyle="font-size: 18px; font-weight: 200;">Repress</a></li>\n' +
    '</ul></span>';
var newundefined =
    '<tr class="undefined"><td class="name"><input type="text"/></td><td><span class="button-dropdown" data-buttons="dropdown"><button class="button button-rounded" style="background-color: rgba(255,51,72,0.78); color: snow; solid #999; border-radius: 8px;">SELECT<i class="fa fa-caret-down"></i></button><ul class="button-dropdown-list"><li><a style="font-size: 18px; font-weight: 200;">Promote</a></li><li class="button-dropdown-divider"><a style="font-size: 18px; font-weight: 200;">Repress</a></li></ul></span></td><td class="name"><input type="text"/></td><td class="netinputok"><button class="button button-glow button-rounded button-caution" disabled="disabled">&radic;</button></td><td class="netinputdelete"><button class="button button-glow button-rounded button-caution">χ</button></td></tr>';

var TFs;    //to store the original inputs TFs
var Targets;    //to store the original inputs Targets
var Relations;  //to store the original inputs Relations
var length = 0; //to store the original inputs length


var sectiontwo = '<tr class="head"><td style="color:#EE0000">Name</td><td style="color:#EE0000">SynRate (μM/min)</td><td style="color:#EE0000">DeRate (/min)</td></tr>';
var Namelist;
var namel;
var Names;
var Length;
var MatrixOne;
var MatrixOneT;
var MatrixTwo;
var MatrixThree;
var MatrixFour;
var MatrixFive;

$netinput.on('click', function (e) {
    switch ($(e.target).html()) {
        case 'Promote':
            $(e.target).parent().parent().parent().parent().next().next().children().removeAttr('disabled');
            $(e.target).parent().parent().parent().parent().html('<input type="text" value="Promote" disabled="disabled"/>');
            break;
        case 'Repress':
            $(e.target).parent().parent().parent().parent().next().next().children().removeAttr('disabled');
            $(e.target).parent().parent().parent().parent().html('<input type="text" value="Repress" disabled="disabled"/>');
            break;
        case 'χ':
            $(e.target).parent().parent().remove();
            break;
        case '?':
            $(e.target).html('&chi;');
            $('#alwayschange').html('?');
            $(e.target).parent().prev().children().html('&radic;').attr('disabled', 'disabled');
            $(e.target).parent().prev().attr('class', 'netinputok');
            $(e.target).parent().prev().prev().prev().html(choosebox);
            $(e.target).parent().siblings().find("input[class!='signal']").removeAttr('disabled');
            $(e.target).parent().parent().attr('class', 'undefined');
            break;
        case '√':
            $(e.target).html('&chi;');
            $(e.target).parent().next().children().html('?');
            $(e.target).parent().attr('class', 'netinputdelete');
            if ($('#alwaysdisabled').text() === 'χ') {
                $('#alwaysdisabled').attr('disabled', 'disabled');
            }
            $(e.target).parent().siblings().find("input").attr('disabled', 'disabled');
            $(e.target).parent().parent().attr('class', 'confirmed');
            break;
        case 'ADD':
            $(e.target).parent().parent().before(newundefined);
            break;
        case 'CONFIRM':
            var $results = $(this).find('.confirmed');
            length = $results.length;
            if (length === 0) {
                $(e.target).attr('class', 'button button-glow button-rounded button-caution');
                $(e.target).text('WARNING:');
                $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >No Input!</button>');
                break;
            }
            TFs = new Array(length);
            Targets = new Array(length);
            Relations = new Array(length);
            for (var index = 0; index < length; index++) {
                TFs[index] = $.trim($($results[index]).find('input')[0].value);
                Targets[index] = $.trim($($results[index]).find('input')[2].value);
                Relations[index] = ($($results[index]).find('input')[1].value);
            }

            /*Check if something is missing.*/
            var check;
            var i = 0;
            while (i < length) {
                check = TFs[i];
                if (!check) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >TFs</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Missing!</button>');
                    break;
                }
                i++;
            }
            if (i === length) {
                i = 0;
            }
            else {
                break;
            }

            while (i < length) {
                check = Targets[i];
                if (!check) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Targets</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Missing!</button>');
                    break;
                }
                i++;
            }
            if (i === length) {
                i = 0;
            }
            else {
                break;
            }
            /*
                Crucial!!!
                Decide if the network is recurrent.
            */
            /*Rule One: Siganl cannot be a target. Otherwise isrecurrent.*/
            if ($.inArray('Signal', Targets) > -1) {
                $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Network</button>');
                $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Recurrent!</button>');
                break;
            }
            /*Rule One End*/

            Namelist = TFs.concat(Targets);
            $.unique(Namelist.sort());
            Names = TFs.concat(Targets);
            $.unique(Names.sort());
            var templength = Namelist.length;
            Length = templength;
            MatrixTwo = new Array(templength);
            for (var tempindex = 0; tempindex < templength; tempindex++) {
                MatrixTwo[tempindex] = new Array(templength);
            }
            for (var tempindexr = 0; tempindexr < templength; tempindexr++) {
                for (var tempindexc = 0; tempindexc < templength; tempindexc++) {
                    MatrixTwo[tempindexr][tempindexc] = 0;
                }
            }
            MatrixThree = new Array(templength);
            for (var tempindex = 0; tempindex < templength; tempindex++) {
                MatrixThree[tempindex] = new Array(templength);
            }
            for (var tempindexr = 0; tempindexr < templength; tempindexr++) {
                for (var tempindexc = 0; tempindexc < templength; tempindexc++) {
                    MatrixThree[tempindexr][tempindexc] = 0;
                }
            }
            MatrixFour = new Array(templength);
            for (var tempindex = 0; tempindex < templength; tempindex++) {
                MatrixFour[tempindex] = new Array(templength);
            }
            for (var tempindexr = 0; tempindexr < templength; tempindexr++) {
                for (var tempindexc = 0; tempindexc < templength; tempindexc++) {
                    MatrixFour[tempindexr][tempindexc] = 0;
                }
            }

            /*Operation One*/
            for (i = 0; i < length; i++) {
                MatrixTwo[$.inArray(TFs[i], Namelist)][$.inArray(Targets[i], Namelist)] = 1;
            }

            MatrixOne = new Array(templength);
            for (var tempindex = 0; tempindex < templength; tempindex++) {
                MatrixOne[tempindex] = new Array(templength);
            }
            for (var tempindexr = 0; tempindexr < templength; tempindexr++) {
                for (var tempindexc = 0; tempindexc < templength; tempindexc++) {
                    MatrixOne[tempindexr][tempindexc] = MatrixTwo[tempindexr][tempindexc];
                }
            }

            MatrixOneT = new Array(templength);
            for (var tempindex = 0; tempindex < templength; tempindex++) {
                MatrixOneT[tempindex] = new Array(templength);
            }
            for (var tempindexr = 0; tempindexr < templength; tempindexr++) {
                for (var tempindexc = 0; tempindexc < templength; tempindexc++) {
                    MatrixOneT[tempindexr][tempindexc] = MatrixTwo[tempindexc][tempindexr];
                }
            }

            /*Operation Two*/
            var click = templength - 1;
            while (click > 0) {
                for (i = 0; i < length; i++) {
                    MatrixTwo[$.inArray(TFs[i], Namelist)] = arryadd(MatrixTwo[$.inArray(TFs[i], Namelist)], MatrixTwo[$.inArray(Targets[i], Namelist)]);
                }
                click--;
            }

            MatrixFive = new Array(templength);
            for (var tempindex = 0; tempindex < templength; tempindex++) {
                MatrixFive[tempindex] = new Array(templength);
            }
            for (var tempindexr = 0; tempindexr < templength; tempindexr++) {
                for (var tempindexc = 0; tempindexc < templength; tempindexc++) {
                    if (MatrixTwo[tempindexr][tempindexc] !== 0) {
                        MatrixFive[tempindexr][tempindexc] = 1;
                    } else {
                        MatrixFive[tempindexr][tempindexc] = 0;
                    }
                }
            }


            /*Rule Two: All targets must be controlled by Target. Otherwise isincomplete.*/
            var isincomplete = 0;
            for (var indexc = 0; indexc < templength; indexc++) {
                if (MatrixTwo[$.inArray('Signal', Namelist)][indexc] === 0 && indexc !== $.inArray('Signal', Namelist)) {
                    isincomplete = 1;
                    break;
                }
            }
            if (isincomplete === 1) {
                $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Network</button>');
                $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Incomplete!</button>');
                break;
            }
            /*Rule Two End*/

            /*Rule Three: What goes around doesn't come around. Otherwise isrecurrent.*/
            var isrecurrent = 0;
            for (var indexr = 0; indexr < templength; indexr++) {
                for (var indexc = 0; indexc < templength; indexc++) {
                    if (MatrixTwo[indexr][indexc] && MatrixTwo[indexc][indexr]) {
                        isrecurrent = 1;
                        break;
                    }
                }
                if (isrecurrent === 1) {
                    break;
                }
            }
            if (isrecurrent === 1) {
                $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Network</button>');
                $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Recurrent!</button>');
                break;
            }
            isrecurrent = 0;
            for (var indexr = 0; indexr < templength; indexr++) {
                for (var indexc = 0; indexc < templength; indexc++) {
                    if (MatrixOne[indexr][indexc] === 1 && MatrixTwo[indexr][indexc] > 1) {
                        isrecurrent = 1;
                        break;
                    }
                }
            }
            if (isrecurrent === 1) {
                $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Network</button>');
                $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Recurrent!</button>');
                break;
            }
            /*Rule Three End*/

            /*Check if something is overloaded*/
            for (i = 0; i < length; i++) {
                if (Relations[i] === 'Promote') {
                    MatrixThree[$.inArray(TFs[i], Namelist)][$.inArray(Targets[i], Namelist)] = 1;
                }
                else {
                    MatrixThree[$.inArray(TFs[i], Namelist)][$.inArray(Targets[i], Namelist)] = -1;
                }
            }

            i = 0;
            while (i < Length) {
                if (($.inArray(1, MatrixThree[i]) > -1) && ($.inArray(-1, MatrixThree[i]) > -1)) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >TFs</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Overloaded!</button>');
                    break;
                }
                i++;
            }
            if (i === Length) {
                i = 0;
            }
            else {
                break;
            }

            for (var tempindexr = 0; tempindexr < templength; tempindexr++) {
                for (var tempindexc = 0; tempindexc < templength; tempindexc++) {
                    MatrixFour[tempindexr][tempindexc] = MatrixThree[tempindexc][tempindexr];
                }
            }
            i = 0;
            while (i < Length) {
                if (($.inArray(1, MatrixFour[i]) > -1) && ($.inArray(-1, MatrixFour[i]) > -1)) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Targets</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Overloaded!</button>');
                    break;
                }
                i++;
            }
            if (i === Length) {
                i = 0;
            }
            else {
                break;
            }

            /*The following operations will only be executed while all the requirements above are satisfied.*/
            Namelist.splice(Namelist.indexOf('Signal'), 1);
            namel = Namelist.length;
            $paraset.find('.start').attr('class', 'decideconfirm');
            $paraset.find('.decideconfirm').children().children().removeAttr('style').attr('class', 'button button-glow button-rounded button-royal').text('CONFIRM');
            $paraset.prepend(sectiontwo);
            for (var i = 0; i < namel; i++) {
                $paraset.find('.decideconfirm').before('<tr class="setting"><td class="name" style="padding-left: 8px">' + Namelist[i] + '</td><td><input type="text" style="padding-left: 8px" /></td> <td><input type="text" style="padding-left: 8px"/></td></tr>');
            }
            $netinput.find('.netinputconfirm').children().text('REDESIGN').attr('class', 'button button-glow button-rounded button-caution');
            /*The above operations will only be executed while all requirements are satisfied.*/
            break;
        case 'WARNING:':
            $(e.target).text('CONFIRM').attr('class', 'button button-glow button-rounded button-royal');
            $(e.target).parent().next().html('');
            $(e.target).parent().next().next().html('');
            break;
        case 'REDESIGN' :
            $(e.target).text('CONFIRM').attr('class', 'button button-glow button-rounded button-royal');
            $paraset.html('<tbody><tr class="start"><td class="parasetconfirm"><button class="button button-glow button-rounded button-caution" style="width: 12cm;">Please Confirm The Settings Above.</button></td><td></td><td></td><td></td></tr></tbody>');
            $default.html('<tbody><tr class="start"><td class="rangeconfirm"><button class="button button-glow button-rounded button-caution" style="width: 12cm;">Please Confirm The Settings Above.</button></td><td></td><td></td></tr></tbody>');
            $result.html('<tbody><tr class="start"><td class="resultconfirm"><button class="button button-glow button-rounded button-caution" style="width: 12cm;">Please Confirm The Settings Above.</button></td><td></td><td></td></tr></tbody>');
            $('#Colors').html('');
            break;
    }
});


/*
----------------------------------------------------
----------------------------------------------------
The Second Section
----------------------------------------------------
----------------------------------------------------
*/


var sectionthree = '<tr class="head"><td style="color:#EE0000">Connection</td><td style="color:#EE0000">Dissociation Constant</td><td style="color:#EE0000">Hill Coefficient</td></tr>';
var synrate;
var derate;
var tfs = new Array();
var targets = new Array();
var relations = new Array();
var verticalrange = 0;

$paraset.on('click', function (e) {
    switch ($(e.target).text()) {
        case 'CONFIRM':
            synrate = new Array(namel);
            derate = new Array(namel);
            var $setting = $('.setting');
            for (var j = 0; j < namel; j++) {
                synrate[j] = $.trim($setting.eq(j).children().eq(1).children().eq(0).val());
                derate[j] = $.trim($setting.eq(j).children().eq(2).children().eq(0).val());
            }
            j = 0;
            while (j < namel) {
                if (!$.isNumeric(synrate[j])) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >SynRate</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Not</button>');
                    $(e.target).parent().next().next().next().html('<button class="button button-glow button-rounded button-caution" >Number!</button>');
                    break;
                }
                j++;
            }
            if (j === namel) {
                j = 0;
            }
            else {
                break;
            }
            while (j < namel) {
                if (!$.isNumeric(derate[j])) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >DeRate</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Not</button>');
                    $(e.target).parent().next().next().next().html('<button class="button button-glow button-rounded button-caution" >Number!</button>');
                    break;
                }
                j++;
            }
            if (j === namel) {
                j = 0;
            }
            else {
                break;
            }
            /*The following operations will only be executed while all the requirements above are satisfied.*/
            $default.find('.start').attr('class', 'decideconfirm');
            $default.find('.decideconfirm').children().children().removeAttr('style').attr('class', 'button button-glow button-rounded button-royal').text('CONFIRM');
            $default.prepend(sectionthree);
            var tempt = new Array();
            for (var i = 0; i < length; i++) {
                tempt[i] = Targets[i];
            }
            targets = $.unique(tempt.sort());
            for (var i = 0; i < targets.length; i++) {
                relations[i] = Relations[$.inArray(targets[i], Targets)];
                var temptf = ' ';
                var doublesearch = 0;
                var temptarget = targets[i] + '+';
                for (var findtemp = 0; findtemp < Length; findtemp++) {
                    if (MatrixOneT[$.inArray(targets[i], Names)][findtemp] === 1) {
                        temptf += Names[findtemp] + '+';
                        if (doublesearch === 0) {
                            for (var findtempt = 0; findtempt < Length; findtempt++) {
                                if (MatrixOne[findtemp][findtempt] === 1 && Names[findtempt] !== targets[i]) {
                                    temptarget += Names[findtempt] + '+';
                                    targets.splice($.inArray(Names[findtempt], targets), 1);
                                }
                            }
                            doublesearch = 1;
                        }
                    }
                }
                targets[i] = temptarget;
                targets[i] = targets[i].substring(0, targets[i].length - 1);
                targets[i] = $.trim(targets[i]);
                tfs[i] = temptf;
                tfs[i] = tfs[i].substring(0, tfs[i].length - 1);
                tfs[i] = $.trim(tfs[i]);
                $default.find('.decideconfirm').before('<tr class="defaultpara"><td class="relation" style="padding-left: 8px">' + tfs[i] + ' ' + relations[i] + ' ' + targets[i] + '</td><td>Kd' + (i + 1) + '</td><td>n' + (i + 1) + '</td></tr>\n' +
                    '<tr class="range"><td style="background-color: rgba(256,256,256,0); border: 0px;"></td><td><input type="text" placeholder="min" style="margin-left: 0.2cm; margin-right: 0.5cm"/><input type="text" placeholder="max"/></td><td><input type="text" placeholder="min" style="margin-left: 0.2cm; margin-right: 0.5cm"/><input type="text" placeholder="max"/></td></tr>');
            }
            $paraset.find('.parasetconfirm').children().text('RESET').attr('class', 'button button-glow button-rounded button-caution');
            var temprange = [];
            for (var i = 0; i<namel; i++){
                temprange[i] = synrate[i]/derate[i];
            }
            verticalrange = (Math.max.apply(null, temprange))*101/100;
            /*The above operations will only be executed while all requirements are satisfied.*/

            break;
        case 'WARNING:':
            $(e.target).text('CONFIRM').attr('class', 'button button-glow button-rounded button-royal');
            $(e.target).parent().next().html('');
            $(e.target).parent().next().next().html('');
            $(e.target).parent().next().next().next().html('');
            break;
        case 'RESET':
            $(e.target).text('CONFIRM').attr('class', 'button button-glow button-rounded button-royal');
            $default.html('<tbody><tr class="start"><td class="rangeconfirm"><button class="button button-glow button-rounded button-caution" style="width: 12cm;">Please Confirm The Settings Above.</button></td><td></td><td></td></tr></tbody>');
            $result.html('<tbody><tr class="start"><td class="resultconfirm"><button class="button button-glow button-rounded button-caution" style="width: 12cm;">Please Confirm The Settings Above.</button></td><td></td><td></td></tr></tbody>');
            $('#Colors').html('');
            break;
    }
})
;

/*
----------------------------------------------------
----------------------------------------------------
The Third Section
----------------------------------------------------
----------------------------------------------------
*/


var sectionfour = '<tr class="Srange"><td style="width: 7cm">Please set the range of Signal.</td><td style="width:5cm"><input type="text" placeholder="min" style="width: 1.5cm; margin-left: 0.2cm; margin-right: 0.4cm; padding-left:8px;"/><input type="text" placeholder="max" style="width:1.5cm; margin-left: 0.2cm; padding-left:8px;"/></td></tr>';

var Kdmin = new Array();
var Kdmax = new Array();
var nmin = new Array();
var nmax = new Array();
var Kd = new Array();
var n = new Array();

$default.on('click', function (e) {
    switch ($(e.target).text()) {
        case 'CONFIRM':
            for (var j = 0; j < targets.length; j++) {
                Kdmin[j] = -6;
                Kdmax[j] = 1;
                nmin[j] = 1;
                nmax[j] = 4;
            }
            var $range = $('.range');
            for (var j = 0; j < targets.length; j++) {
                Kdmin[j] += $.isNumeric($.trim($range.eq(j).children().eq(1).children().eq(0).val())) * $range.eq(j).children().eq(1).children().eq(0).val() - Kdmin[j] * ($.isNumeric($.trim($range.eq(j).children().eq(1).children().eq(0).val())));
                Kdmax[j] += $.isNumeric($.trim($range.eq(j).children().eq(1).children().eq(1).val())) * $range.eq(j).children().eq(1).children().eq(1).val() - Kdmax[j] * ($.isNumeric($.trim($range.eq(j).children().eq(1).children().eq(1).val())));
                nmin[j] += $.isNumeric($.trim($range.eq(j).children().eq(2).children().eq(0).val())) * $range.eq(j).children().eq(2).children().eq(0).val() - nmin[j] * ($.isNumeric($.trim($range.eq(j).children().eq(2).children().eq(0).val())));
                nmax[j] += $.isNumeric($.trim($range.eq(j).children().eq(2).children().eq(1).val())) * $range.eq(j).children().eq(2).children().eq(1).val() - nmax[j] * ($.isNumeric($.trim($range.eq(j).children().eq(2).children().eq(1).val())));
            }
            j = 0;
            while (j < targets.length) {
                if (Kdmin[j] >= Kdmax[j]) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Range</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Nonlicet!</button>');
                    break;
                }
                j++;
            }
            if (j === targets.length) {
                j = 0;
            }
            else {
                break;
            }
            while (j < targets.length) {
                if (nmin[j] >= nmax[j] || nmin[j] <= 0 || nmax[j] <= 0) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Range</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Nonlicet!</button>');
                    break;
                }
                j++;
            }
            if (j === targets.length) {
                j = 0;
            }
            else {
                break;
            }
            while (j < targets.length) {
                if (!$.isNumeric(Kdmin[j]) || !$.isNumeric(Kdmax[j])) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Not</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Number!</button>');
                    break;
                }
                j++;
            }
            if (j === targets.length) {
                j = 0;
            }
            else {
                break;
            }
            while (j < targets.length) {
                if (!$.isNumeric(nmin[j]) || !$.isNumeric(nmax[j])) {
                    $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                    $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Not</button>');
                    $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Number!</button>');
                    break;
                }
                j++;
            }
            if (j === targets.length) {
                j = 0;
            }
            else {
                break;
            }
            /*The following operations will only be executed while all the requirements above are satisfied.*/
            $result.find('.start').attr('class', 'decideconfirm');
            $result.find('.decideconfirm').children().children().removeAttr('style').attr('class', 'button button-glow button-rounded button-royal').text('CONFIRM');
            $result.prepend(sectionfour);
            $default.find('.rangeconfirm').children().text('RESET').attr('class', 'button button-glow button-rounded button-caution');
            /*The above operations will only be executed while all requirements are satisfied.*/
            break;
        case 'WARNING:':
            $(e.target).text('CONFIRM').attr('class', 'button button-glow button-rounded button-royal');
            $(e.target).parent().next().html('');
            $(e.target).parent().next().next().html('');
            $(e.target).parent().next().next().next().html('');
            break;
        case 'RESET':
            $(e.target).text('CONFIRM').attr('class', 'button button-glow button-rounded button-royal');
            $result.html('<tbody><tr class="start"><td class="resultconfirm"><button class="button button-glow button-rounded button-caution" style="width: 12cm;">Please Confirm The Settings Above.</button></td><td></td><td></td></tr></tbody>');
            $('#Colors').html('');
            break;
    }
});


/*
----------------------------------------------------
----------------------------------------------------
The Fourth Section
----------------------------------------------------
----------------------------------------------------
*/

var Smin;
var Smax;
var scores;
var results;
var temptargets = new Array();
var ResultsName = new Array();

$result.on('click', function (e) {
    switch ($(e.target).text()) {
        case 'CONFIRM':
            Smin = -6;
            Smax = 1;
            for (var j = 0; j < targets.length; j++) {
                Kd[j] = (Kdmin[j] + Kdmax[j]) / 2;
                n[j] = (nmin[j] + nmax[j]) / 2;
            }
            for (var i = 0; i < length; i++) {
                temptargets[i] = Targets[i];
            }
            temptargets = $.unique(temptargets.sort());
            scores = new Array(temptargets.length);
            results = new Array(temptargets.length);
            var $Srange = $('.Srange');
            Smin += $.isNumeric($.trim($Srange.eq(0).children().eq(1).children().eq(0).val())) * $Srange.eq(0).children().eq(1).children().eq(0).val() - Smin * ($.isNumeric($.trim($Srange.eq(0).children().eq(1).children().eq(0).val())));
            Smax += $.isNumeric($.trim($Srange.eq(0).children().eq(1).children().eq(1).val())) * $Srange.eq(0).children().eq(1).children().eq(1).val() - Smax * ($.isNumeric($.trim($Srange.eq(0).children().eq(1).children().eq(1).val())));
            if (Smin >= Smax) {
                $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Range</button>');
                $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Nonlicet!</button>');
                break;
            }
            if (!$.isNumeric(Smin) || !$.isNumeric(Smax)) {
                $(e.target).text('WARNING:').attr('class', 'button button-glow button-rounded button-caution');
                $(e.target).parent().next().html('<button class="button button-glow button-rounded button-caution" >Not</button>');
                $(e.target).parent().next().next().html('<button class="button button-glow button-rounded button-caution" >Number!</button>');
                break;
            }
            /*The following operations will only be executed while all the requirements above are satisfied.*/
            for (var i = 0; i < temptargets.length; i++) {
                scores[i] = 0;
                var column = $.inArray(temptargets[i], Names);
                for (var j = 0; j < Length; j++) {
                    scores[i] += MatrixFive[j][column];
                }
            }
            $result.find('.resultconfirm').children().text('RESET').attr('class', 'button button-glow button-rounded button-caution');
            $(this).append('<div id="figure" style="padding-left: 10px; width: 7cm;"></div>');
            for (var i = 0; i < targets.length; i++) {
                $('#figure').append('<div style="height:20px;float: left;">Kd' + (i + 1) + ': </div>');
                $('#figure').append('<div id="Kd' + (i + 1) + 'text"></div>');
                $('#figure').append('<div style="width:7cm;" id="Kd' + (i + 1) + '"></div><div></div>');
                $('#figure').append('<div style="height:20px;float: left;">n' + (i + 1) + ': </div>');
                $('#figure').append('<div id="n' + (i + 1) + 'text"></div>');
                $('#figure').append('<div style="width:7cm;" id="n' + (i + 1) + '"></div><div></div>');
            }
            for (var i = 0; i < targets.length; i++) {
                $('#Kd' + (i + 1)).slider({
                    min: Kdmin[i],
                    max: Kdmax[i],
                    step: 0.01,
                    value: (Kdmin[i] + Kdmax[i]) / 2,
                    create: function () {
                        $(this).next().attr('class', i);
                        $(this).prev().text($(this).slider("value"));
                    },
                    slide: function (event, ui) {
                        Kd[$(this).next().attr('class')] = ui.value;
                        $(this).prev().text(ui.value);
                        paramUpdate();
                        Fplot('figure', results);
                    }
                });
                $('#n' + (i + 1)).slider({
                    min: nmin[i],
                    max: nmax[i],
                    step: 0.01,
                    value: (nmin[i] + nmax[i]) / 2,
                    create: function () {
                        $(this).next().attr('class', i);
                        $(this).prev().text($(this).slider("value"));
                    },
                    slide: function (event, ui) {
                        n[$(this).next().attr('class')] = ui.value;
                        $(this).prev().text(ui.value);
                        paramUpdate();
                        Fplot('figure', results);
                    }
                })
            }
            paramUpdate();
            Fplot('figure', results);
            $('.result').after('<div id="Colors"><div class="tutorial"><h1 class="texth"><p>We provide a check list that contains twelve colors. Names of the components in your network is shown below in order. Let\'s hope your network is not that big (what a monster woult it be!).</p><p style="font-size: 18px">' + temptargets+ '</p><p><img src="Resources/Images/Colors.png"/></p></h1></div></div>');
            $texth = $('.texth');
            /*The above operations will only be executed while all requirements are satisfied.*/
            break;
        case 'WARNING:':
            $(e.target).text('CONFIRM').attr('class', 'button button-glow button-rounded button-royal');
            $(e.target).parent().next().html('');
            $(e.target).parent().next().next().html('');
            $(e.target).parent().next().next().next().html('');
            break;
        case 'RESET':
            $(e.target).text('CONFIRM').attr('class', 'button button-glow button-rounded button-royal');
            $('#figure').html('');
            $('#Colors').html('');
            break;
    }
});


function Fplot(id, fn) {
    var plotData = [];
    var colors = ['#008EDB', '#ff9b21', '#65b542', '#ff769a', '#0814FF', '#FF0504', 'FFEF00', '#42FF00', '#930057', '#00FEFF', '#636363', '#FFD1A9'];
    for (var i = 0; i < fn.length; i++) {
        plotData[i] = {
            fn: fn[i],
            sampler: 'builtIn',
            graphType: 'polyline',
            color: colors[i],
            attr: {'stroke-width': 3}
        };
    }
    functionPlot({
        disableZoom: true,
        grid: true,
        xAxis: {
            label: 'Log[Signal]',
            domain: [Smin, Smax]
        },
        yAxis: {
            label: 'Concentration',
            domain: [0, verticalrange]
        },
        target: '#' + id,
        data: plotData
    })
}

function paramUpdate() {
    var Nameindex = 0;
    for (var i = 1; i <= Math.max.apply(null, scores); i++) {
        if (i === 1) {
            for (var j = 0; j < temptargets.length; j++) {
                if (scores[j] === i) {
                    var currentindex;
                    for (var k = 0; k < targets.length; k++) {
                        if (targets[k].includes(temptargets[j])) {
                            currentindex = k;
                            break;
                        }
                    }
                    switch (relations[currentindex]) {
                        case 'Promote':
                            results[j] = '(' + synrate[j] + '/' + derate[j] + ')*(' + '(10^(x))^(' + n[currentindex] + ')/((10^(x))^(' + n[currentindex] + ')+' + '10^(' + Kd[currentindex] + ')))';
                            ResultsName[Nameindex] = temptargets[j];
                            Nameindex += 1;
                            break;
                        case 'Repress':
                            results[j] = '(' + synrate[j] + '/' + derate[j] + ')*(' + '10^(' + Kd[currentindex] + ')/((10^(x))^(' + n[currentindex] + ')+' + '10^(' + Kd[currentindex] + ')))';
                            ResultsName[Nameindex] = temptargets[j];
                            Nameindex += 1;
                            break;
                    }
                }
            }
        }
        else {
            for (var j = 0; j < temptargets.length; j++) {
                if (scores[j] === i) {
                    var currentindex;
                    for (var k = 0; k < targets.length; k++) {
                        if (targets[k].includes(temptargets[j])) {
                            currentindex = k;
                            break;
                        }
                    }
                    var currenttf = ' ';
                    for (var findtemp = 0; findtemp < Length; findtemp++) {
                        if (MatrixOneT[$.inArray(temptargets[j], Names)][findtemp] === 1) {
                            if (Names[findtemp] === 'Signal') {
                                currenttf += '(10^(x))+';
                            }
                            else {
                                currenttf += results[$.inArray(Names[findtemp], temptargets)] + '+';
                            }
                        }
                    }
                    currenttf = currenttf.substring(0, currenttf.length - 1);
                    currenttf = $.trim(currenttf);
                    switch (relations[currentindex]) {
                        case 'Promote':
                            results[j] = '(' + synrate[j] + '/' + derate[j] + ')*(' + '(' + currenttf + ')^(' + n[currentindex] + ')/(' + '(' + currenttf + ')^(' + n[currentindex] + ')+' + '10^(' + Kd[currentindex] + ')))';
                            ResultsName[Nameindex] = temptargets[j];
                            Nameindex += 1;
                            break;
                        case 'Repress':
                            results[j] = '(' + synrate[j] + '/' + derate[j] + ')*(' + '10^(' + Kd[currentindex] + ')/(' + '(' + currenttf + ')^(' + n[currentindex] + ')+' + '10^(' + Kd[currentindex] + ')))';
                            ResultsName[Nameindex] = temptargets[j];
                            Nameindex += 1;
                            break;
                    }
                }
            }
        }
    }
}



