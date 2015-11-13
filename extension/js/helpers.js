Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};

function daysInMonth(year, month) {
  return new Date(year, month+1, 0).getDate();
}

Date.prototype.getMonthsDaysPassed = function() {
  var currentDate = new Date();

  var monthDifference = currentDate.getMonth() - this.getMonth();

  var numLeapDaysPassed =  Math.floor(currentDate.getFullYear()/4)- Math.floor(this.getFullYear()/4);

  var msDifference = currentDate - this;
  var dayDifference = Math.floor((msDifference % 31536000000)/86400000);
  if( dayDifference >= 365 )
  {
    dayDifference -= 365;
  }
  dayDifference -= numLeapDaysPassed;
  var i = this.getMonth();
  var year = this.getYear();
  var end = currentDate.getMonth();

  var loop = 0;
  if( i == end && currentDate.getDate() > this.getDate() )
  {
    dayDifference = currentDate.getDate() - this.getDate();
  }
  if( i == end && currentDate.getDate() < this.getDate() )
  {
    var loop = 12;
  }

  while( i != end || loop > 0 )
  {
    dayDifference -= daysInMonth(year, i);
    i += 1;
    if( i == 12 )
    {
      i = 0;
      year += 1;
    }
    loop-=1;
  }

  if( dayDifference < 0 )
  {
    dayDifference = daysInMonth(year, i-1) + dayDifference;
    monthDifference -= 1;
  }

  if( monthDifference < 0 )
  {
    monthDifference += 12;
  }
  return [monthDifference, dayDifference];
};

Date.prototype.stdTimezoneOffset = function() {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function() {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

function getTimeStringFromMinutes(totalMinutes) {
  var hours = Math.floor(totalMinutes/60);
  var minutes = totalMinutes%60;
  return zeroFill(hours,2)+":"+zeroFill(minutes,2)+":00";
}

function zeroFill(number, width)
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + "";
}