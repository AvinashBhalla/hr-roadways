# Haryana Roadways Smart Bus Booking System

## Product Requirements Document (PRD v1.2 -- FINAL)

------------------------------------------------------------------------

## 1. Overview

A government-grade, offline-resilient bus booking and tracking system
for Haryana Roadways with passenger, driver, authority, superadmin, and
AI (MCP) support.

------------------------------------------------------------------------

## 2. User Roles

-   Passenger
-   Driver
-   Authority
-   Tracking Team
-   SuperAdmin
-   MCP Agent

------------------------------------------------------------------------

## 3. Core Decisions (Locked)

-   Fixed seat numbers (user-selected)
-   No ticket cancellation
-   Refund only on payment failure
-   Journey auto-completes at passenger drop or final stop
-   Internal dashboard only
-   Backend: Supabase (Auth, DB, Storage, Realtime)

------------------------------------------------------------------------

## 4. Passenger App -- Pages & Components

### 4.1 Splash & Language

-   Logo
-   Language selector (EN / HI)
-   Continue button

### 4.2 Login

-   Phone input
-   OTP input
-   Resend OTP
-   Privacy policy

### 4.3 Home

-   Nearest pickup card
-   Distance indicator
-   Destination search bar
-   Change pickup

### 4.4 Pickup & Destination

-   Pickup input
-   Destination input
-   Map / search
-   Nearest pickup confirmation

### 4.5 Bus List

-   Bus card:
    -   Time
    -   Duration
    -   Stops
    -   Seats available
    -   Fare
    -   Live / Derived badge

### 4.6 Seat Selection

-   Seat layout
-   Available/occupied legend
-   Selected seat
-   Fare summary

### 4.7 Payment

-   Booking summary
-   Payment options:
    -   UPI
    -   Card
    -   NetBanking
    -   Cash
-   Pay button

### 4.8 Ticket Screen

-   QR code (offline)
-   Ticket details
-   Wake-up alert toggle
-   Help

### 4.9 Wake-Up Alert

-   Alert modal
-   TTS
-   Snooze / Awake / Alternates

### 4.10 Alternate Bus

-   Alternate bus list
-   Seat availability
-   Fare delta
-   Book button

### 4.11 Complaints

-   Type selector
-   Description
-   Media upload
-   Submit

### 4.12 Settings

-   Language
-   Location consent
-   Logout

------------------------------------------------------------------------

## 5. Driver App -- Pages

### 5.1 Login

-   Employee ID
-   OTP / PIN

### 5.2 Bus Dashboard

-   Bus info
-   GPS status
-   Verify button

### 5.3 Ticket Verification

-   Camera scanner
-   Fast scan mode
-   Scan result indicators

### 5.4 Passenger List

-   Next 2 stops only
-   Seat & payment status

### 5.5 Cash Summary

-   Cash collected
-   Submit to depot

------------------------------------------------------------------------

## 6. SuperAdmin Dashboard

### 6.1 Login

-   Email / password
-   2FA

### 6.2 Dashboard

-   KPIs
-   Quick actions

### 6.3 User Management

-   Users table
-   Role assignment
-   Activate / deactivate

### 6.4 Roles & Permissions

-   Roles list
-   Permission matrix

### 6.5 Routes & Stops

-   Route list
-   Stops editor
-   Map view

### 6.6 Bus Management

-   Bus list
-   Seat config
-   Assign route

### 6.7 Driver Management

-   Assign bus
-   Activate / deactivate

### 6.8 System Config

-   Thresholds
-   Offline window
-   Save config

### 6.9 Seed Data

-   Seed users
-   Seed buses
-   Seed routes

------------------------------------------------------------------------

## 7. Backend (Supabase)

### 7.1 Tables

-   profiles
-   roles
-   permissions
-   routes
-   stops
-   buses
-   drivers
-   bookings
-   tickets
-   payments
-   scan_audits
-   gps_alerts
-   complaints

### 7.2 Key Logic

-   Signed tickets (ECDSA)
-   Offline scan queue
-   Derived bus location (only onboard passengers)
-   GPS mismatch alerts
-   Wake-up notifications
-   Seat availability & holds

------------------------------------------------------------------------

## 8. MCP Integration

Tools: - find_buses - book_ticket - get_ticket_status - verify_ticket

------------------------------------------------------------------------

## 9. Non-Functional

-   Offline-first
-   Low-end Android support
-   Secure & auditable
-   Scalable to other states

------------------------------------------------------------------------

## 10. Status

PRD v1.2 -- FINAL & LOCKED
