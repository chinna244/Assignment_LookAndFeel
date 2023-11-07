// script.js
document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("start-button");
    button.addEventListener("click", function () {
      // Redirect to the search page
      window.location.href = "Search.html";
    });
  });
  
  const apiUrl = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=hkZVQijE8ZvMpchuICzQYDI8gIyPjxVsGzt9h0oI";

// Mapping of state abbreviations to full state names for all U.S. states
const stateAbbreviationsToNames = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

let chart; // Declare a global variable to store the chart instance
let originalData; // Store the original data
 



// Fetch data from the API and create the chart
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Store the original data
    originalData = data;

    // Process the data and create a chart
    createFilteredStateStationsChart(data);
	//createPieChart(data, "all");

	        })
  .catch(error => {
    console.error("Error fetching data:", error);
  });

function createFilteredStateStationsChart(data) {
  // Extract the relevant data from the API response
  const stations = data.fuel_stations;
  const stateCounts = {};

  stations.forEach(station => {
    const state = station.state;
    const fullStateName = stateAbbreviationsToNames[state];
    if (fullStateName) {
      if (stateCounts[fullStateName]) {
        stateCounts[fullStateName]++;
      } else {
        stateCounts[fullStateName] = 1;
      }
    }
  });

  // Filter out states with null values
  const filteredStateLabels = Object.keys(stateCounts).filter(
    state => stateCounts[state] !== null
  );
  const filteredStateData = filteredStateLabels.map(state => stateCounts[state]);

  // Check if a chart instance already exists and destroy it
  if (chart) {
    chart.destroy();
  }

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  }
  
  function getRandomBorderColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
  function generateColors(size) {
    return Array.from({ length: size }, getRandomColor);
  }
  
  function generateBorderColors(size) {
    return Array.from({ length: size }, getRandomBorderColor);
  }

  const colors = generateColors(filteredStateLabels.length);
  const borderColors = generateBorderColors(filteredStateLabels.length);
  
  // Create a bar chart
  const ctx = document.getElementById("stateStationsChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: filteredStateLabels,
      datasets: [
        {
          label: "Number of Stations",
          data: filteredStateData,
          backgroundColor:  colors, // "rgba(75, 192, 192, 0.2)",
         borderColor: borderColors, // "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero:true,
          ticks:{
            color: 'black'
          },
          grid: {
            display: false
          }
        },
        x: {
          ticks: {
            color: 'black',
        },
        grid: {
            display: false
        }
        }
      },
      plugins: {
        legend: {
            labels: {
                color: 'black',
                font: {
                    weight: 'bold'
                }
            },
        }
    }
    },
    plugins: [{
      afterDraw: function (chart) {
        if (chart.data.datasets.length > 0) {
          document.getElementById("chart-loading").style.display = "none";
        }
      },
    }],
  });

  // Add an event listener to the fuel type select input
  const fuelTypeSelect = document.getElementById("fuelTypeSelect");
  fuelTypeSelect.addEventListener("change", () => {
    const selectedFuelType = fuelTypeSelect.value;
    updateChartByFuelType(selectedFuelType);
  });
}

function updateChartByFuelType(selectedFuelType) {
  if (selectedFuelType === "all") {
    // Display all data
    createFilteredStateStationsChart(originalData);
  } else {
    // Filter data by the selected fuel type
    const filteredData = originalData.fuel_stations.filter(station => station.fuel_type_code === selectedFuelType);
    createFilteredStateStationsChart({ fuel_stations: filteredData });
  }
}


