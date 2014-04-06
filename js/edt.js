/**
 * Created by cosmin on 23.03.2014.
 */

var edt;
var editor;
var X, Y;
var wrk, pars;
var globrange;
function LabeleDit(edt) {
	var tata = this;
	this.editor = edt;
	editor = edt;
	this.id = edt.id;
	this.inputFile = document.createElement('input');
	this.inputFile.setAttribute('type', 'file');
	this.inputFile.setAttribute('id', 'infile');
	var fReader = null;
	this.inputFile.onchange = function () {
		fReader = new FileReader();
		fReader.onload = function () {
			tata.html(this.result);
		};
		fReader.readAsText(this.files[0]);
	};
	this.saveInt = 0;
}
LabeleDit.prototype.text = function (arg) {
	if (arg === undefined) {
		return this.editor.innerText;
	} else if (typeof (arg) == 'string') {
		this.editor.innerText = arg;
	} else if (typeof (arg) == 'object') {
		try {
			this.editor.innerText = arg.innerText;
		} catch (err) {
			console.log('ERR: ' + err.message);
		}
	}
};
LabeleDit.prototype.html = function (arg) {
	if (arg === undefined) {
		return this.editor.innerHTML;
	} else if (typeof (arg) == 'string') {
		this.editor.innerHTML = arg;
	} else if (typeof (arg) == 'object') {
		try {
			this.editor.innerHTML = arg.innerHTML;
		} catch (err) {
			console.log('ERR: ' + err.message);
		}
	}
};
//LabeleDit.prototype.exe = function (what, b, arg) {document.execCommand(what, (b == undefined) ? false : b, (arg == undefined) ? null : arg);};

LabeleDit.prototype.setSelStyle = function (stil) {
	var sel = window.getSelection();
	if (sel.rangeCount) {
		var range = sel.getRangeAt(0);
		var nod = document.createElement(stil);
		nod.appendChild(range.extractContents());
		range.insertNode(nod);
	}
};


LabeleDit.prototype.nou = function () {this.html('');};


LabeleDit.prototype.saveBuff = function () {
	var txt = this.html().replace(/(\r\n|\n|\r)/gm, '');
	var textFileAsBlob = new Blob([txt], {type: 'text/html'});
	var fileName = "myfile";
	var downloadLink = document.createElement("a");
	downloadLink.download = fileName;
	//downloadLink.innerHTML = "Salvează";
	if (window.webkitURL != null) {
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else {
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = function () {
			downloadLink.parentNode.removeChild(downloadLink);
		};
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}
	downloadLink.click();
};
LabeleDit.prototype.saveToLoco = function () {
	localStorage.setItem('labeledit', this.html().replace(/(\r\n|\n|\r)/gm, ''));
};
LabeleDit.prototype.loadFromLoco = function () {
	this.html(localStorage.getItem('labeledit'));
};
LabeleDit.prototype.loadFile = function () {
	this.inputFile.click();
};
LabeleDit.prototype.test = function () {
	document.execCommand('insertImage', false, 'file:///home/cosmin/Downloads/motren.jpg');
	document.execCommand('enableObjectResizing', true, true);
};
LabeleDit.prototype.selectAll = function () {
	window.getSelection().removeAllRanges();
	var range = document.createRange();
	range.selectNodeContents(this.editor);
	window.getSelection().addRange(range);
};
LabeleDit.prototype.deSelect = function () {window.getSelection().removeAllRanges();};

LabeleDit.prototype.onKey = function (evt) {
	//lst(evt);
	console.log(evt.which);
	if (evt.which == 9) {
		document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
		evt.preventDefault();
	}
};
LabeleDit.prototype.getCaretPos = function () {
	//http://stackoverflow.com/questions/16736680/get-caret-position-in-contenteditable-div-including-tags
	var range = window.getSelection().getRangeAt(0);
	var preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(this.editor);
	preCaretRange.setEnd(range.endContainer, range.endOffset);
	globrange = preCaretRange;
	return preCaretRange.toString().length;
};
function hasFileApi() {
	return window.File && window.FileReader && window.FileList && window.Blob;
}

function platform() {
	return (navigator.appVersion.indexOf("Win") != -1) ? 'win' : (navigator.appVersion.indexOf("Linux") != -1) ? 'linux' : (navigator.appVersion.indexOf("Mac") != -1) ? 'mac' : (navigator.appVersion.indexOf("X11") != -1) ? 'unix' : 'unknown';
}

LabeleDit.prototype.init = function () {
};

function getTextNodesIn(node) {
	var textNodes = [];
	if (node.nodeType == 3) {
		textNodes.push(node);
	} else {
		var children = node.childNodes;
		for (var i = 0, len = children.length; i < len; ++i) {
			textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
		}
	}
	return textNodes;
}

function setSelectionRange(start, end) {
	var range = document.createRange();
	range.selectNodeContents(editor);
	var textNodes = getTextNodesIn(editor);
	var foundStart = false;
	var charCount = 0, endCharCount;
	for (var i = 0, textNode; textNode = textNodes[i++];) {
		endCharCount = charCount + textNode.length;
		if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i < textNodes.length))) {
			range.setStart(textNode, start - charCount);
			foundStart = true;
		}
		if (foundStart && end <= endCharCount) {
			range.setEnd(textNode, end - charCount);
			break;
		}
		charCount = endCharCount;
	}
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

