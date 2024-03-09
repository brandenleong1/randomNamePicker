const rateFuncs = [ // [0, 1] => [0, 1], y = time, x = iter
	(x) => {return x;},
	(x) => {return 1 - Math.pow(1 - x, 1 / 5);},
	(x) => {return x < 0.5 ? Math.pow(x / 4, 1 / 3) : 1 - (Math.pow(2 - 2 * x , 1 / 3) / 2);}
];

const rateFuncNames = ['Linear', 'Ease Out', 'Ease In-Out'];

document.getElementById('sliderRateFunc').max = rateFuncs.length - 1;
loadSettings();

for (let s of document.getElementsByClassName('slider')) {
	updateSlider(s);
	s.addEventListener('input', function() {
		updateSlider(s);
	});
}

for (let i of document.querySelectorAll('input')) {
	i.addEventListener('change', saveSettings);
}

function updateSlider(s) {
	if (s == document.getElementById('sliderRateFunc')) {
		for (let i of s.parentElement.querySelectorAll('*')) {
			if (i.classList.contains('yellowText')) {
				i.innerText = rateFuncNames[s.value];
				break;
			}
		}
	} else {
		for (let i of s.parentElement.querySelectorAll('*')) {
			if (i.classList.contains('yellowText')) {
				i.innerText = s.value;
				break;
			}
		}
	}
}

async function spin() {
	document.getElementById('nameBox').contentEditable = false;

	let txt = document.getElementById('nameBox').innerText;
	document.getElementById('nameBox').innerText = txt;
	const list = txt.split('\n').map(e => {return e.trim();}).filter(e => {return e;});
	// console.log(list.map(e => {return e.trim();}));
	document.getElementById('nameBox').innerText = list.join('\n');

	if (!list.length) {
		document.getElementById('nameBox').style.boxShadow = '0 0 10px red';
		setTimeout(function() {
			document.getElementById('nameBox').style.boxShadow = null;
			document.getElementById('nameBox').contentEditable = true;
		}, 250);
	} else {
		document.getElementById('settingsColumn').style.display = 'none';
		document.getElementById('spinningColumn').style.display = 'flex';
		document.getElementById('nameUp').style.fontSize = document.getElementById('sliderSpinFontSize').value + 'px';
		document.getElementById('nameUp').style.color = document.getElementById('colorName').value;
		document.getElementById('nameUp').style.outline = null;
		document.getElementById('keepRemoveButtons').style.visibility = 'hidden';

		let ms = document.getElementById('sliderSpinTime').value * 1000;
		let iteration = 1;
		let iters = document.getElementById('sliderNumIters').value;
		let intervalFunction = rateFuncs[document.getElementById('sliderRateFunc').value];

		do {
			document.getElementById('nameUp').innerText = getRandomFromList(list);
			let delay = (intervalFunction(iteration / iters) - intervalFunction((iteration - 1) / iters)) * ms;
			await sleep(delay);
			iteration += 1;
		} while (iteration <= iters);

		document.getElementById('nameUp').style.fontSize = document.getElementById('sliderEndFontSize').value + 'px';
		if (document.getElementById('checkOutline').checked) {
			document.getElementById('nameUp').style.outline = 'solid ' + document.getElementById('colorName').value;
		}
		document.getElementById('keepRemoveButtons').style.visibility = null;
		document.getElementById('removeButton').onclick = function() {
			document.getElementById('nameBox').innerText = removeName(list, document.getElementById('nameUp').innerText).join('\n');
			if (!document.getElementById('checkBackToSettings').checked) {
				spin();
			}
		};
		document.getElementById('keepButton').onclick = function() {
			keep(list);
			if (!document.getElementById('checkBackToSettings').checked) {
				spin();
			}
		};
	}
}

function removeName(list, name) {
	list.splice(list.indexOf(name), 1);
	keep(list);
	return list;
}

function keep(list) {
	document.getElementById('settingsColumn').style.display = 'flex';
	document.getElementById('spinningColumn').style.display = 'none';
	document.getElementById('nameBox').innerText = list.join('\n');
	document.getElementById('nameBox').contentEditable = true;
}

function saveSettings() {
	let settings = [
		['spinFontSize', document.getElementById('sliderSpinFontSize').value],
		['endFontSize', document.getElementById('sliderEndFontSize').value],
		['spinTime', document.getElementById('sliderSpinTime').value],
		['numIters', document.getElementById('sliderNumIters').value],
		['rateFuncID', document.getElementById('sliderRateFunc').value],
		['nameColor', document.getElementById('colorName').value],
		['hasOutline', document.getElementById('checkOutline').checked],
		['backToSettings', document.getElementById('checkBackToSettings').checked]
	];
	for (let s of settings) {
		setCookie(s[0], s[1], 30);
	}
}

function loadSettings() {
	let settings = [
		['spinFontSize', document.getElementById('sliderSpinFontSize'), 'value'],
		['endFontSize', document.getElementById('sliderEndFontSize'), 'value'],
		['spinTime', document.getElementById('sliderSpinTime'), 'value'],
		['numIters', document.getElementById('sliderNumIters'), 'value'],
		['rateFuncID', document.getElementById('sliderRateFunc'), 'value'],
		['nameColor', document.getElementById('colorName'), 'value'],
		['hasOutline', document.getElementById('checkOutline'), 'checked'],
		['backToSettings', document.getElementById('checkBackToSettings'), 'checked']
	];
	for (let s of settings) {
		let c = getCookie(s[0]);
		if (c) {
			if (s[2] == 'value') {
				s[1].value = c;
			} else if (s[2] == 'checked') {
				s[1].checked = c == 'true';
			}
		}
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomFromList(list) {
	return list[getRandomInt(list.length)];
}

function getRandomInt(i) {
	return Math.floor(Math.random() * i);
}

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = 'expires='+ d.toUTCString();
	document.cookie = cname + '=' + cvalue + ';' + expires + '; path=/';
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return null;
}