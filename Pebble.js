$status = {
    sgdjpy: "xx.xx",
    hightemp:"xx"
};

function updateSubtitle() {
    var fmt = "SGD: $sgdjpy\nHIGHTEMP: $hightemp";
    simply.subtitle(util2.format(fmt, $status));
}

function updateBody() {
    //ランダムでヱヴァンゲリヲン新劇場版のサブタイトルを表示
    var evaTitles=new Array(
        "You are (not) alone.",
        "You can (not) advance.",
        "You can (not) redo.");

    var rand = Math.floor(Math.random() * 3);

    simply.body(util2.format(evaTitles[rand], $status));
}

function zeroFill(num, fill) {
    var padd = "0000000000";
    return (padd + num).slice(-fill);
}

function timeText() {
    var now = new Date();
    var n =
        {
            month: zeroFill(now.getMonth() + 1, 2),
            date: zeroFill(now.getDate(), 2),
            hours: zeroFill(now.getHours(), 2),
            minutes: zeroFill(now.getMinutes(), 2)
        }
    return util2.format("$month/$date - $hours:$minutes", n);
}

$tasks =
    {
        //SGD円相場
        sgdjpy: function () {
            ajax({ url: 'http://stocks.finance.yahoo.co.jp/stocks/detail/?code=sgdjpy%3Dx' },
                function (data) {
                    $status.sgdjpy = Number(data.match(/<td class="stoksPrice">(.*?)<\/td>/)[1]).toFixed(2);
                    updateSubtitle();
                });
        },

        //シンガポール最高気温
        temp: function () {
            ajax({ url: 'http://www.tenki.jp/world/4/79/48698.html' },
                function (data) {
                    $status.hightemp = data.match(/<td class="forecast_days_temperature_max_temp highTemp"><span class="forecast_days_temperature_max_temp_numeric">(.*?)<\/span>/)[1];
                    updateSubtitle();
                });
        }
    }

function refresh() {
    simply.title(timeText());
    for (var task in $tasks) {
        $tasks[task]();
    }
    updateSubtitle();
    updateBody();
}

simply.on('singleClick', function (e) {
    simply.vibe();
    refresh();
});

simply.on('accelTap', function (e) {
    simply.vibe();
    refresh();
});

simply.begin = function () {
    try {
        console.log('Simply.js start!');
        simply.fullscreen(true);
        refresh();
        setInterval(refresh, 60000);
    }
    catch (e) {
        console.log(e);
        simply.body(e);
    }
};
