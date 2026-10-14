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

// Navbar: solid bar after scrolling + close mobile menu on link tap
(function () {
  var nav = document.querySelector(".site-nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var collapseEl = document.getElementById("navMenu");
  if (collapseEl) {
    Array.prototype.slice.call(collapseEl.querySelectorAll(".nav-link, .btn"))
      .forEach(function (link) {
        link.addEventListener("click", function () {
          var instance = bootstrap.Collapse.getInstance(collapseEl);
          if (instance && collapseEl.classList.contains("show")) instance.hide();
        });
      });
  }
})();

// EmailJS init
emailjs.init("TKaaoQG7mCRiv7PHV");

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
    })
    .catch(() => {
      document.getElementById("formMsg").innerText = "Error sending message!";
    });
});

// Hero: mouse parallax on background + profile card tilt
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var hero = document.querySelector(".hero");
  var bg = hero && hero.querySelector(".hero-bg");
  var aside = document.querySelector(".hero-aside");
  var card = aside && aside.querySelector(".profile-card");

  if (hero && bg) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      bg.style.transform = "translate3d(" + (x * -20).toFixed(1) + "px, " + (y * -16).toFixed(1) + "px, 0)";
    });
    hero.addEventListener("mouseleave", function () {
      bg.style.transform = "";
    });
  }

  if (aside && card) {
    aside.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "perspective(900px) rotateY(" + (x * 7).toFixed(2) + "deg) rotateX(" + (y * -7).toFixed(2) + "deg)";
    });
    aside.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  }
})();