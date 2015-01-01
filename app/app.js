(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

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

  this.documentCircle = document.querySelector('#circles');

  var tempDoB = localStorage.dob;
  if( tempDoB != 'null') {
    this.dob = new Date(parseInt(tempDoB));
  }

  var currentDate = new Date;
  var oneDay = 24*60*60*1000;

  var diffDays = Math.round(Math.abs((this.dob.getTime() - currentDate.getTime())/(oneDay)));
  var numberMonths = Math.floor(diffDays/30);
  var fractionOfMonth = (diffDays%30)/30.0;

  this.generateCircleLoop(numberMonths, 1, 60, '#311B92', fractionOfMonth);
  this.generateCircleLoop(numberMonths, 61, 120, '#1A237E', fractionOfMonth);
  this.generateCircleLoop(numberMonths, 121, 156, '#0D47A1', fractionOfMonth);
  this.generateCircleLoop(numberMonths, 157, 204, '#006064', fractionOfMonth);
  this.generateCircleLoop(numberMonths, 205, 252, '#004D40', fractionOfMonth);
  this.generateCircleLoop(numberMonths, 253, 792, '#1B5E20', fractionOfMonth);
  this.generateCircleLoop(numberMonths, 793, 945, '#33691E', fractionOfMonth);

};

App.fn.generateCircleLoop = function(numberMonths, firstCount, secondCount, bkgdColor, fractionOfMonth) {
  var x;
  if( numberMonths > secondCount ) {
    for(x = firstCount ; x <= secondCount ; x++) {
      this.createCircle( bkgdColor, '1.00');
    }
  }
  else if( numberMonths > (firstCount-1) && numberMonths <= secondCount ){
    for(x = firstCount ; x < numberMonths ; x++) {
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

    for(x = (numberMonths+1) ; x <= secondCount ; x++) {
      this.createCircle(bkgdColor, '0.25');
    }
  }
  else
  {
    for(x = firstCount ; x <= secondCount ; x++) {
      this.createCircle(bkgdColor, '0.25');
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

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
    localStorage.dobSet = "YES";
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.save();

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
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 100);
};

App.fn.renderAge = function(){
  var now       = new Date
  var duration  = now - this.dob;
  var years     = duration / 31556900000;

  var majorMinor = years.toFixed(9).toString().split('.');

  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year:         majorMinor[0],
      milliseconds: majorMinor[1]
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
