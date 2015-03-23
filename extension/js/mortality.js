Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = (this.getDate()+1).toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};

(function(){

  var $  = document.getElementById.bind(document);

  var yearMS = 31556952000;
  var monthMS = 2628000000;
  var dayMS = 86400000;
  var hourMS = 3600000;
  var minuteMS = 60000;
  var secondMS = 1000;

  var App = function(appElement){
    this.appElement = appElement;
    this.load();

    localStorage.removeItem("infoSeen");

    if (localStorage.getItem("dob") === null) {
      infoButtonPressed();
      loadCheckBoxes();
      setWhiteInfoButton();
    }
    else {
      this.renderAge();
      var savedTheme = localStorage.getItem("colorTheme");
      loadDarkOrLightTheme(savedTheme);
      this.interval = setInterval(this.renderAge.bind(this), 115);
    }
  };

  App.fn = App.prototype;

  App.fn.load = function(){
    var x;

    this.dob = getDOB();
    this.dobMinutes = localStorage.dobMinutes || 0;

    var monthBorn = this.dob.getMonth();
    var chaptersArray = getChapters(monthBorn);

    this.documentCircle = document.querySelector('#circles');

    var currentDate = new Date;
    var oneDay = 24*60*60*1000;

    var diffDays = Math.round(Math.abs((this.dob.getTime() - currentDate.getTime())/(oneDay)));
    var numberMonths = Math.floor(diffDays/30);

    this.generateCircleLoops(numberMonths, chaptersArray);
  };

  App.fn.generateCircleLoops = function(numberMonths, chaptersArray) {
    for (var chapter = 0; chapter < chaptersArray.length; chapter++) {
      var startMonth = chaptersArray[chapter][0] + 1;
      var endMonth = chaptersArray[chapter][1];
      var bkgdColor = getColorTheme()[chapter];

      var x;
      if( numberMonths > endMonth ) {
        for(x = startMonth ; x <= endMonth ; x++) {
          this.createCircle(bkgdColor, '1.00');
        }
      }
      else if( numberMonths > (startMonth-1) && numberMonths <= endMonth ){
        for(x = startMonth ; x < numberMonths ; x++) {
          this.createCircle(bkgdColor, '1.00');
        }

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("fill",bkgdColor);
        path.id = 'path';

        var pie = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        pie.setAttribute("class","pie");
        pie.setAttribute("opacity",1.0)



        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.id = 'piecircle';
        circle.setAttribute("cx","10");
        circle.setAttribute("cy","10");
        circle.setAttribute("r","10");
        circle.setAttribute("fill", bkgdColor);
        circle.setAttribute("fill-opacity","0.25");
        pie.appendChild(circle);
        pie.appendChild(path);
        this.documentCircle.appendChild(pie);

        for(x = (numberMonths+1) ; x <= endMonth ; x++) {
          this.createCircle(bkgdColor, '0.25');
        }
      }
      else
      {
        for(x = startMonth ; x <= endMonth ; x++) {
          this.createCircle(bkgdColor, '0.25');
        }
      }
    }
  };

  App.fn.createCircle = function(bkgdColor, opacity) {
    var circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.backgroundColor = bkgdColor;
    circle.style.opacity = opacity;
    this.documentCircle.appendChild(circle);
  };

  App.fn.saveDob = function()
  {
    var dateInput = $('dob_input');
    //TODO: Show ERROR
    if( !dateInput.valueAsDate ) return;

    this.dob = dateInput.valueAsDate;
    localStorage.setItem("dob", this.dob.getTime());

    var timeChecked = document.querySelector('input[id=timeCheckbox]').checked;
    if( timeChecked )
    {
      var timeInput = $('time_input');
      //TODO: Show ERROR
      if( !timeInput.valueAsDate ) return;
      var timeArray = timeInput.value.split(":");
      this.dobMinutes = timeArray[0]*60 + timeArray[1]*1;
      localStorage.dobTimeSet = "YES";
      localStorage.dobMinutes = this.dobMinutes;
    }
    else
    {
      this.dobMinutes = 0;
      localStorage.removeItem("dobTimeSet");
      localStorage.removeItem("dobMinutes")
    }
    var hideAgeChecked = document.querySelector('input[id=hideAgeCheckBox').checked;
    hideAgeChecked ? localStorage.setItem("hideAge", "YES") : localStorage.removeItem("hideAge");
  };

  App.fn.renderSettings = function(){
    this.setAppElementHTML(this.getTemplateScript('dob')());
    document.body.style.backgroundColor = "#1d1d1d";
    document.body.style.color = "#eff4ff";
    this.documentCircle.style.display = "none";
    if( this.dob != 'null' ) {
      document.getElementById('dob_input').value = this.dob.yyyymmdd();
    }
    if( this.dobMinutes != 'null' ) {
      var temp = getTimeStringFromMinutes(this.dobMinutes);
      document.getElementById('time_input').value = temp;
    }
    setDropdownWithCurrentTheme();
  };



  App.fn.renderAge = function()
  {
    if( localStorage.getItem("hideAge") === null )
    {
      var now = new Date();
      var timezoneOffset = now.getTimezoneOffset() * minuteMS;
      var duration  = now - this.dob + timezoneOffset - (parseInt(this.dobMinutes)*minuteMS);

      var years = Math.floor(duration / yearMS);
      duration -= (years*yearMS);
      var months = Math.floor(duration / monthMS);
      duration -= (months*monthMS);
    	var days = Math.floor(duration / dayMS);
      duration -= (days*dayMS);
    	var hours = Math.floor(duration / hourMS);
      duration -= (hours*hourMS);
    	var minutes = Math.floor(duration / minuteMS);
      duration -= (minutes*minuteMS);
    	var seconds = Math.floor(duration / secondMS);
      duration -= (seconds*secondMS);
    	var milliseconds = Math.floor(duration / 10);

    	var yearString = zeroFill(years.toString(),2);
    	var monthString = zeroFill(months.toString(),2);
    	var dayString = zeroFill(days.toString(),2);
    	var hourString = zeroFill(hours.toString(),2);
    	var minuteString = zeroFill(minutes.toString(),2);
    	var secondString = zeroFill(seconds.toString(),2);
    	var msString = zeroFill(milliseconds.toString(),2);

      requestAnimationFrame(function()
      {
        this.setAppElementHTML(this.getTemplateScript('age')(
        {
          year: yearString,
          month: monthString,
          day: dayString,
          hour: hourString,
          minute: minuteString,
          second: secondString,
          ms: msString
        }));
        var savedTheme = localStorage.getItem("colorTheme");
        if(savedTheme == "light" || savedTheme == "rainbowl")
        {
          var counts = document.getElementsByClassName('count');
          for( i=0; i<counts.length; i++ ) {
            counts[i].style.textShadow = "-3px 0 white, 0 3px white, 3px 0 white, 0 -3px white";
          }
          var countLabels = document.getElementsByClassName('count-labels');
          for( i=0; i<countLabels.length; i++ ) {
            countLabels[i].style.textShadow = "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white";
            countLabels[i].style.fontWeight = "500";
          }
        }
        else
        {
          var counts = document.getElementsByClassName('count');
          for( i=0; i<counts.length; i++ ) {
            counts[i].style.textShadow = "-3px 0 black, 0 3px black, 3px 0 black, 0 -3px black";
          }
          var countLabels = document.getElementsByClassName('count-labels');
          for( i=0; i<countLabels.length; i++ ) {
            countLabels[i].style.textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
            countLabels[i].style.fontWeight = "400";
          }
        }
      }.bind(this));
    }
  };

  App.fn.setAppElementHTML = function(html){
    this.appElement.innerHTML = html;
  };

  App.fn.getTemplateScript = function(name){
    var templateElement = $(name + '-template');
    return Handlebars.compile(templateElement.innerHTML);
  };

  window.app = new App($('app'))

})();


