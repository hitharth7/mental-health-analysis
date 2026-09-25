# 🧠 Mental Health Analysis System (NeuraSense)

An end-to-end AI platform for monitoring, analyzing, and detecting mental health sentiment indicators from multi-platform social media data (Reddit, Twitter/X, Spotify).

---

## 🏗️ Repository Architecture

This repository consists of two main modules:

1. **`frontend/neura-sense`**: Next.js 16 (React 19) web dashboard with Firebase Authentication, OAuth connections for social platforms, and interactive visualizations.
2. **`ml-model/`**: Python pipeline for extracting user text data via APIs (Reddit PRAW), performing text preprocessing/cleaning, and training NLP models for sentiment and mental health analysis.

---

## 👥 Team Setup & Contribution Guide

This guide explains how to set up the repository for team contributions.

### 1. Fork the Repository

1. Go to the original repo: [https://github.com/aadityaa29/mental-health-analysis](https://github.com/aadityaa29/mental-health-analysis)
2. Click **Fork** (top-right corner) to create your own copy under your GitHub account.

---

### 2. Clone Your Fork Locally

```bash
git clone https://github.com/<your-username>/mental-health-analysis.git
cd mental-health-analysis
```
*Replace `<your-username>` with your GitHub username.*

---

### 3. Add the Original Repo as Upstream

```bash
git remote add upstream https://github.com/aadityaa29/mental-health-analysis.git
git remote -v
```

---

### 4. Keep Your Fork Updated

```bash
git fetch upstream
git checkout main             # or target branch
git merge upstream/main       # merge latest changes
```

---

### 5. Create Feature Branches & Commit

```bash
git checkout -b feature/<your-feature-name>
git add .
git commit -m "Add descriptive commit message"
```

---

### 6. Push Branch & Open Pull Request (PR)

```bash
git push origin feature/<your-feature-name>
```

1. Go to your fork on GitHub.
2. Click **Compare & pull request**.
3. Select the target branch (`main` or `backend`) on the original repo (`upstream`).
4. Assign reviewers and describe your changes.

---

## 📋 Team Best Practices

1. Always work on dedicated feature branches (`feature/xxx` or `fix/xxx`).
2. Fetch and merge `upstream/main` before starting new work.
3. Push only to your fork.
4. Use Pull Requests for review before merging into `main`.
