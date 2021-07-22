var fetchButton = document.getElementById('submitLocation');
var renderResultsName = document.getElementById('result-container-name');
var renderResultsAddress = document.getElementById('result-container-address');
var catActive = "4d4b7105d754a06377d81259"; // Outdoor & Recreation
var catCreative = "4d4b7104d754a06370d81259" ; // Arts & Entertainment
var catSocial = "4d4b7105d754a06374d81259,4bf58dd8d48988d116941735";//food,bar
var userFormEl = document.querySelector("#locationPoint");
var imBored = document.querySelector("#startQuiz");
var checkboxChoice = document.querySelector("#checkboxChoice");
var previousChoice = document.querySelector("#previousChoice");
var displayPreviousLocations = document.querySelector('#displayPreviousLocations');
var startOver = document.querySelector("#startOver");

var localStoredLocation = 'stored_locations';
var showCount = 0;

imBored.addEventListener("click", function(){
  document.body.children[0].style.display = 'none';
  document.body.children[1].style.display = 'block';
  displayPreviousLocations.textContent="";
})

checkboxChoice.addEventListener("click", function(event){
  event.preventDefault();
  document.getElementById("clearPreviousChoice").style.display = "none";
  document.body.children[1].style.display = 'none';
  document.body.children[2].style.display = 'block';
  document.body.children[4].style.display = 'block';
     /* if (showCount > 0 ){
       if(document.body.children[1].children[7].length!==null){
      document.body.children[1].children[7].children[0].remove();
      showCount = 0;
       } */
    //} 
} )

startOver.addEventListener("click", function(event){
  event.preventDefault();
  document.body.children[0].style.display = 'block';
  document.body.children[3].style.display = 'none';
  document.body.children[5].style.display = 'none';
  document.getElementById('chkActive').checked = true;
  displayPreviousLocations.textContent="";
})

var formSubmitHandler = function (event) {
      event.preventDefault();
      document.body.children[2].style.display = 'none';
      document.body.children[4].style.display = 'none';
      document.body.children[3].style.display = 'block';
      document.body.children[5].style.display = 'block';
      var paramLoc = document.getElementById("enterLocation").value.trim();
      
      getWeatherInfo(paramLoc);
      getApi(paramLoc);
    }

