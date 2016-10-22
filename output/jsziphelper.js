JSZipHelper = {};
JSZipHelper.Loading = 0;
JSZipHelper.Files = {};
JSZipHelper.openZip = function(pathToZip,callback) {
JSZipUtils.getBinaryContent(pathToZip, function(err, data) {
    if(err) {
        throw err; 
    }
    JSZip.loadAsync(data).then(function () {
		callback(arguments[0]);
    });
});
}
JSZipHelper.loadImage = function(zipData,fileName,callback)
{
	var G = zipData.files[fileName];
	if (G == null)
	{
		callback(null);
	}
	else
	{
	var GG = G.async("base64");
		GG.then(function (VG) {
		var img = document.createElement("img");
		var b64encoded = VG;
		
		img.src = "data:image/png;base64,"+b64encoded;
		callback(img);},function () {callback(null);});
	}
}
/*JSZipHelper.LoadPNGs = function() {
JSZipUtils.getBinaryContent('Images.zip', function(err, data) {
    if(err) {
        throw err; 
    }
    JSZip.loadAsync(data).then(function () {
		//var f = "object/amulet_0.png";
		var files = arguments[0].file;
		var keys = Object.Keys(fileSize);
		var i = 0;
		var ln = files.length
		while (i < ln)
		{
		var G = files[keys[i]];
		if (G == null)
		{
			alert("file \""+f+"\" not found.");
			return;
		}
		var GG = G.async("base64");
		JSZipHelper.Loading += 1;
		GG.then(function (VG) {
		var img = document.createElement("img");
		var b64encoded = VG;
		
		img.src = "data:image/png;base64,"+b64encoded;
		//document.body.appendChild(img);},function () {document.body.innerHTML="image fail!";});
		document.body.appendChild(img);
		JSZipHelper.Loading -= 1;
		},function () {JSZipHelper.Loading -= 1;});
		i = i + 1;
		}
		
		
    });
});
}*/