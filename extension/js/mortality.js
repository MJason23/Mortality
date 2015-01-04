(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var yearMS = 31556952000;
var monthMS = 2628000000;
var dayMS = 86400000;
var hourMS = 3600000;
var minuteMS = 60000;
var secondMS = 1000;

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (localStorage.getItem("dobSet") === null) {
    this.renderChoose();
  } else {
    this.renderAgeLoop();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var x;

  this.dob = this.getDob();
  this.colorTheme = this.getColorTheme();
  this.chapters = this.getChapters();

  this.documentCircle = document.querySelector('#circles');

  var currentDate = new Date;
  var oneDay = 24*60*60*1000;

  var diffDays = Math.round(Math.abs((this.dob.getTime() - currentDate.getTime())/(oneDay)));
  var numberMonths = Math.floor(diffDays/30);

  this.generateCircleLoops(numberMonths);
};

App.fn.generateCircleLoops = function(numberMonths) {
  for (var chapter = 0; chapter < this.chapters.length; chapter++) {
    var startMonth = this.chapters[chapter][0] + 1;
    var endMonth = this.chapters[chapter][1];
    var bkgdColor = this.colorTheme[chapter];

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

App.fn.saveDob = function(){
  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;

  if (this.dob) {
    localStorage.dob = this.dob.getTime();
    localStorage.dobSet = "YES";
  }
};

App.fn.saveTheme = function(){
  var savedTheme = localStorage.getItem("colorTheme");
  var selectedTheme = document.getElementById("theme_dropdown").value;

  if (savedTheme != selectedTheme) {
    localStorage.setItem("colorTheme", selectedTheme);
  }
};

App.fn.submit = function(e){
  e.preventDefault();

  this.saveDob();
  this.saveTheme();
  
  location.reload();
};

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = (this.getDate()+1).toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
  this.documentCircle.style.display = "none";
  if( this.dob != 'null' ) {
    var test = this.dob.yyyymmdd();
    document.getElementById('dobField').value = this.dob.yyyymmdd();
  }

  this.setSelectedTheme();
};

App.fn.setSelectedTheme = function(){
  var theme = localStorage.getItem("colorTheme");
  if (theme != null) {
    document.getElementById("theme_dropdown").value = theme;
  }
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 110);
};

App.fn.getChapters = function() {

  // Default chapter periods
  var chapters = localStorage.getItem("chapters");
  if (chapters == null) {
    var firstChapter = 0;
    var secondChapter = 60

    var monthBorn = this.dob.getMonth();
    var educationStartOffset = 0;
    if(monthBorn == 11) {
     educationStartOffset = 8; 
    }
    else {
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

App.fn.getDob = function() {
  var savedDoB = localStorage.dob;
  if(savedDoB != 'null') {
    return new Date(parseInt(savedDoB));
  }
};

App.fn.getColorTheme = function() {
  var themes = {
    "aqua" : ['#311B92', '#1A237E', '#0D47A1', '#006064', '#004D40', '#1B5E20', '#33691E'],
    "dark" : ['#EEEEEE', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242'],
    "dusk" : ['#FFEB3B', '#FFB300', '#F57C00', '#BF360C', '#8D6E63', '#4E342E', '#757575']
  }

  var savedTheme = localStorage.getItem("colorTheme");
  
  if (savedTheme == null) {
    return themes.aqua;
  }
  else {
    switch (savedTheme) {
      case "aqua":
        return themes.aqua;

      case "dark":
        return themes.dark;

      case "dusk":
        return themes.dusk;

      default:
        return themes.aqua;
    }
  }
};

App.fn.zeroFill = function( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + "";
};

App.fn.renderAge = function(){
  var now = new Date();
  var timezoneOffset = now.getTimezoneOffset() * minuteMS;
  var duration  = now - timezoneOffset - this.dob;

  var years = Math.floor(duration / yearMS);
  var months = Math.floor((duration % yearMS) / monthMS);
	var days = Math.floor((duration % monthMS) / dayMS);
	var hours = Math.floor((duration % dayMS) / hourMS);
	var minutes = Math.floor((duration % hourMS) / minuteMS);
	var seconds = Math.floor((duration % minuteMS) / secondMS);
	var milliseconds = Math.floor((duration % secondMS) / 10);

	var leapDays = Math.floor(years/4);
	days = days - leapDays;

	var yearString = this.zeroFill(years.toString(),2);
	var monthString =this.zeroFill(months.toString(),2);
	var dayString = this.zeroFill(days.toString(),2);
	var hourString = this.zeroFill(hours.toString(),2);
	var minuteString = this.zeroFill(minutes.toString(),2);
	var secondString = this.zeroFill(seconds.toString(),2);
	var msString = this.zeroFill(milliseconds.toString(),2);

  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year: yearString,
      month: monthString,
      day: dayString,
      hour: hourString,
      minute: minuteString,
      second: secondString,
      ms: msString
    }));
    document.getElementById('reset').onclick = function(){
      localStorage.removeItem("dobSet");
      location.reload();
    };
    document.getElementById('reset').style.opacity = '1';
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};



window.app = new App($('app'))

})();


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
};


(function() {
  window.onresize= function() {
    var div = document.querySelector('#circles');
    var circleWidth = div.childNodes[0].offsetWidth;
    circle.style.height= circleWidth +'px';
    pie.style.width = circle.style.height;
    pie.style.height= circle.style.height;

    var tempDoB = localStorage.dob;
    var tempDateDoB;
    if( tempDoB != 'null') {
      tempDateDoB = new Date(parseInt(tempDoB));
    }

    var currentDate = new Date;
    var oneDay = 24*60*60*1000;

    var diffDays = Math.round(Math.abs((tempDateDoB.getTime() - currentDate.getTime())/(oneDay)));
    var fractionOfMonth = 360-(((diffDays%30)/30.0)*360);

    animate(fractionOfMonth, circleWidth/2);
  }

  var styleSheets = document.styleSheets,
      circle,
      pie,
      i, j, k;
  k = 0;
  for(i = 0 ; i < styleSheets.length ; i++) {
    rules= styleSheets[i].rules ||
           styleSheets[i].cssRules;
    for(j = 0 ; j < rules.length ; j++) {
      if(rules[j].selectorText==='.circle') {
        circle= rules[j];
        k++;
        if(k>1) {
          break;
        }
      }
      else if(rules[j].selectorText==='.pie') {
        pie = rules[j];
        k++;
        if(k>1) {
          break;
        }
      }
    }
  }
})();

window.onresize();
