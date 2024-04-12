import zipcodes from 'zipcodes';
import Papa from 'papaparse';
import * as d3 from 'd3';

// Ensure the document is fully loaded before setting up handlers
document.addEventListener('DOMContentLoaded', function() {
    // Setup your event listeners or other initialization logic here
    document.getElementById("search").addEventListener('click', search);
});

// Define 'search' in the global scope if it needs to be accessible globally
function search() {
    var treatment = document.getElementById("treatment").value;
    var zip_code = document.getElementById("zip-code").value;

    var rad = zipcodes.radius(parseInt(zip_code), 15);

    const dataloc = require('./public/data.csv');
    d3.csv(dataloc).then((data) => {
      const filteredData = data.filter(row => rad.includes(row.zip_code) && (row.service).indexOf(treatment) != -1);

      localStorage.setItem("filteredData", JSON.stringify(filteredData));
      loadResults()
    })
}

function loadResults() {
  
}