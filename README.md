# 🚀 Smart India Hackathon Project: SevaSangam

We are building a **scalable, modern, AI-powered Cooperative Gig Services Platform** for the **Smart India Hackathon (SIH)**.

The project name is:

# **SevaSangam**

> **SevaSangam** is a cooperative-based digital platform that connects customers with verified skilled workers for various services while ensuring smart worker matching, fair job distribution, worker welfare, and cooperative management.

Your task is to help us **design and develop a complete working prototype** based on the requirements below.

---

# 🎯 IMPORTANT TASKS YOU NEED TO COMPLETE

## 1️⃣ Dashboard Architecture & Visual Flow

Create **visual diagrams** showing how the following three dashboards work:

* 👤 Customer Panel
* 👷 Worker Panel
* 🏢 Cooperative Administrator Panel

Clearly explain:

* What features each dashboard contains
* What pages/screens are required
* How users navigate between features
* How data flows between Customer, Worker, and Admin
* What actions each role can perform

### 👤 Customer Dashboard

Include:

* Browse services
* Find nearby workers
* View worker profiles
* Book services
* Schedule appointments
* Track booking status
* Emergency service request
* Booking history
* Ratings and reviews
* Profile management

### 👷 Worker Dashboard

Include:

* Profile management
* Skills management
* Certificate upload
* Availability management
* Receive booking requests
* Accept/reject jobs
* Upcoming jobs
* Completed jobs
* Earnings tracking
* Ratings and feedback

### 🏢 Admin Dashboard

Include:

* Worker verification
* Certificate verification
* Worker management
* Booking monitoring
* Workforce utilization
* Fair job distribution monitoring
* Service demand monitoring
* Complaint management
* Analytics and reports
* Worker welfare information

Use **clear visual diagrams using Mermaid diagrams or structured architecture diagrams**.

---

# 2️⃣ Complete System Architecture

Design the complete system architecture of SevaSangam.

Explain:

* How React frontend communicates with FastAPI
* How APIs communicate with PostgreSQL/PostGIS
* How AI/ML integrates with the backend
* How OCR certificate verification works
* How Twilio notifications work
* How all dashboards interact with the backend

Provide:

* High-level system architecture diagram
* Detailed data flow
* Complete application workflow

Example flow:

```text
Customer
   ↓
React Frontend
   ↓
REST API
   ↓
FastAPI Backend
   ↓
PostgreSQL + PostGIS
   ↓
AI/ML Services + External Integrations
```

---

# 3️⃣ Technology Stack Visual Architecture

Create a **visual diagram showing how the complete technology stack works together**.

Use:

### Frontend

* React
* JavaScript
* HTML5
* Tailwind CSS

### Backend

* FastAPI
* Python
* REST APIs

### Database

* PostgreSQL
* PostGIS

### AI/ML

* Scikit-learn
* TensorFlow (optional/future use)
* OpenCV
* Tesseract OCR

### Notifications

* Twilio
* SMS
* WhatsApp

### Deployment

* Docker
* Vercel
* GitHub

Show how these technologies connect and communicate.

---

# 4️⃣ UI/UX DESIGN

Generate a **very classy, modern, professional, and visually attractive UI** suitable for an AI-powered cooperative service platform.

The design should feel:

* Modern
* Trustworthy
* Professional
* Premium
* Clean
* Easy to use
* Responsive
* Accessible

## 🎨 UI Theme

Suggest the best UI theme, including:

* Primary color
* Secondary color
* Background colors
* Accent colors
* Typography
* Card design
* Button styles
* Dashboard layout
* Sidebar design
* Icons

The UI should represent:

> **Trust + Service + Technology + Community + Cooperation**

Use:

* Clean dashboards
* Modern cards
* Smooth transitions
* Subtle animations
* Professional icons
* Responsive design

Avoid an overly complicated interface.

---

# 5️⃣ Project Name

Use the project name everywhere:

# **SevaSangam**

Create branding suitable for:

> **SevaSangam — Connecting Services, Workers, and Communities**

You may suggest a better tagline if suitable.

---

# 6️⃣ Complete Working Prototype

Develop the **complete frontend prototype** with all major pages, dashboards, navigation, workflows, and interactions.

Initially, use:

# **Mock APIs / Mock Data**

The application should be designed so that mock APIs can easily be replaced later with the actual FastAPI backend.

Create a clean API abstraction layer.

Example:

```text
React Components
       ↓
API Service Layer
       ↓
Mock API / Mock Data
       ↓
Future FastAPI Backend
```

Do not tightly couple frontend components directly with mock data.

---

# 7️⃣ Folder Structure — IMPORTANT

Before writing the actual implementation code, first suggest the **complete recommended folder structure**.

The project should follow this main structure:

