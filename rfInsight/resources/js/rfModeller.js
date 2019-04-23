var patternData;
var patternList;

$.when(
  $.ajax({
    context: this,
    url: "/api/modeller_config",
    method: "GET",
    success: function (response) {
      patternData = response;
    },
    error: function (error) {
      alert("Error getting modeller config!");
      console.log(error);
    }
  }),

  $.ajax({
    context: this,
    url: "/api/modeller_patterns",
    method: "GET",
    success: function (response) {
      patternList = response;
    },
    error: function (error) {
      alert("Error getting modeller patterns!");
      console.log(error);
    }
  })

).then(function() {
  populatePatterns();
});

function checkPatternProperties(select, parentDiv) {
  var center = $(parentDiv).find('input[name="patCenter"]');

  if ($(select).val() == "rubberband") {
    $(center).prop('disabled', false);
  } else {
    $(center).prop('disabled', true);
  }
}

function populatePatterns() {
  let html = "";

  $.each(patternData["MockupData"]["MockupPatterns"], function(index, value) {
    html += `<div class="pattern" id="patternDiv` + index + `">`;
    html += `  <div class="pattFormRow"><label>Enabled</label><input name="patEnabled" value="enabled" type="checkbox" ` + (typeof value["enabled"] === "undefined" ? "" : (value["enabled"] == true ? "checked" : "")) + ` size=80/></div>`;
    html += `  <div class="pattFormRow"><label>Name</label><input name="patName" value="` + value["name"] + `" type="text" required=true size=80 unique/></div>`;
    html += `  <div class="pattFormRow"><label>Path</label><input name="patPath" value="` + value["path"] + `" type="text" required=true size=80 /></div>`;
    html += `  <div class="pattFormRow"><label>Pattern</label><select name="patPatt" id="patternSelect` + index + `"></select></div>`;
    html += `  <div class="pattFormRow"><label>Delay</label><input name="patDelay" value="` + (typeof value["timedelay"] === "undefined" ? "15" : value["timedelay"]) + `" type="number" required=true size=20 /></div>`;
    html += `  <div class="pattFormRow"><label>Minimum</label><input name="patMin" value="` + (typeof value["min"] === "undefined" ? "0" : value["min"]) + `" type="number" required=true size=20 /></div>`;
    html += `  <div class="pattFormRow"><label>Step</label><input name="patStep" value="` + (typeof value["step"] === "undefined" ? "1" : value["step"]) + `" type="number" required=true size=20 /></div>`;
    html += `  <div class="pattFormRow"><label>Center</label><input name="patCenter" value="` + (typeof value["center"] === "undefined" ? "50" : value["center"]) + `" type="number" required=true size=20 /></div>`;
    html += `  <div class="pattFormRow"><label>Maximum</label><input name="patMax" value="` + (typeof value["max"] === "undefined" ? "100" : value["max"]) + `" type="number" required=true size=20 /></div>`;
    html += `  <div class="pattFormRow"><label>MemberID</label><input name="patMemberID" value="` + value["MetricValueTemplate"]["MemberID"] + `" type="text" required=true size=80 unique/></div>`;
    html += `  <div class="pattFormRow"><label>MetricProperty</label><input name="patMetricProp" value="` + value["MetricValueTemplate"]["MetricProperty"] + `" type="text" required=true size=80 unique/></div>`;
    html += `<div><input type="button" value="Remove" id=value["name"] onClick="function rm(){$('#pattern` + index + `').remove()}; rm()" /></div>`
    html += `</div>`;
  });

  $("#patternContainer").empty();
  $("#patternContainer").html(html);

  $.each(patternData["MockupData"]["MockupPatterns"], function(index, value) {
    var select = document.getElementById("patternSelect" + index);

    for (index in patternList) {
      select.options[select.options.length] = new Option(patternList[index], index);
    }

    $(select).val(value["pattern"]);

    var parentDiv = $(select).parent().parent();

    checkPatternProperties(select, parentDiv);

    select.addEventListener('change', (event, select, parentDiv) => {
      checkPatternProperties(select, parentDiv);
    });
  });
}

function buildJSONFromForm() {
  var config = patternData;
  config["MockupData"]["MockupPatterns"] = [];

  $.each(document.getElementsByClassName("pattern"), function(index, value) {
    var pattern = {
      "enabled": $(this).find('input[name="patEnabled"]').prop('checked') ? true : false,
      "name": $(this).find('input[name="patName"]').val(),
      "path": $(this).find('input[name="patPath"]').val(),
      "timedelay": $(this).find('input[name="patDelay"]').val(),
      "pattern": $(this).find('select[name="patPatt"]').val(),
      "min": $(this).find('input[name="patMin"]').val(),
      "step": $(this).find('input[name="patStep"]').val(),
      "max": $(this).find('input[name="patMax"]').val(),
      "MetricValueTemplate": {
        "MemberID": $(this).find('input[name="patMemberID"]').val(),
        "MetricValue": "#value",
        "TimeStamp": "#timestamp",
        "MetricProperty": $(this).find('input[name="patMetricProp"]').val()
      }
    }

    if (pattern["pattern"] == "rubberband") {
      pattern["center"] = $(this).find('input[name="patCenter"]').val();
    }

    config["MockupData"]["MockupPatterns"].push(pattern);
  });

  console.log("Saving config:\n" + JSON.stringify(config, null, 2));

  $.ajax({
    url: "/api/modeller_config",
    type: "POST",
    data: JSON.stringify(config),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (response) {
      alert("Save Successful!");
    },
    error: function (error) {
      alert("Error saving modeller config!");
      console.log(error);
    }
  });
}

