import zipcodes from 'zipcodes';
import Papa from 'papaparse';
import axios from 'axios';
import * as datedreamer from "datedreamer";
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("search").addEventListener('click', search);
    document.getElementById("re-search").addEventListener('click', search);
    document.getElementById("change-insurance").addEventListener('click', function() {
      openInsurancePopUp();
    });
    // document.getElementById("plan_search").addEventListener('onfocus', filterPlans);

    document.getElementById("company-name").addEventListener('click', function() {
      document.getElementById("results").style.display = "none";
      document.getElementById("appointment").style.display = "none";
      document.getElementById("main").style.display = "block";
    });

    // loadResults();
    // makeAppointment();
});

function removeCalendars() {
  var calendars = document.getElementsByTagName("datedreamer-calendar");
  if(calendars.length > 0) {
    for(var c in calendars) {
      if(typeof calendars[c] == "object"){
        calendars[c].remove();
      }
    }
  }

}

function removeCards() {
  var cards = document.getElementsByClassName('card');

  for(var card of cards) {
    card.remove();
  }

  if(document.getElementsByClassName('card').length > 0) {
    removeCards();
  }
}

function search(insurance) {
    if(document.getElementById("main").style.display != "none"){
      var treatment = document.getElementById("treatment").value;
      var zip_code = document.getElementById("zip-code").value;
      document.getElementById("main-loading").style.display = "block";
      document.getElementById("main-default").style.display = "none";
    }
    else {
      document.getElementById("no-results").style.display = "none";
      removeCards();
      document.getElementById("results-loading").style.display = "block";
      var treatment = document.getElementById("results-treatment").value;
      var zip_code = document.getElementById("results-zip-code").value;
    }

    console.log(treatment, zip_code)

    var rad = zipcodes.radius(parseInt(zip_code), 10);
    parse(treatment, rad);
}

function openInsurancePopUp() {
  var plans = JSON.parse(localStorage.getItem("plans"));

  const { value: plan } = Swal.fire({
    title: "Select Insurance Plan",
    input: "select",
    inputOptions: {
      Insurance: plans
    },
    inputPlaceholder: "Select A Plan",
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        var selectedInsurance = plans[value];
        localStorage.setItem("preferred_plan", selectedInsurance);
        search();
        resolve();
      });
    }
  });
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

  var parsedData = new Map();
  var finalDataSet = new Map();
  var plans = new Set();

  var preferred_insurance;

  preferred_insurance = localStorage.getItem("preferred_plan");

  GetFileObjectFromURL(FileURL, function (fileObject) {
     Papa.parse(fileObject, {
       step: function(results) {
         var hospital_zip = results.data[indices.indexOf("zip_code")];
         var service = results.data[indices.indexOf("service")];
         var insurance = results.data[indices.indexOf("plan_raw")];
         var withinRadius = zips.includes(hospital_zip);

         if(withinRadius && service.toLowerCase().indexOf(treatment.toLowerCase()) != -1) {
           if(insurance != "Cash Price" && insurance != "List Price") {
             plans.add(insurance);
           }

           if(insurance == "List Price" || insurance == preferred_insurance) {
             var hospital = results.data[0];
             var address = results.data[indices.indexOf("street_address")];
             var cash_price = results.data[indices.indexOf("rate")];

             var details = {
               "service": service,
               "hospital": hospital,
               "address": address,
               "rate": "",
               "your_rate": "",
               "insurance": insurance
             };

             if(parsedData.get(hospital + ";" + service)) {
               results = parsedData.get(hospital + ";" + service);

               if(insurance == preferred_insurance) {
                 results.your_rate = cash_price;
               }
               if(insurance == "List Price") {
                 results.rate = cash_price;
               }

               parsedData.set(hospital + ";" + service, results);

               if(results.rate != "" && results.your_rate != "") {
                 finalDataSet.set(hospital + ";" + service, results);
               }
             }
             else {
               if(insurance == preferred_insurance) {
                 details.your_rate = cash_price;
               }
               if(insurance == "List Price") {
                 details.rate = cash_price;
               }

               parsedData.set(hospital + ";" + service, details);
             }
           }
         }
         if(preferred_insurance == null) {
           finalDataSet = parsedData;
         }
       },
       complete: function() {
         if(document.getElementById("results").style.display != "none") {
           document.getElementById("results-loading").style.display = "none";
         }
         else if(document.getElementById("main").style.display != "none") {
           document.getElementById("main-loading").style.display = "none";
           document.getElementById("main-default").style.display = "block";
         }
         localStorage.setItem("plans", JSON.stringify(Array.from(plans)));
         localStorage.setItem("data", JSON.stringify(Array.from(finalDataSet)));
         loadResults();
       }
     });
  });

}

