import Swal from 'sweetalert2'

import { makeAppointment } from '/js/index.js'

class Card {
  constructor(ref, plans, id) {
    this.ref = document.getElementById(id);
    this.plans = plans;
    this.id = id;
  }

  get data() {
    return [this.ref, this.plans. this.id];
  }

}

export function openInsurancePopUp(plans, priceInfo) {
  var formattedPlans = []

  for(var p of plans) {
    formattedPlans.push(p.substring(0, p.indexOf("@")));
  }

  const { value: plan } = Swal.fire({
    title: "Select Insurance Plan",
    input: "select",
    inputOptions: {
      Insurance: formattedPlans
    },
    inputPlaceholder: "Select A Plan",
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        var selectedInsurance = plans[value];

        if(selectedInsurance) {
          var plan = selectedInsurance.split("@")[0];

          populate(plan);
        }
        resolve();
      });
    }
  });
}

function populate(insurance) {
  var cards = JSON.parse(localStorage.getItem("cards"));

  for(var card of cards) {
    var plans = card.plans;
    var elem = document.getElementById(card.id);


    for(var plan of plans) {
      if(plan.split("@")[0] == insurance) {
        var buttonId = 'id' + (new Date()).getTime();
        var yourPriceId = 'ix' + (new Date()).getTime();

        var button = elem.children[1];
        button.style.display = "none";
        button.id = buttonId;

        var price = plan.split("@")[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var yourPrice = document.createElement('span');
        yourPrice.id = yourPriceId;
        yourPrice.textContent = "Your Price: ";

        var yourPriceNum = document.createElement('span');
        yourPriceNum.className = "number";
        yourPriceNum.textContent = price;
        yourPriceNum.style.fontSize = "15px";
        yourPrice.className = 'your-price';

        yourPrice.appendChild(yourPriceNum);

        elem.appendChild(yourPrice);

        document.getElementById(yourPriceId).onmouseover = function() {
          document.getElementById(buttonId).style.display = "block";
          document.getElementById(yourPriceId).style.display = "none";
        }

        document.getElementById(yourPriceId).onmouseout = function() {
          document.getElementById(buttonId).style.display = "none";
          document.getElementById(yourPriceId).style.display = "block";
        }

      }
    }
  }
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

  const uid = String(
      Date.now().toString(32) +
        Math.random().toString(16)
    ).replace(/\./g, '')

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

  if(cash_rate == null || data.plans.length == 0) {
    return;
  }

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
  priceInfo.id = uid;

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
    openInsurancePopUp(data.plans, priceInfo);
  }

  // Construct the card
  priceInfo.appendChild(cashPrice);
  priceInfo.appendChild(addInsurance);

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

  var cardObj = new Card(card, data.plans, uid);
  var cards = localStorage.getItem("cards") == null ? [] : JSON.parse(localStorage.getItem("cards"));
  cards.push(cardObj);
  localStorage.setItem("cards", JSON.stringify(cards));

}