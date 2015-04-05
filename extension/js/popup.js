$('#inline-popup').magnificPopup({
  removalDelay: 800,
  callbacks: {
    beforeOpen: function() {
       this.st.mainClass = this.st.el.attr('data-effect');
    }
  },
  closeBtnInside: false,
  modal: false,
  midClick: true
});


function infoButtonPressed()
{
  if(localStorage.getItem("dob")===null)
  {
    setModalPopup();
    setButtonPressed(2);
  }
  //UPDATE WHEN REVVING VERSIONS
  else if(localStorage.getItem("version")=="3.2.0")
  {
    setButtonPressed(0);
  }
  else
  {
    setButtonPressed(1);
    document.getElementById("update-bubble").style.display = "none";
    localStorage.setItem("version", "3.2.0");
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

function setModalPopup()
{
  $('#inline-popup').magnificPopup({
    removalDelay: 800,
    callbacks: {
      beforeOpen: function() {
         this.st.mainClass = this.st.el.attr('data-effect');
      }
    },
    closeBtnInside: false,
    modal: true,
    midClick: true
  });
}

$('#info-button').click(function()
{
  infoButtonPressed();
});

$("#about-button").click(function()
{
  if(localStorage.getItem("dob")===null)
  {
    setButtonPressed(2);
  }
  else
  {
    setButtonPressed(0);
  }
});

$("#updates-button").click(function()
{
  if(localStorage.getItem("dob")===null)
  {
    setButtonPressed(2);
  }
  else
  {
    setButtonPressed(1);
  }
});

$("#settings-button").click(function()
{
  setButtonPressed(2);
});

function setButtonPressed(button)
{
  var updatesButton = document.querySelector("#updates-button");
  var aboutButton = document.querySelector("#about-button");
  var settingsButton = document.querySelector("#settings-button");
  var popupBody = document.querySelector('#popup-body');
  if (button == 0)
  {
    popupBody.innerHTML = window.app.getTemplateScript('about-popup')();
    aboutButton.className = "pressed-button";
    updatesButton.className = "default-button";
    settingsButton.className = "default-button";
  }
  else if (button == 1)
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

    setupSettings(window.app.dob, window.app.dobMinutes);
  }
  if(localStorage.getItem("dob")===null)
  {
    $("#cancel-button").toggle();
  }
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

function loadCheckBoxes()
{
  var timeCheckbox = document.querySelector('input[id=time-checkbox]');
  if (localStorage.getItem("dobTimeSet") == "YES")
  {
    timeCheckbox.checked = true;
  }
  showTimeSelectorIf(timeCheckbox.checked);

  timeCheckbox.addEventListener('change', function () {
    showTimeSelectorIf(timeCheckbox.checked);
  });

  var hideAgeCheckbox = document.querySelector('input[id=hideAge-checkbox]');
  if (localStorage.getItem("hideAge") == "YES")
  {
    hideAgeCheckbox.checked = true;
  }

  hideAgeCheckbox.addEventListener('change', function () {
    var hideCirclesCheckbox = document.querySelector('input[id=hideCircles-checkbox]');
    if(hideCirclesCheckbox.checked == true)
    {
      hideCirclesCheckbox.checked = false;
    }
  });

  var hideCirclesCheckbox = document.querySelector('input[id=hideCircles-checkbox]');
  if (localStorage.getItem("hideCircles") == "YES")
  {
    hideCirclesCheckbox.checked = true;
  }

  hideCirclesCheckbox.addEventListener('change', function () {
    var hideAgeCheckbox = document.querySelector('input[id=hideAge-checkbox]');
    if(hideAgeCheckbox.checked == true)
    {
      hideAgeCheckbox.checked = false;
    }
  });

  var swapTimerCheckbox = document.querySelector('input[id=swapTimer-checkbox]');
  if (localStorage.getItem("swap") == "YES")
  {
    swapTimerCheckbox.checked = true;
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
  if(localStorage.getItem("version") == "3.2.0") {
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
  if(localStorage.getItem("version") == "3.2.0") {
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

function showTimeSelectorIf(isChecked) {
  if (isChecked) {
      document.getElementById("time-input").style.display = "block";
  } else {
      document.getElementById("time-input").style.display = "none";
  }
}

