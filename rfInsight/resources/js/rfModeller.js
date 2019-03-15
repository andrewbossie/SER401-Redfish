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
	html += `  <table>`;
    html += `  <tr><td><div class="pattFormRow"><label>Name</label></td><td><input name="patName" value="` + value["name"] + `" type="text" required=true size=80 unique/></div></td></tr>`;
    html += `  <tr><td><div class="pattFormRow"><label>Path</label></td><td><input name="patPath" value="` + value["path"] + `" type="text" required=true size=80 /></div></td></tr>`;
    html += `  <tr><td><div class="pattFormRow"><label>Pattern</label></td><td><input name="patPatt" value="` + value["pattern"] + `" type="text" required=true size=80 /></div></td></tr>`;
    html += `  <tr><td><div class="pattFormRow"><label>Delay</label></td><td><input name="patDelay" value="` + (typeof value["timedelay"] === "undefined" ? "15" : value["timedelay"]) + `" type="number" required=true size=20 /></div></td></tr>`;
    html += `  <tr><td><div class="pattFormRow"><label>Minimum</label></td><td><input name="patMin" value="` + (typeof value["min"] === "undefined" ? "0" : value["min"]) + `" type="number" required=true size=20 /></div></td></tr>`;
    html += `  <tr><td><div class="pattFormRow"><label>Step</label></td><td><input name="patStep" value="` + (typeof value["step"] === "undefined" ? "1" : value["step"]) + `" type="number" required=true size=20 /></div></td></tr>`;
    if (value["pattern"] == "RubberBand") {
      html += `  <tr><td><div class="pattFormRow"><label>Center</label></td><td><input name="patCenter" value="` + (typeof value["center"] === "undefined" ? "50" : value["center"]) + `" type="number" required=true size=20 /></div></td></tr>`;
    }
    html += `  <tr><td><div class="pattFormRow"><label>Maximum</label></td><td><input name="patMax" value="` + (typeof value["max"] === "undefined" ? "0" : value["max"]) + `" type="number" required=true size=20 /></div></td></tr>`;
    html += `  <tr><td><div class="pattFormRow"><label>MemberID</label></td><td><input name="patMemberID" value="` + value["MetricValueTemplate"]["MemberID"] + `" type="text" required=true size=80 unique/></div></td></tr>`;
    html += `  <tr><td><div class="pattFormRow"><label>MetricProperty</label></td><td><input name="patMetricProp" value="` + value["MetricValueTemplate"]["MetricProperty"] + `" type="text" required=true size=80 unique/></div></td></tr>`;
    html += `</table>`;
	html += `<div><input type="button" value="-" id=value["name"] /></div>`
    html += `</div><br /><hr />`;
  });

  $("#patternContainer").empty();
  $("#patternContainer").html(html);
}
