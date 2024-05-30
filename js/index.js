import axios from 'axios';

import { search, loadResults } from '/js/query.js'
import { openInsurancePopUp, removeCards } from '/js/data.js'

document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        search();
      }
    });

    document.getElementById("search").addEventListener('click', search);
    document.getElementById("re-search").addEventListener('click', search);
    document.getElementById("change-insurance").addEventListener('click', function() {
      openInsurancePopUp();
    });

    document.getElementById("company-name").addEventListener('click', function() {
      document.getElementById("results").style.display = "none";
      document.getElementById("appointment").style.display = "none";
      document.getElementById("main").style.display = "block";
    });


    document.getElementById("zip-code").addEventListener('input', function (evt) {
        var value = this.value;

        if(isNaN(value)) {
            document.getElementById("dropdown").style.display = "block";
            filterFunction();
        }
        else {
            document.getElementById("dropdown").style.display = "none";
        }
    });

    // loadResults();
    // makeAppointment();
});

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("zip-code");
  filter = input.value.toUpperCase();
  div = document.getElementById("dropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
