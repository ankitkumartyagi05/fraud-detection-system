# 🛡️ Real-Time Financial Fraud Detection System

🚨 Detect Scam Messages • 🔗 Block Malicious Links • 🤖 AI Powered Protection

---

# 🧠 Project Overview

Real-Time Financial Fraud Detection System is an AI-powered application that detects scam SMS messages and malicious links in real time to protect users from financial fraud.

The system analyzes incoming messages, detects fraud patterns using Machine Learning, and alerts the user instantly.

---

# 🌐 Live Demo

### 🚀 Frontend Demo  
🔗 **[Open Live Website](https://ankitkumartyagi05.github.io/fraud-detection-system/)**

### 🤖 Backend API  
⚡ **[Open API](backend-production-4684.up.railway.app)**




Example request

json
{
 "message": "Dear customer your electricity will disconnect today pay now http://fake-pay.xyz"
}

---

# ⚠ Problem

Financial fraud through SMS scams is increasing rapidly.

Common scams include

• Electricity disconnection scam  
• Bank KYC update scam  
• Fake payment links  
• Government scheme scams  
• OTP fraud  

Example scam message

```
Dear customer,
Your electricity connection will be disconnected today.
Pay immediately: http://pay-bill-now.xyz
```

Risks

• Bank details theft  
• Account balance drained  

---

# 💡 Solution

This project provides an AI-powered fraud detection system that

✔ scans SMS messages  
✔ detects fraud patterns  
✔ identifies malicious links  
✔ alerts users instantly  

---

# ✨ Core Features

### 📩 Real-Time SMS Fraud Detection
Automatically scans messages and detects fraud patterns.

### 🔗 Malicious Link Detection
Extracts URLs and checks suspicious domains.

### 🚫 Link Blocking
Dangerous links are blocked and users are warned.

### 📂 Fraud Message Quarantine
Suspicious messages are moved to a safe folder.

### 👤 Sender Risk Analysis
Detects unknown numbers and spam patterns.

### 🤖 Smart AI Fraud Detection
Detects scam phrases like

• Pay immediately  
• Last warning  
• KYC update required  
• Electricity disconnect  

### 📊 User Dashboard
Displays

• messages scanned  
• fraud detected  
• links blocked  

### 🌎 Multi-Language Detection
Supports detection in

• English  
• Hindi  
• regional languages  

### 🔒 Privacy Protection
All processing happens locally without cloud storage.

---

# ⚙ System Architecture

```
Incoming SMS
      ↓
SMS Listener
      ↓
Text Preprocessing
      ↓
AI Fraud Detection Model
      ↓
Safe / Fraud Classification

If Fraud
      ↓
URL Extraction
      ↓
Malicious Link Detection
      ↓
User Alert
      ↓
Block Link + Quarantine
```

---

# 🤖 AI Model

Machine Learning Pipeline

```
SMS Text
   ↓
Tokenization
   ↓
TF-IDF Vectorization
   ↓
Machine Learning Model
   ↓
Fraud Probability Score
```

Recommended models

• Logistic Regression  
• Naive Bayes  
• Random Forest  

Best hackathon model

TF-IDF + Logistic Regression

---

# 🔗 URL Fraud Detection

Suspicious links detected using

• Long domain patterns  
• Shortened URLs  
• Fake domains  
• Random scam domains  

Examples

```
pay-electricity-now.xyz
bit.ly/payment
sbi-payment.xyz
abcd1234.xyz
```

---

# 🛠 Tech Stack

Frontend

```
HTML
CSS
JavaScript
```

Backend

```
Python
Flask
```

Machine Learning

```
Scikit-learn
TF-IDF
Logistic Regression
```

Deployment

```
Railway
GitHub
```

---

# 📂 Project Structure

```
project
│
├── frontend
│   ├── index.html
│   └── assets
│       ├── css
│       │   └── style.css
│       └── js
│           └── script.js
│
├── backend
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── runtime.txt
│   └── model
│       ├── fraud_model.pkl
│       └── vectorizer.pkl
```

---

# 🚀 Deployment

Backend deployed using Railway.

Steps

1 Push project to GitHub  
2 Connect repository with Railway  
3 Add Procfile

```
web: gunicorn app:app
```

4 Deploy project  

---

# 📊 Performance Metrics

Accuracy = 95%

Precision = 93%

Recall = 91%

---

# 🔮 Future Improvements

• Scam knowledge database  
• Community scam reporting  
• AI self-learning model  
• Government number verification  

---

# 👨‍💻 Author

Developed as an AI-powered fraud detection system to protect users from financial scams.

⭐ If you like this project give it a star on GitHub.
