// Footer year: fills every <span data-year> with the current year.
document.querySelectorAll("[data-year]").forEach(function (span) {
  span.textContent = new Date().getFullYear();
});


// Mobile menu: the button toggles the "open" class that style.css uses to show the menu.
const menuButton = document.querySelector(".nav-toggle");
const menu = document.getElementById("site-nav");

function setMenu(open) {
  menu.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", open);
}

menuButton.addEventListener("click", function () {
  setMenu(!menu.classList.contains("open"));
});

menu.addEventListener("click", function (event) {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") setMenu(false);
});


// Contact form (contact.html only).
const contactForm = document.getElementById("contact-form");
if (contactForm) setUpContactForm(contactForm);

function setUpContactForm(form) {
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  const status = document.getElementById("form-status");
  const successBox = document.getElementById("form-success");
  const message = document.getElementById("message");
  const counter = document.getElementById("message-counter");

  // Returns an error message, or "" if the field is fine.
  // The limits come from the HTML attributes (minlength, type="email").
  function getError(field) {
    const value = field.value.trim();
    if (!value) return "This field is required.";
    if (value.length < field.minLength) return "Please write at least " + field.minLength + " characters.";
    if (field.validity.typeMismatch) return "Enter a valid email, like name@example.com.";
    return "";
  }

  // Shows or clears the error under a field. Returns true if the field is valid.
  function check(field) {
    const error = getError(field);
    field.closest(".field").classList.toggle("invalid", error !== "");
    field.setAttribute("aria-invalid", error !== "");
    document.getElementById(field.id + "-error").textContent = error;
    return error === "";
  }

  function updateCounter() {
    counter.textContent = message.value.length + " / " + message.maxLength;
  }

  // Check a field when the visitor leaves it. Once it shows an error, re-check as they type.
  form.addEventListener("focusout", function (event) {
    if (fields.includes(event.target)) check(event.target);
  });
  form.addEventListener("input", function (event) {
    if (event.target.closest(".invalid")) check(event.target);
  });
  message.addEventListener("input", updateCounter);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const invalid = fields.filter(function (field) { return !check(field); });
    if (invalid.length > 0) {
      invalid[0].focus();
      return;
    }

    const endpoint = form.dataset.endpoint.trim();
    if (endpoint) {
      await sendToService(endpoint);
    } else {
      openEmailApp();
    }
  });

  document.getElementById("send-another").addEventListener("click", function () {
    form.reset();
    updateCounter();
    successBox.hidden = true;
    form.hidden = false;
    fields[0].focus();
  });

  function showSuccess(text) {
    document.getElementById("success-text").textContent = text;
    form.hidden = true;
    successBox.hidden = false;
    successBox.focus();
  }

  // Option A: send through a form service (Formspree, Web3Forms...).
  // Used only when data-endpoint on the <form> in contact.html has a URL.
  async function sendToService(endpoint) {
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Sending...";
    status.textContent = "";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Rejected");
      showSuccess("Thanks! Your message has been sent. I'll reply to your email soon.");
    } catch (error) {
      status.textContent = "Sorry, something went wrong. Please try again or email me directly.";
    }

    button.disabled = false;
    button.textContent = "Send message";
  }

  // Option B (default): open the visitor's email app with the message filled in.
  // Your address is read from the email link on the Contact page.
  function openEmailApp() {
    const value = function (id) { return document.getElementById(id).value.trim(); };
    const myEmail = document.getElementById("email-link").textContent.trim();
    const subject = "Portfolio enquiry (" + value("interest") + ") from " + value("name");
    const body = value("message") + "\n\nName: " + value("name") + "\nEmail: " + value("email");

    showSuccess("Your email app should open with your message ready to send. If nothing opens, email me directly at " + myEmail + ".");
    window.location.href = "mailto:" + myEmail +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }
}
