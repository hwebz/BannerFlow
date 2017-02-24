
(function() {

  // /******************************************/
  // var BannerFlow = {
  //   settings: {
  //       actionURL: '//bannerflow.us4.list-manage.com/subscribe/post?u=36b6ac1d6572c45165d44bd51&id=dec680da11',
  //       showAllFields: false,
  //       showRequiredFieldIndicators: true,
  //       signUpColor: '#FFFFFF',
  //       signUpBackground: '#777777',
  //       signUpFontSize: 15
  //     },
  //   text: '<div>Mailchimp Mailing List</div><div>indicate required fields</div><div>Email</div><div>Subscribe to Newsletter</div>'
  // };

  // /******************************************/

  // function updateMailchimp() {
  //     var formAction = document.getElementById("mc-embedded-subscribe-form");
  //     var optionalFields = document.getElementsByClassName("optional-fields");
  //     var requiredFields = document.getElementsByClassName("indicates-required");
  //     var astericksFields = document.getElementsByClassName("asterisk");
  //     var signUpBtn = document.getElementById("mc-embedded-subscribe");
      
  //     // Action URL
  //     formAction.setAttribute("action", BannerFlow.settings.actionURL);
      
  //     // Show all fields
  //     if (BannerFlow.settings.showAllFields) {
  //         for (var i = 0; i < optionalFields.length; i++) {
  //             optionalFields[i].style.display = "block";
  //         }
  //     } else {
  //         for (var i = 0; i < optionalFields.length; i++) {
  //             optionalFields[i].style.display = "none";
  //         }
  //     }
      
  //     // Show required fields indicator
  //     if (BannerFlow.settings.showRequiredFieldIndicators) {
  //         for (var i = 0; i < requiredFields.length; i++) {
  //             requiredFields[i].style.display = "block";
  //         }
  //         for (var i = 0; i < astericksFields.length; i++) {
  //             astericksFields[i].style.display = "inline-block";
  //         }
  //     } else {
  //         for (var i = 0; i < requiredFields.length; i++) {
  //             requiredFields[i].style.display = "none";
  //         }
  //         for (var i = 0; i < astericksFields.length; i++) {
  //             astericksFields[i].style.display = "none";
  //         }
  //     }
      
  //     // Sign up button style
  //     signUpBtn.style.backgroundColor = BannerFlow.settings.signUpBackground;
  //     signUpBtn.style.color = BannerFlow.settings.signUpColor;
  //     signUpBtn.style.fontSize = BannerFlow.settings.signUpFontSize + "px";
  // }

  // function updateLabelText() {
  //     var formTitle = document.getElementById("formTitle");
  //     var requiredTitle = document.getElementById("required-text");
  //     var emailTitle = document.getElementById("emailTitle");
  //     var firstNameTitle = document.getElementById("firstNameTitle");
  //     var lastNameTitle = document.getElementById("lastNameTitle");
  //     var submitTitle = document.getElementById("mc-embedded-subscribe");
  //     var userText = (BannerFlow.text != undefined && BannerFlow.text != "") ? BannerFlow.text.split("</div><div>") : "";
  //     var txtForm, txtRequired, txtEmail, txtFirstName, txtLastName, txtSubmit;
  //     if (Array.isArray(userText)) {
  //         txtForm = userText[0] ? userText[0].replace("<div>", "") : "";
  //         txtRequired = userText[1] ? userText[1].replace("</div>", "") : "";
  //         txtEmail = userText[2] ? userText[2].replace("</div>", "") : "";
  //         txtFirstName = userText[3] ? userText[3].replace("</div>", "") : "";
  //         txtLastName = userText[4] ? userText[4].replace("</div>", "") : "";
  //         txtSubmit = userText[userText.length - 1] ? userText[userText.length - 1].replace("</div>", "") : "";
  //     }
      
  //     formTitle.innerHTML = txtForm;
  //     requiredTitle.innerHTML = txtRequired;
  //     emailTitle.innerHTML = txtEmail;
  //     firstNameTitle.innerHTML = txtFirstName;
  //     lastNameTitle.innerHTML = txtLastName;
  //     submitTitle.value = txtSubmit;
  // }

  // updateMailchimp();
  // updateLabelText();

  function getFont(family) {
    family        = (family || "").replace(/[^A-Za-z]/g, '').toLowerCase();   
    var sans      = 'Helvetica, Arial, "Microsoft YaHei New", "Microsoft Yahei", "微软雅黑", 宋体, SimSun, STXihei, "华文细黑", sans-serif';
    var serif     = 'Georgia, "Times New Roman", "FangSong", "仿宋", STFangSong, "华文仿宋", serif';
    var fonts     = {
        helvetica : sans,
        verdana   : "Verdana, Geneva," + sans,
        lucida    : "Lucida Sans Unicode, Lucida Grande," + sans,
        tahoma    : "Tahoma, Geneva," + sans,
        trebuchet : "Trebuchet MS," + sans,
        impact    : "Impact, Charcoal, Arial Black," + sans,
        comicsans : "Comic Sans MS, Comic Sans, cursive," + sans,
        georgia   : serif,
        palatino  : "Palatino Linotype, Book Antiqua, Palatino," + serif,
        times     : "Times New Roman, Times," + serif,
        courier   : "Courier New, Courier, monospace, Times," + serif
    }
    var font      = fonts[family] || fonts.helvetica;
    return font;
  }

  function updateMailchimp() {
    var formAction = document.getElementById("mc-embedded-subscribe-form");
      var optionalFields = document.getElementsByClassName("optional-fields");
      var requiredFields = document.getElementsByClassName("indicates-required");
      var astericksFields = document.getElementsByClassName("asterisk");
      var signUpBtn = document.getElementById("mc-embedded-subscribe");
      var lbl = document.getElementsByTagName("label");
      var textColor = BannerFlow.settings.textColor;
      var fontFamily = BannerFlow.settings.fontFamily;
      var starColor = BannerFlow.settings.starColor;
      
      // Action URL
      formAction.setAttribute("action", BannerFlow.settings.actionURL);
      
      // Show all fields
      if (BannerFlow.settings.showAllFields.toLowerCase() == "full") {
          for (var i = 0; i < optionalFields.length; i++) {
              optionalFields[i].style.display = "block";
          }
      } else {
          for (var i = 0; i < optionalFields.length; i++) {
              optionalFields[i].style.display = "none";
          }
      }
      
      // Show required fields indicator
      if (BannerFlow.settings.showRequiredFieldIndicators) {
          for (var i = 0; i < requiredFields.length; i++) {
              requiredFields[i].style.display = "block";
          }
          for (var i = 0; i < astericksFields.length; i++) {
              astericksFields[i].style.display = "inline-block";
          }
      } else {
          for (var i = 0; i < requiredFields.length; i++) {
              requiredFields[i].style.display = "none";
          }
          for (var i = 0; i < astericksFields.length; i++) {
              astericksFields[i].style.display = "none";
          }
      }
      
      // Change label text color
      for (var i = 0; i < requiredFields.length; i++) {
          requiredFields[i].style.color = textColor;
      }
      for (var i = 0; i < lbl.length; i++) {
          lbl[i].style.color = textColor;
      }
      
      // Change font family of whole form
      formAction.style.fontFamily = getFont(fontFamily.toLowerCase());
      
      // Change astericks color
      for (var i = 0; i < astericksFields.length; i++) {
          astericksFields[i].style.color = starColor;
      }
      
      // Sign up button style
      signUpBtn.style.backgroundColor = BannerFlow.settings.signUpBackground;
      signUpBtn.style.color = BannerFlow.settings.signUpColor;
      signUpBtn.style.fontSize = BannerFlow.settings.signUpFontSize + "px";
  }

  function updateLabelText() {
      var formTitle = document.getElementById("formTitle");
      var requiredTitle = document.getElementById("required-text");
      var emailTitle = document.getElementById("emailTitle");
      var firstNameTitle = document.getElementById("firstNameTitle");
      var lastNameTitle = document.getElementById("lastNameTitle");
      var submitTitle = document.getElementById("mc-embedded-subscribe");
      var userText = (BannerFlow.text != undefined && BannerFlow.text != "") ? BannerFlow.text.split("</div><div>") : "";
      var txtForm, txtRequired, txtEmail, txtFirstName, txtLastName, txtSubmit;
      if (Array.isArray(userText)) {
          txtForm = userText[0] ? userText[0].replace("<div>", "") : "";
          txtRequired = userText[1] ? userText[1].replace("</div>", "") : "";
          txtEmail = userText[2] ? userText[2].replace("</div>", "") : "";
          txtFirstName = userText[3] ? userText[3].replace("</div>", "") : "";
          txtLastName = userText[4] ? userText[4].replace("</div>", "") : "";
          txtSubmit = userText[userText.length - 1] ? userText[userText.length - 1].replace("</div>", "") : "";
      }
      
      formTitle.innerHTML = txtForm;
      requiredTitle.innerHTML = txtRequired;
      emailTitle.innerHTML = txtEmail;
      firstNameTitle.innerHTML = txtFirstName;
      lastNameTitle.innerHTML = txtLastName;
      submitTitle.value = txtSubmit;
  }

  BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, updateMailchimp);
  BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, updateLabelText);
  BannerFlow.addEventListener(BannerFlow.INIT, updateLabelText);
  BannerFlow.addEventListener(BannerFlow.RESIZE, updateLabelText);
})();