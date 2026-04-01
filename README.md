# DeSy — Dependable Systems Research Group Website

A modern, responsive website for the **Dependable Systems (DeSy)** research group at the **Technical University of Cluj-Napoca**, Faculty of Automation and Computer Science.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap)

---

## 🚀 Features

- **Home** — Overview, contact details, research areas, architecture diagram
- **Team** — Filterable card grid of 26+ researchers with links to faculty profiles
- **Publications** — Searchable & filterable list of 25+ publications + patents
- **Projects** — Timeline of 10+ representative research projects (2013–2028)
- **Resources** — R&D, consulting, engineering services, and training offerings

### Additional

- Fully responsive (mobile, tablet, desktop)
- Scroll-triggered fade-in animations
- SEO-optimised meta tags
- Modern UI with DeSy orange/navy branding

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9 or higher | Comes with Node.js |

To verify your installation, run:

```bash
node --version
npm --version
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/banumihail/Dependabale-Systems-Website.git
cd Dependabale-Systems-Website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The site will be available at **http://localhost:5173/** (the exact URL will be shown in your terminal).

### 4. Build for production (optional)

```bash
npm run build
```

This creates an optimised production build in the `dist/` folder. To preview the production build locally:

```bash
npm run preview
```

---

## 🗂️ Project Structure

```
├── index.html                  # Entry HTML (meta tags, Google Fonts)
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── public/                     # Static assets
└── src/
    ├── main.jsx                # React root + Router + Bootstrap
    ├── App.jsx                 # Route definitions & layout
    ├── index.css               # Global design system (~600 lines)
    ├── components/
    │   ├── Navbar.jsx          # Fixed navigation with scroll effect
    │   ├── Footer.jsx          # 4-column footer
    │   ├── DesyLogo.jsx        # SVG logo component
    │   └── ScrollToTop.jsx     # Scroll-to-top on route change
    ├── hooks/
    │   └── useScrollReveal.js  # Intersection + Mutation observer
    ├── pages/
    │   ├── Home.jsx            # Landing page
    │   ├── Team.jsx            # Personnel listing
    │   ├── Publications.jsx    # Publications & patents
    │   ├── Projects.jsx        # Research projects
    │   └── Resources.jsx       # Services & training
    └── data/
        ├── team.json           # 26 team members
        ├── publications.json   # 26 publications + 1 patent
        └── projects.json       # 10 representative projects
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework  | React 18 |
| Build Tool | Vite 8 |
| Routing | React Router v6 |
| Styling | Bootstrap 5 + Custom CSS |
| Typography | Google Fonts (Inter, Outfit) |
| Data | JSON (static, Phase 1) |

---

## 📜 License

This project is developed for the Dependable Systems research group at UTCN.

---

## 🏫 About DeSy

**Dependable Systems (DeSy)** is a research group within the Automation Department at the Faculty of Automation and Computer Science, Technical University of Cluj-Napoca.

- **Director**: Prof. Eng. Liviu Miclea, PhD
- **Website**: [desy.utcluj.ro](http://desy.utcluj.ro)
- **Address**: 26-28 G. Bariţiu Str., 400027, Cluj-Napoca, Romania
