document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("search-form");
  var button = document.getElementById("submit-button");
  var results = document.querySelector(".card-container");
  var apiKey = "hkZVQijE8ZvMpchuICzQYDI8gIyPjxVsGzt9h0oI"; // Replace with your API key
  var apiUrl = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=" + apiKey; // Base URL for the API

  button.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    var location = document.getElementById("location").value;
    var fuelType = document.getElementById("fuel-type").value;

    if (location === "") {
      alert("Please enter a location or a Zip");
      return;
    }

    var requestUrl = apiUrl + "&location=" + location;

    if (fuelType !== "") {
      requestUrl += "&fuel_type=" + fuelType;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", requestUrl);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        var stations = response.fuel_stations;

        if (stations.length > 0) {
          results.innerHTML = ""; // Clear previous results

          stations.forEach(function (station) {
            var stationCard = createStationCard(station);
            results.appendChild(stationCard);
          });
        } else {
          results.innerHTML = "<p>No stations found for your search criteria.</p>";
        }
      } else {
        results.innerHTML = "<p>Sorry, something went wrong. Please try again later.</p>";
      }
    };

    xhr.send();
  });

  // Function to create a card for a station
  function createStationCard(station) {
    var stationCard = document.createElement("div");
    stationCard.className = "station card";
    stationCard.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${station.station_name}</h5>
        <p class="card-text">${station.street_address}, ${station.city}, ${station.state}, ${station.zip}</p>
        <p class="card-text">Phone: ${station.phone}</p>
        <p class="card-text">Fuel Type: ${station.fuel_type_code}</p>
        <p class="card-text">Access Times: ${station.access_days_time}</p>
        <a href="detail.html?id=${station.id}" class="btn btn-secondary">More Details</a>
      </div>
    `;

    return stationCard;
  }
});
