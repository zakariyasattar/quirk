import Swal from 'sweetalert2'

import { makeAppointment } from '/js/bookAppt.js'

export function openInsurancePopUp() {
  // var plans = JSON.parse(localStorage.getItem("plans"));
  var plans = [
      "Aetna",
      "United Healthcare",
      "Cigna",
      "Medicare",
      "Health Alliance",
      "Blue Cross Blue Shield",
      "Anthem",
      "Humana"
    ]

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
        removeCards();
        populate([selectedInsurance]);
        resolve();
      });
    }
  });
}

function populate(insurance) {
    var data = JSON.parse(localStorage.getItem("data"));

    if(insurance[0] == "Blue Cross Blue Shield") {
        insurance.push("BCBS");
        insurance.push("BC");
        insurance.push("Blue Cross");
    }

    if(insurance[0] == "United Healthcare") {
        insurance.push("UHC");
    }

    for(var elem of data) {
        var insuranceCount = 0;
        var sum = 0;

        for(var plan of elem['plans']) {
            var plan_name = plan.split("@")[0];
            var price = plan.split("@")[1];

            for(var i of insurance) {
                if(plan_name.indexOf(i) != -1 && parseFloat(price) < parseFloat(elem.cash_rate)) {
                    sum += parseFloat(price);
                    insuranceCount++;
                }
            }
        }

        if(insuranceCount != 0 && sum != 1) {
            var finalNum = (Math.round((sum / insuranceCount) * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            elem.insurance_rate = finalNum;

            createResult(elem);
        }
    }

    localStorage.setItem("data", JSON.stringify(data));
}

export function removeCards() {
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
  var insurance_rate = data.insurance_rate;

  // Set text contents and attributes
  hospitalName.textContent = hospital;

  cashPrice.textContent = "Cash Price: ";
  yourPrice.textContent = "Your Price: ";

  var cashPriceNum = document.createElement('span');
  cashPriceNum.className = "number";
  cashPriceNum.textContent = cash_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  cashPriceNum.style.fontSize = "15px";

  var yourPriceNum = document.createElement('span');
  yourPriceNum.className = "number";
  yourPriceNum.textContent = insurance_rate;
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

  if(insurance_rate) {
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