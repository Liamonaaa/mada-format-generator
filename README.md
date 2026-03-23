# mada-format-generator

A fully static Hebrew RTL website for generating copy-ready text formats for MDA-related forms.

## Features

- Plain HTML, CSS, and JavaScript
- Fully static and GitHub Pages friendly
- Hebrew UI with full RTL layout
- Three built-in format generators
- Live output updates while typing
- Copy and quick-copy actions
- Local storage persistence
- Required-field validation
- Mobile-friendly polished interface
- GitHub Actions workflow for GitHub Pages deployment

## Project Structure

```text
.
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   |-- icons/
|   |   `-- favicon.svg
|   `-- js/
|       `-- app.js
|-- .gitignore
|-- index.html
`-- README.md
```

## Local Usage

1. Clone the repository.
2. Open `index.html` directly in a browser, or serve the folder with any static file server.

## Deployment

### GitHub Pages via Actions

The repository includes `.github/workflows/deploy.yml`, which deploys the static site automatically on every push to the `main` branch.

Recommended repository settings:

1. Go to `Settings > Pages`.
2. Set `Source` to `GitHub Actions`.
3. Push to `main`.

### Manual GitHub Pages

If you do not want to use Actions:

1. Push the repository to GitHub.
2. Enable GitHub Pages for the repository.
3. Serve the root directory as the published source.

## Customization

All visible UI labels and generated output are defined in `assets/js/app.js`.

## License

This project is provided as-is for personal or community use.
