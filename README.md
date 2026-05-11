# Sumo AI (CV Creator AI)

A web app that lets you fill in your resume data, choose a template, preview it, and download a PDF.

## Features

- Multiple CV templates (Minimal, Corporate, Creative, Card, ATS)
- Real-time preview
- PDF download via `html2canvas` + `jsPDF`

## Local development

### 1) Install dependencies

```bash
npm install
```

### 2) Run the dev server

```bash
npm run dev
```

Vite will start on `http://localhost:8080/`.

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Testing

```bash
npm run test
```

## Notes

### PDF rendering alignment

The PDF generation uses a hidden, full-scale render of the selected template.
To avoid overlap/offset issues during download, the hidden preview container is rendered at the correct A4 size (210mm × 297mm) with `overflow: hidden`.

## License

SUMO AI
