var patternData;

$.ajax({
  context: this,
  url: "/api/modeller_config",
  method: "GET",
	success: function (response) {
		patternData = response;
    populatePatterns();
	},
	error: function (error) {
		alert("Error getting available metrics!");
		console.log(error);
	}
});

function populatePatterns() {
  let html = "";

  console.log(patternData);

  $.each(patternData["MockupData"]["MockupPatterns"], function(index, value) {
    console.log(value);
    html += `<div class="pattern">`;
    html += `  <div class="pattFormRow"><label>Name</label><input name="patName" value="` + value["name"] + `" type="text" required=true size=80 unique/></div>`;
    html += `  <div class="pattFormRow"><label>Path</label><input name="patPath" value="` + value["path"] + `" type="text" required=true size=80 /></div>`;
    html += `  <div class="pattFormRow"><label>Pattern</label><input name="patPatt" value="` + value["pattern"] + `" type="text" required=true size=80 /></div>`;
    html += `  <div class="pattFormRow"><label>Delay</label><input name="patDelay" value="` + (typeof value["timedelay"] === "undefined" ? "15" : value["timedelay"]) + `" type="number" required=true size=20 /></div>`;
    html += `  <div class="pattFormRow"><label>Minimum</label><input name="patMin" value="` + (typeof value["min"] === "undefined" ? "0" : value["min"]) + `" type="number" required=true size=20 /></div>`;
    html += `  <div class="pattFormRow"><label>Step</label><input name="patStep" value="` + (typeof value["step"] === "undefined" ? "1" : value["step"]) + `" type="number" required=true size=20 /></div>`;
    if (value["pattern"] == "RubberBand") {
      html += `  <div class="pattFormRow"><label>Center</label><input name="patCenter" value="` + (typeof value["center"] === "undefined" ? "50" : value["center"]) + `" type="number" required=true size=20 /></div>`;
    }
    html += `  <div class="pattFormRow"><label>Maximum</label><input name="patMax" value="` + (typeof value["max"] === "undefined" ? "0" : value["max"]) + `" type="number" required=true size=20 /></div>`;
    html += `  <div class="pattFormRow"><label>MemberID</label><input name="patMemberID" value="` + value["MetricValueTemplate"]["MemberID"] + `" type="text" required=true size=80 unique/></div>`;
    html += `  <div class="pattFormRow"><label>MetricProperty</label><input name="patMetricProp" value="` + value["MetricValueTemplate"]["MetricProperty"] + `" type="text" required=true size=80 unique/></div>`;
    html += `<div><input type="button" value="-" id=value["name"] /></div>`
    html += `</div>`;
  });

  $("#patternContainer").empty();
  $("#patternContainer").html(html);
}
