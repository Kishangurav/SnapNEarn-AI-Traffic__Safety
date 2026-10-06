# SnapNEarn

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
