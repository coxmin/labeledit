var w = ['import', 'def', 'print', 'as'];
onmessage = function (evt) {
	var t = evt.data.split(' ');
	var ret = '';
	for (var i = 0; i < t.length; i++) {
		if (t[i].lastIndexOf('#', 0) === 0) {
			ret += ' <span style="color:' + t[i] + '">' + t[i] + "</span>";
		} else {
			var b = false
			for (var j = 0; j < w.length; j++) {
				if (t[i].lastIndexOf(w[j], 0) === 0) {
					b = true;
					ret += ' <span style="color:#c3f">' + t[i] + "</span>";
					break;
				}
			}
			if (b == false) {ret += ' ' + t[i];}
		}
	}
	self.postMessage(ret);
};
