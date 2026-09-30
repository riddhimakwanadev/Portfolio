// Init animations
AOS.init();

// Typewriter text animation (hero subtitle)
(function () {
  var el = document.getElementById("typeText");
  if (!el) return;

  var text = "Frontend Developer & Web Designer";
  var i = 0;
  var deleting = false;

  function tick() {
    if (!deleting) {
      i++;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        deleting = true;
        setTimeout(tick, 2400);
        return;
      }
      setTimeout(tick, 70);
    } else {
      i--;
      el.textContent = text.slice(0, i);
      if (i <= 0) {
        deleting = false;
        setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, 35);
    }
  }

  tick();
})();

// Active nav link (scroll spy)
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  function updateActiveLink() {
    var probe = window.scrollY + 180;
    var current = null;

    // document-order sections: pick the last one that starts above the probe line
    sections
      .slice()
      .sort(function (a, b) { return a.offsetTop - b.offsetTop; })
      .forEach(function (section) {
        if (section.offsetTop <= probe) current = section;
      });

    if (!current) current = sections[0];

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      current = sections[sections.length - 1];
    }

    if (current) setActive(current.id);
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
  window.addEventListener("load", updateActiveLink);

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      setActive(link.getAttribute("href").slice(1));
    });
  });

  updateActiveLink();
})();

// EmailJS init
emailjs.init("TKaaoQG7mCRiv7PHV");

// Custom dropdowns
document.querySelectorAll(".cs-dropdown").forEach(function (dropdown) {
  var control = dropdown.querySelector(".cs-control");
  var placeholder = dropdown.querySelector(".cs-placeholder");
  var nativeSelect = dropdown.querySelector(".cs-native");
  var options = dropdown.querySelectorAll(".cs-option");
  var defaultText = placeholder.textContent;

  function closeDropdown() {
    dropdown.classList.remove("open");
    control.setAttribute("aria-expanded", "false");
  }

  function openDropdown() {
    document.querySelectorAll(".cs-dropdown.open").forEach(function (other) {
      if (other !== dropdown) {
        other.classList.remove("open");
        other.querySelector(".cs-control").setAttribute("aria-expanded", "false");
      }
    });
    dropdown.classList.add("open");
    control.setAttribute("aria-expanded", "true");
  }

  control.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.contains("open") ? closeDropdown() : openDropdown();
  });

  control.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      dropdown.classList.contains("open") ? closeDropdown() : openDropdown();
    }
    if (e.key === "Escape") closeDropdown();
  });

  options.forEach(function (option) {
    option.addEventListener("click", function (e) {
      e.stopPropagation();
      options.forEach(function (o) { o.classList.remove("selected"); });
      option.classList.add("selected");
      placeholder.textContent = option.dataset.value;
      placeholder.classList.add("is-selected");
      nativeSelect.value = option.dataset.value;
      closeDropdown();
    });
  });

  dropdown._reset = function () {
    options.forEach(function (o) { o.classList.remove("selected"); });
    placeholder.textContent = defaultText;
    placeholder.classList.remove("is-selected");
    nativeSelect.selectedIndex = 0;
    closeDropdown();
  };
});

document.addEventListener("click", function () {
  document.querySelectorAll(".cs-dropdown.open").forEach(function (dropdown) {
    dropdown.classList.remove("open");
    dropdown.querySelector(".cs-control").setAttribute("aria-expanded", "false");
  });
});

// Projects slider
(function () {
  var slider = document.querySelector(".projects-slider");
  if (!slider) return;

  var track = slider.querySelector(".slider-track");
  var slides = slider.querySelectorAll(".slider-slide");
  var dotsWrap = slider.querySelector(".slider-dots");
  var prev = slider.querySelector(".slider-prev");
  var next = slider.querySelector(".slider-next");
  var total = slides.length;
  var index = 0;
  var timer = null;
  var perView = 1;
  var maxIndex = 0;

  function calcPerView() {
    return window.innerWidth >= 768 ? 2 : 1;
  }

  function renderDots() {
    dotsWrap.innerHTML = "";
    for (var i = 0; i <= maxIndex; i++) {
      (function (i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
          restart();
        });
        dotsWrap.appendChild(dot);
      })(i);
    }
    paintDots();
  }

  function paintDots() {
    var dots = dotsWrap.querySelectorAll("button");
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle("active", d === index);
    }
  }

  function goTo(i) {
    index = ((i % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
    track.style.transform = "translateX(" + (-index * (100 / perView)) + "%)";
    paintDots();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(index + 1); }, 5000);
  }

  function sync() {
    var newPerView = calcPerView();
    var newMax = total - newPerView;
    if (newPerView !== perView || newMax !== maxIndex) {
      perView = newPerView;
      maxIndex = newMax;
      if (index > maxIndex) index = maxIndex;
      renderDots();
      goTo(index);
    }
  }

  prev.addEventListener("click", function () { goTo(index - 1); restart(); });
  next.addEventListener("click", function () { goTo(index + 1); restart(); });

  slider.addEventListener("mouseenter", function () { clearInterval(timer); });
  slider.addEventListener("mouseleave", restart);

  window.addEventListener("resize", sync);

  // swipe
  var startX = 0;
  slider.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    clearInterval(timer);
  }, { passive: true });

  slider.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) goTo(dx < 0 ? index + 1 : index - 1);
    restart();
  });

  perView = calcPerView();
  maxIndex = total - perView;
  renderDots();
  goTo(0);
  restart();
})();

// Form submit
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm("service_xoxe884", "template_2c43036", this)
    .then(() => {
      document.getElementById("formMsg").innerText = "Message sent successfully!";
      this.reset();
      document.querySelectorAll(".cs-dropdown").forEach(function (d) { d._reset(); });
    })
    .catch(() => {
      document.getElementById("formMsg").innerText = "Error sending message!";
    });
});