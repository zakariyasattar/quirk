import axios from 'axios';

import { search, loadResults } from '/js/query.js'
import { openInsurancePopUp, removeCards } from '/js/data.js'

document.addEventListener('DOMContentLoaded', function() {
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

    // loadResults();
    // makeAppointment();
});
