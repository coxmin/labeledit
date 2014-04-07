/**
 * Created by cosmin on 23.03.2014.
 */

var editor;
var X, Y;
var wrk, pars;
var globrange;
var ctxdiv;
var editor = new function () {
	var tata = this;
	this.tmpId = 1;
	this.inputFile = document.createElement('input');
	this.inputFile.setAttribute('type', 'file');
	this.inputFile.setAttribute('id', 'infile');
	this.lastInFile = null;
	this.saveLnk = null;
	this.saveInt = 0;
};
editor.text = function (arg) {
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
editor.html = function (arg) {
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
editor.exe = function (what, b, arg) {
	switch (what) {
		case 'createLink':
			var h = prompt('Insert link addres', 'http://');
			document.execCommand('createLink', false, h);
			break;
		case 'insertImage':
			var aFile = document.createElement('input');
			aFile.setAttribute('type', 'file');
			aFile.setAttribute('id', 'infile');
			aFile.onchange = function () {
				var fReader = new FileReader();
				fReader.onload = function (evt) {
					var im = '<img id="img' + editor.tmpId + '" src="' + this.result + '"/>';
					document.execCommand('insertHTML', false, im);
					log(im);
					document.getElementById('img' + editor.tmpId++).addEventListener('contextmenu', function (evt) {
						log(evt.x, evt.which);
						evt.stopPropagation();
						evt.preventDefault();
						return false;
					}, false);
				};
				fReader.readAsDataURL(this.files[0]);
			};
			aFile.click();
			break;
		case 'reloadLastFile':
			editor.html(editor.lastInFile.result);
			break;
		default :
			document.execCommand(what, (b == undefined) ? false : b, (arg == undefined) ? null : arg);
	}
};
editor.setSelStyle = function (stil) {
	var sel = window.getSelection();
	if (sel.rangeCount) {
		var range = sel.getRangeAt(0);
		var nod = document.createElement(stil);
		nod.appendChild(range.extractContents());
		range.insertNode(nod);
	}
};

editor.nou = function () {this.html('');};

editor.saveBuff = function () {
	var txt = this.html().replace(/(\r\n|\n|\r)/gm, '');
	var textFileAsBlob = new Blob([txt], {type: 'text/html'});
	if (!this.saveLnk) {
		this.saveLnk = document.createElement("a");
		this.saveLnk.download = 'myfile';
		if (!window.webkitURL) {
			//this.saveLnk.onclick = function () {this.saveLnk.parentNode.removeChild(this.saveLnk);};
			this.saveLnk.style.display = "none";
			document.body.appendChild(this.saveLnk);
		}
	}
	if (window.webkitURL != null) {
		this.saveLnk.href = window.webkitURL.createObjectURL(textFileAsBlob);
	} else {
		this.saveLnk.href = window.URL.createObjectURL(textFileAsBlob);
	}
	this.saveLnk.click();
};
editor.rebuf = function () {
	log(editor.getPos(), editor.getCaretPos());
};
editor.saveToLoco = function () {
	localStorage.setItem('labeledit', this.html().replace(/(\r\n|\n|\r)/gm, ''));
};
editor.loadFromLoco = function () {
	this.html(localStorage.getItem('labeledit'));
};
editor.doLoadFile = function () {
	var fReader = new FileReader();
	fReader.onload = function () {
		editor.html(this.result);
		editor.lastInFile = this;
		document.getElementById('btreload').disabled = false;
	};
	fReader.readAsText(this.files[0]);

};
editor.loadFile = function () {
	this.inputFile.click();
};

editor.selectAll = function () {
	window.getSelection().removeAllRanges();
	var range = document.createRange();
	range.selectNodeContents(editor.editor);
	window.getSelection().addRange(range);
};
editor.deSelect = function () {
	window.getSelection().removeAllRanges();
};

editor.onKey = function (evt) {
	//lst(evt);
	console.log(evt.which);
	if (evt.which == 9) {
		document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
		evt.preventDefault();
	}
};

function platform() {
	return (navigator.appVersion.indexOf("Win") != -1) ? 'win' : (navigator.appVersion.indexOf("Linux") != -1) ? 'linux' : (navigator.appVersion.indexOf("Mac") != -1) ? 'mac' : (navigator.appVersion.indexOf("X11") != -1) ? 'unix' : 'unknown';
}

editor.init = function () {
	this.editor = document.getElementById('ledit');
	this.inputFile.addEventListener('change', editor.doLoadFile, false);
};
editor.cxMenu = function (evt) {
	ctxdiv.style.display = 'block';
	var w = ctxdiv.clientWidth;
	var h = ctxdiv.clientHeight;
	ctxdiv.style.left = (evt.pageX + w < X) ? evt.pageX + 10 + 'px' : evt.pageX - w - 10 + 'px';
	ctxdiv.style.top = (evt.pageY + h < Y) ? evt.pageY + 'px' : Y - h - 5 + 'px';
	evt.preventDefault();
	return false;
};

function log(a) {
	for (var i = -1; ++i < arguments.length;) {
		console.log(i + " > " + arguments[i]);
	}
}
var sellist = function (evt) {
	document.removeEventListener('mouseup', sellist, false);
	var sel = document.getSelection();
	if (sel != '') {editor.cxMenu(evt);}
};
window.onload = function () {
	X = window.innerWidth;
	Y = window.innerHeight;
	ctxdiv = document.getElementById('tb1');
	ctxdiv.addEventListener('click', function (evt) {
		ctxdiv.style.display = 'none';
	}, false);
	editor.init();
	editor.editor.addEventListener('contextmenu', editor.cxMenu, false);
	//editor.editor.addEventListener('mousedown', function (evt) {ctxdiv.style.display = 'none';}, false);
	editor.editor.addEventListener('selectstart', function (evt) {
		selstart = document.addEventListener('mouseup', sellist, false);
	}, false);
};
window.onunload = function () {
	//wrk.terminate();
	//clearInterval(pars);
};
window.onresize = function () {
	X = window.innerWidth;
	Y = window.innerHeight;
};
function setFontFam() {
	var plat = platform();
	var fams = ['serif', 'Arial', 'Arial Black', 'Arial Narrow', 'Calibri', 'Courier New', 'Fixedsys', 'Microsoft Sans Serif', 'Palatino Linotype', 'Tahoma'];
	var select = document.getElementById('selFF');
	var opt;
	var k = 0;
	for (var i in fams) {
		opt = document.createElement('option');
		opt.innerText = fams[i];
		opt.value = fams[i];
		opt.style.fontFamily = fams[i];
		select.appendChild(opt);
	}
	select.options[2].style.color = '#f00';
}
function lst(o) {
	var s = '';
	for (var i in o) {
		try {
			console.log(i + ' => ' + o[i]);
		} catch (err) {
			console.log("ERR: " + err.message);
		}
	}
}