function log(a) {
	for (var i = -1; ++i < arguments.length;) {
		console.log(i + " > " + arguments[i]);
	}
}
function test() {
	var range = document.createRange();
	var sel = window.getSelection();
	range.setStart(editor, l);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
}
function tim() {
	var range = document.createRange();
	var sel = window.getSelection();
	var l = edt.getCaretPos();
	range.setStart(editor, 1);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
	return;
	var d = new Date();
	var s0 = d.getSeconds();
	var ms0 = d.getMilliseconds();
	for (var i = 0; i < 1000; i++) {
		test();
	}
	d = new Date();
	var ret;
	var ms1 = d.getMilliseconds();
	var s1 = d.getSeconds() - s0;
	if (s1 > 0) {
		var r = 1000 - ms0;
		var dd = (s1 - 1) * 1000;
		ret = r + dd + ms1;
	} else {
		ret = ms1 - ms0;
	}
	log(ret / 1000);
}

window.onload = function () {
	X = window.innerWidth;
	Y = window.innerHeight;
	edt = new LabeleDit(document.getElementsByClassName('textarea')[0]);
	edt.editor.designMode = 'on';
	edt.editor.addEventListener('contextmenu', function (evt) {
		var div = document.getElementById('tb1');
		div.style.display = 'block';
		var w = div.clientWidth;
		var h = div.clientHeight;
		div.style.left = (evt.pageX + w < X) ? evt.pageX + 10 + 'px' : evt.pageX - w - 10 + 'px';
		div.style.top = (evt.pageY + h < Y) ? evt.pageY + 'px' : Y - h - 5 + 'px';
		evt.preventDefault();
		return false;
	});
	edt.editor.addEventListener('click', function () {document.getElementById('tb1').style.display = 'none';});
	//edt.editor.addEventListener('touchstart', function (e) {alert(e.changedTouches[0].pageX);});
	edt.loadFromLoco();
	edt.saveInt = window.setInterval('edt.saveToLoco()', 5000);
	//pars = window.setInterval(function () {wrk.postMessage(edt.text());}, 1000);
	//pars = window.setInterval('edt.getCaretPos()', 500);
	wrk = new Worker('js/worker.js');
	wrk.addEventListener('message', function (evt) {
		var sel = window.getSelection();
		var r = sel.getRangeAt(0);
		edt.html(evt.data);
		sel.removeAllRanges();
		sel.addRange(r);
	}, false);

};
window.onresize = function () {
	X = window.innerWidth;
	Y = window.innerHeight;
};
function setFontFam() {
	var plat = platform();
	var fams;
	if (plat == 'win') {
		fams = [' serif', ' Arial', ' Arial Black', ' Arial Narrow', ' Book Antiqua', ' Brush Script MT',
			' Calibri', ' Calibri Light', ' Comic Sans MS', ' Consolas', ' Cooper Black', ' Courier New', ' Fixedsys',
			' Harlow Solid Italic', ' Impact', ' Lucida Calligraphy', ' Lucida Sans Unicode', ' Magneto',
			' Microsoft Sans Serif', ' Palatino Linotype', ' Segoe Script', ' Segoe Print', ' Segoe UI', ' Tahoma'
		];
	} else {
		fams = [' ABeeZee', ' Abel', ' Actor', ' Adamina', ' Aladin', ' Alef', ' Alegreya', ' Allura', ' Amiri', ' Anton', ' Andika',
			' Basic', ' Bitstream Vera Sans', ' Bitstream Vera Sans Mono', ' Bitstream Vera Serif', 'Bree Serif',
			'Bruno Ace', 'Cantarell', 'CantoraOne', 'Cardo', 'Caudex', 'Century Schoolbook L', 'Changa', 'Clara', 'Clean',
			'ClearlyU', 'ClearlyU Alternate Glyphs', 'Coda', 'Comfortaa', 'Convergence', 'Corben', 'Courgette', 'Cousine',
			'Croisant One', 'Crushed', 'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif', 'Della Respira', 'Denk One', 'Devonshire',
			'Dhyana', 'Didact Gothic', 'Domine', 'Dosis', 'Droid Sans', 'Droid Sans Mono', 'Droid Serif', 'EB Garamond', 'Eagle Lake',
			'Economica', 'Elsie', 'Emblema One', 'Engagement', 'Englebert', 'Ewert', 'Fanwood Text', 'Fira Sans', 'Fixed',
			'Fondamento', 'Forum', 'Francois One', 'Gentium Book Basic', 'Glass Antiqua', 'Great Vibes', 'Gruppo', 'HammersmithOne',
			'HeadLandOne', 'Hermeneus One', 'IM FELL English', 'Inika', 'Jacques Francois Shadow', 'Jockey One', 'Josefin Sans Std',
			'Jura', 'Kelly Slab', 'La Belle Aurore', 'Ledger', 'Lekton', 'Liberation Mono', 'Liberation Sans', 'Liberation Serif',
			'Libre Baskerville', 'Maiden Orange', 'Marcellus', 'Marck Script', 'Margarine', 'McLaren', 'MedievalSharp', 'Merge One',
			'Merriweather', 'Merriweather Sans', 'Mervale Script', 'Metal', 'Metamorphous', 'Miama', 'Milonga', 'Molengo', 'Monda',
			'Monospace', 'Monoton', 'Moul', 'Neuton', 'New Rocker', 'Newspaper', 'Niconne', 'Nimbus Roman No9 L', 'Nimbus Sans L',
			'NovaMono', 'Open Sans', 'Open Sans Condensed', 'Oranienbaum', 'Oswald', 'Parisienne', 'Paytone One', 'Pecita',
			'Petit Formal Script', 'Plaster', 'Playfair Display', 'Poiret One', 'Poly', 'Porter Sans Block', 'Prociono', 'Purisa',
			'Purple Purse', 'Quando', 'Quintessential', 'Radley', 'Raleway', 'Righteous', 'Roboto', 'Roboto Condensed', 'Roboto Slab',
			'Romanesco', 'Rum Raisin', 'Sacramento', 'Sampige', 'Sanchez', 'Sancreek', 'Sans', 'Sarabun', 'Serif', 'Siemreap',
			'Smokum', 'Sonsie One', 'Source Code Pro', 'Source Sans Pro', 'Special Elite', 'Stalin One', 'Stint Ultra Condensed',
			'Stint Ultra Expanded', 'Stoke', 'Supermercado', 'Swanky and Moo Moo', 'Tangerine', 'Tenor Sans', 'Terminus', 'URW Bookman L',
			'URW Chancery L', 'URW Gothic L', 'URW Palladio L', 'Ubuntu', 'Ubuntu Condensed', 'Ubuntu Mono', 'Ultra', 'Uncial Antiqua',
			'Wellfleet', 'Yanone Kaffeesatz', 'Yellowtail', 'Zekton', ' Zeyada'];
	}
	var select = document.getElementById('selFF');
	var opt;
	var k = 0;
	for (var i in fams) {
		opt = document.createElement('option');
		opt.innerText = fams[i];
		opt.value = fams[i];
		opt.style.fontFamily = fams[i];
		select.appendChild(opt);
		select.options[k++].style.fontFamily = fams[i];
		console.log('<font font-family=\'' + fams[i] + '\'>' + fams[i] + '</font>');
	}
	select.options[2].style.color = '#f00';
}
