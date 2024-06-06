import axios from 'axios';

import { search, loadResults } from '/js/query.js'
import { openInsurancePopUp, removeCards } from '/js/data.js'
import { convertZipToCoord } from '/js/convertToCoord.js'
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
    //   openInsurancePopUp();
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

    document.onkeydown = function checkKey(e) {
        e = e || window.event;
        var a = document.getElementsByTagName('a');

        if (e.keyCode == '38') {

        }
        else if (e.keyCode == '40') {
            // down arrow
        }

    }

    populateProviders();

    convertZipToCoord("60646").then(x => {
      console.log(x);
    });

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
