

function search() {
  var treatment = document.getElementById("treatment").value;
  var zip_code = document.getElementById("zip-code").value;

  import('zipcodes').then(zipcodes => {
  // Use the zipcodes library here...
    console.log(zipcodes.lookupByZip('10001')); // Example usage
  }).catch(error => {
    console.error('Error loading zipcodes library:', error);
  });


  var rad = zipcodes.radius(parseInt(zip_code), 50);
  console.log(rad);

}