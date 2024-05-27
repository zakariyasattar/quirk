import Swal from 'sweetalert2'
import zipcodes from 'zipcodes';

import { createResult, removeCards } from '/js/data.js'

export function search(insurance) {
	if(document.getElementById("main").style.display != "none"){
		var treatment = document.getElementById("treatment").value;
		var zip_code = document.getElementById("zip-code").value;

		document.getElementById("main-loading").style.display = "block";
		document.getElementById("main-default").style.display = "none";
	}
	else {
		var treatment = document.getElementById("results-treatment").value;
		var zip_code = document.getElementById("results-zip-code").value;

		if(treatment != "" && zip_code != "") {
			document.getElementById("no-results").style.display = "none";
			removeCards();
			document.getElementById("results-loading").style.display = "block";
		}
	}

	if(treatment != "" && zip_code != "") {
		var rad = zipcodes.radius(parseInt(zip_code), 10);
		query(treatment, rad);
	}
	else {
		Swal.fire({
		  text: "Please make sure all fields have been filled out",
		  icon: "error"
		});
	}
}

function query(treatment, zips) {
	treatment = treatment.toUpperCase();
	treatment = treatment.replace(/[\*\+]/g," ")
         .replace(/^\d+(\s+)?/,"")
         .replace(/\n?/,"")
         .replace(/\s{2,}/g," ")


	const filter = { service: {$regex : `\\b${treatment}\\b`, "$options": "i"}, zip_code: { $in: zips } };
	fetch('.netlify/functions/getData', {
			method: 'POST',
			body: JSON.stringify({ filter }),
	})
	.then(response => response.json())
	.then(data => {
		localStorage.setItem("data", JSON.stringify(data));
		if(document.getElementById("main").style.display != "none") {
			loadResults(true);
		}
		else {
			loadResults(false);
		}
		document.getElementById("results-loading").style.display = "none";

		document.getElementById("main-loading").style.display = "none";
		document.getElementById("main-default").style.display = "block";
	})
	.catch(error => console.error(error));
}

export function loadResults(first) {
	var data = JSON.parse(localStorage.getItem("data"));
	console.log(data)

	if(data.length == 0) {
		document.getElementById("no-results").style.display = "block";
	}

	var main = document.getElementById("main");
	var results = document.getElementById("results");

	var lastTreatment = document.getElementById("treatment").value;
	var lastZip = document.getElementById("zip-code").value;

	main.style.display = "none";
	results.style.display = "block";

	if(first) {
		document.getElementById("results-treatment").value = lastTreatment;
		document.getElementById("results-zip-code").value = lastZip;
	}

	var plans = new Set();

	for(var service of data) {
		var insurance_plans = service["plans"];

		for(var plan of insurance_plans) {
			var plan_name = plan.substring(0, plan.indexOf("@"));
			plans.add(plan_name);
		}

		createResult(service);
	}

	localStorage.setItem("plans", JSON.stringify(plans));
}