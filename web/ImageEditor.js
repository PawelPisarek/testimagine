/*
ImageEditor.js
Copyright (C) 2004-2006 Peter Frueh (http://www.ajaxprogrammer.com/)
Additional code contributions and modifications by David Fuller, Olli Jarva, and Simon Jensen

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*/

ImageEditor = {
	imageName: "",
	w: 0,
	h: 0,
	startX: 0,
	startY: 0,
	mouseIsDown: false,
	loadingTextInterval: 0,
    editorImage: null,
	loaderImage: document.createElement("img"),
    cropRegion: document.createElement("div"),
	validDimension: /^\d{1,4}$/
};
ImageEditor.processImage = function(args){
	if (ImageEditor.cropRegion){
		ImageEditor.cropRegion.style.display = "none";
		ImageEditor.hideCropSize();
	}
	ImageEditor.showLoading();
	var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	request.open("POST", "processImage.php", true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function(){
		if (request.readyState == 4){
			var json = eval("(" + request.responseText + ")");
			if (json.imageFound) {
				ImageEditor.imageName = json.imageName;
				ImageEditor.w = json.w;
				ImageEditor.h = json.h;
				ImageEditor.loadImage();
			} else {
                ImageEditor.editorImage.innerHTML = '<span style="font-size:12px;color:red;">Image was not found.</span>';
			}
		}
	};
	request.send("imageName=" + ImageEditor.imageName + ((args) ? "&" + args : ""));
};
ImageEditor.loadImage = function(){
	//ImageEditor.loaderImage.setAttribute("src", "getImage.php?imageName=frog.png&t=" + (new Date).getTime());
    ImageEditor.loaderImage.setAttribute("src", "getImage.php?imageName=1517637_685764381491028_3567086122046556921_n.jpg&t=" + (new Date).getTime());
};
ImageEditor.displayImage = function(){
	clearInterval(ImageEditor.loadingTextInterval);
	
    var editorImage = ImageEditor.editorImage;
	editorImage.innerHTML = "";
	editorImage.style.width = ImageEditor.w + "px";
	editorImage.style.height = ImageEditor.h + "px";
	editorImage.style.backgroundImage = "url(/uploads/documents/1517637_685764381491028_3567086122046556921_n.jpg)";

    //editorImage.style.backgroundImage = "url(" + ImageEditor.loaderImage.getAttribute('src') + ")"


	document.getElementById("txt-width").value = ImageEditor.w;
	document.getElementById("txt-height").value = ImageEditor.h;
};
ImageEditor.showLoading = function(){
    ImageEditor.editorImage.style.backgroundImage = "none";
    ImageEditor.editorImage.innerHTML =
		'<div id="loading-text">Loading Image<span id="ellipsis">...</span></div>';
	ImageEditor.loadingTextInterval = setInterval(function(){
		if (document.getElementById("ellipsis")){
			var dots = document.getElementById("ellipsis").innerHTML;
			document.getElementById("ellipsis").innerHTML = (dots != "...") ? dots += "." : "";
		}
	}, 500);
};
ImageEditor.txtWidthKeyup = function(){
	if (!document.getElementById("chk-constrain").checked) { return; }
	var w = document.getElementById("txt-width").value;
	if (ImageEditor.validDimension.test(w)){
		document.getElementById("txt-width").value = parseInt(w);
		document.getElementById("txt-height").value = parseInt((w * ImageEditor.h)/ImageEditor.w);
	}else if (w == ""){
		document.getElementById("txt-height").value = "";	
	}else{
		document.getElementById("txt-width").value = w.replace(/[^0-9]/g, "");
	}
};
ImageEditor.txtHeightKeyup = function(){
	if (!document.getElementById("chk-constrain").checked) { return; }
	var h = document.getElementById("txt-height").value;
	if (ImageEditor.validDimension.test(h)){
		document.getElementById("txt-height").value = parseInt(h);
		document.getElementById("txt-width").value = parseInt((h * ImageEditor.w)/ImageEditor.h);	
	}else if (h == ""){
		document.getElementById("txt-width").value = "";
	}else{
		document.getElementById("txt-height").value = h.replace(/[^0-9]/g, "");	
	}
};
ImageEditor.txtBlur = function(){
	var w = document.getElementById("txt-width").value;
	var h = document.getElementById("txt-height").value;
	if (!ImageEditor.validDimension.test(w) || !ImageEditor.validDimension.test(h)){
		document.getElementById("txt-width").value = ImageEditor.w;
		document.getElementById("txt-height").value = ImageEditor.h;	
	}
}
ImageEditor.resize = function(){
	var w = document.getElementById("txt-width").value;
	var h = document.getElementById("txt-height").value;
	
	if (!ImageEditor.validDimension.test(w) || !ImageEditor.validDimension.test(h)){
		alert("The image dimensions are not valid.");
		document.getElementById("txt-width").value = ImageEditor.w;
		document.getElementById("txt-height").value = ImageEditor.h;
		return;
	}
	if (w > 2000 || h > 2000){
		alert("Width and/or height cannot exceed 2000 pixels.");
		document.getElementById("txt-width").value = ImageEditor.w;
		document.getElementById("txt-height").value = ImageEditor.h;
		return;
	}
	ImageEditor.processImage("action=resize&w=" + w + "&h=" + h);
};
ImageEditor.rotate = function(degrees){
	ImageEditor.processImage("action=rotate&degrees=" + degrees);
};
ImageEditor.viewActive = function(){
	ImageEditor.processImage("action=viewActive");
};
ImageEditor.viewOriginal = function(){
	ImageEditor.processImage("action=viewOriginal");
};
ImageEditor.save = function(){
	ImageEditor.processImage("action=save");
};
ImageEditor.undo = function(){
   ImageEditor.processImage("action=undo");
};
ImageEditor.grayscale = function(){
    ImageEditor.processImage("action=grayscale");
};
ImageEditor.sepia = function(){
    ImageEditor.processImage("action=sepia");
};
ImageEditor.pencil = function(){
    ImageEditor.processImage("action=pencil");
};
ImageEditor.emboss = function(){
    ImageEditor.processImage("action=emboss");
};
ImageEditor.sblur = function(){
    ImageEditor.processImage("action=blur");
};
ImageEditor.smooth = function(){
    ImageEditor.processImage("action=smooth");
};
ImageEditor.invert = function(){
    ImageEditor.processImage("action=invert");
};
ImageEditor.brighten = function(){
    ImageEditor.processImage("action=brighten&amt=20");
};
ImageEditor.darken = function(){
    ImageEditor.processImage("action=brighten&amt=-20");
};
ImageEditor.crop = function(){
	if (typeof ImageEditor == "undefined") { return; }
	if (ImageEditor.cropRegion.style.display == "none"){
		alert("You must select an area to crop before using this feature.");
		return;
	}
	var x = parseInt(ImageEditor.cropRegion.style.left) - PageInfo.getElementLeft(ImageEditor.editorImage);
	var y = parseInt(ImageEditor.cropRegion.style.top) - PageInfo.getElementTop(ImageEditor.editorImage);
	var w = parseInt(ImageEditor.cropRegion.style.width);
	var h = parseInt(ImageEditor.cropRegion.style.height);

	ImageEditor.processImage("action=crop&x=" + x + "&y=" + y + "&w=" + w + "&h=" + h);
};
ImageEditor.startCrop = function(){
	if (typeof ImageEditor == "undefined") { return; }
    
    var cropRegionStyle = ImageEditor.cropRegion.style;
    cropRegionStyle.left = PageInfo.getMouseX() + "px";
    cropRegionStyle.top = PageInfo.getMouseY() + "px";
    cropRegionStyle.width = "1px";
    cropRegionStyle.height = "1px";
    cropRegionStyle.display = "block";
	
    ImageEditor.startX = PageInfo.getMouseX();
	ImageEditor.startY = PageInfo.getMouseY();
};
ImageEditor.dragCrop = function(){
	if (typeof ImageEditor == "undefined") { return; }
	if (!ImageEditor.mouseIsDown) { return; }

	// mouse is to the right of starting point
	if (PageInfo.getMouseX() - ImageEditor.startX > 0) {
		ImageEditor.cropRegion.style.width = PageInfo.getMouseX() - ImageEditor.startX + "px";
	} else{ // mouse is to the left of starting point
		ImageEditor.cropRegion.style.left = PageInfo.getMouseX() + "px";
		ImageEditor.cropRegion.style.width = ImageEditor.startX - PageInfo.getMouseX() + "px";
	}
	// mouse is below the starting point
	if (PageInfo.getMouseY() - ImageEditor.startY > 0) {
		ImageEditor.cropRegion.style.height = PageInfo.getMouseY() - ImageEditor.startY + "px";
	} else { // mouse is above the starting point
		ImageEditor.cropRegion.style.top = PageInfo.getMouseY() + "px";
		ImageEditor.cropRegion.style.height = ImageEditor.startY - PageInfo.getMouseY() + "px";
	}
	ImageEditor.showCropSize(parseInt(ImageEditor.cropRegion.style.width), parseInt(ImageEditor.cropRegion.style.height));
};
ImageEditor.slideCrop = function(e){
	if (ImageEditor.cropRegion.style.display == "none") { return; }
	e = e || event;
	var code = (e.keyCode) ? e.keyCode : (e.which) ? e.which : null;
	if (!code) { return };
	switch (code){
		case 37: //left
			if(PageInfo.getElementLeft(ImageEditor.cropRegion) > PageInfo.getElementLeft(ImageEditor.editorImage)){
				ImageEditor.cropRegion.style.left = PageInfo.getElementLeft(ImageEditor.cropRegion) - 1 + "px";
			}
			break;
		case 38: //up
			if(PageInfo.getElementTop(ImageEditor.cropRegion) > PageInfo.getElementTop(ImageEditor.editorImage)){
				ImageEditor.cropRegion.style.top = PageInfo.getElementTop(ImageEditor.cropRegion) - 1 + "px";
			}		
			break;
		case 39: //right
			if (PageInfo.getElementLeft(ImageEditor.cropRegion) + PageInfo.getElementWidth(ImageEditor.cropRegion) < PageInfo.getElementLeft(ImageEditor.editorImage) + PageInfo.getElementWidth(ImageEditor.editorImage)){
				ImageEditor.cropRegion.style.left = PageInfo.getElementLeft(ImageEditor.cropRegion) + 1 + "px";
			}
			break;
		case 40: //down
			if (PageInfo.getElementTop(ImageEditor.cropRegion) + PageInfo.getElementHeight(ImageEditor.cropRegion) < PageInfo.getElementTop(ImageEditor.editorImage) + PageInfo.getElementHeight(ImageEditor.editorImage)){
				ImageEditor.cropRegion.style.top = PageInfo.getElementTop(ImageEditor.cropRegion) + 1 + "px";
			}		
			break;
	}
};
ImageEditor.showCropSize = function(w, h){
	document.getElementById("crop-size").innerHTML = w + " by " + h + " (use arrow keys to slide)";
};
ImageEditor.hideCropSize = function(){
	document.getElementById("crop-size").innerHTML = "";
};
ImageEditor.addEvent = function(obj, evt, func){
	if (window.addEventListener){
		obj.addEventListener(evt, func, false);
	}else if (window.attachEvent){
		obj.attachEvent("on" + evt, func);
	}
};
ImageEditor.init = function(imageName){

    ImageEditor.imageName = imageName || "";
    ImageEditor.editorImage = document.getElementById("image");

	ImageEditor.loaderImage.onload = function(){ ImageEditor.displayImage(); };

	ImageEditor.processImage("action=viewActive");
	
    ImageEditor.cropRegion.className = "cropRegion";
	var bodyNode = document.getElementsByTagName("body").item(0);
	bodyNode.appendChild(ImageEditor.cropRegion);
	
	ImageEditor.addEvent(document, "mousedown", function(){ ImageEditor.mouseIsDown = true; });
	ImageEditor.addEvent(document, "mouseup", function(){ ImageEditor.mouseIsDown = false; });
	ImageEditor.addEvent(ImageEditor.editorImage, "mouseover", function(){ ImageEditor.editorImage.style.cursor = "crosshair"; });
	ImageEditor.addEvent(ImageEditor.editorImage, "mousedown", ImageEditor.startCrop);
	ImageEditor.addEvent(ImageEditor.editorImage, "mousemove", ImageEditor.dragCrop);
	ImageEditor.addEvent(ImageEditor.cropRegion, "mousedown", ImageEditor.startCrop);
	ImageEditor.addEvent(ImageEditor.cropRegion, "mousemove", ImageEditor.dragCrop);
	ImageEditor.addEvent(document, "dblclick", function() { ImageEditor.cropRegion.style.display = "none"; ImageEditor.hideCropSize(); });
	ImageEditor.addEvent(document, "keydown", ImageEditor.slideCrop);
	ImageEditor.addEvent(document.getElementById("txt-width"), "keyup", ImageEditor.txtWidthKeyup);
	ImageEditor.addEvent(document.getElementById("txt-width"), "blur", ImageEditor.txtBlur);
	ImageEditor.addEvent(document.getElementById("txt-height"), "keyup", ImageEditor.txtHeightKeyup);
	ImageEditor.addEvent(document.getElementById("txt-height"), "blur", ImageEditor.txtBlur);
};