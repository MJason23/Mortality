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
  if( monthDifference < 0 )
  {
    monthDifference += 12;
  }
  //var numLeapDaysPassed =  Math.floor(currentDate.getFullYear()/4)- Math.floor(this.getFullYear()/4);
  //if( this.getMonth() <= 1 )
  //{
  //  numLeapDaysPassed += 1;
  //}

  var msDifference = currentDate - this;
  var dayDifference = Math.floor((msDifference % 31556952000)/86400000);

  //dayDifference -= numLeapDaysPassed;

  var i = this.getMonth();
  var year = this.getYear();
  var end = currentDate.getMonth();
  while( i != end )
  {
    dayDifference -= daysInMonth(year, i);
    i += 1;
    if( i == 12 )
    {
      i = 0;
      year += 1;
    }
  }

  if( dayDifference < 0 )
  {
    dayDifference += daysInMonth(year, i-1);
    monthDifference -= 1;
  }
  return [monthDifference, dayDifference];
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