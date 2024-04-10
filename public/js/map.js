let properties = [];

async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
      "marker",
    );
  
    const center = { lat: 51.03406855212306, lng: 4.114069511980837 };
    const map = new Map(document.getElementById("map"), {
      zoom: 8.5,
      center,
      mapId: "c4e4580c04395a6d",
      disableDefaultUI: true,
  
    });
    
  
      const markers = [];
  
    for (const property of properties) {
      const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
        map,
        content: buildContent(property),
        position: {
            "lat": property.lat,
            "lng": property.lng
        },
        title: property.description,
        collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
      });
  
      markers.push(AdvancedMarkerElement);
  
      AdvancedMarkerElement.addListener("click", () => {
        toggleHighlight(AdvancedMarkerElement, property);
      });
    }
  
    
  }
  
  let currentHighlightedMarker = null;
  
  function toggleHighlight(markerView, property) {
    if (currentHighlightedMarker === markerView) {
      // If the clicked marker is already highlighted, dehighlight it
      markerView.content.classList.remove("highlight");
      markerView.zIndex = null;
      currentHighlightedMarker = null;
    } else {
      // Otherwise, highlight the clicked marker and dehighlight the previous one
      if (currentHighlightedMarker) {
        currentHighlightedMarker.content.classList.remove("highlight");
        currentHighlightedMarker.zIndex = null;
      }
  
      markerView.content.classList.add("highlight");
      markerView.zIndex = 1;
      currentHighlightedMarker = markerView;
    }
  }
  
  
  function buildContent(property) {
    const content = document.createElement("div");
  
    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <img src="${property.logo}" class="logo-map" style="max-width:100%;" title="Theater"/>
          <span class="fa-sr-only">Theater</span>
      </div>
      <div class="details">
          <div class="name">${property.name}</div>
          <div class="address">${property.address}</div>
          <div class="website"><a href="${property.website}" target="_blank">${property.website}</a></div>
          <div class="details">${property.details}</div>
      </div>
  `;
  
    return content;
  }

  const apiUrl = '/api/producer/all';
  
  // Asynchronously load Google Maps JavaScript API
  function loadMapScript() {
        fetch(apiUrl)
    .then(response => response.json())
    .then(result => {
        properties = result["data"];
        
        // Now you can work with the 'properties' constant
        console.log(properties);
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });



      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAaE3p7rHezMvtm7ojfpQSiZVbfhmRS-ps&callback=initMap';
      script.async = true;
      document.body.appendChild(script);
  }
  
  window.onload = loadMapScript;