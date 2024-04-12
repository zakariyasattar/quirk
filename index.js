import zipcodes from 'zipcodes';
import Papa from 'papaparse';
import * as d3 from 'd3';

// Ensure the document is fully loaded before setting up handlers
document.addEventListener('DOMContentLoaded', function() {
    // Setup your event listeners or other initialization logic here
    document.getElementById("search").addEventListener('click', search);
    document.getElementById("plan_search").addEventListener('keyup', filterPlans);
});

// Define 'search' in the global scope if it needs to be accessible globally
function search() {
    var treatment = document.getElementById("treatment").value;
    var zip_code = document.getElementById("zip-code").value;

    var rad = zipcodes.radius(parseInt(zip_code), 10);

    const dataloc = require('./public/data.csv');
    d3.csv(dataloc).then((data) => {
      const filteredData = data.filter(row => rad.includes(row.zip_code) && (row.service).indexOf(treatment) != -1);

      localStorage.setItem("filteredData", JSON.stringify(filteredData));
      loadResults()
    })
}

function loadResults() {
  var main = document.getElementById("main");
  var results = document.getElementById("results");

  main.style.display = "none";
  results.style.display = "block";

  var data = JSON.parse(localStorage.getItem("filteredData"));
  var options = {};

  for(var x in data) {
    addPlanOption(data[x].plan_raw);

    if(data[x].plan_raw == localStorage.getItem("preferred_plan") || data[x].plan_raw == "Cash Price") {
      // if(options[data[x].provider + ";" + data[x].service] != null) {
      //   var priceOptions = options[data[x].provider + ";" + data[x].service];
      //   priceOptions.push(data[x].rate);
      //   options[data[x].provider + ";" + data[x].service] = priceOptions;
      // }
      // else {
      //   options[data[x].provider + ";" + data[x].service] = [];
      // }
      createResult(data[x]);
      console.log(data[x]);

    }
  }

  console.log(options);

  // localStorage.setItem("plans", JSON.stringify(plans));

}

function createResult(data) {
  const card = document.createElement('div');
  const header = document.createElement('div');
  const hospitalName = document.createElement('span');
  const priceInfo = document.createElement('div');
  const cashPrice = document.createElement('span');
  const yourPrice = document.createElement('span');
  const content = document.createElement('div');
  const serviceInfo = document.createElement('div');
  const serviceTitle = document.createElement('h2');
  const serviceAddress = document.createElement('p');
  const distance = document.createElement('span');
  const appointmentBtn = document.createElement('button');
  const footer = document.createElement('div');

  // Set text contents and attributes
  hospitalName.textContent = data.provider;
  cashPrice.textContent = `Cash Price: ${data.rate}`;
  yourPrice.textContent = `Your Price: ${data.rate}`;
  serviceTitle.textContent = data.service;
  serviceAddress.textContent = data.address;
  distance.textContent = `${data.distance} Miles Away`;
  appointmentBtn.textContent = 'Make Appointment';

  // Assign classes for styling
  card.className = 'card';
  header.className = 'header';
  hospitalName.className = 'hospital-name';
  priceInfo.className = 'price-info';
  cashPrice.className = 'cash-price';
  yourPrice.className = 'your-price';
  content.className = 'content';
  serviceInfo.className = 'service-info';
  serviceTitle.className = 'service-title';
  serviceAddress.className = 'service-address';
  distance.className = 'distance';
  appointmentBtn.className = 'appointment-btn';
  footer.className = 'footer';

  // Construct the card
  priceInfo.appendChild(cashPrice);
  priceInfo.appendChild(yourPrice);
  header.appendChild(hospitalName);
  header.appendChild(priceInfo);

  serviceInfo.appendChild(serviceTitle);
  serviceInfo.appendChild(serviceAddress);
  serviceInfo.appendChild(distance);
  content.appendChild(serviceInfo);
  content.appendChild(appointmentBtn);

  card.appendChild(header);
  card.appendChild(content);
  card.appendChild(footer);

  document.getElementById('data').appendChild(card);
}

function addPlanOption(plan) {
  if(plan != "List Price" && plan != "Cash Price") {
    var a = document.createElement('a');
    a.innerText = plan;
    a.style.cursor = "pointer";

    a.addEventListener('click', function(event) {
      event.preventDefault();
      localStorage.setItem('preferred_plan', plan);
      loadResults();
    });

    var dropdown = document.getElementById("plan_dropdown");
    dropdown.appendChild(a);
  }
}

function filterPlans() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("plan_search");
  filter = input.value.toUpperCase();
  var div = document.getElementById("plan_dropdown");
  div.style.display = "block";
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    var txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}