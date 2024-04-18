import zipcodes from 'zipcodes';
import Papa from 'papaparse';
import axios from 'axios';
import * as d3 from 'd3';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("search").addEventListener('click', search);
    document.getElementById("plan_search").addEventListener('onfocus', filterPlans);
    // loadResults();
    // makeAppointment();
});

function search() {
    var treatment = document.getElementById("treatment").value;
    var zip_code = document.getElementById("zip-code").value;

    var rad = zipcodes.radius(parseInt(zip_code), 10);

    parse(treatment, rad);
}

function parse(treatment, zips) {
  var indices = ["provider","health_system","service","code","code_type","plan_raw","rate","medicare_provider_id","zip_code","street_address","city","state","county","acute_care_facility","hospital_overall_rating","hospital_type","total_beds","npi","compliance_score"];

  var GetFileBlobUsingURL = function (url, convertBlob) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function() {
        convertBlob(xhr.response);
    });
    xhr.send();
  };
  var blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
  };
  var GetFileObjectFromURL = function(filePathOrUrl, convertBlob) {
     GetFileBlobUsingURL(filePathOrUrl, function (blob) {
        convertBlob(blobToFile(blob, 'data.csv'));
     });
  };

  var FileURL = require('./public/data.csv');

  var parsedData = [];
  var preferred_insurance;

  if(localStorage.getItem("preferred_plan") == null) {
    preferred_insurance = "List Price";
  }
  else {
    preferred_insurance = localStorage.getItem("preferred_plan");
  }

  GetFileObjectFromURL(FileURL, function (fileObject) {
     Papa.parse(fileObject, {
       step: function(results) {
         var hospital_zip = results.data[indices.indexOf("zip_code")];
         var service = results.data[indices.indexOf("service")];
         var insurance = results.data[indices.indexOf("plan_raw")];
         var withinRadius = zips.includes(hospital_zip);

         if(withinRadius && service.toLowerCase().indexOf(treatment.toLowerCase()) != -1 && insurance == preferred_insurance) {
           var hospital = results.data[0];
           var address = results.data[indices.indexOf("street_address")];
           var cash_price = results.data[indices.indexOf("rate")];

           var details = {
             "service": service,
             "hospital": hospital,
             "address": address,
             "rate": cash_price,
             "insurance": insurance
           };

           parsedData.push(details);
         }
       },
       complete: function() {
         localStorage.setItem("data", JSON.stringify(parsedData));
         loadResults();
       }
     });
  });

}

function loadResults() {
  var data = JSON.parse(localStorage.getItem("data"));

  var main = document.getElementById("main");
  var results = document.getElementById("results");

  main.style.display = "none";
  results.style.display = "block";

  var options = {};

  for(var x in data) {
    addPlanOption(data[x].insurance);
    createResult(data[x]);
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
  hospitalName.textContent = data.hospital;
  cashPrice.textContent = `Cash Price: ${data.rate}`;
  yourPrice.textContent = `Your Price: ${data.rate}`;
  serviceTitle.textContent = data.service;
  serviceAddress.textContent = data.address;
  distance.textContent = `${data.distance} Miles Away`;
  appointmentBtn.textContent = 'Make Appointment';
  appointmentBtn.onclick = function() {
    makeAppointment(data.hospital, data.service);
  }

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

function makeAppointment(hospitalName, service) {
  var resultsDiv = document.getElementById("results");
  resultsDiv.style.display = "none";

  var makeAppointmentDiv = document.getElementById("appointment");
  makeAppointmentDiv.style.display = "block";
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