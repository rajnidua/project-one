var fetchButton = document.getElementById('submitLocation');
var renderResultsName = document.getElementById('result-container-name');
var renderResultsAddress = document.getElementById('result-container-address');
var catActive = "4d4b7105d754a06377d81259"; // Outdoor & Recreation
var catCreative = "4d4b7104d754a06370d81259" ; // Arts & Entertainment
var catSocial = "4d4b7105d754a06373d81259,4d4b7105d754a06374d81259,4d4b7105d754a06376d81259";
var userFormEl = document.querySelector("#locationPoint");
var imBored = document.querySelector("#startQuiz");
var checkboxChoice = document.querySelector("#checkboxChoice");
var startOver = document.querySelector("#startOver");

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
      getApi(paramLoc);
    }

function getApi(paramLoc) {
    var paramCategoryID="";   
    if(document.getElementById('chkActive').checked == true){
         paramCategoryID =  catActive+ "&query='park,fitness,beach'";
         console.log("The category ID that you selected is "+paramCategoryID);
    }

    if(document.getElementById('chkCreative').checked == true){
         paramCategoryID = paramCategoryID  + catCreative+"&query='arts,craft,museum,theatre'";
         console.log("The category ID that you selected is "+paramCategoryID);
    }

    if(document.getElementById('chkSocial').checked == true){
         paramCategoryID = paramCategoryID  + catSocial + "&query='coffee'";
         console.log("The category ID that you selected is "+paramCategoryID);
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
        /* var b = data.response.groups[0].items[i].venue.categories[0].id;
        var a = data.response.groups[0].items[i].venue.categories[0].icon.prefix;
        var c = data.response.groups[0].items[i].venue.categories[0].icon.suffix;
        console.log(a);
        console.log(b);
        console.log(c);
        var liImage = document.createElement('img');
           liImage.setAttribute("src",a+b+c);
            listContainer.appendChild(liImage); */
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
            /* var liImage = document.createElement('img');
            var imageSrc = "https://www.google.com/search?q=St+James%27s+Park";
            liImage.setAttribute("src",imageSrc);
            liImage.setAttribute("alt","Image of St James Park");
            listContainer.appendChild(liImage); */
            //getThePhoto( nameArray[i]);
            var liImage = document.createElement('p');
            liImage.setAttribute("class","fas fa-mug-hot");
            listContainer.appendChild(liImage);
            contentTable.appendChild(listContainer);
          //renderResultsName.appendChild(listContainer);
        }renderResultsName.appendChild(contentTable);
      });
  }


  function getThePhoto(placeName){
    accessKey: 'MY_ACCESS_KEY';
      var apiUrl =  fetch('https://api.unsplash.com/photos/?client_id=' + accessKey);
      fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //looping over the fetch response and inserting the URL of your repos into a list
        console.log(data);
       // return data;
  })
}


document.addEventListener('click', function (event) {
  // If the clicked element doesn't have the right selector, bail
 if (!event.target.matches('.row-btn')) return;
 // Don't follow the link
 console.log("I am not clicked");
 event.preventDefault();
 console.log("I am clicked");
 // Log the clicked element in the console
 console.log(event.target); 
 console.log(event.target.id);
 event.target.parentNode.setAttribute("style","background-color:purple;");
 var targetLatitude = event.target.dataset.latitude;
 var targetLongitude = event.target.dataset.longitude;
 console.log("The latitude for this place is "+targetLatitude);
 getWeatherInfo(targetLatitude,targetLongitude);
 }, false);

 
function getWeatherInfo(targetLatitude,targetLongitude){
  var myforecastapiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+targetLatitude+'&lon='+targetLongitude+'&cnt='+1 +  '&appid=fabc0f3ee2df47776dc03eed2998269f';
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