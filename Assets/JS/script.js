var fetchButton = document.getElementById('submitLocation');
var renderResultsName = document.getElementById('result-container-name');
var renderResultsAddress = document.getElementById('result-container-address');
var catActive = "4d4b7105d754a06377d81259"; // Outdoor & Recreation
var catCreative = "4d4b7104d754a06370d81259" ; // Arts & Entertainment
//var catSocial = "4d4b7105d754a06373d81259,4d4b7105d754a06374d81259,4d4b7105d754a06376d81259";
var catSocial = "4d4b7105d754a06374d81259,4bf58dd8d48988d116941735";//food,bar
var userFormEl = document.querySelector("#locationPoint");
var imBored = document.querySelector("#startQuiz");
var checkboxChoice = document.querySelector("#checkboxChoice");
var previousChoice = document.querySelector("#previousChoice");
var displayPreviousLocations = document.querySelector('#displayPreviousLocations');
var startOver = document.querySelector("#startOver");
var storedLocation = [];
var localStoredLocation = 'stored_locations';

imBored.addEventListener("click", function(){
 // event.preventDefault();
  document.body.children[0].style.display = 'none';
  document.body.children[1].style.display = 'block';
})

checkboxChoice.addEventListener("click", function(){
  event.preventDefault();
  document.body.children[1].style.display = 'none';
  document.body.children[2].style.display = 'block';
  document.body.children[4].style.display = 'block';
} )

startOver.addEventListener("click", function(){
  event.preventDefault();
  document.body.children[0].style.display = 'block';
  document.body.children[3].style.display = 'none';
  document.body.children[5].style.display = 'none';
})

var formSubmitHandler = function (event) {
      event.preventDefault();
      document.body.children[2].style.display = 'none';
      document.body.children[4].style.display = 'none';
      document.body.children[3].style.display = 'block';
      document.body.children[5].style.display = 'block';
      var paramLoc = document.getElementById("enterLocation").value.trim();
      // var listOfOldSearches = [];
      // listOfOldSearches = listOfOldSearches + paramLoc;
      // localStorage.setItem("oldSearch", JSON.stringify(listOfOldSearches));
      
      getWeatherInfo(paramLoc);
      getApi(paramLoc);
    }

function getApi(paramLoc) {
  renderResultsName.textContent = "";
    var paramCategoryID="";   
    if(document.getElementById('chkActive').checked == true){
         paramCategoryID =  catActive+ "&query='Athletics & Sports,Gym / Fitness Center,Beach,Bike Trail'";
         console.log("The category ID that you selected is "+paramCategoryID);
         document.getElementById('chkActive').checked = false;
    }

    if(document.getElementById('chkCreative').checked == true){
        paramCategoryID = paramCategoryID  + catCreative+"&query='Amphitheater,Aquarium,Art Gallery,Museum,Movie Theater,Exhibit'";
        
         console.log("The category ID that you selected is "+paramCategoryID);
         document.getElementById('chkCreative').checked = false;
    }

    if(document.getElementById('chkSocial').checked == true){
        paramCategoryID = paramCategoryID  + catSocial + "&query='Restaurant,Bar'";
          console.log("The category ID that you selected is "+paramCategoryID);
         document.getElementById('chkSocial').checked = false;
    }

    console.log(paramCategoryID);
    console.log("The location that user selected is "+paramLoc);
    // Insert the API url to get a list of your repos
    var baseUrl = "https://api.foursquare.com/v2/venues/explore?client_id=RFZUCUXYVINZNS2TNEGFNI4JN3ANESOHMV0YFRVYNP2XV1H2&client_secret=13ILEVDA520W4OXTJMYOW10CAFEROVPKLYUPSFBV1JFBDLIR&v=20210701";
    var requestUrl = baseUrl + "&near=" + paramLoc  ;
    if(paramCategoryID !== ""){
         requestUrl = requestUrl + "&categoryID=" + paramCategoryID;
         console.log("the request URL is "+requestUrl);
    }
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //looping over the fetch response and inserting the URL of your repos into a list
        console.log(data);
        var numberOfPlaces = data.response.groups[0].items.length;
        var nameArray = [];
        var addressArray=[] ;
        var imageArray=[];
        var contentTable = document.createElement('table');
        console.log(numberOfPlaces);
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
            console.log("latitude is "+liName.dataset.latitude);
            console.log("longitude is  "+liName.dataset.longitude);
            listContainer.appendChild(liName);
            console.log("addressfor"+i+ data.response.groups[0].items[i].venue.location.formattedAddress[0]) ; 
            var addressListContainer = document.createElement('ul');
        
            for(var j=0;j<3;j++){
              var listAddress =document.createElement('li');
              listAddress.textContent = data.response.groups[0].items[i].venue.location.formattedAddress[j];
              addressListContainer.appendChild(listAddress);
              var liAddress = document.createElement('td');
              listAddress.setAttribute("class","row-btn");
              listAddress.setAttribute("id",i);
              liAddress.appendChild(addressListContainer);
              listContainer.appendChild(liAddress);         
            } 
            var liImage = document.createElement('img');
            var imageSrc = data.response.groups[0].items[i].venue.categories[0].icon.prefix+"64";
            imageSrc = imageSrc + data.response.groups[0].items[i].venue.categories[0].icon.suffix;
            liImage.setAttribute("src",imageSrc);
            liImage.setAttribute("alt","Icon of the place category");
            listContainer.appendChild(liImage); 

            var saveButton = document.createElement("button");
            saveButton.textContent = "SAVE";
            listContainer.appendChild(saveButton);
            saveButton.setAttribute("id",i);
            saveButton.setAttribute("class","save-btn");
        
            
            contentTable.appendChild(listContainer);
          //renderResultsName.appendChild(listContainer);
        }
        renderResultsName.appendChild(contentTable);
      });
  }


   
