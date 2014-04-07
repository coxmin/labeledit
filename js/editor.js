/**
 * Created by cosmin on 07.04.2014.
 */

(function qq() {
	editor11 = new function () {};
	editor11.editor = document.getElementById('ledit');
	this.editor1 = function () {
		var tata = this;
		this.editor = document.getElementById('ledit');
		this.inputFile = document.createElement('input');
		this.aFile = document.createElement('input');
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
		this.aFile.setAttribute('type', 'file');
		this.aFile.setAttribute('id', 'afile');
	};
	editor11.aa = function () {
		var aa = 1;
		return 2;
	}
	var log = function () {
		for (var i in arguments) {
			console.log(i + ' -> ' + arguments[i]);
		}
	};
	log(editor11.aa());
})();
