import zipcodes from 'zipcodes';

console.log("hello");

// Ensure the document is fully loaded before setting up handlers
document.addEventListener('DOMContentLoaded', function() {
    // Setup your event listeners or other initialization logic here
    document.getElementById("search").addEventListener('click', search);
});

// Define 'search' in the global scope if it needs to be accessible globally
function search() {
    var treatment = document.getElementById("treatment").value;
    var zip_code = document.getElementById("zip-code").value;

    var rad = zipcodes.radius(parseInt(zip_code), 50);
    console.log(rad);
}