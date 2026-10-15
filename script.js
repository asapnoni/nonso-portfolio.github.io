/* ======================================================================
   NONSO'S PORTFOLIO  -  script.js
   ======================================================================
   One script shared by all three pages. Each block below only runs if the
   page contains the elements it needs, so nothing breaks on other pages.

   TABLE OF CONTENTS (search for the number)
     1. Helpers                 short names for finding elements
     2. Footer year             writes the current year into the footer
     3. Mobile menu             opens / closes the menu on phones
     4. Screenshot viewer       click a screenshot to enlarge it (Projects page)
     5. Contact form            validation and sending (Contact page)
          5a. Settings and fields
          5b. The rules         <- change what counts as valid here
          5c. Showing errors
          5d. Live checking     (as the visitor types)
          5e. Sending           (what happens after a valid submit)
   ====================================================================== */

(() => {
  "use strict";   // catches common mistakes (like typing a variable name wrongly)


  /* ====================================================================
     1. HELPERS
     $("x")  finds the FIRST element matching the CSS selector "x"
     $$("x") finds ALL matching elements, as a list
     ==================================================================== */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];


  /* ====================================================================
     2. FOOTER YEAR
     Finds every <span data-year> and writes the current year in it,
     so the copyright line never goes out of date.
     ==================================================================== */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));


  /* ====================================================================
     3. MOBILE MENU
     On phones the menu links are hidden. Pressing the three-line button
     adds the class "open" to the menu (style.css section 16 then shows it).
     ==================================================================== */
  const toggle = $(".nav-toggle");   // the three-line button
  const nav = $("#site-nav");        // the menu links

  if (toggle && nav) {
    // Open (true) or close (false) the menu, and tell screen readers about it
    const setMenu = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    // Button pressed: flip between open and closed
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));

    // A menu link was clicked: close the menu
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });

    // Escape key closes the menu and returns focus to the button
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }


  /* ====================================================================
     4. SCREENSHOT VIEWER (LIGHTBOX)   -   Projects page only
     Click a screenshot  ->  it opens large in a dark pop-up.
     Close it with: the X button, the Escape key, or a click on the dark area.
     HTML: <div id="lightbox"> at the bottom of projects.html
     CSS:  style.css section 14 ("Lightbox")
     ==================================================================== */
  const lightbox = $("#lightbox");

  if (lightbox) {
    const bigImage = $("#lightbox-img");                 // the large picture inside the pop-up
    const closeButton = $(".lightbox-close", lightbox);  // the X button
    let lastTrigger = null;                              // remembers which screenshot was clicked

    // Show the pop-up with the chosen image
    const openLightbox = (src, alt, trigger) => {
      lastTrigger = trigger;
      bigImage.src = src;
      bigImage.alt = alt;
      lightbox.hidden = false;                           // remove "hidden" = show it
      document.body.classList.add("no-scroll");          // stop the page scrolling behind it
      closeButton.focus();                               // keyboard focus moves to the X
    };

    // Hide the pop-up again
    const closeLightbox = () => {
      lightbox.hidden = true;
      bigImage.removeAttribute("src");
      document.body.classList.remove("no-scroll");
      if (lastTrigger) lastTrigger.focus();              // give focus back to the screenshot
    };

    // Every screenshot button opens the pop-up when clicked
    $$(".shot-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const img = $("img", button);
        openLightbox(img.currentSrc || img.src, img.alt, button);
      });
    });

    // Clicking anywhere except the picture itself closes it
    lightbox.addEventListener("click", (event) => {
      if (event.target !== bigImage) closeLightbox();
    });

    // Keyboard: Escape closes; Tab is kept on the close button while the pop-up is open
    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.focus();
      }
    });
  }


  /* ====================================================================
     5. CONTACT FORM VALIDATION   -   Contact page only
     "Validation" = checking the form is filled in correctly BEFORE sending.
     HTML: <form id="contact-form"> in contact.html
     CSS:  style.css section 15 (the red error styling)
     ==================================================================== */
  const form = $("#contact-form");

  if (form) {

    /* ------------------------------------------------------------------
       5a. SETTINGS AND FIELDS
       ------------------------------------------------------------------ */
    const MESSAGE_MIN = 20;     // shortest message allowed (characters)
    const MESSAGE_MAX = 1000;   // longest message allowed (characters)

    // The four form controls, found by their name="" in contact.html
    const fields = {
      name: $('[name="name"]', form),
      email: $('[name="email"]', form),
      interest: $('[name="interest"]', form),
      message: $('[name="message"]', form),
    };

    /* ------------------------------------------------------------------
       5b. THE RULES  (CHANGE WHAT COUNTS AS VALID HERE)
       One rule per field. Each rule receives what the visitor typed and
       returns:  ""  when it is fine,  or the error message to show.
       ------------------------------------------------------------------ */
    const rules = {
      // Name: required, 2+ characters, letters only (spaces - ' . allowed)
      name(value) {
        if (!value) return "Please enter your name.";
        if (value.length < 2) return "Your name needs at least 2 characters.";
        if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value))
          return "Use letters only. Spaces, hyphens and apostrophes are fine.";
        return "";
      },

      // Email: required, must look like  something@something.xx
      email(value) {
        if (!value) return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
          return "Enter a valid email address, like name@example.com.";
        return "";
      },

      // Drop-down: an option must be chosen (the first "Choose one" option has an empty value)
      interest(value) {
        return value ? "" : "Please choose what you need help with.";
      },

      // Message: required, between MESSAGE_MIN and MESSAGE_MAX characters
      message(value) {
        if (!value) return "Please write a message.";
        if (value.length < MESSAGE_MIN)
          return `Add a little more detail (${value.length} of ${MESSAGE_MIN} characters minimum).`;
        if (value.length > MESSAGE_MAX) return `Please keep it under ${MESSAGE_MAX} characters.`;
        return "";
      },
    };

    // Other parts of the page this code needs
    const statusBox = $("#form-status");                     // line next to the Send button
    const submitButton = $('button[type="submit"]', form);   // the Send button
    const successBox = $("#form-success");                   // the "Message ready" panel
    const successText = $("#success-text");                  // text inside that panel
    const counter = $("#message-counter");                   // "0 / 1000" counter
    const touched = {};    // remembers which fields the visitor has already visited
    let sending = false;   // true while a message is being sent (stops double-clicks)

    /* ------------------------------------------------------------------
       5c. SHOWING ERRORS
       ------------------------------------------------------------------ */

    // Show (or clear) the error under one field.
    // message = "" clears it. Otherwise the text appears in red under the field.
    const showError = (key, message) => {
      const field = fields[key];
      const wrapper = field.closest(".field");              // the <div class="field"> around it
      $(`#${field.id}-error`).textContent = message;        // e.g. #name-error
      wrapper.classList.toggle("invalid", Boolean(message)); // adds the red border (CSS)
      if (message) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
    };

    // Run one field's rule and show the result.
    // Returns true if the field is valid, false if not.
    const check = (key) => {
      touched[key] = true;
      const message = rules[key](fields[key].value.trim());
      showError(key, message);
      return message === "";
    };

    // Update the "123 / 1000" counter under the message box
    const updateCounter = () => {
      const length = fields.message.value.length;
      counter.textContent = `${length} / ${MESSAGE_MAX}`;
    };

    /* ------------------------------------------------------------------
       5d. LIVE CHECKING  (while the visitor fills in the form)
       ------------------------------------------------------------------ */
    Object.keys(fields).forEach((key) => {
      const field = fields[key];

      // 1) Check a field when the visitor LEAVES it ("blur")
      field.addEventListener("blur", () => check(key));

      // 2) After that, re-check on every keystroke so the error disappears as soon as it's fixed
      const liveEvent = key === "interest" ? "change" : "input";
      field.addEventListener(liveEvent, () => {
        if (touched[key]) check(key);
      });
    });

    fields.message.addEventListener("input", updateCounter);
    updateCounter();

    // Small helpers to show messages next to the Send button
    const setStatus = (text, isError = false) => {
      statusBox.textContent = text;
      statusBox.classList.toggle("error", isError);
    };

    // Hide the form and show the success panel
    const showSuccess = (text) => {
      successText.textContent = text;
      form.hidden = true;
      successBox.hidden = false;
      successBox.focus();
    };

    // "Send another message": clear everything and show the form again
    const resetForm = () => {
      form.reset();
      Object.keys(fields).forEach((key) => {
        touched[key] = false;
        showError(key, "");
      });
      updateCounter();
      setStatus("");
      successBox.hidden = true;
      form.hidden = false;
      fields.name.focus();
    };
    $("#send-another").addEventListener("click", resetForm);

    /* ------------------------------------------------------------------
       5e. SENDING  (runs when the visitor presses "Send message")
       ------------------------------------------------------------------ */
    form.addEventListener("submit", async (event) => {
      event.preventDefault();          // stop the browser's normal form submit
      if (sending) return;             // already sending: ignore extra clicks

      // Step 1: check every field. "invalid" = the list of fields that failed.
      const invalid = Object.keys(fields).filter((key) => !check(key));
      if (invalid.length) {
        setStatus(
          `Please fix ${invalid.length} field${invalid.length > 1 ? "s" : ""} and try again.`,
          true
        );
        fields[invalid[0]].focus();    // jump to the first problem
        return;                        // stop here: nothing is sent
      }

      // Step 2: everything is valid, so send.
      sending = true;
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
      setStatus("");

      try {
        const endpoint = (form.dataset.endpoint || "").trim();   // data-endpoint="" in contact.html

        if (endpoint) {
          // OPTION A: a form service (Formspree, Web3Forms...) was set in data-endpoint.
          const response = await fetch(endpoint, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          });
          if (!response.ok) throw new Error("The form service rejected the message.");
          showSuccess("Thanks! Your message has been sent. I'll reply to your email soon.");
        } else {
          // OPTION B (default): open the visitor's email app with the message filled in.
          // The address comes from the email link on the Contact page (#email-link).
          const myEmail = $("#email-link").textContent.trim();
          const subject = `Portfolio enquiry (${fields.interest.value}) from ${fields.name.value.trim()}`;
          const body =
            `${fields.message.value.trim()}\n\n` +
            `Name: ${fields.name.value.trim()}\nEmail: ${fields.email.value.trim()}`;
          const mailto =
            `mailto:${myEmail}?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

          showSuccess(
            `Your email app should open with your message ready to send. If nothing opens, email me directly at ${myEmail}.`
          );
          window.location.href = mailto;   // this is what opens the email app
        }
      } catch (error) {
        // Something failed (e.g. no internet): keep the form so nothing is lost
        setStatus("Sorry, something went wrong. Please try again or email me directly.", true);
      } finally {
        // Always runs: unlock the button again
        sending = false;
        submitButton.disabled = false;
        submitButton.textContent = "Send message";
      }
    });
  }
})();
