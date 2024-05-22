import zipcodes from 'zipcodes';

import { createResult } from '/js/data.js'

export function search(insurance) {
	if(document.getElementById("main").style.display != "none"){
		var treatment = document.getElementById("treatment").value;
		var zip_code = document.getElementById("zip-code").value;

		document.getElementById("main-loading").style.display = "block";
		document.getElementById("main-default").style.display = "none";
	}
	else {
		document.getElementById("no-results").style.display = "none";
		removeCards();
		document.getElementById("results-loading").style.display = "block";
		var treatment = document.getElementById("results-treatment").value;
		var zip_code = document.getElementById("results-zip-code").value;
	}

	var rad = zipcodes.radius(parseInt(zip_code), 10);
	query(treatment, rad);
}

function query(treatment, zips) {
	const filter = { service: {$regex : treatment}, zip_code: { $in: zips } };
	fetch('.netlify/functions/getData', {
			method: 'POST',
			body: JSON.stringify({ filter }),
	})
	.then(response => response.json())
	.then(data => {
		localStorage.setItem("data", JSON.stringify(data));
		loadResults(data);
	})
	.catch(error => console.error(error));
}

export function loadResults() {
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

	document.getElementById("results-treatment").value = lastTreatment;
	document.getElementById("results-zip-code").value = lastZip;

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