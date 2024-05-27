// import * as datedreamer from "datedreamer";

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

}