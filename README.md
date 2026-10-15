# Nonso's portfolio

A three-page portfolio: Home, Projects and Contact. Plain HTML, CSS and JavaScript, so there is nothing to install.

Open `index.html` in your browser to view it.

## Folder layout

```
index.html      Home (hero, about, education, project cards)
projects.html   All projects: description + every screenshot
contact.html    Contact form with JavaScript validation
style.css       All the styling (colours and fonts are at the top)
script.js       Menu, screenshot viewer, form validation
fonts/          Bebas Neue and Inter, included so the site works offline
images/         Project screenshots and the profile placeholder
```

## Finding your way around the code

Every file starts with a comment that lists its sections, and each section has a banner you can search for with Ctrl+F.

- **HTML:** each section has a boxed banner in capitals and a closing line, for example `HERO`, `PROJECT 2: MUSICA` and `END OF PROJECT 2`. Search for those words with Ctrl+F. Search `TODO` to find every place to add your own details.
- **CSS:** search for the number or name in the table of contents at the top of `style.css`, for example `7. HOME: HERO` or `15. CONTACT PAGE`.
- **JavaScript:** search for `5b. THE RULES` to change what the contact form accepts.

## Things to change first

1. **Your photo.** Put it in `images/` and, in `index.html`, change
   `src="images/profile-placeholder.svg"` to your file name (for example `images/profile.jpg`).
   A portrait photo with a 3:4 shape works best.
2. **Your email.** In `contact.html`, change `you@example.com` (it appears twice in the same line).
3. **Social links.** They are on the Contact page only. Replace each `href="#"` with your real link,
   or delete the links you don't use.
4. **About and Education text.** Edit it in `index.html` so it says what you want visitors to read.
5. **Surname.** Add it to the `<h1>` in `index.html` if you want your full name in the hero.
6. **Project descriptions.** Edit the paragraph under each project title in `projects.html`.

## Adding a new project

In `projects.html`, copy one whole `<section class="project">…</section>` block, change the id,
title, description and image paths, then add a matching jump button (the "pills" under the page title) and a card in `index.html`.

## How the contact form works

`script.js` checks every field before anything is sent:

| Field | Rule |
| --- | --- |
| Name | Required, at least 2 characters, letters/spaces/hyphens/apostrophes only |
| Email | Required, must look like `name@example.com` |
| Interested in | Required, one option must be chosen |
| Message | Required, 20 to 1000 characters, with a live counter |

Errors appear under each field as you leave it, and the first problem is focused when you press Send.

A plain website cannot send email by itself, so there are two options:

- **Default (no setup):** after a valid submit, the visitor's email app opens with the message already written.
- **Form service (recommended once live):** create a free form at Formspree or Web3Forms, then paste its URL into
  `data-endpoint=""` on the `<form>` tag in `contact.html`. Messages are then sent to your inbox without opening an email app.
  (Web3Forms also needs a hidden `access_key` input inside the form; its docs show the exact line.)

## Putting it online (free)

Drag the whole folder onto Netlify Drop, or push it to a GitHub repository and turn on GitHub Pages.
