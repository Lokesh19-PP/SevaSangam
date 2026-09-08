# SevaSangam — Architecture Overview

> **"Trusted Services. Fair Opportunities. Stronger Communities."**

This document will contain the full system architecture, data flow diagrams, and component interaction maps for SevaSangam.

## High-Level Architecture

```
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
Bookings            OpenCV             SMS
Services            Tesseract OCR      WhatsApp
Payments
Analytics
```

## Detailed documentation will be added in subsequent phases.