$("#submit_button").click(function(){
  window.app.saveDob();
  saveTheme();
  location.reload();
  return false;
});

$("#cancel_button").click(function(){
  location.reload();
  return false;
});

function infoButtonPressed()
{
	var popupBody = document.querySelector('#popup-body');
  if(localStorage.getItem("dob")===null)
  {
    setButtonPressed(3);
  }
	else if(localStorage.getItem("update-3.1.1")===null)
	{
		setButtonPressed(2);
		localStorage.setItem("update-3.1.1", "YES");
	}
	else
	{
		setButtonPressed(1);
	}

	if(document.getElementById("info-img").src.indexOf("assets/infoWhiteAlert.png") > -1)
	{
		document.getElementById("info-img").src = "assets/infoWhite.png"
	}
	else if(document.getElementById("info-img").src.indexOf("assets/infoBlackAlert.png") > -1)
	{
		document.getElementById("info-img").src = "assets/infoBlack.png"
	}
}
$('#info').click(function()
{
	infoButtonPressed();
});

$("#about-button").click(function()
{
	setButtonPressed(1);
});

$("#updates-button").click(function()
{
	setButtonPressed(2);
});

$("#settings-button").click(function()
{
	setButtonPressed(3);
});

function setButtonPressed(buttonNumber) {
	var updatesButton = document.querySelector("#updates-button");
	var aboutButton = document.querySelector("#about-button");
	var settingsButton = document.querySelector("#settings-button");
  var popupBody = document.querySelector('#popup-body');
	if (buttonNumber == 1)
	{
    popupBody.innerHTML = window.app.getTemplateScript('about-popup')();
		aboutButton.className = "pressed-button";
		updatesButton.className = "default-button";
		settingsButton.className = "default-button";
	}
	else if (buttonNumber == 2)
	{
    popupBody.innerHTML = window.app.getTemplateScript('updates-popup')();
		aboutButton.className = "default-button";
		updatesButton.className = "pressed-button";
		settingsButton.className = "default-button";
	}
	else
	{
    popupBody.innerHTML = window.app.getTemplateScript('settings-popup')();
		aboutButton.className = "default-button";
		updatesButton.className = "default-button";
		settingsButton.className = "pressed-button";
	}
}