```text
SevaSangam/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── docker/
│
├── README.md
│
└── docker-compose.yml
```

Suggest a detailed structure for both:

### Frontend

Include appropriate folders such as:

* components
* pages
* layouts
* dashboards
* services
* hooks
* context
* routes
* utils
* assets

### Backend

Include:

* api
* models
* schemas
* services
* repositories
* ai
* integrations
* database
* core

Clearly explain the purpose of each folder.

**First provide the folder structure and wait for confirmation before generating the complete implementation**, if required.

---

# 8️⃣ FINAL TASK — Generate Antigravity Prompt

After completing all the above tasks:

Create a **complete, highly detailed, ready-to-copy prompt for Antigravity AI**.

The Antigravity prompt should instruct it to generate the complete **SevaSangam frontend prototype**.

The Antigravity prompt must include:

* Project description
* Project name
* UI theme
* Complete pages
* Customer Dashboard
* Worker Dashboard
* Admin Dashboard
* Navigation
* Components
* Responsive design
* Mock API integration
* Mock data
* API service abstraction
* Folder structure
* Technology stack
* Required features
* Modern UI requirements
* User workflows

The Antigravity prompt should be **ready to directly copy and paste**.

---

# 💻 TECHNOLOGY STACK

## 🎨 Frontend

* React
* JavaScript
* HTML5
* Tailwind CSS

Build a modern, responsive, interactive web application.

---

# 👤 CUSTOMER FEATURES

The Customer Dashboard should include:

* Browse services
* Search services
* Find nearby workers
* View worker profiles
* View ratings
* Book services
* Schedule appointments
* Track bookings
* Emergency service requests
* Service history
* Ratings and reviews
* Profile management

---

# 👷 WORKER FEATURES

The Worker Dashboard should include:

* Profile management
* Skills management
* Upload certifications
* Availability management
* Receive booking requests
* Accept/reject jobs
* Upcoming jobs
* Completed jobs
* Earnings dashboard
* Ratings and feedback

---

# 🏢 ADMIN FEATURES

The Cooperative Administrator Dashboard should include:

* Worker verification
* Certificate verification
* Worker management
* Booking monitoring
* Workforce utilization
* Fair job distribution
* Service demand monitoring
* Complaint handling
* Analytics
* Reports
* Worker welfare management

---

# ⚙️ BACKEND

## Technologies

* FastAPI
* Python
* RESTful APIs

FastAPI will handle:

* Authentication
* Authorization
* User management
* Worker management
* Service management
* Booking
* Scheduling
* Worker availability
* Smart worker matching
* Geo-location queries
* Emergency services
* AI/ML integration
* OCR processing
* Notifications
* Payments
* Analytics

Use a **clean, modular, scalable architecture**.

Separate:

```text
API Routes
Business Logic
Database Models
Schemas
Services
Repositories
AI/ML Layer
External Integrations
Configuration
```

---

# 🔐 AUTHENTICATION & RBAC

Use either:

* Firebase Authentication, OR
* Auth0

Recommend the best option for:

> React + FastAPI + SIH MVP

Support:

```text
Customer
Worker
Cooperative Administrator
```

Implement Role-Based Access Control (RBAC).

Each role should only access its authorized dashboard and features.

---

# 🗄️ DATABASE

## PostgreSQL

Store:

* Users
* Customers
* Workers
* Cooperatives
* Services
* Skills
* Certifications
* Bookings
* Schedules
* Availability
* Ratings
* Reviews
* Payments
* Notifications
* Complaints
* Welfare information
* Analytics data

---

# 🗺️ POSTGIS

Use PostGIS for:

* Customer location
* Worker location
* Geographic coordinates
* Nearby worker search
* Distance calculations
* Service areas
* Location-based worker matching
* Emergency worker discovery

Example:

> Find available workers with the required skill within a specified radius.

Location intelligence is a **core feature of SevaSangam**.

---

# 🤖 AI/ML

## 🧠 Smart Worker Matching

Use Scikit-learn or a practical scoring/ML approach.

Consider:

* Required skills
* Distance
* Availability
* Worker rating
* Previous performance
* Current workload
* Fair job distribution

Balance:

> **Customer Satisfaction + Skills + Distance + Availability + Performance + Fair Opportunity**

Design a practical matching algorithm suitable for the SIH MVP.

---

## 📈 Demand Forecasting

Analyze historical booking data to predict:

* Future service demand
* High-demand services
* High-demand locations
* Peak booking periods
* Workforce requirements

Use Scikit-learn for the MVP.

---

## 🧠 TensorFlow

Keep TensorFlow optional for future features:

* Advanced forecasting
* Deep-learning recommendations
* Pattern recognition
* Workforce prediction

Do not unnecessarily complicate the SIH MVP.

