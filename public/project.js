var URLParts;
window.onhashchange = onPageLoad;
var imagesArray;
var imagesLength;
var username = localStorage.getItem("username");
var sort = localStorage.getItem("sort");
var apiKey = "b72b903aa3afba5c70536c77bea2971a";

function onPageLoad() {
	URLParts = location.href.split('#');
	clearContentDiv();
	loadContentDiv();
}

function preferencesClick() {
	window.location.href = URLParts[0] + "#" + "view=" + "preferences";
}

function catGalleryClick() {
	window.location.href = URLParts[0] + "#" + "view=" + "cats";
}

function dogGalleryClick() {
	window.location.href = URLParts[0] + "#" + "view=" + "dogs";
}

function homeClick() {
	window.location.href = URLParts[0];
}

function clearContentDiv() {
	document.getElementById("sharedButtons").innerHTML = "";
	document.getElementById("content").innerHTML = "";
}

function loadCatContent(response) {
	addNameToBanner();
	document.getElementById("sharedButtons").innerHTML = "<button onclick='dogGalleryClick()' id='dogGalleryButton' type='button'>Dog Gallery</button><button onclick='preferencesClick()' id='preferencesButton' type='button'>Preferences</button>";
	document.getElementById("content").innerHTML = "<h2>Cat Gallery:</h2><div id='pictureGrid'></div>";
	
	addImagesToList(response, "cat");
}

function loadDogContent(response) {
	addNameToBanner();
	document.getElementById("sharedButtons").innerHTML = "<button onclick='catGalleryClick()' id='catGalleryButton' type='button'>Cat Gallery</button><button onclick='preferencesClick()' id='preferencesButton' type='button'>Preferences</button>";
	document.getElementById("content").innerHTML = "<h2>Dog Gallery:</h2><div id='pictureGrid'></div>";
	
	addImagesToList(response, "dog");
}

function loadPreferencesContent() {
	addNameToBanner();
	var ascending = "<h2>Preferred Settings:</h2><div class='preferencesDiv'><label>Name: </label><input type='text'  id='inputtedName' onkeyup='addNameToBanner()' placeholder='name'><form action=''><input type='radio' name='display' onclick='getDisplayOrder()' checked='checked' id='ascending' value='displayAscending'> Show Newest First<br><input type='radio' name='display' onclick='getDisplayOrder()' id='descending' value='displayDescending'> Show Oldest First<br></form></div><div class='imgDiv'><img alt='' src='images/gears.jpg'></div>";
	var descending = "<h2>Preferred Settings:</h2><div class='preferencesDiv'><label>Name: </label><input type='text'  id='inputtedName' onkeyup='addNameToBanner()' placeholder='name'><form action=''><input type='radio' name='display' onclick='getDisplayOrder()' id='ascending' value='displayAscending'> Show Newest First<br><input type='radio' name='display' onclick='getDisplayOrder()' id='descending' checked='checked' value='displayDescending'> Show Oldest First<br></form></div><div class='imgDiv'><img alt='' src='images/gears.jpg'></div>";
	document.getElementById("sharedButtons").innerHTML = "<button onclick='homeClick()' id='homeButton' type='button'><< Home</button>";
	if(sort == "ascending")
		document.getElementById("content").innerHTML = ascending;
	else
		document.getElementById("content").innerHTML = descending;
	
}

function loadIndexContent() {
	addNameToBanner();
	document.getElementById("sharedButtons").innerHTML = "<button onclick='preferencesClick()' id='preferencesButton' type='button'>Preferences</button>";
	document.getElementById("content").innerHTML = "<h2>Gallery Options:</h2><div class='left'><button onclick='catGalleryClick()' id='catGalleryButton' type='button'>Cat Gallery</button><img alt='cat logo' src='images/cartoon-cats-7.jpg'></div><div class='right'><button onclick='dogGalleryClick()' id='dogGalleryButton' type='button'>Dog Gallery</button><img alt='dog logo' src='images/snoopy.jpg'></div>";
}

function addNameToBanner() {	
	username = localStorage.getItem("username");
	if(document.getElementById("inputtedName")){
		username = document.getElementById("inputtedName").value;
		if(username != null && username != "" && username != "null"){
			localStorage.setItem("username", username);
		}
	}
	console.log(username);
	if(username == null || username == "" || username == "null"){
		document.getElementById("username").innerHTML = "enter name in preferences";
	}else{
		document.getElementById("username").innerHTML = "welcome, " + username;
	}
	getDisplayOrder();
}

function getDisplayOrder() {
	if(document.getElementById("ascending")){
		if(document.getElementById("ascending").checked){
			localStorage.setItem("sort", "ascending");
			sort = localStorage.getItem("sort");
		}
		else{
			localStorage.setItem("sort", "descending");
			sort = localStorage.getItem("sort");
		}
	
		if(sort == "descending"){
			document.getElementById("descending").checked = true;
		}else{
			document.getElementById("ascending").checked = true;
		}
	}
	
	if(sort == null)
		sort = "ascending";
	document.getElementById("sort").innerHTML = "sort - " + sort;
}

function loadContentDiv() {
	console.log("sorted by " + sort);
	if(URLParts[1]){
		var view = URLParts[1];
		if(view == "view=cats"){
			getEventsAJAX("cats", sort, loadCatContent)
		}else if(view == "view=dogs"){
			getEventsAJAX("dogs", sort, loadDogContent);
		}else if(view == "view=preferences"){
			loadPreferencesContent();
		}else{
			loadIndexContent();
		}
	}else{
		console.log("url has nothing after the #")
		loadIndexContent();
	}
}

function getEventsAJAX(searchTag, sort, successCB) {
	if(sort == "descending"){
		sort = "desc";
	}else{
		sort = "asc";
	}
	var server = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apiKey +"&tags=" + searchTag + "&sort=date-posted-" + sort + "&accuracy=1&radius=100000&format=json&nojsoncallback=1";
	var response;
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4) {
	    	if (xhttp.status == 200) {
	    		response = JSON.parse(xhttp.responseText);
	    		successCB(response);
	    		console.log(response);
	    	}else{
	    	    var eventDiv = document.getElementById("content");
	    	    eventDiv.innerHTML = "";
	    	    eventDiv.innerHTML = "500 error, try reloading"
	    	}
	    }
	  };
	  xhttp.open("GET", server, true);
	  xhttp.send();
	  
}

function addImagesToList(response, animal){
	console.log(response);
	var content = document.getElementById("content");
	var grid = document.getElementById("pictureGrid");
	
	var photos = response.photos.photo;
	imagesArray = photos.length;
	for(var i = 0; i < imagesArray; i++){
		var item = photos[i];	
		var srcInfo = "https://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
		var img = document.createElement("img");
		img.src = srcInfo;
		img.alt = animal + "picture"
		  
		document.getElementById("pictureGrid").appendChild(img);
	}
	content.appendChild(grid);
}