function loadResults() {
  var data = JSON.parse(localStorage.getItem("data"));
  console.log(data)

  if(data.length == 0) {
    document.getElementById("no-results").style.display = "block";
  }

  var main = document.getElementById("main");
  var results = document.getElementById("results");

  var lastTreatment = document.getElementById("treatment").value;
  var lastZip = document.getElementById("zip-code").value;

  main.style.display = "none";
  results.style.display = "block";

  document.getElementById("results-treatment").value = lastTreatment;
  document.getElementById("results-zip-code").value = lastZip;

  var options = {};

  for(var x in data) {
    addPlanOption(data[x][1].insurance);
    createResult(data[x][1]);
  }

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

  cashPrice.textContent = "Cash Price: ";
  yourPrice.textContent = "Your Price: ";

  var cashPriceNum = document.createElement('span');
  cashPriceNum.className = "number";
  cashPriceNum.textContent = data.rate;
  cashPriceNum.style.fontSize = "15px";

  var yourPriceNum = document.createElement('span');
  yourPriceNum.className = "number";
  yourPriceNum.textContent = data.your_rate;
  yourPriceNum.style.fontSize = "15px";

  cashPrice.appendChild(cashPriceNum);
  yourPrice.appendChild(yourPriceNum);

  serviceTitle.textContent = data.service;
  serviceAddress.textContent = data.address;
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

  var addInsurance = document.createElement('button');
  addInsurance.textContent = "See Your Rate";
  addInsurance.className = "add-insurance-button";
  addInsurance.onclick = function() {
    openInsurancePopUp();
  }

  // Construct the card
  priceInfo.appendChild(cashPrice);

  if(localStorage.getItem("preferred_plan")) {
    priceInfo.appendChild(yourPrice);
  }
  else {
    priceInfo.appendChild(addInsurance);
  }
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
  removeCalendars();
  var resultsDiv = document.getElementById("results");
  resultsDiv.style.display = "none";

  var makeAppointmentDiv = document.getElementById("appointment");
  makeAppointmentDiv.style.display = "block";

  var days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  var selected_date = document.getElementById("selected-date");
  selected_date.innerText = days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate()

  today = mm + '/' + dd + '/' + yyyy;

  document.getElementsByClassName("appointment-input-first")[0].addEventListener('click', function() {
    document.getElementById("first").checked = true;
  });
  document.getElementsByClassName("appointment-input")[0].addEventListener('click', function() {
    document.getElementById("second").checked = true;
  });

  new datedreamer.calendar({
    element: "#calendar",
    // select date on init
    selectedDate: today,
    // date format
    format: "MM/DD/YYYY",
    // custom next/prev icons
    iconNext: '',
    iconPrev: '',
    // set the label of the date input
    inputLabel: 'Set a date',
    // set the placeholder of the date input
    inputPlaceholder: 'Enter a date',
    // hide the input and today button
    hideInputs: true,
    // enable dark mode
    darkMode: true,
    // or 'lite-purple'
    theme: 'unstyled',
    // custom styles here
    styles: `
      button {
        color: blue
      }
    `,
    // callback
    onChange: (e) => {
      var newDate = new Date(e.detail);
      var finalStr = days[newDate.getDay()] + ", " + months[newDate.getMonth()] + " " + newDate.getDate()

      selected_date.innerText = finalStr;

    },
    onRender: (e) => {
      // console.log(e.detail.calendar);
    },
  });

  document.getElementById("book-btn").addEventListener('click', function() {
    var checkedBoxes = document.querySelectorAll('input[name=time]:checked');
    var time = checkedBoxes[0].nextSibling.data.substring(0, checkedBoxes[0].nextSibling.data.indexOf(" "));
    var date = document.getElementById("selected-date").innerText;

    Swal.fire({
      title: "Appointment Scheduled!",
      text: "Appointment Booked For The " + time + " Of " + date + "!",
      icon: "success"
    }).then((result) => {
      document.getElementById("appointment").style.display = "none";
      document.getElementById("results").style.display = "block";
    });

  });

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