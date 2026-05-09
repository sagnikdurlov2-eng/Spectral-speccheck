# SpecCheck
### AI-Powered Spatial Compliance & Verification System

SpecCheck transforms standard smartphone and laptop cameras into intelligent real-time spatial verification systems using Computer Vision and AI.

It compares digital specifications, layouts, or reference images with real-world environments and automatically detects deviations, misplaced objects, and compliance errors — without requiring expensive sensors or specialized hardware.

---

# 🚀 Inspiration

Industries like construction, manufacturing, warehousing, and interior planning lose billions due to manual inspection errors, incorrect physical execution, and inefficient verification processes.

Existing enterprise-grade inspection systems are:
- expensive,
- hardware-dependent,
- difficult to scale.

We wanted to build a low-cost, AI-powered alternative using only standard RGB cameras and modern computer vision.

---

# 💡 What It Does

SpecCheck:
- Aligns digital layouts with physical environments
- Performs real-time spatial verification
- Detects deviations and incorrect object placements
- Generates compliance scores
- Provides live AI overlay visualization
- Supports accessibility-focused interaction modes

---

# 🧠 Core Features

## ✅ Real-Time AI Overlay
Overlay expected layouts/specifications directly onto the live webcam feed.

## ✅ Deviation Detection
Detects:
- misplaced objects,
- incorrect layouts,
- missing components,
- alignment inconsistencies.

## ✅ Compliance Scoring
Provides a live compliance accuracy score.

## ✅ Voice-Guided Verification
Hands-free voice commands for accessibility and industrial usage.

## ✅ Industry Modes
Supports multiple use cases:
- Construction
- Interior Layout
- Warehouse Verification
- PCB Inspection

## ✅ Accessibility Mode
Adaptive interaction and larger visual indicators for improved usability.

---

# 🏗️ How It Works

1. User uploads a reference image/layout/specification
2. Webcam captures the physical environment
3. OpenCV extracts feature points
4. Homography aligns digital and physical spaces
5. AI compares expected vs actual positions
6. Deviations are highlighted visually
7. Compliance score updates in real time

---

# ⚙️ Tech Stack

## Frontend
- React.js
- Tailwind CSS

## Computer Vision
- OpenCV
- MediaPipe

## AI & Spatial Logic
- Feature Matching
- Homography Transformation
- Spatial Analysis

## Deployment
- Vercel
- GitHub

## Development Tools
- Cursor AI
- Bolt.new

---

# 🖥️ Demo Workflow

### Step 1
Upload reference layout

### Step 2
Initialize webcam alignment

### Step 3
AI calibrates physical environment

### Step 4
Move or misplace an object

### Step 5
SpecCheck detects deviation instantly

### Step 6
Compliance score updates dynamically

---

# 🌍 Real-World Applications

- Construction QA
- Smart factories
- Warehouse management
- Industrial inspection
- Interior validation
- Robotics alignment
- PCB verification

---

# 🔥 Innovation

SpecCheck converts commodity RGB cameras into intelligent spatial verification tools capable of real-time digital-to-physical compliance analysis.

Unlike traditional industrial inspection systems, SpecCheck:
- requires no expensive hardware,
- is lightweight and scalable,
- works using standard devices.

---

# 📈 Future Scope

- AR headset integration
- 3D scene reconstruction
- Predictive AI inspection
- Cloud collaboration
- Smart city infrastructure validation
- Robotics integration

---

# 🛠️ Installation

```bash
git clone <repo-url>
cd speccheck
npm install
npm run dev