function setWhiteInfoButton()
{
  if(localStorage.getItem("update-3.1.1") === null)
  {
    document.getElementById("info-img").src = "assets/infoWhiteAlert.png"
  }
  else
  {
	  document.getElementById("info-img").src = "assets/infoWhite.png"
  }
}

function setBlackInfoButton()
{
  if(localStorage.getItem("update-3.1.1") === null)
  {
    document.getElementById("info-img").src = "assets/infoBlackAlert.png"
  }
  else
  {
    document.getElementById("info-img").src = "assets/infoBlack.png"
  }
}

function saveTheme(){
  var savedTheme = localStorage.getItem("colorTheme");
  var selectedTheme = document.getElementById("theme_dropdown").value;

  if (savedTheme != selectedTheme) {
    localStorage.setItem("colorTheme", selectedTheme);
  }
};

function loadCheckBoxes() {
  var timeCheckbox = document.querySelector('input[id=timeCheckbox]');
  if (localStorage.getItem("dobTimeSet") == "YES") {
    timeCheckbox.checked = true;
  }
  showTimeSelectorIf(timeCheckbox.checked);

  var hideAgeCheckBox = document.querySelector('input[id=hideAgeCheckBox]');
  if (localStorage.getItem("hideAge") == "YES") {
    hideAgeCheckBox.checked = true;
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    var tempTimeCheckbox = document.querySelector('input[id=timeCheckbox]');
    tempTimeCheckbox.addEventListener('change', function (event) {
        showTimeSelectorIf(tempTimeCheckbox.checked);
    });
  });
}

function loadDarkOrLightTheme(savedTheme)
{
    if(savedTheme == "light" || savedTheme == "rainbowl")
    {
      document.body.style.backgroundColor = "#F5F5F5";
      document.body.style.color = "#424242";
      setBlackInfoButton();
    }
    else
    {
      document.body.style.backgroundColor = "#1d1d1d";
      document.body.style.color = "#eff4ff";
      setWhiteInfoButton();
    }
}

