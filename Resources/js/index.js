$(document).ready(function () {
    var count = 0;
    var displayed = [];

    $("#add").click(
        function (e) {
            e.preventDefault();
            $('ul.dropdown').slideToggle("medium");
        }
    );

    $('.dropdown li').on('click', function () {
        $('ul.dropdown').slideToggle("medium");
        updatePanel(this);
    });

    let isThemeDark = true;
    let themeURLParam = "";

    setThemeString = () => {
        themeURLParam = isThemeDark ? "&theme=dark" : "&theme=light";
    };

    let updateTheme = isDark => {
        isThemeDark = isDark;
        if (isDark == false) {
            document.body.classList.add("themeLight");
        } else {
            document.body.classList = [];
        }
        setThemeString();
        updatePanels();
    };

    let updatePanel = panelElement => {
        var value = $(panelElement).index();
        // console.log(value);
        var url = '';
        var label = '';

        var panel1URL = "http://52.37.217.87:3000/d-solo/uiNmWixmz/randomdata?refresh=5s&orgId=1&panelId=2&var-Host=serverB" + themeURLParam;
        var panel2URL = "http://52.37.217.87:3000/d-solo/uiNmWixmz/randomdata?refresh=5s&orgId=1&panelId=2&var-Host=serverA" + themeURLParam;
        var panel3URL = "http://52.37.217.87:3000/d-solo/uiNmWixmz/randomdata?refresh=5s&orgId=1&var-Host=serverA&panelId=6" + themeURLParam;
        var panel4URL = "http://52.37.217.87:3000/d-solo/uiNmWixmz/randomdata?refresh=5s&orgId=1&panelId=4&var-Host=serverB" + themeURLParam;
        var panel5URL = "http://52.37.217.87:3000/d-solo/uwmb0iBmz/testdash?refresh=5s&panelId=4&fullscreen&orgId=1" + themeURLParam;
        var panel6URL = "http://52.37.217.87:3000/d-solo/uwmb0iBmz/testdash?refresh=5s&panelId=2&fullscreen&orgId=1" + themeURLParam;
        var panel1Label = "Static Grafana Panel 1";
        var panel2Label = "Static Grafana Panel 2";
        var panel3Label = "Static Grafana Panel 3";
        var panel4Label = "Static Grafana Panel 4";
        var panel5Label = "TestDash Custom Panel 1 (New Plugin)";
        var panel6Label = "TestDash Custom Panel 2 (New Plugin)";

        switch (value) {
            case 0:
                url = panel1URL;
                label = panel1Label;
                break;

            case 1:
                url = panel2URL;
                label = panel2Label;
                break;

            case 2:
                url = panel3URL;
                label = panel3Label;
                break;

            case 3:
                url = panel4URL;
                label = panel4Label;
                break;

            case 4:
                url = panel5URL;
                label = panel5Label;
                break;

            case 5:
                url = panel6URL;
                label = panel6Label;
                break;

            case 6:
                let urls = [
                    panel1URL,
                    panel2URL,
                    panel3URL,
                    panel4URL,
                    panel5URL,
                    panel6URL
                ];

                let labels = [
                    panel1Label,
                    panel2Label,
                    panel3Label,
                    panel4Label,
                    panel5Label,
                    panel6Label
                ];

                let html = "<table class=\"panelTable\">";

                for (var index in urls) {
                    html += "<td class=\"panelCell\">";
                    html += "<iframe src=\"" + urls[index] + "\" class=\"panelFrame\" frameborder=\"0\"></iframe>";
                    html += "<div class=\"labelContainer text\">";
                    html += "<span>";
                    html += "<h2>" + labels[index] + "</h2>";
                    html += "</span>";
                    html += "</div>";
                    html += "</td>"
                }

                html += "</table>";


                $('.main_container').empty();
                $('.main_container').html(html);
                return;

        }

        if($.inArray(value, displayed) !== -1) {
            alert("Panel already added!!");
        } else{
            displayed.push(value);
            let html = "<div class=panel_area_'" + value + "'><iframe src='" + url + "' class='panelFrame' frameborder='0'></iframe>";
            html += "<h3 class='text'>" + label + "</h3><i class='fa fa-trash del' aria-hidden='true' id='" + value + "'></i></div>";
            $('.main_container').append(html);
        }
    };

    $('.del').on('click', function(){
        console.log(this.id);
        delete_panel(this.id);
    });


    function delete_panel(index) {
        $( ".panel_area_" + index + "").remove();
    }

    let updatePanels = () => {
        let panelSelectIds = ["1", "2"];
        for (var id in panelSelectIds) {
            updatePanel(document.getElementById(panelSelectIds[id]));
        }
    };

    // updatePanels();
});
