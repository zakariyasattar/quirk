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

function removeCards() {
  var cards = document.getElementsByClassName('card');

  for(var card of cards) {
    card.remove();
  }

  if(document.getElementsByClassName('card').length > 0) {
    removeCards();
  }
}

export function createResult(data) {
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

  var hospital = data.provider;
  var address = data.street_address + ", " + data.city + ", " + data.state + ", " + data.zip_code;
  var service = data.service;
  var cash_rate = data.cash_rate;

  // Set text contents and attributes
  hospitalName.textContent = hospital;

  cashPrice.textContent = "Cash Price: ";
  yourPrice.textContent = "Your Price: ";

  var cashPriceNum = document.createElement('span');
  cashPriceNum.className = "number";
  cashPriceNum.textContent = cash_rate;
  cashPriceNum.style.fontSize = "15px";

  var yourPriceNum = document.createElement('span');
  yourPriceNum.className = "number";
  yourPriceNum.textContent = data.your_rate;
  yourPriceNum.style.fontSize = "15px";

  cashPrice.appendChild(cashPriceNum);
  yourPrice.appendChild(yourPriceNum);

  serviceTitle.textContent = service;
  serviceAddress.textContent = address;
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