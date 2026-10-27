# Nonso's portfolio

A three-page portfolio: Home, Projects and Contact. Plain HTML, CSS and JavaScript, so there is nothing to install.

Open `index.html` in your browser to view it.

## Folder layout

```
index.html      Home (hero, about, education, project cards)
projects.html   All projects: description + every screenshot
contact.html    Contact form
style.css       All the styling (colours and fonts are at the top, in :root)
script.js       Footer year, mobile menu, contact form validation
images/         Project screenshots and profile photos
```

## Finding your way around the code

- **HTML:** each section has a short comment above it. Search for `TODO` to find what still needs your details.
- **CSS:** each section starts with a heading comment such as `Home: hero` or `Contact page`. Search for it with Ctrl+F.
- **JavaScript:** `script.js` has three parts: footer year, mobile menu and contact form.

## Things to change first

1. **Your photo.** Replace `images/profile_pic.jpg`, or change the `src` in the hero of `index.html`.
   A portrait photo with a 3:4 shape works best.
2. **Your email.** In `contact.html`, replace the example address. It appears twice in the same line.
3. **Social links.** They are in the "Elsewhere" line on the Contact page. Delete the links you don't use.
4. **About and Education text.** Edit it in `index.html`.
5. **Surname.** Add it to the `<h1>` in `index.html` if you want your full name in the hero.
6. **Project descriptions.** Edit the paragraph under each project title in `projects.html`.

## Adding a new project

In `projects.html`, copy one whole `<section class="project">…</section>` block, change the id,
title, description and image paths, then add a matching jump link (the "pills" under the page title)
and a card in `index.html`.

## How the contact form works

`script.js` checks every field before anything is sent. The limits are attributes on each field in `contact.html`:

| Field | Rule |
| --- | --- |
| Name | Required, at least 2 characters (`minlength="2"`) |
| Email | Required, must look like `name@example.com` (`type="email"`) |
| Interested in | Required, one option must be chosen |
| Message | Required, 20 to 1000 characters (`minlength` and `maxlength`), with a live counter |

Errors appear under each field when you leave it, and the first problem is focused when you press Send.

A plain website cannot send email by itself, so there are two options:

- **Default (no setup):** after a valid submit, the visitor's email app opens with the message already written.
- **Form service (recommended once live):** create a free form at Formspree or Web3Forms, then paste its URL into
  `data-endpoint=""` on the `<form>` tag in `contact.html`. Messages are then sent to your inbox without opening an email app.
  (Web3Forms also needs a hidden `access_key` input inside the form; its docs show the exact line.)

## Putting it online (free)

Drag the whole folder onto Netlify Drop, or push it to a GitHub repository and turn on GitHub Pages.
