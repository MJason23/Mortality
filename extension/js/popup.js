$('#inline-popup').magnificPopup({
  removalDelay: 800,
  callbacks: {
    beforeOpen: function() {
       this.st.mainClass = this.st.el.attr('data-effect');
    }
  },
  closeBtnInside: false,
  focus: 'link-input',
  midClick: true
});


function infoButtonPressed()
{
  if(localStorage.getItem("dob")===null)
  {
    setButtonPressed(2);
  }
  //UPDATE WHEN REVVING VERSIONS
  else if(localStorage.getItem("version")=="3.4.2")
  {
    var lastOptionView = localStorage.getItem("lastOptionView");
    if( lastOptionView === null )
    {
      lastOptionView = 0;
    }
    setButtonPressed(lastOptionView);
  }
  else
  {
    setButtonPressed(1);
    document.getElementById("update-bubble").style.display = "none";
    localStorage.setItem("version", "3.4.2");
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

$('#info-button').click(function()
{
  infoButtonPressed();
});

$("#about-button").click(function()
{
  unlessDOBMissingGoToButtonNumber(0);
});

$("#updates-button").click(function()
{
  unlessDOBMissingGoToButtonNumber(1);
});

$("#settings-button").click(function()
{
  unlessDOBMissingGoToButtonNumber(2);
});

$("#countdown-button").click(function()
{
  unlessDOBMissingGoToButtonNumber(3);
});

function unlessDOBMissingGoToButtonNumber(button)
{
  localStorage.setItem("lastOptionView", button);

  if(localStorage.getItem("dob")===null)
  {
    setButtonPressed(2);
  }
  else
  {
    setButtonPressed(button);
  }
}

function setButtonPressed(button)
{
  var updatesButton = document.querySelector("#updates-button");
  var aboutButton = document.querySelector("#about-button");
  var settingsButton = document.querySelector("#settings-button");
  var countdownButton = document.querySelector("#countdown-button");
  var popupBody = document.querySelector('#popup-body');
  if (button == 0)
  {
    popupBody.innerHTML = window.app.getTemplateScript('about-popup')();
    aboutButton.className = "pressed-button";
    updatesButton.className = "default-button";
    settingsButton.className = "default-button";
    countdownButton.className = "countdown-default-button";
  }
  else if (button == 1)
  {
    popupBody.innerHTML = window.app.getTemplateScript('updates-popup')();
    aboutButton.className = "default-button";
    updatesButton.className = "pressed-button";
    settingsButton.className = "default-button";
    countdownButton.className = "countdown-default-button";
  }
  else if (button == 3)
  {
    popupBody.innerHTML = window.app.getTemplateScript('countdown-popup')();
    aboutButton.className = "default-button";
    updatesButton.className = "default-button";
    settingsButton.className = "default-button";
    countdownButton.className = "countdown-pressed-button";

    setupCountdown();
  }
  else
  {
    popupBody.innerHTML = window.app.getTemplateScript('settings-popup')();
    aboutButton.className = "default-button";
    updatesButton.className = "default-button";
    settingsButton.className = "pressed-button";
    countdownButton.className = "countdown-default-button";

    setupSettings(window.app.dob, window.app.dobMinutes);
  }
  if(localStorage.getItem("dob")===null)
  {
    $("#cancel-button").toggle();
  }
}

function setupCountdown()
{
  loadCountdownCheckboxes();
  var toggleCountdownCheckbox = document.querySelector('input[id=toggleCountdown-checkbox]');
  if( toggleCountdownCheckbox.checked )
  {
    var specifyCountdownCheckbox = document.querySelector('input[id=specifyCountdown-checkbox]');
    if( specifyCountdownCheckbox.checked )
    {
      loadCountdownDate();

      var countdownTimeCheckbox = document.querySelector('input[id=countdown-addTime-checkbox]');
      if( countdownTimeCheckbox.checked )
      {
        loadCountdownTime();
      }
    }
    else
    {
      loadSurveyAnswers();
    }
  }

  $("#countdown-submit-button").click(function(){
    var toggleCountdownCheckbox = document.querySelector('input[id=toggleCountdown-checkbox]');
    if( toggleCountdownCheckbox.checked )
    {
      localStorage.setItem("countdownEnabled", "YES");
      var specifyCountdownCheckbox = document.querySelector('input[id=specifyCountdown-checkbox]');
      if( specifyCountdownCheckbox.checked )
      {
        saveCountdownDeath();
        localStorage.setItem("specificTimeSet", "YES");
        var countdownTimeCheckbox = document.querySelector('input[id=countdown-addTime-checkbox]');
        if( countdownTimeCheckbox.checked )
        {
          localStorage.setItem("countdownTimeSet", "YES");
        }
        else
        {
          localStorage.removeItem("countdownTimeSet");
        }
      }
      else
      {
        localStorage.removeItem("specificTimeSet");
        saveSurveyAnswers();
      }
    }
    else
    {
      localStorage.removeItem("countdownEnabled");
    }
    $("#info-popup").magnificPopup('close');
  });

  $("#countdown-cancel-button").click(function(){
    $("#info-popup").magnificPopup('close');
  });

}

function setupSettings(dob, dobMinutes)
{
  loadCheckBoxes();

  document.getElementById('dob-input').value = dob.yyyymmdd();
  document.getElementById('time-input').value = getTimeStringFromMinutes(dobMinutes);
  setDropdownWithCurrentTheme();

  var savedPrecision = localStorage.getItem("precision");
  if (savedPrecision != null) {
    document.getElementById("precision-dropdown").value = savedPrecision;
  }

  var savedChapterLengths = JSON.parse(localStorage.getItem("chapterLengths"));
  if( savedChapterLengths === null )
  {
    savedChapterLengths = [5,7,2,4,4,43,15,0];
  }

  $("#first-chapter-input").val(savedChapterLengths[0]);
  $("#second-chapter-input").val(savedChapterLengths[1]);
  $("#third-chapter-input").val(savedChapterLengths[2]);
  $("#fourth-chapter-input").val(savedChapterLengths[3]);
  $("#fifth-chapter-input").val(savedChapterLengths[4]);
  $("#sixth-chapter-input").val(savedChapterLengths[5]);
  $("#seventh-chapter-input").val(savedChapterLengths[6]);
  $("#eighth-chapter-input").val(savedChapterLengths[7]);


  $("#submit-button").click(function(){
    window.app.saveDob();
    saveTheme();
    savePrecision();
    saveChapterLengths();
    $("#info-popup").magnificPopup('close');
  });

  $("#cancel-button").click(function(){
    $("#info-popup").magnificPopup('close');
  });
}


function loadCountdownTime()
{
  var deathTime = localStorage.getItem("deathTime");
  if( deathTime === null )
  {
    document.getElementById('countdownTime-input').value = "00:00";
  }
  else
  {
    document.getElementById('countdownTime-input').value = getTimeStringFromMinutes(deathTime);
  }


}

function saveCountdownDeath()
{
  window.app.saveDeath();
}

function loadCountdownDate()
{
  var deathDate = localStorage.getItem("deathDate");
  if( deathDate === null )
  {
    document.getElementById('countdownDate-input').value = new Date();
  }
  else
  {
    document.getElementById('countdownDate-input').value = new Date(parseInt(deathDate)).yyyymmdd();
  }
}

function saveSurveyAnswers()
{


}
function loadSurveyAnswers()
{

}

function loadCountdownCheckboxes()
{
  var toggleCountdownCheckbox = document.querySelector('input[id=toggleCountdown-checkbox]');
  if (localStorage.getItem("countdownEnabled") == "YES") {
    toggleCountdownCheckbox.checked = true;
  }
  showCountdownIf(toggleCountdownCheckbox.checked);

  toggleCountdownCheckbox.addEventListener('change', function () {
    showCountdownIf(toggleCountdownCheckbox.checked);
  });

  var specificTimeCheckbox = document.querySelector('input[id=specifyCountdown-checkbox]');
  if (localStorage.getItem("specificTimeSet") == "YES") {
    specificTimeCheckbox.checked = true;
  }
  showSpecificTimeSettingsIf(specificTimeCheckbox.checked);

  specificTimeCheckbox.addEventListener('change', function () {
    showSpecificTimeSettingsIf(specificTimeCheckbox.checked);
  });

  var countdownTimeCheckbox = document.querySelector('input[id=countdown-addTime-checkbox]');
  if (localStorage.getItem("countdownTimeSet") == "YES") {
    countdownTimeCheckbox.checked = true;
  }
  showCountdownTimeSelectorIf(countdownTimeCheckbox.checked);

  countdownTimeCheckbox.addEventListener('change', function () {
    showCountdownTimeSelectorIf(countdownTimeCheckbox.checked);
  });
}

function loadCheckBoxes()
{
  var timeCheckbox = document.querySelector('input[id=time-checkbox]');
  if (localStorage.getItem("dobTimeSet") == "YES") {
    timeCheckbox.checked = true;
  }
  showTimeSelectorIf(timeCheckbox.checked);

  timeCheckbox.addEventListener('change', function () {
    showTimeSelectorIf(timeCheckbox.checked);
  });

  var hideAgeCheckbox = document.querySelector('input[id=hideAge-checkbox]');
  if (localStorage.getItem("hideAge") == "YES") {
    hideAgeCheckbox.checked = true;
  }

  hideAgeCheckbox.addEventListener('change', function () {
    var hideCirclesCheckbox = document.querySelector('input[id=hideCircles-checkbox]');
    if(hideCirclesCheckbox.checked == true) {
      hideCirclesCheckbox.checked = false;
    }
  });

  var hideCirclesCheckbox = document.querySelector('input[id=hideCircles-checkbox]');
  if (localStorage.getItem("hideCircles") == "YES") {
    hideCirclesCheckbox.checked = true;
  }

  hideCirclesCheckbox.addEventListener('change', function () {
    var hideAgeCheckbox = document.querySelector('input[id=hideAge-checkbox]');
    if(hideAgeCheckbox.checked == true) {
      hideAgeCheckbox.checked = false;
    }
  });

  var swapTimerCheckbox = document.querySelector('input[id=swapTimer-checkbox]');
  if (localStorage.getItem("swap") == "YES") {
    swapTimerCheckbox.checked = true;
  }

  var shapeCircleCheckbox = document.querySelector('input[id=shapeCircle-checkbox]');
  if (localStorage.getItem("hideCircles") == "YES") {
    shapeCircleCheckbox.checked = true;
  }

  shapeCircleCheckbox.addEventListener('change', function () {
    var shapeCircleCheckbox = document.querySelector('input[id=shapeCircle-checkbox]');
    if(shapeCircleCheckbox.checked == false) {
      shapeCircleCheckbox.checked = true;
    }
    var shapeSquareCheckbox = document.querySelector('input[id=shapeSquare-checkbox]');
    if(shapeSquareCheckbox.checked == true) {
      shapeSquareCheckbox.checked = false;
    }
  });

  var shapeSquareCheckbox = document.querySelector('input[id=shapeSquare-checkbox]');
  if (localStorage.getItem("hideCircles") == "YES") {
    shapeSquareCheckbox.checked = true;
  }

  shapeSquareCheckbox.addEventListener('change', function () {
    var shapeSquareCheckbox = document.querySelector('input[id=shapeSquare-checkbox]');
    if(shapeSquareCheckbox.checked == false) {
      shapeSquareCheckbox.checked = true;
    }
    var shapeCircleCheckbox = document.querySelector('input[id=shapeCircle-checkbox]');
    if(shapeCircleCheckbox.checked == true) {
      shapeCircleCheckbox.checked = false;
    }
  });

  if( localStorage.getItem("shape") == "square") {
    shapeSquareCheckbox.checked = true;
  }
  else {
    shapeCircleCheckbox.checked = true;
  }
}

function setDropdownWithCurrentTheme(){
  var theme = localStorage.getItem("colorTheme");
  if (theme != null) {
    document.getElementById("theme-dropdown").value = theme;
  }
}


function setWhiteInfoButton()
{
  if(localStorage.getItem("version") == "3.4.2") {
    document.getElementById("info-img").src = "assets/infoWhite.png";
    document.getElementById("update-bubble").style.display = "none";
  }
  else {
    document.getElementById("info-img").src = "assets/infoWhiteAlert.png";
    document.getElementById("update-bubble").style.display = "block";
  }
}

function setBlackInfoButton()
{
  if(localStorage.getItem("version") == "3.4.2") {
    document.getElementById("info-img").src = "assets/infoBlack.png";
    document.getElementById("update-bubble").style.display = "none";
  }
  else {
    document.getElementById("info-img").src = "assets/infoBlackAlert.png";
    document.getElementById("update-bubble").style.display = "block";
  }
}

function loadDarkOrLightTheme()
{
    var savedTheme = localStorage.getItem("colorTheme");
    if(savedTheme == "light" || savedTheme == "rainbowl" || savedTheme == "sky")
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

function showTimeSelectorIf(isChecked)
{
  if (isChecked) {
      document.getElementById("time-input").style.display = "block";
  } else {
      document.getElementById("time-input").style.display = "none";
  }
}

function showCountdownIf(isChecked)
{
  if (isChecked) {
      document.getElementById("countdown-container").style.display = "block";
  } else {
      document.getElementById("countdown-container").style.display = "none";
  }
}

function showCountdownTimeSelectorIf(isChecked)
{
  if (isChecked) {
      document.getElementById("countdownTime-input").style.display = "block";
  } else {
      document.getElementById("countdownTime-input").style.display = "none";
  }
}

function showSpecificTimeSettingsIf(isChecked)
{
  if (isChecked) {
      document.getElementById("specific-container").style.display = "block";
      document.getElementById("survey-container").style.display = "none";
      loadCountdownDate();
      loadCountdownTime();

  } else {
      document.getElementById("specific-container").style.display = "none";
      document.getElementById("survey-container").style.display = "block";
  }
}

