// Init animations
AOS.init();

// EmailJS init
emailjs.init("TKaaoQG7mCRiv7PHV");

// Form submit
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm("service_xoxe884", "template_2c43036", this)
    .then(() => {
      document.getElementById("formMsg").innerText = "Message sent successfully!";
      this.reset();
    })
    .catch(() => {
      document.getElementById("formMsg").innerText = "Error sending message!";
    });
});