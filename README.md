# SnapNEarn

<p align="center">
  <img src="https://img.shields.io/badge/AI-Traffic%20Safety-blue" alt="AI Traffic Safety">
  <img src="https://img.shields.io/badge/Computer%20Vision-OpenCV-red" alt="Computer Vision">
  <img src="https://img.shields.io/badge/Backend-Node.js-green" alt="Node.js">
  <img src="https://img.shields.io/badge/Database-MongoDB-green" alt="MongoDB">
  <img src="https://img.shields.io/badge/Authentication-JWT-orange" alt="JWT">
  <img src="https://img.shields.io/badge/Deployment-Render-purple" alt="Render">
</p>

<h3 align="center">
  AI-Powered Traffic Violation Reporting and Road Safety Platform
</h3>

<p align="center">
  SnapNEarn is a full-stack intelligent traffic safety platform that enables citizens
  to report traffic violations using image and video evidence while leveraging
  computer vision and AI-assisted analysis to support violation detection and verification.
</p>

<p align="center">
  <a href="https://snapnearn-ai-traffic-safety.onrender.com">
    Live Application
  </a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://github.com/Kishangurav/SnapNEarn-AI-Traffic__Safety">
    Source Code
  </a>
</p>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Core Capabilities](#core-capabilities)
- [AI and Computer Vision](#ai-and-computer-vision)
- [System Architecture](#system-architecture)
- [Application Workflow](#application-workflow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Screenshots](#application-screenshots)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Architecture](#api-architecture)
- [Security and Privacy](#security-and-privacy)
- [Deployment](#deployment)
- [Testing](#testing)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

# Project Overview

Traffic violations are often difficult to monitor at scale because traditional enforcement depends heavily on physical observation and manual reporting.

SnapNEarn addresses this challenge through a digital platform that connects:

- Citizen-based traffic reporting
- AI-assisted computer vision
- Evidence processing
- Location services
- Secure backend infrastructure
- Report management
- Real-time communication

The platform is designed to create a structured workflow from the initial submission of evidence to the processing, verification, and management of a traffic violation report.

---

# Problem Statement

Traditional traffic violation reporting systems can face several limitations:

- Limited monitoring coverage
- Delayed reporting
- Manual evidence collection
- Difficulty processing large amounts of visual data
- Lack of structured digital reporting
- Limited citizen participation
- Manual verification overhead

There is a need for a system that can combine citizen participation with automated computer vision techniques while maintaining privacy, security, and structured data management.

---

# Solution

SnapNEarn provides a centralized platform where users can:

1. Create an account
2. Submit traffic violation evidence
3. Capture or provide location information
4. Upload images or videos
5. Process submitted evidence using AI-based services
6. Detect relevant traffic violations
7. Extract vehicle information
8. Protect sensitive visual information
9. Track submitted reports
10. Manage rewards and report status

This creates an end-to-end digital workflow for traffic violation reporting.

---

# Core Capabilities

## Citizen Reporting

The platform provides a dedicated reporting interface that allows users to submit traffic violation evidence.

Capabilities include:

- User registration
- Secure authentication
- Image submission
- Video submission
- Violation categorization
- Location capture
- Report history
- Report status tracking
- Reward tracking

---

## Location Intelligence

SnapNEarn integrates location-based functionality to improve the context associated with submitted reports.

Features include:

- GPS-based location capture
- Google Maps integration
- Police station discovery
- Location-aware reporting
- Geographic context for submitted violations

---

## AI-Assisted Violation Analysis

The platform integrates computer vision components to assist in analyzing submitted visual evidence.

The AI pipeline can perform:

- Vehicle detection
- Helmet detection
- Number plate detection
- Number plate OCR
- Face detection
- Face blurring
- Confidence-based analysis
- Temporal verification for video evidence

---

# AI and Computer Vision

The AI subsystem is designed to transform raw visual evidence into structured information.

## Processing Pipeline

```text
Image / Video Evidence
          |
          v
    Media Preprocessing
          |
          v
     Vehicle Detection
          |
     +----+------------------+
     |                       |
     v                       v
Helmet Detection       Number Plate Detection
     |                       |
     |                       v
     |                  OCR Processing
     |                       |
     +-----------+-----------+
                 |
                 v
          Face Detection
                 |
                 v
           Face Blurring
                 |
                 v
        Violation Analysis
                 |
                 v
       Confidence Evaluation
                 |
                 v
        Temporal Verification
                 |
                 v
        Final Detection Result# SnapNEarn

<p align="center">
  <strong>AI-Powered Traffic Violation Reporting and Road Safety Platform</strong>
</p>

<p align="center">
  A computer vision-based platform that enables citizens to report traffic violations using image and video evidence while providing AI-assisted analysis and secure digital reporting.
</p>

<p align="center">
  <a href="https://snapnearn-ai-traffic-safety.onrender.com">
    <strong>Live Demo</strong>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-API-black" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-green" alt="MongoDB">
  <img src="https://img.shields.io/badge/Python-AI%2FML-blue" alt="Python">
  <img src="https://img.shields.io/badge/OpenCV-Computer%20Vision-red" alt="OpenCV">
  <img src="https://img.shields.io/badge/JWT-Authentication-orange" alt="JWT">
</p>

---

## Overview

SnapNEarn is an AI-assisted traffic safety platform designed to simplify the process of reporting traffic violations.

The platform allows citizens to submit photographic or video evidence of traffic violations. The submitted media can be processed using computer vision techniques to identify relevant violations and extract useful information such as vehicle details and number plates.

The system combines a web-based reporting platform, REST APIs, MongoDB, real-time communication, location services, and AI-based image processing into a single application.

### Key Objectives

- Simplify traffic violation reporting
- Encourage citizens to contribute to road safety
- Assist in identifying traffic violations using AI
- Protect sensitive information in submitted media
- Provide structured digital records of reported violations
- Improve communication between citizens and authorities
- Support scalable traffic safety monitoring

---

## Problem Statement

Traditional traffic violation reporting often depends on direct observation by law enforcement personnel or manual complaint procedures.

This can result in:

- Limited monitoring coverage
- Delayed reporting
- Difficulty collecting reliable evidence
- Manual verification of submitted information
- Limited citizen participation
- Inefficient handling of large numbers of reports

SnapNEarn addresses these challenges by providing a digital platform where citizens can submit evidence and AI-assisted processing can help analyze the submitted media.

---

## How SnapNEarn Works

```text
Citizen
   |
   v
Submit Traffic Violation
   |
   v
Image / Video Evidence
   |
   v
Backend API
   |
   +----------------------+
   |                      |
   v                      v
Database             AI Processing
                           |
                           +-------------------+
                           |                   |
                           v                   v
                    Helmet Detection     Number Plate OCR
                           |
                           v
                     Face Blurring
                           |
                           v
                   Violation Analysis
                           |
                           v
                    Report Processing
                           |
                           v
                  Status / Reward System
