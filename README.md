# My Portfolio Website

A minimal [Flask](https://flask.palletsprojects.com/) application that server-side-renders a single portfolio page — a "My Portfolio Website" header, an "About Me" section, and the text "I am learning React." It is a Flask port of a former React/Vite prototype, reproducing the same rendered page from the server.

## Requirements

- **Python 3.12** (Flask 3.1.3 requires Python 3.9 or newer)
- **Flask 3.1.3** — installed via `requirements.txt` (see [Setup](#setup) below)

## Project structure

```text
.
├── app.py                  # Flask app; route "/" renders the page
├── requirements.txt        # Python dependencies (Flask==3.1.3)
├── templates/
│   ├── index.html          # Jinja page (HTML shell + content)
│   └── partials/
│       └── header.html     # Header partial
└── static/
    ├── favicon.svg
    └── css/
        └── index.css       # Styles (theme tokens, dark mode, responsive)
```

## Setup

Create and activate a virtual environment, then install the dependencies:

```bash
python3 -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run

Start the development server with either of these equivalent commands:

```bash
flask run
```

```bash
python app.py
```

Once the server is running, open the app in your browser at
[http://127.0.0.1:5000/](http://127.0.0.1:5000/) (Flask's default port).

> **Note:** `flask run` auto-detects `app.py`, so no extra configuration is
> needed. If your environment does not auto-detect it, set `FLASK_APP=app.py`
> before running.
