(function(){

  var $  = document.getElementById.bind(document);

  var yearMS = 31556952000;
  var monthMS = 2628000000;
  var dayMS = 86400000;
  var hourMS = 3600000;
  var minuteMS = 60000;
  var secondMS = 1000;

  var App = function(appElement)
  {
    this.appElement = appElement;
    this.load();

    // CHANGE Previous Version /////////
    localStorage.removeItem("infoSeen");
    localStorage.removeItem("update-3.1.1");
    ////////////////////////////////////

    this.updateInterval();
    loadDarkOrLightTheme();
  };


  App.fn = App.prototype;

  App.fn.updateInterval = function()
  {
    if( localStorage.getItem("hideAge") === null ) {
      if( localStorage.getItem("swap") === null ) {
        var interval = 60000;
        var savedPrecision = localStorage.getItem("precision");
        if(savedPrecision == "sec")
        {
          interval = 1000
        }
        else if(savedPrecision == "ms" || savedPrecision === null)
        {
          interval = 113;
        }
        this.renderAge();
        setInterval(this.renderAge.bind(this),interval);
      }
      else {
        this.renderTime();
        setInterval(this.renderTime.bind(this),1000);
      }

      var savedTheme = localStorage.getItem("colorTheme");
      if(savedTheme == "light" || savedTheme == "rainbowl" || savedTheme == "sky") {
        var whiteFlag = "YES";
      }
      else {
        var blackFlag = "YES";
      }

      var now = new Date();
      var timezoneOffset = now.getTimezoneOffset() * minuteMS;
      var duration  = now - this.dob + timezoneOffset - (parseInt(this.dobMinutes)*minuteMS);

      var savedPrecision = localStorage.getItem("precision");
      while(true) {
        var years = Math.floor(duration / yearMS);
        var yearString = zeroFill(years.toString(), 2);
        if (savedPrecision == "year") {
          break;
        }
        duration -= (years * yearMS);
        var months = Math.floor(duration / monthMS);
        var monthString = zeroFill(months.toString(), 2);
        if (savedPrecision == "month") {
          break;
        }
        duration -= (months * monthMS);
        var days = Math.floor(duration / dayMS);
        var dayString = zeroFill(days.toString(), 2);
        if (savedPrecision == "day") {
          break;
        }
        duration -= (days * dayMS);
        var hours = Math.floor(duration / hourMS);
        var hourString = zeroFill(hours.toString(), 2);
        if (savedPrecision == "hour") {
          break;
        }
        duration -= (hours * hourMS);
        var minutes = Math.floor(duration / minuteMS);
        var minuteString = zeroFill(minutes.toString(), 2);
        if (savedPrecision == "min") {
          break;
        }
        duration -= (minutes * minuteMS);
        var seconds = Math.floor(duration / secondMS);
        var secondString = zeroFill(seconds.toString(), 2);
        if (savedPrecision == "sec") {
          break;
        }
        duration -= (seconds * secondMS);
        var milliseconds = Math.floor(duration / 10);
        var msString = zeroFill(milliseconds.toString(), 2);
        break;
      }

      this.setAppElementHTML(this.getTemplateScript('age')(
      {
        white: whiteFlag,
        black: blackFlag,
        year: yearString,
        month: monthString,
        day: dayString,
        hour: hourString,
        minute: minuteString,
        second: secondString,
        ms: msString
      }));
    }
  };

  App.fn.load = function() {
	  this.dob = getDOB();
	  this.dobMinutes = localStorage.dobMinutes || 0;

	  if (localStorage.getItem("hideCircles") === null)
	  {
		  var monthBorn = this.dob.getMonth();
		  var chaptersArray = getChapters(monthBorn);

		  this.documentCircle = document.querySelector('#circles');

		  var currentDate = new Date;
		  var oneDay = 24 * 60 * 60 * 1000;

		  var diffDays = Math.round(Math.abs((this.dob.getTime() - currentDate.getTime()) / (oneDay)));
		  var numberMonths = Math.floor(diffDays / 30);

		  this.generateCircleLoops(numberMonths, chaptersArray);
    }
  };

  App.fn.generateCircleLoops = function(numberMonths, chaptersArray)
  {
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

        var pie = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        pie.setAttribute("class","pie");
        pie.setAttribute("opacity","1.0");

        var circle;
        var path;
        if(localStorage.getItem("shape") == "square") {
          circle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          path = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        }
        else {
          circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        }
        circle.id = 'piecircle';
        circle.setAttribute("fill", bkgdColor);
        circle.setAttribute("fill-opacity","0.25");
        path.setAttribute("fill",bkgdColor);
        path.id = 'path';
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
    var dateInput = $('dob-input');
    //TODO: Show ERROR
    if( !dateInput.valueAsDate ) return;

    this.dob = dateInput.valueAsDate;
    localStorage.setItem("dob", this.dob.getTime()+((this.dob.getTimezoneOffset()-60) * 60000));

    var timeChecked = document.querySelector('input[id=time-checkbox]').checked;
    if( timeChecked )
    {
      var timeInput = $('time-input');
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
    var hideAgeChecked = document.querySelector('input[id=hideAge-checkbox').checked;
    hideAgeChecked ? localStorage.setItem("hideAge", "YES") : localStorage.removeItem("hideAge");

	  var hideCirclesChecked = document.querySelector('input[id=hideCircles-checkbox').checked;
	  hideCirclesChecked ? localStorage.setItem("hideCircles", "YES") : localStorage.removeItem("hideCircles");

    var swapTimerChecked = document.querySelector('input[id=swapTimer-checkbox').checked;
    swapTimerChecked ? localStorage.setItem("swap", "YES") : localStorage.removeItem("swap");

    var shapeCircleChecked = document.querySelector('input[id=shapeCircle-checkbox').checked;
    shapeCircleChecked ? localStorage.setItem("shape", "circle") : localStorage.removeItem("shape");

    var shapeSquareChecked = document.querySelector('input[id=shapeSquare-checkbox').checked;
    shapeSquareChecked ? localStorage.setItem("shape", "square") : localStorage.removeItem("shape");
  };



  App.fn.renderAge = function()
  {
    var now = new Date();
    var timezoneOffset = now.getTimezoneOffset() * minuteMS;
    var duration  = now - this.dob + timezoneOffset - (parseInt(this.dobMinutes)*minuteMS);

    var savedPrecision = localStorage.getItem("precision");
    while(true) {
      var years = Math.floor(duration / yearMS);
      var yearString = zeroFill(years.toString(), 2);
      if (savedPrecision == "year") {
        break;
      }
      duration -= (years * yearMS);
      var months = Math.floor(duration / monthMS);
      var monthString = zeroFill(months.toString(), 2);
      if (savedPrecision == "month") {
        break;
      }
      duration -= (months * monthMS);
      var days = Math.floor(duration / dayMS);
      var dayString = zeroFill(days.toString(), 2);
      if (savedPrecision == "day") {
        break;
      }
      duration -= (days * dayMS);
      var hours = Math.floor(duration / hourMS);
      var hourString = zeroFill(hours.toString(), 2);
      if (savedPrecision == "hour") {
        break;
      }
      duration -= (hours * hourMS);
      var minutes = Math.floor(duration / minuteMS);
      var minuteString = zeroFill(minutes.toString(), 2);
      if (savedPrecision == "min") {
        break;
      }
      duration -= (minutes * minuteMS);
      var seconds = Math.floor(duration / secondMS);
      var secondString = zeroFill(seconds.toString(), 2);
      if (savedPrecision == "sec") {
        break;
      }
      duration -= (seconds * secondMS);
      var milliseconds = Math.floor(duration / 10);
      var msString = zeroFill(milliseconds.toString(), 2);
      break;
    }
    var notBubbled = true;

    var year = $('year-number');
    if(year) {
      var yearFlag = year.innerHTML != yearString;
    }
    if(yearFlag) {
      year.innerHTML = yearString;
      this.bubbleNumber(year, 2.1);
      notBubbled = false;
    }

    var month = $('month-number');
    if(month) {
      var monthFlag = month.innerHTML != monthString;
    }
    if(monthFlag) {
      month.innerHTML = monthString;
      if(notBubbled) {
        this.bubbleNumber(month, 1.9);
        notBubbled = false;
      }
    }

    var day = $('day-number');
    if(day) {
      var dayFlag = day.innerHTML != dayString;
    }
    if(dayFlag) {
      day.innerHTML = dayString;
      if(notBubbled) {
        this.bubbleNumber(day, 1.7);
        notBubbled = false;
      }
    }

    var hour = $('hour-number');
    if(hour) {
      var hourFlag = hour.innerHTML != hourString;
    }
    if(hourFlag) {
      hour.innerHTML = hourString;
      if(notBubbled) {
        this.bubbleNumber(hour, 1.5);
        notBubbled = false;
      }
    }

    var minute = $('minute-number');
    if(minute) {
      var minuteFlag = minute.innerHTML != minuteString;
    }
    if(minuteFlag) {
      minute.innerHTML = minuteString;
      if(notBubbled) {
        this.bubbleNumber(minute, 1.3);
        notBubbled = false;
      }
    }

    var second = $('second-number');
    if(second) {
      second.innerHTML = secondString;
    }

    var millisecond = $('milli-number');
    if(millisecond) {
      millisecond.innerHTML = msString;
    }

  };


  App.fn.bubbleNumber = function(numberElement, scale)
  {
    requestAnimationFrame(function()
    {
      numberElement.style.webkitTransition=".1s ease-in-out";
      numberElement.style.webkitTransform="scale("+scale.toString()+")";
      setTimeout(function(){
        numberElement.style.webkitTransition=".8s ease-in-out";
        numberElement.style.webkitTransform="scale(1)";
      }, 80);
    }.bind(this));
  }


  App.fn.renderTime = function()
  {
    var now = new Date();
    var ampmString = "AM";
    var hour = now.getHours();
    if( hour > 11 ) {
      ampmString = "PM";
      hour = hour % 12;
    }
    if( hour == 0 ) {
      hour = 12;
    }
    var hourString = zeroFill(hour.toString(), 2);
    var minuteString = zeroFill(now.getMinutes().toString(), 2);
    var secondString = zeroFill(now.getSeconds().toString(), 2);

    var savedTheme = localStorage.getItem("colorTheme");
    if(savedTheme == "light" || savedTheme == "rainbowl" || savedTheme == "sky") {
      var whiteFlag = "YES";
    }
    else {
      var blackFlag = "YES";
    }

    requestAnimationFrame(function()
    {
      this.setAppElementHTML(this.getTemplateScript('clock')(
      {
        white: whiteFlag,
        black: blackFlag,
        hour: hourString,
        minute: minuteString,
        second: secondString,
        ampm: ampmString
      }));
    }.bind(this));
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












/*********************
// Window Functions
**********************/

function animate(theta, radius) {
  var path = document.getElementById('path');
  var piecircle = document.getElementById('piecircle');
  if(path && piecircle) {
    if (localStorage.getItem("shape") == "square") {
      piecircle.setAttribute("height", (2 * radius));
      piecircle.setAttribute("width", (2 * radius));
      var fraction = theta/360;
      path.setAttribute("height", (2*radius));
      path.setAttribute("width", (fraction*(2*radius)));
    }
    else {
      piecircle.setAttribute("cx", radius);
      piecircle.setAttribute("cy", radius);
      piecircle.setAttribute("r", radius);

      theta += 0.5;
      theta %= 360;
      var x = Math.sin(theta * Math.PI / 180) * radius;
      var y = Math.cos(theta * Math.PI / 180) * -radius;
      var d = 'M0,0 v' + -radius + 'A' + radius + ',' + radius + ' 1 ' + ((theta > 180) ? 1 : 0) + ',1 ' + x + ',' + y + 'z';
      path.setAttribute('d', d);
      path.setAttribute('transform', 'translate(' + radius + ',' + radius + ')');
    }
  }
  setTimeout(animate, 7200000); // 1/360 of a month in ms
}


(function() {
  window.onresize= function() {
    var div = document.querySelector('#circles');
    var circleWidth = div.childNodes[0].offsetWidth;
    circle.style.height= circleWidth +'px';
    if(localStorage.getItem("shape") == "square") {
      circle.style.borderRadius = 0;
    }
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

(function($) {
    $(window).load(function () {
      if(localStorage.getItem("dob")===null)
      {
        $("#cancel-button").toggle();
        $("#info-button")[0].click();
      }
    });
})(jQuery);

window.onresize();

