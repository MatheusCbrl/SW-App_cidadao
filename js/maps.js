
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var map, infoWindow;
var showInfoWindow = false;
var faisalabad = {lat: -29.1684796, lng: -51.1793861};
var locations = [
  ['Linha: L001',-29.169134503314755,-51.18309985664441,'Mercado X', 'Aguardar o transporte a partir de: 6:45:00'],
  ['Linha: L001',-29.17063341335785,-51.1809540894325,'Mercado X', 'Aguardar o transporte a partir de: 6:45:00'],
  ['Linha: L001',-29.165312183636253,-51.17683421638562,'Mercado Y', 'Aguardar o transporte a partir de: 6:45:00'],
  ['Linha: L001',-29.16426289451481,-51.18756305244519,'Mercado Y', 'Aguardar o transporte a partir de: 6:45:00'],
  ['Linha: L001',-29.166661253891487,-51.18962298896863,'Mercado Z', 'Aguardar o transporte a partir de: 6:45:00'],
  ['Linha: L001',-29.16793535952094,-51.19468699958875,'Mercado Z', 'Aguardar o transporte a partir de: 6:45:00'],
];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: faisalabad,
    zoom: 14,
    mapTypeControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.LEFT_CENTER
    },
    scaleControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    rotateControl: true,
  });

  const contentString =
  '<div>' +
  '<p>Você está aqui!</p>' +
  "</div>";
  const infowindowx = new google.maps.InfoWindow({
    content: contentString,
  });

  var myMarker = new google.maps.Marker({
    position: faisalabad,
    animation: google.maps.Animation.DROP,
    title: 'Estou Aqui!',
    map: map,
    icon: {
      path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
      strokeColor: "green",
      scale: 3
  },
    anchorPoint: new google.maps.Point(0, -29)
  });

  myMarker.addListener("click", () => {
    infowindowx.open({
      anchor: myMarker,
      map,
      shouldFocus: false,
    });
  });


  addYourLocationButton(map, myMarker);
  
  infoWindow = new google.maps.InfoWindow;
  setMarkers(map, locations)

  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');


  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name']);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    title: '<a> Abrir no Google Maps</a>',
    map: map,
    icon: {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      strokeColor: "orange",
      scale: 3
  },
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function () {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("Ops, sem resultados para: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function () {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-address', ['address']);
  setupClickListener('changetype-establishment', ['establishment']);
  setupClickListener('changetype-geocode', ['geocode']);

  document.getElementById('use-strict-bounds')
    .addEventListener('click', function () {
      console.log('Checkbox clicked! New state=' + this.checked);
      autocomplete.setOptions({ strictBounds: this.checked });
    });
}

function setMarkers(map, locations) {
  var markers = new Array();
  var marker, i
  var infowindow = new google.maps.InfoWindow();

  for (i = 0; i < locations.length; i++) {

    var loan = locations[i][0]
    var lat = locations[i][1]
    var long = locations[i][2]
    var pre = locations[i][3]
    var add = locations[i][4]
    

    latlngset = new google.maps.LatLng(lat, long);

    function openModal() {
      $("#exampleModal").modal("show");
    };

  
    const svgMarker = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "#ed5748",
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };

    var marker = new google.maps.Marker({
      map: map, 
      title: loan, 
      position: latlngset,
      icon: svgMarker,
    });
    var OpenGM = ("https://www.google.com/maps/search/?api=1&query=" +lat+","+ long)
    var Direction = ("https://www.google.com/maps/dir/?api=1&query=&destination="+ lat + long +"&travelmode=walking")

    const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h6 id="firstHeading" class="firstHeading">' + loan + ' - ' + pre + '</h6>' +
      '<div id="bodyContent">' +
      '<p>' + add + '</p>' +
      '<div id="siteNotice">' +
      '<a href="'+ OpenGM +'"> Abrir no Google Maps </a>' + '<a> | </a>' +
      '<a href="' + Direction +'"> Rotas</a>' +
      '</br>' +
      '</br>' +
      '<div class="d-grid gap-2"><button type="button" class="btn btn-outline-info btn-sm" data-toggle="modal" data-target="#exampleModal">Informações</buton></div>' +
      '</div>';
    var content = contentString
    // loan +' ' + add

    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
      return function () {
        infowindow.setContent(content);
        infowindow.open(map, marker);
       // map.setCenter(marker.getPosition());
        console.log('Opaa: ' + marker.getPosition());
      }
    })(marker, content, infowindow));
    // Add marker to markers array
    markers.push(marker);

     // Trigger a click event on each marker when the corresponding marker link is clicked
     $('.marker-link').on('click', function () {

      google.maps.event.trigger(markers[$(this).data('markerid')], 'click');
  });

    
  }

  //Try HTML5 geolocation.

}
// Add a marker clusterer to manage the markers.
new MarkerClusterer({ markers, map });

  
function addYourLocationButton(map, marker) 
{
  var controlDiv = document.createElement('div');
  var firstChild = document.createElement('button');
  firstChild.style.backgroundColor = '#fff';
  firstChild.style.border = 'none';
  firstChild.style.outline = 'none';
  firstChild.style.width = '40px';
  firstChild.style.height = '40px';
  firstChild.style.borderRadius = '2px';
  firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
  firstChild.style.cursor = 'pointer';
  firstChild.style.marginRight = '10px';
  firstChild.style.padding = '0px';
  firstChild.title = 'Your Location';
  controlDiv.appendChild(firstChild);
  
  var secondChild = document.createElement('div');
  secondChild.style.margin = '0px';
  secondChild.style.width = '28px';
  secondChild.style.height = '28px';
  secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
  secondChild.style.backgroundSize = '180px 18px';
  secondChild.style.backgroundPosition = '10px 6px';
  secondChild.style.backgroundRepeat = 'no-repeat';
  secondChild.id = 'you_location_img';
  firstChild.appendChild(secondChild);
  
  google.maps.event.addListener(map, 'dragend', function() {
    $('#you_location_img').css('background-position', '10px 6px');
  });

  firstChild.addEventListener('click', function() {
    var imgX = '0';
    var animationInterval = setInterval(function(){
      if(imgX == '-18') imgX = '0';
      else imgX = '-18';
      $('#you_location_img').css('background-position', imgX+'px 0px');
    }, 500);
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        marker.setPosition(latlng);
        map.setCenter(latlng);
        clearInterval(animationInterval);
        $('#you_location_img').css('background-position', '-134px 6px');
      });
    }
    else{
      clearInterval(animationInterval);
      $('#you_location_img').css('background-position', '0px 0px');
    }
  });
  
  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}