---

# 📄 CERTIFICATE VERIFICATION

Use:

* OpenCV
* Tesseract OCR

Workflow:

```text
Worker Uploads Certificate
        ↓
OpenCV Image Processing
        ↓
Tesseract OCR
        ↓
Extract Certificate Information
        ↓
Administrator Review
        ↓
Approved / Rejected
```

OCR should only **assist verification**.

The final decision must remain with the **Cooperative Administrator**.

---

# 📅 SMART BOOKING & MATCHING

Design this workflow:

```text
Customer Selects Service
        ↓
Provides Location
        ↓
PostGIS Finds Nearby Workers
        ↓
Filter by Skills + Availability
        ↓
AI Matching Algorithm
        ↓
Fair Job Distribution
        ↓
Best Workers Recommended
        ↓
Worker Assigned
        ↓
Booking Created
```

Prevent unfairly assigning all jobs to only highly rated workers.

---

# 🚨 EMERGENCY SERVICE

Workflow:

```text
Customer Requests Emergency Service
        ↓
FastAPI Backend
        ↓
PostGIS Finds Nearby Workers
        ↓
Smart Matching
        ↓
Best Workers Identified
        ↓
Twilio Notification
        ↓
SMS / WhatsApp Alert
        ↓
Worker Accepts Request
```

Prioritize:

* Distance
* Availability
* Required skill
* Response speed

---

# 🔔 NOTIFICATIONS

Use **Twilio**.

Support:

* SMS
* WhatsApp notifications

Notifications:

* New booking
* Booking accepted/rejected
* Cancellation
* Emergency requests
* Worker alerts
* Booking updates
* Appointment reminders
* Service completion
* Payment updates
* Cooperative announcements

Architecture:

```text
FastAPI
   ↓
Notification Service
   ↓
Twilio
   ↓
SMS / WhatsApp
```

Keep the notification system modular so providers can be replaced later.

---

# 💳 PAYMENT MODULE

For the SIH MVP:

**Do not integrate a real payment gateway initially.**

Implement:

* Mock payment
* Pending status
* Paid status
* Cash payment
* Payment records
* Digital invoice structure

Workflow:

```text
Service Booking
      ↓
Service Completed
      ↓
Payment
      ↓
Pending / Paid / Cash
      ↓
Invoice Generated
```

Design the module so Razorpay/UPI can be integrated later.

---

# ☁️ DEPLOYMENT

## Docker

Use Docker for:

* FastAPI backend
* AI/ML services
* PostgreSQL + PostGIS during development
* Consistent development environment

## Vercel

Deploy:

* React frontend

Flow:

```text
GitHub
   ↓
Vercel
   ↓
React Frontend
```

The backend should be deployable separately using Docker-compatible infrastructure.

---

# 🔗 OVERALL ARCHITECTURE

```text
                   React Frontend
        Customer / Worker / Admin Dashboards
                        │
                     REST APIs
                        │
                        ▼
                  FastAPI Backend
                        │
       ┌────────────────┼─────────────────┐
       │                │                 │
       ▼                ▼                 ▼
PostgreSQL + PostGIS   AI/ML        External Services
       │                │                 │
Users & Locations   Scikit-learn       Twilio
Bookings            TensorFlow         SMS
Services            OpenCV             WhatsApp
Payments            Tesseract OCR
Analytics
```

---

# ⚠️ IMPORTANT DEVELOPMENT INSTRUCTIONS

This is an **SIH MVP**, so:

* Do not create unnecessary microservices
* Keep architecture modular but simple
* Prioritize a working prototype
* Use clean reusable components
* Make the UI highly professional
* Ensure responsiveness
* Use mock APIs initially
* Keep the frontend ready for future FastAPI integration
* Demonstrate AI features clearly
* Make the project suitable for hackathon presentation and live demo

---

# 📌 REQUIRED OUTPUT ORDER

Follow this exact order:

### Step 1

Suggest the complete **project folder structure**.

### Step 2

Create **Customer, Worker, and Admin dashboard diagrams**.

### Step 3

Create the complete **System Architecture Diagram**.

### Step 4

Create the complete **Technology Stack Architecture Diagram**.

### Step 5

Suggest the **UI/UX theme, colors, typography, and design system**.

### Step 6

Explain the complete **application workflow and data flow**.

### Step 7

Recommend the implementation/development approach for the complete prototype using **React + Tailwind + Mock APIs**.

### Step 8

After completing all of the above, generate a **final, highly detailed, ready-to-copy Antigravity AI prompt** to build the complete SevaSangam frontend prototype.

The final Antigravity prompt should be clearly separated under:

# 🚀 FINAL ANTIGRAVITY PROMPT

Make it directly copy-paste ready.

Do not skip any feature mentioned above.
