import * as datedreamer from "datedreamer";
import axios from 'axios';
import Swal from 'sweetalert2'

import { search, loadResults } from '/js/query.js'
import { resetInsurance, openInsurancePopUp, removeCards } from '/js/data.js'

// import { makeAppointment } from '/js/bookAppt.js'

document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        search();
      }
    });

    document.getElementById("search").addEventListener('click', search);
    document.getElementById("re-search").addEventListener('click', search);
    // document.getElementById("change-insurance").addEventListener('click', function() {
    //   resetInsurance();
    // });

    document.getElementById("company-name").addEventListener('click', function() {
      document.getElementById("results").style.display = "none";
      document.getElementById("appointment").style.display = "none";
      document.getElementById("main").style.display = "block";
    });


    document.getElementById("zip-code").addEventListener('input', function (evt) {
        var value = this.value;

        if(isNaN(value) && !(value.charAt(0) >= '0' && value.charAt(0) <= '9')) {
            document.getElementById("dropdown").style.display = "block";
            filterFunction();
        }
        else {
            document.getElementById("dropdown").style.display = "none";
        }
    });

    document.getElementById("zip-code").addEventListener('focus', function (evt) {

      if(isNaN(evt.target.value)) {
        document.getElementById('dropdown').style.display = "block";
        filterFunction();
      }

    });

    document.getElementById("results-zip-code").addEventListener('input', function (evt) {
        var value = this.value;

        if(isNaN(value) && !(value.charAt(0) >= '0' && value.charAt(0) <= '9')) {
            document.getElementById("results-dropdown").style.display = "block";
            filterFunctionResults();
        }
        else {
            document.getElementById("results-dropdown").style.display = "none";
        }
    });

    document.getElementById("results-zip-code").addEventListener('focus', function (evt) {

      if(isNaN(evt.target.value)) {
        document.getElementById('results-dropdown').style.display = "block";
        filterFunctionResults();
      }

    });

    document.addEventListener('mousedown', function(event) {
      var dropdown = document.getElementById('dropdown');
      var resDropdown = document.getElementById('results-dropdown');

      if (!dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
      }

      if (!resDropdown.contains(event.target)) {
        resDropdown.style.display = 'none';
      }
    });

    populateProviders();

    // loadResults();
    // makeAppointment();
});

function populateProviders() {
  var providers = [
    'Advocate Christ Medical Center',
    'Advocate Condell Medical Center',
    'Advocate Good Samaritan Hospital',
    'Advocate Good Shepherd Hospital',
    'Advocate Illinois Masonic Medical Center',
    'Advocate Lutheran General Hospital',
    'Advocate Sherman Hospital',
    'Advocate South Suburban Hospital',
    'Advocate Trinity Hospital',
    "Ann & Robert H. Lurie Children's Hospital of Chicago",
    'Endeavor Health Evanston Hospital',
    'Endeavor Health Swedish Hospital',
    'Gottlieb Memorial Hospital',
    'John H. Stroger, Jr. Hospital of Cook County',
    'Loyola University Medical Center',
    'MacNeal Hospital',
    'Methodist Hospital',
    'Northwestern Medicine Central DuPage Hospital',
    'Northwestern Medicine Delnor Hospital',
    'Northwestern Medicine Huntley Hospital',
    'Northwestern Medicine Kishwaukee Hospital',
    'Northwestern Medicine Lake Forest Hospital',
    'Northwestern Medicine Marianjoy Rehabilitation Hospital',
    'Northwestern Medicine McHenry Hospital',
    'Northwestern Medicine Palos Hospital',
    'Northwestern Medicine Valley West Hospital',
    'Northwestern Medicine Woodstock Hospital',
    'Northwestern Memorial Hospital',
    'Rush Copley Medical Center',
    'University of Illinois Hospital & Clinics'
  ]

  localStorage.setItem("providers", JSON.stringify(providers));

  var dropdown = document.getElementById("dropdown");
  var resDropdown = document.getElementById("results-dropdown");

  for(var provider of providers) {
    var a = document.createElement('a');
    a.textContent = provider;
    a.onclick = function() {
      document.getElementById("zip-code").value = this.textContent;
      document.getElementById("dropdown").style.display = "none";
    };

    var resA = document.createElement('a');
    resA.textContent = provider;
    resA.onclick = function() {
      document.getElementById("results-zip-code").value = this.textContent;
      document.getElementById("results-dropdown").style.display = "none";
    };
    dropdown.appendChild(a);
    resDropdown.appendChild(resA);
  }
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("zip-code");
  filter = input.value.toUpperCase();
  var div = document.getElementById("dropdown");
  a = div.getElementsByTagName("a");

  var hiddenCounter = 0;

  for (i = 0; i < a.length; i++) {
    var txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
      hiddenCounter++;
    }
  }

  if(hiddenCounter == a.length) {
    var a = document.createElement('a');
    a.textContent = "No Results";
    document.getElementById("dropdown").appendChild(a);
  }

}

function filterFunctionResults() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("results-zip-code");
  filter = input.value.toUpperCase();
  var div = document.getElementById("results-dropdown");
  a = div.getElementsByTagName("a");

  var hiddenCounter = 0;

  for (i = 0; i < a.length; i++) {
    var txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
      hiddenCounter++;
    }
  }

  if(hiddenCounter == a.length) {
    var a = document.createElement('a');
    a.textContent = "No Results";
    document.getElementById("results-dropdown").appendChild(a);
  }
}

removeCalendars();

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

export function makeAppointment(hospitalName, service) {
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

  document.getElementById("exit-book-appointment").addEventListener('click', function() {
    document.getElementById("appointment").style.display = "none";
    document.getElementById("results").style.display = "block";
  });

}