function getApi(paramLoc) {
  renderResultsName.textContent = "";
  var resultsHeading = document.createElement("h2");
  resultsHeading.textContent = "Here are some options!"
  renderResultsName.appendChild(resultsHeading)
    var paramCategoryID="";   
    if(document.getElementById('chkActive').checked == true){
         paramCategoryID =  catActive+ "&query='Athletics & Sports,Gym / Fitness Center,Beach,Bike Trail'";
         document.getElementById('chkActive').checked = false;
    }

    if(document.getElementById('chkCreative').checked == true){
        paramCategoryID = paramCategoryID  + catCreative+"&query='Amphitheater,Aquarium,Art Gallery,Museum,Movie Theater,Exhibit'";
        
         document.getElementById('chkCreative').checked = false;
    }

    if(document.getElementById('chkSocial').checked == true){
        paramCategoryID = paramCategoryID  + catSocial + "&query='Restaurant,Bar'";
         document.getElementById('chkSocial').checked = false;
    }

    // Insert the API url to get a list of your locations according to the category selected
    var baseUrl = "https://api.foursquare.com/v2/venues/explore?client_id=RFZUCUXYVINZNS2TNEGFNI4JN3ANESOHMV0YFRVYNP2XV1H2&client_secret=13ILEVDA520W4OXTJMYOW10CAFEROVPKLYUPSFBV1JFBDLIR&v=20210701";
    var requestUrl = baseUrl + "&near=" + paramLoc  ;
    if(paramCategoryID !== ""){
         requestUrl = requestUrl + "&categoryID=" + paramCategoryID;
    }
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //looping over the fetch response and inserting the URL of your data into a table
        var numberOfPlaces = data.response.groups[0].items.length;
        var nameArray = [];
        var addressArray=[] ;
        var imageArray=[];
        var contentTable = document.createElement('table');
          for(var i=0;i<numberOfPlaces;i++){
            var listContainer = document.createElement('tr');
            nameArray[i] = data.response.groups[0].items[i].venue.name;
            var liName = document.createElement('td');
            liName.textContent = nameArray[i];
            liName.setAttribute("class","row-btn");
            liName.setAttribute("id",i);
            var myLatitude = data.response.groups[0].items[i].venue.location.lat;
            var myLongitude = data.response.groups[0].items[i].venue.location.lng;
            
            liName.setAttribute("data-latitude", myLatitude);
            liName.setAttribute("data-longitude", myLongitude);
            listContainer.appendChild(liName);
            var liAddress = document.createElement('td');
            var addressListContainer = document.createElement('ul');
            //get the length of the formatted address array
            var formattedAddressLength = data.response.groups[0].items[i].venue.location.formattedAddress.length;
        
            for(var j=0;j<formattedAddressLength;j++){
              var listAddress =document.createElement('li');
              listAddress.textContent = data.response.groups[0].items[i].venue.location.formattedAddress[j];
              addressListContainer.appendChild(listAddress);
              listAddress.setAttribute("class","row-btn");
              listAddress.setAttribute("id",i);
              liAddress.appendChild(addressListContainer);
              listContainer.appendChild(liAddress);         
            } 
            var liImage = document.createElement('img');
            //checks if icon is present or not
            if(data.response.groups[0].items[i].venue.categories.length === 0){
              
              liImage.setAttribute("alt","No Icon");
            }else{
              
            var imageSrc = data.response.groups[0].items[i].venue.categories[0].icon.prefix+"64";
            
            imageSrc = imageSrc + data.response.groups[0].items[i].venue.categories[0].icon.suffix;
            liImage.setAttribute("src",imageSrc);
            liImage.setAttribute("alt","Icon of the place category");
          }
            listContainer.appendChild(liImage); 

            var saveButton = document.createElement("button");
            saveButton.textContent = "SAVE";
            listContainer.appendChild(saveButton);
            saveButton.setAttribute("id",i);
            saveButton.setAttribute("class","save-btn");
        
            
            contentTable.appendChild(listContainer);
          
        }
        renderResultsName.appendChild(contentTable);
      });
  }


//saves the record in local storage when save button is clicked   
document.addEventListener("click",function(event){
  if(!event.target.matches('.save-btn')) return;
  event.preventDefault();
  event.target.setAttribute("style","background-color:grey;");
  var currentLocation = {
    name : '',
    address : {
      addressLine1 :'',
      addressLine2 :'',
      addressLine3 :''
    },
    
  };

   currentLocation.name=event.target.parentNode.children[0].textContent;
   var addressLength = event.target.parentNode.children[1].firstChild.children.length;
   if(addressLength>3){
     addressLength=3;
   }
   for (var i=0;i<addressLength;i++){
    if(addressLength===3){
      currentLocation.address.addressLine1=event.target.parentNode.children[1].firstChild.children[0].textContent;
      currentLocation.address.addressLine2=event.target.parentNode.children[1].firstChild.children[1].textContent;
      currentLocation.address.addressLine3=event.target.parentNode.children[1].firstChild.children[2].textContent;  
    }else if(addressLength===2){
      currentLocation.address.addressLine1=event.target.parentNode.children[1].firstChild.children[0].textContent;
      currentLocation.address.addressLine2=event.target.parentNode.children[1].firstChild.children[1].textContent;
   }else if(addressLength===1){
      currentLocation.address.addressLine1=event.target.parentNode.children[1].firstChild.children[0].textContent;
   }

  }
  storedLocation = JSON.parse(localStorage.getItem(localStoredLocation));
    if (storedLocation === null)
    {
      storedLocation = storedLocation || [];
      storedLocation.push(currentLocation);
      localStorage.setItem(localStoredLocation,JSON.stringify(storedLocation));
      return;
    }

    else {
      for(var i = 0; i < storedLocation.length; i++){
        if (storedLocation[i].name === currentLocation.name &&
          storedLocation[i].address.addressLine1 === currentLocation.address.addressLine1 &&
          storedLocation[i].address.addressLine2 === currentLocation.address.addressLine2 &&
          storedLocation[i].address.addressLine3 === currentLocation.address.addressLine3)
        { 
          return;
        }
      }  
      storedLocation.push(currentLocation);
      localStorage.setItem(localStoredLocation,JSON.stringify(storedLocation));
      document.getElementById('clearPreviousChoice').disabled = false;
   
}

},false);

