$status = {
	sgdjpy: "xx.xx"
};

function updateSubtitle() {
	var fmt = "JPY: $sgdjpy";
	simply.subtitle(util2.format(fmt, $status));
}

function updateBody() {
	var fmt = "Take it easy!";
	simply.body(util2.format(fmt, $status));
}

function zeroFill(num, fill) {
	var padd = "0000000000";
	return (padd + num).slice(-fill);
}

// A.日付と時刻
function timeText() {
	var now = new Date();
	var n = {
		month: zeroFill(now.getMonth()+1, 2),
		date: zeroFill(now.getDate(), 2),
		hours: zeroFill(now.getHours(), 2),
		minutes: zeroFill(now.getMinutes(), 2)
	}
	return util2.format("$month/$date - $hours:$minutes", n);
}

$tasks = {
	sgdjpy: function() {
		// B.ドル円相場
		ajax({ url: 'http://stocks.finance.yahoo.co.jp/stocks/detail/?code=sgdjpy%3Dx' }, function(data) {
			$status.sgdjpy = Number(data.match(/<td class="stoksPrice">(.*?)<\/td>/)[1]).toFixed(2);
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

// イベントハンドラ

simply.on('singleClick', function(e) {
	simply.vibe();
	refresh();
});

simply.on('accelTap', function(e) {
	simply.vibe();
	refresh();
});

// エントリポイント

simply.begin = function() {
	try {
		console.log('Simply.js start!');
		simply.fullscreen(true);
		refresh();
		setInterval(refresh, 60000);
	} catch (e) {
		console.log(e);
		simply.body(e);
	}
};