document.addEventListener("click",function(event){
  if(!event.target.matches('.save-btn')) return;
  event.preventDefault();
  event.target.parentNode.setAttribute("style","background-color:green;");
  var currentLocation = {
    name : '',
    address : {
      addressLine1 :'',
      addressLine2 :'',
      addressLine3 :''
    }
  };

   currentLocation.name=event.target.parentNode.children[0].textContent;
  currentLocation.address.addressLine1=event.target.parentNode.children[3].firstChild.children[0].textContent;
  currentLocation.address.addressLine2=event.target.parentNode.children[3].firstChild.children[1].textContent;
  currentLocation.address.addressLine3=event.target.parentNode.children[3].firstChild.children[2].textContent; 
  console.log("value for stored location name is "+currentLocation.name);
  console.log("value for stored address is "+currentLocation.address.addressLine1);

   /* for(var i = 0; i < storedLocation.length; i++){
    storedLocation[i].name = currentLocation.name;
    storedLocation[i].address.addressLine1 = currentLocation.address.addressLine1;
    storedLocation[i].address.addressLine2 = currentLocation.address.addressLine2;
    storedLocation[i].address.addressLine3 = currentLocation.address.addressLine3;
    
    localStorage.setItem(localStoredLocation, JSON.stringify(storedLocation));
    return null;
  }  */
  storedLocation.push(currentLocation);
    localStorage.setItem(localStoredLocation,JSON.stringify(storedLocation));
  

},false);


document.getElementById('previousChoice').addEventListener("click",function(){
  window.alert("prevous search clicked");
  var myStoredLocation = JSON.parse(localStorage.getItem(localStoredLocation));
  if(myStoredLocation === null){return;}
  else{
  var previousTable = document.createElement('table');
  for (var i=0;i<storedLocation.length;i++){
    var previousRow = document.createElement('tr');
    var previousName = document.createElement('td');
    previousName.textContent = storedLocation[i].name;
    previousRow.appendChild(previousName);
    
    
    var addressListContainer = document.createElement('ul');
    
      var listAddress1 =document.createElement('li');
      
              listAddress1.textContent = storedLocation[i].address.addressLine1;
              
              addressListContainer.appendChild(listAddress1);
             
             var listAddress2 =document.createElement('li');
      
             listAddress2.textContent = storedLocation[i].address.addressLine2;
             window.alert( listAddress2.textContent);
             addressListContainer.appendChild(listAddress2);
              
              var listAddress3 =document.createElement('li');
              listAddress3.textContent = storedLocation[i].address.addressLine3;
             window.alert( listAddress3.textContent);
             addressListContainer.appendChild(listAddress3);
              var previousAddress = document.createElement('td');
              
              
              previousAddress.appendChild(addressListContainer);
              previousRow.appendChild(previousAddress);    
   
    previousTable.appendChild(previousRow);
   
  }displayPreviousLocations.appendChild(previousTable);
}
})



function getWeatherInfo(cityName){
  var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=75458c08fa474ac348f9900cc8ef4e74';
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            //console.log(city);
            console.log(data);
            console.log(data[0].lat);
            console.log(data[0].lon);
            
            sendLatLng(data[0].lat, data[0].lon);
        });
      }else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
} 
  
  
  
  function sendLatLng(myLatitude,myLongitude){
  
  var myforecastapiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+myLatitude+'&lon='+myLongitude+'&cnt='+1 +  '&appid=fabc0f3ee2df47776dc03eed2998269f';
  
    fetch(myforecastapiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
          console.log(data);
          var currentImageIcon = document.createElement('img');
          var makeImageIcon = data.current.weather[0].main;
          console.log("The weather main is "+makeImageIcon);
          currentImageIcon.setAttribute("class",makeImageIcon);
      })
    }
  }) 
}


 
userFormEl.addEventListener('submit', formSubmitHandler);