//clears the local storage and rendered text in displayPreviousLocation , also disables the clear button
 document.getElementById('clearPreviousChoice').addEventListener("click", function(){
    displayPreviousLocations.textContent="";
    if (localStorage.length !== 0){
      localStorage.clear();
      document.getElementById('clearPreviousChoice').disabled = true;
    }
   else{
    // window.alert("No Locations found based on previous searches");
   }
 })

//function for familiar button,displays previous stored locations
document.getElementById('previousChoice').addEventListener("click",function(){
  
  //showCount = showCount + 1;
  displayPreviousLocations.textContent="";
 
  var myStoredLocation = JSON.parse(localStorage.getItem(localStoredLocation));
  if(myStoredLocation === null) {

      
      displayPreviousLocations.textContent="There are no previous searches.";
      document.getElementById('clearPreviousChoice').style.display = "none";
      document.getElementById('clearPreviousChoice').disabled = true;
    return;}
  else{
      var previousTable = document.createElement('table');
      for (var i=0;i<myStoredLocation.length;i++){
        var previousRow = document.createElement('tr');
        var previousName = document.createElement('td');
        previousName.textContent = myStoredLocation[i].name;
        previousRow.appendChild(previousName);
    
        var addressListContainer = document.createElement('ul');
       var listAddress1 =document.createElement('li');
      
        listAddress1.textContent = myStoredLocation[i].address.addressLine1;
              
        addressListContainer.appendChild(listAddress1);
             
        var listAddress2 =document.createElement('li');
      
        listAddress2.textContent = myStoredLocation[i].address.addressLine2;
        addressListContainer.appendChild(listAddress2);
              
        var listAddress3 =document.createElement('li');
        listAddress3.textContent = myStoredLocation[i].address.addressLine3;
  
        addressListContainer.appendChild(listAddress3);
        var previousAddress = document.createElement('td');

        previousAddress.appendChild(addressListContainer);
        previousRow.appendChild(previousAddress);   
          
        previousTable.appendChild(previousRow);
   
      }displayPreviousLocations.appendChild(previousTable);
  document.getElementById('clearPreviousChoice').style.display = "inline-flex";
  document.getElementById('clearPreviousChoice').disabled = false;
}
})


//weather information for background images
function getWeatherInfo(cityName){
  var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=75458c08fa474ac348f9900cc8ef4e74';
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            
                       
            sendLatLng(data[0].lat, data[0].lon);
        });
      }else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
     alert('Unable to connect');
    });
    
} 
  
  
 //getting class for background image 
  function sendLatLng(myLatitude,myLongitude){
  
  var myforecastapiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+myLatitude+'&lon='+myLongitude+'&cnt='+1 +  '&appid=fabc0f3ee2df47776dc03eed2998269f';
  
    fetch(myforecastapiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
      
          var makeImageIcon = data.current.weather[0].main;
          
          document.querySelector("html").setAttribute("class",makeImageIcon);
         
      })
    }
  }) 
}


 
userFormEl.addEventListener('submit', formSubmitHandler);