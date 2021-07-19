var fetchButton = document.getElementById('submitLocation');
var renderResultsName = document.getElementById('result-container-name');
var renderResultsAddress = document.getElementById('result-container-address');
var catActive = "4d4b7105d754a06377d81259"; // Outdoor & Recreation
var catCreative = "4d4b7104d754a06370d81259" ; // Arts & Entertainment
var catSocial = "4d4b7105d754a06373d81259,4d4b7105d754a06374d81259,4d4b7105d754a06376d81259";
var userFormEl = document.querySelector("#locationPoint");
 

var formSubmitHandler = function (event) {
      event.preventDefault();
      var paramLoc = document.getElementById("enterLocation").value.trim();
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
        var contentTable = document.createElement('table');
        console.log(numberOfPlaces);
          for(var i=0;i<numberOfPlaces;i++){
            var listContainer = document.createElement('tr');
            nameArray[i] = data.response.groups[0].items[i].venue.name;
            var liName = document.createElement('td');
            liName.textContent = nameArray[i];
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
              liAddress.appendChild(addressListContainer);
              listContainer.appendChild(liAddress);         
            } 
          renderResultsName.appendChild(listContainer);
        }
      });
  }
  
 
userFormEl.addEventListener('submit', formSubmitHandler);