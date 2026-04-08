# Bilay Demir Dograma - PRD

## Project Overview
Modern full-stack website and admin panel for "Bilay Demir Dograma" - a metal fabrication company in Kağıthane, Istanbul.

**Goal:** Generate customers from Google and allow easy website management.

## Tech Stack
- **Frontend:** React 18, Three.js (3D animations), Framer Motion
- **Backend:** Python FastAPI
- **Database:** MongoDB
- **Authentication:** JWT (httpOnly cookies)
- **Styling:** Custom CSS with industrial dark theme

## User Personas
1. **Potential Customers** - Looking for metal fabrication services
2. **Admin** - Company staff managing website content

## Core Requirements (Static)
- [x] 3D Hero section with iron gate and welding sparks
- [x] Services showcase (6 services)
- [x] Portfolio/Project gallery
- [x] About company section
- [x] Testimonials
- [x] Contact page with Google Maps
- [x] WhatsApp floating button
- [x] Offer request form with image upload
- [x] SEO landing pages (5 pages)
- [x] Blog system
- [x] Admin panel with JWT auth
- [x] Dashboard with statistics
- [x] CRUD for services, projects, blog, testimonials
- [x] Offer requests and contact messages management
- [x] Site settings management
- [x] SEO settings management

## What's Been Implemented
**Date: 2026-01-08**
- Full backend API with 30+ endpoints
- React frontend with 15+ pages
- Three.js 3D hero animation
- Admin panel with all CRUD operations
- JWT authentication with httpOnly cookies
- MongoDB data models and seeding
- Stock images integration
- Industrial dark theme (black, steel gray, orange)
- Mobile responsive design
- CORS configuration for production

## Test Status
- Backend: 100% working (all APIs tested)
- Frontend UI: 100% working
- Integration: Pending public URL activation

## Prioritized Backlog

### P0 (Critical)
- [x] Core website functionality
- [x] Admin authentication
- [x] All CRUD operations

### P1 (High Priority)
- [ ] Gmail SMTP email notifications (requires credentials)
- [ ] Real project images upload
- [ ] SEO meta tags implementation

### P2 (Medium Priority)
- [ ] Blog post rich text editor
- [ ] Image optimization
- [ ] Lazy loading for images
- [ ] Performance optimization

### Future Features
- [ ] Multi-language support (Turkish/English)
- [ ] Customer testimonial submission
- [ ] Project request tracking for customers
- [ ] Analytics dashboard
- [ ] Social media integration

## Next Tasks
1. Wait for preview URL activation
2. Configure Gmail SMTP credentials
3. Add real project images
4. Create initial blog posts
5. Configure SEO meta tags for each page
