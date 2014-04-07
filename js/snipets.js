function download(strData, strFileName, strMimeType) {
	var D = document,
	    a = D.createElement("a");
	strMimeType = strMimeType || "application/octet-stream";

	if (navigator.msSaveBlob) { // IE10+
		return navigator.msSaveBlob(new Blob([strData], {type: strMimeType}), strFileName);
	}
	/* end if(navigator.msSaveBlob) */

	if ('download' in a) { //html5 A[download]
		a.href = "data:" + strMimeType + "," + encodeURIComponent(strData);
		a.setAttribute("download", strFileName);
		a.innerHTML = "downloading...";
		D.body.appendChild(a);
		setTimeout(function () {
			a.click();
			D.body.removeChild(a);
		}, 66);
		return true;
	}
	/* end if('download' in a) */


	//do iframe dataURL download (old ch+FF):
	var f = D.createElement("iframe");
	D.body.appendChild(f);
	f.src = "data:" + strMimeType + "," + encodeURIComponent(strData);

	setTimeout(function () {
		D.body.removeChild(f);
	}, 333);
	return true;
}
/* end download() */

function loadCanvas(id) {
	var canvas = document.createElement('canvas');
	div = document.getElementById(id);
	canvas.id = "CursorLayer";
	canvas.width = 600;
	canvas.height = 400;
	canvas.style.zIndex = 8;
	canvas.style.position = "absolute";
	canvas.style.left = 0;
	canvas.style.top = 0;
	canvas.style.border = "1px solid #0f0";
	div.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 10;
	ctx.strokeStyle = "#777";
	ctx.shadowBlur = 10;
	ctx.shadowColor = "#00f";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(300, 150);
	ctx.stroke();
}

Storage.prototype.getObject = function (key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
};

function getSelectionHtml() {
	var html = "";
	if (typeof window.getSelection != "undefined") {
		var sel = window.getSelection();
		if (sel.rangeCount) {
			var container = document.createElement("div");
			for (var i = 0, len = sel.rangeCount; i < len; ++i) {
				container.appendChild(sel.getRangeAt(i).cloneContents());
			}
			html = container.innerHTML;
		}
	} else if (typeof document.selection != "undefined") {
		if (document.selection.type == "Text") {
			html = document.selection.createRange().htmlText;
		}
	}
	alert(html);
}
function replaceSelectedText(replacementText) {
	var sel, range;
	if (window.getSelection) {
		sel = window.getSelection();
		if (sel.rangeCount) {
			/*var elm = $('#txt');
			 var start = elm.selectionStart;
			 var end = elm.selectionEnd;
			 alert(elm.value.substring(start, end))*/
			range = sel.getRangeAt(0);
			range.deleteContents();
			range.insertNode(document.createTextNode(replacementText));
		}
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		range.text = replacementText;
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
	var l = editor.getCaretPos();
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
/*onload
 //editor.editor.addEventListener('touchstart', function (e) {alert(e.changedTouches[0].pageX);});
 //editor.loadFromLoco();
 //editor.saveInt = window.setInterval('editor.saveToLoco()', 5000);
 //pars = window.setInterval(function () {wrk.postMessage(editor.text());}, 1000);
 //pars = window.setInterval('editor.getCaretPos()', 500);
 wrk = new Worker('js/worker.js');
 wrk.addEventListener('message', function (evt) {
 var sel = window.getSelection();
 var r = sel.getRangeAt(0);
 editor.html(evt.data);
 sel.removeAllRanges();
 sel.addRange(r);
 }, false);
 */


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

editor.getCaretPos = function () {
	//http://stackoverflow.com/questions/16736680/get-caret-position-in-contenteditable-div-including-tags
	var range = window.getSelection().getRangeAt(0);
	var preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(this.editor);
	preCaretRange.setEnd(range.endContainer, range.endOffset);
	globrange = preCaretRange;
	return preCaretRange.toString().length;
};
editor.saveBuff = function () {
	var txt = this.html().replace(/(\r\n|\n|\r)/gm, '');
	var textFileAsBlob = new Blob([txt], {type: 'text/html'});
	if (!this.saveLnk) {
		this.saveLnk = document.createElement("a");
		this.saveLnk.download = 'myfile';
		if (window.webkitURL != null) {
			this.saveLnk.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}
		else {
			this.saveLnk.href = window.URL.createObjectURL(textFileAsBlob);
			//this.saveLnk.onclick = function () {this.saveLnk.parentNode.removeChild(this.saveLnk);};
			this.saveLnk.style.display = "none";
			document.body.appendChild(this.saveLnk);
		}
	}
	this.saveLnk.click();
};
