# VHD Detection System

<div align="center">
  <h3>AI-Powered Valvular Heart Disease Detection</h3>
  <p>Detect heart valve abnormalities through heart sound analysis using Deep Learning</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black?logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
</div>

---

## About The Project

**VHD Detection System** is a web application that helps detect potential Valvular Heart Disease (VHD) through heart sound analysis using a Deep Learning CNN model. This application aims to raise public awareness about VHD and provide an easily accessible early screening tool.

### Key Features

- **Heart Sound Analysis** - Upload heart sound recordings for automatic detection
- **AI-Powered** - Uses a CNN model trained on thousands of phonocardiogram samples
- **Comprehensive Results** - Displays probabilities for 5 different conditions
- **Responsive** - Optimal display on desktop and mobile
- **Health Check** - Automatic API availability verification before use

### Detectable Conditions

| Code | Condition | Description |
|------|-----------|-------------|
| **AS** | Aortic Stenosis | Narrowing of the aortic valve |
| **MR** | Mitral Regurgitation | Leakage of the mitral valve |
| **MS** | Mitral Stenosis | Narrowing of the mitral valve |
| **MVP** | Mitral Valve Prolapse | Valve flaps bulge into the atrium |
| **N** | Normal | No valve abnormality detected |

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **npm** or **yarn**
- **VHD Classification API** running at `http://localhost:8001` (for demo feature)
  - Repository: [https://github.com/raflidev/vhd_model](https://github.com/raflidev/vhd_model)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/raflidev/vhd_web_system.git
   cd vhd_web_system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open browser**

   ```text
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```text
vhd_web_system/
├── app/
│   ├── components/          # Reusable React components
│   │   ├── ComparisonChart.tsx
│   │   ├── ECGLine.tsx
│   │   ├── GSAPAnimations.tsx
│   │   ├── SectionTitle.tsx
│   │   ├── SoundWave.tsx
│   │   ├── Timeline.tsx
│   │   └── ValveCard.tsx
│   ├── demo/
│   │   └── page.tsx         # Heart sound analysis demo page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Main application layout
│   └── page.tsx             # Home page
├── public/                  # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Technologies Used

| Technology | Version | Description |
|------------|---------|-------------|
| [Next.js](https://nextjs.org/) | 16.1.2 | React framework with App Router |
| [React](https://reactjs.org/) | 19.2.3 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [TailwindCSS](https://tailwindcss.com/) | 4.x | Utility-first CSS |
| [Framer Motion](https://www.framer.com/motion/) | 12.x | React animations |
| [GSAP](https://greensock.com/gsap/) | 3.14.2 | Advanced animations |

---

## API Endpoints

This application requires a backend API to function fully. Here are the endpoints used:

### Health Check

```http
GET http://localhost:8001/health
```

**Response:**

```json
{
  "status": "healthy",
  "model_loaded": true,
  "service": "VHD Audio Classification API",
  "version": "1.0.0"
}
```

### Predict

```http
POST http://localhost:8001/predict
Content-Type: multipart/form-data

file: <audio_file>
```

**Response:**

```json
{
  "filename": "heart_sound.wav",
  "prediction": "N",
  "class_id": 4,
  "confidence": 0.95,
  "probabilities": {
    "AS": 0.01,
    "MR": 0.02,
    "MS": 0.01,
    "MVP": 0.01,
    "N": 0.95
  }
}
```

---

### Home Page

Educational page about Valvular Heart Disease with comprehensive information about:

- What is VHD
- Risk factors
- Symptoms
- Importance of early detection

### Demo Page

Interface for uploading and analyzing heart sound audio files with:

- Drag & drop upload
- Real-time health check
- Prediction result visualization
- Probability bar for each condition

---

## Medical Disclaimer

> **Important:** This application is for educational and initial screening purposes only. The analysis results **do not replace professional medical diagnosis**. Always consult a qualified doctor or healthcare professional for proper evaluation and diagnosis.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run development server |
| `npm run build` | Build application for production |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Contributing

Contributions are greatly appreciated! To contribute:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Contact

**Raflidev** - [@raflidev](https://github.com/raflidev)

Project Link: [https://github.com/raflidev/vhd_web_system](https://github.com/raflidev/vhd_web_system)

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made for heart health awareness</p>
  <p>© 2026 Raflidev. All rights reserved.</p>
</div>
