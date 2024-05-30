import Swal from 'sweetalert2'
import zipcodes from 'zipcodes';

import { createResult, removeCards } from '/js/data.js'

export function search(insurance) {
	localStorage.removeItem("cards");

	if(document.getElementById("main").style.display != "none"){
		var treatment = document.getElementById("treatment").value;
		var zip_code = document.getElementById("zip-code").value;

		if(treatment != "" && zip_code != "" && isValid(zip_code)) {
			document.getElementById("main-loading").style.display = "block";
			document.getElementById("main-default").style.display = "none";
		}
	}
	else {
		var treatment = document.getElementById("results-treatment").value;
		var zip_code = document.getElementById("results-zip-code").value;

		if(treatment != "" && zip_code != "" && isValid(zip_code)) {
			document.getElementById("no-results").style.display = "none";
			removeCards();
			document.getElementById("results-loading").style.display = "block";
		}
	}

	if(treatment != "" && zip_code != "" && isValid(zip_code)) {
		if(zip_code.length == 5) {
			var rad = zipcodes.radius(parseInt(zip_code), 10);
			localStorage.removeItem("data");
			query(treatment, rad, "");
		}
		else {
			// query by hospital if user selected hospital
			localStorage.removeItem("data");
			query(treatment, [], zip_code);
		}
	}
	else {
		Swal.fire({
		  text: "Please make sure all fields have been filled out correctly",
		  icon: "error"
		});
	}
}

function isValid(zip) {
	if(isNaN(zip)) {
		return JSON.parse(localStorage.getItem("providers")).includes(zip);
	}
	return zip.length == 5;
}

function query(treatment, zips, hospitalName) {
	treatment = treatment.split(" ");

	for(var i = 0; i < treatment.length; i++) {
		treatment[i] = treatment[i].toUpperCase();
		treatment[i] = treatment[i].replace(/[\*\+]/g," ")
	         .replace(/^\d+(\s+)?/,"")
	         .replace(/\n?/,"")
	         .replace(/\s{2,}/g," ")
	}

	const filter = {
	  $and: [
	    ...treatment.map(word => ({
	      service: { $regex: `\\b${word}\\b`, $options: "i" }
	    })),
	    ...(zips.length > 0 ? [{ zip_code: { $in: zips } }] : []),
	    ...(hospitalName ? [{ provider: hospitalName }] : [])
	  ]
	};

	var collection = "main";
	if(zips.length != 0 && zips[0].charAt(0) != '6') {
		collection = "sample"
	}

	fetch('.netlify/functions/getData', {
			method: 'POST',
			body: JSON.stringify({
				filter,
				collectionName: collection
			 }),
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

	if(data.length == 0) {
		document.getElementById("no-results").style.display = "block";
	}
	else {
		document.getElementById("no-results").style.display = "none";
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

		if(insurance_plans != null) {
			for(var plan of insurance_plans) {
				var plan_name = plan.substring(0, plan.indexOf("@"));
				plans.add(plan_name);
			}
		}

		createResult(service);
	}

	localStorage.setItem("plans", JSON.stringify(plans));
}