function getColorTheme() {
  var themes = {
    "def" : ['#311B92', '#1A237E', '#0D47A1', '#006064', '#004D40', '#1B5E20', '#33691E'],
    "dark" : ['#EEEEEE', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242'],
    "light" : ['#212121', '#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0'],
    "dawn" : ['#FFEB3B', '#FBC02D', '#F9A825', '#FF9800', '#F57C00', '#E65100', '#795548'],
    "dusk" : ['#391003', '#5D1A25', '#722007','#ab300a', '#bf360c', '#cb5e3c', '#df9a85'],
    "twilight" : ['#4527A0', '#283593', '#3F51B5', '#5C6BC0', '#78909C', '#B0BEC5', '#ECEFF1'],
    "retro" : ['#13a1a9', '#18CAD4', '#941036', '#D4184E', '#FFF14C', '#00E8BB', '#00a282'],
    "rainbowl" : ['#B71C1C', '#E65100', '#FFD600', '#1B5E20', '#004D40', '#01579B', '#673AB7'],
    "rainbowd" : ['#ee4035', '#f37736', '#fcec4d', '#7bc043', '#009688', '#0392cf', '#644ca2']
  }

  savedTheme = localStorage.getItem("colorTheme");

  if (savedTheme == null) {
    return themes.def;
  }
  else {
    switch (savedTheme) {
      case "default":
        return themes.def;
      case "dark":
        return themes.dark;
      case "light":
        return themes.light;
      case "dawn":
        return themes.dawn;
      case "dusk":
        return themes.dusk;
      case "twilight":
        return themes.twilight;
      case "retro":
        return themes.retro;
      case "rainbowd":
        return themes.rainbowd;
      case "rainbowl":
        return themes.rainbowl;
      default:
        return themes.def;
    }
  }
};

function setDropdownWithCurrentTheme(){
  var theme = localStorage.getItem("colorTheme");
  if (theme != null) {
    document.getElementById("theme_dropdown").value = theme;
  }
};

function getChapters(monthBorn) {
  var chapters = localStorage.getItem("chapters");
  if (chapters == null) {
    var firstChapter = 0;
    var secondChapter = 60;
    var educationStartOffset = 0;
    if(monthBorn == 11)
    {
     educationStartOffset = 8;
    }
    else
    {
     educationStartOffset = (7-monthBorn);
    }
    secondChapter += educationStartOffset;
    var thirdChapter = secondChapter + 84;
    var fourthChapter = thirdChapter + 24;
    var fifthChapter = fourthChapter + 48;
    var sixthChapter = fifthChapter + 48;
    var seventhChapter = sixthChapter + 540;
    var eighthChapter = seventhChapter + 141 - educationStartOffset;
    return [[firstChapter, secondChapter], [secondChapter, thirdChapter]
      ,[thirdChapter, fourthChapter], [fourthChapter, fifthChapter]
      ,[fifthChapter, sixthChapter], [sixthChapter, seventhChapter]
      ,[seventhChapter, eighthChapter]];
  }
};


function showTimeSelectorIf(isChecked) {
  if (isChecked) {
      document.getElementById("time_input").style.display = "block";
  } else {
      document.getElementById("time_input").style.display = "none";
  }
}

function getDOB() {
  var savedDoB = localStorage.dob;
  if(savedDoB != 'null') {
    return new Date(parseInt(savedDoB));
  }
};

function zeroFill(number, width)
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + "";
};

function animate(theta, radius) {
  var path = document.getElementById('path');
  var piecircle = document.getElementById('piecircle');
  if(path && piecircle) {
    piecircle.setAttribute("cx",radius);
    piecircle.setAttribute("cy",radius);
    piecircle.setAttribute("r",radius);

    theta += 0.5;
    theta %= 360;
    var x = Math.sin(theta * Math.PI / 180) * radius;
    var y = Math.cos(theta * Math.PI / 180) * -radius;
    var d = 'M0,0 v' + -radius + 'A' + radius + ',' + radius + ' 1 ' + ((theta > 180) ? 1 : 0) + ',1 ' + x + ',' + y + 'z';
    path.setAttribute('d', d);
    path.setAttribute('transform', 'translate(' + radius + ',' + radius + ')');
  }
  setTimeout(animate, 7200000); // 1/360 of a month in ms
}

function getTimeStringFromMinutes(totalMinutes) {
  var hours = Math.floor(totalMinutes/60);
  var minutes = totalMinutes%60;
  return zeroFill(hours,2)+":"+zeroFill(minutes,2)+":00";
}

(function() {
  window.onresize= function() {
    var div = document.querySelector('#circles');
    var circleWidth = div.childNodes[0].offsetWidth;
    circle.style.height= circleWidth +'px';
	  var radius = circle.style.height;
    pie.style.width = radius;
    pie.style.height = radius;

    var tempDoB = localStorage.dob;
    var tempDateDoB;
    if( tempDoB != 'null') {
      tempDateDoB = new Date(parseInt(tempDoB));
    }

    var currentDate = new Date;
    var oneDay = 24*60*60*1000;

    var diffDays = Math.round(Math.abs((currentDate.getTime() - tempDateDoB.getTime())/(oneDay)));
    var fractionOfMonth = ((diffDays%30)/30.0)*360;

    animate(fractionOfMonth, circleWidth/2);
  };

  var styleSheets = document.styleSheets,
      circle,
      pie,
      i, j, k;
  k = 0;
	var rules;
	for (i = 0; i < styleSheets.length; i++) {
		rules = styleSheets[i].rules ||
		styleSheets[i].cssRules;
		for (j = 0; j < rules.length; j++) {
			if (rules[j].selectorText === '.circle') {
				circle = rules[j];
				k++;
				if (k > 1) {
					break;
				}
			}
			else if (rules[j].selectorText === '.pie') {
				pie = rules[j];
				k++;
				if (k > 1) {
					break;
				}
			}
		}
	}
})();

window.onresize();
