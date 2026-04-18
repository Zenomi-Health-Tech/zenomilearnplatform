# SCORM Content Structure - ZenomiLearn

Place your SCORM zip files in the corresponding week folder.

## Naming Convention

```
public/scorm/
├── week-1/
│   └── week-1.zip      ← Sleep Hygiene & Nutrition
├── week-2/
│   └── week-2.zip      ← What Are Emotions?
├── week-3/
│   └── week-3.zip      ← What is Empathy?
├── week-4/
│   └── week-4.zip      ← Self-Awareness
├── week-5/
│   └── week-5.zip      ← Self-Regulation
└── week-6/
    └── week-6.zip      ← Building Resilience
```

## How it works

1. Drop the SCORM `.zip` file into the matching `week-X/` folder
2. The backend (when connected) will unzip and serve the content
3. The SCORM player on the frontend will load it via iframe from `/scorm/week-X/index.html`

## File format

- Each zip should be a standard SCORM 1.2 or SCORM 2004 package
- Must contain `imsmanifest.xml` at the root of the zip
