(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dobSet) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
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

  var tempDoBSet = localStorage.dobSet;
  if( tempDoBSet != 'null') {
    this.dobSet = "YES";
  }

  if( numberMonths > 60 ) {
    for(x = 1 ; x <= 60 ; x++) {
      this.createCircle('#311B92', '1.00');
    }
  }
  else {
    for(x = 1 ; x <= numberMonths ; x++) {
      this.createCircle('#311B92', '1.00');
    }
    for(x = 1 ; x <= (60-numberMonths) ; x++) {
      this.createCircle('#311B92', '0.15');
    }
  }

  if( numberMonths > 120) {
    for(x = 61 ; x <= 120 ; x++) {
      this.createCircle('#1A237E', '1.00');
    }
  }
  else {
    for(x = 61 ; x <= numberMonths ; x++) {
      this.createCircle('#1A237E', '1.00');
    }
    for(x = 61 ; x <= (120-numberMonths) ; x++) {
      this.createCircle('#1A237E', '0.15');
    }
  }

  if( numberMonths > 156 ) {
    for(x = 121 ; x <= 156 ; x++) {
      this.createCircle('#0D47A1', '1.00');
    }
  }
  else {
    for(x = 121 ; x <= numberMonths ; x++) {
      this.createCircle('#0D47A1', '1.00');
    }
    for(x = 121 ; x <= (156-numberMonths) ; x++) {
      this.createCircle('#0D47A1', '0.15');
    }
  }


  if( numberMonths > 204 ) {
    for(x = 157 ; x <= 204 ; x++) {
      this.createCircle('#006064', '1.00');
    }
  }
  else {
    for(x = 157 ; x <= numberMonths ; x++) {
      this.createCircle('#006064', '1.00');
    }
    for(x = 157 ; x <= (204-numberMonths) ; x++) {
      this.createCircle('#006064', '0.15');
    }
  }

  if( numberMonths > 252 ) {
    for(x = 205 ; x <= 252 ; x++) {
      this.createCircle('#004D40', '1.00');
    }
  }
  else {
    for(x = 205 ; x <= numberMonths ; x++) {
      this.createCircle('#004D40', '1.00');
    }
    for(x = 205 ; x <= (252-numberMonths) ; x++) {
      this.createCircle('#004D40', '0.15');
    }
  }


  if( numberMonths > 792 ) {
    for(x = 253 ; x <= 792 ; x++) {
      this.createCircle('#1B5E20', '1.00');
    }
  }
  else if( numberMonths > 252 && numberMonths <= 792 ){
    for(x = 253 ; x < numberMonths ; x++) {
      this.createCircle('#1B5E20', '1.00');
    }
    for(x = numberMonths ; x <= 792 ; x++) {
      this.createCircle('#1B5E20', '0.15');
    }
  }
  else
  {
    for(x = 253 ; x <= 792 ; x++) {
      this.createCircle('#1B5E20', '0.15');
    }
  }



  if( numberMonths > 945 ) {
    for(x = 793 ; x <= 945 ; x++) {
      this.createCircle('#33691E', '1.00');
    }
  }
  else if( numberMonths > 792 && numberMonths <= 945 ){
    for(x = 793 ; x < numberMonths ; x++) {
      this.createCircle('#33691E', '1.00');
    }
    for(x = numberMonths ; x <= (945-numberMonths) ; x++) {
      this.createCircle('#33691E', '0.15');
    }
  }
  else
  {
    for(x = 793 ; x <= 945 ; x++) {
      this.createCircle('#33691E', '0.15');
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
    localStorage.dobSet = this.dobSet;
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.dobSet = "YES";
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
      this.dobSet = null;
      localStorage.dobSet = null;
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


(function() {
  window.onresize= function() {
    var div = document.querySelector('#circles');
    circle.style.height= div.childNodes[0].offsetWidth+'px';
  }

  var styleSheets = document.styleSheets,
      circle,
      i, j;

  for(i = 0 ; i < styleSheets.length ; i++) {
    rules= styleSheets[i].rules ||
           styleSheets[i].cssRules;
    for(j = 0 ; j < rules.length ; j++) {
      if(rules[j].selectorText==='.circle') {
        circle= rules[j];
        break;
      }
    }
  }
})();

window.onresize();
