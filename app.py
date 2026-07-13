"""Flask application entry point for the portfolio website.

This module is the Python/Flask replacement for the former React client
bootstrap (``src/main.jsx``), which mounted the SPA in the browser with
``createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>)``.

The rendering model changes from client-side rendering (CSR) to server-side
rendering (SSR): instead of the browser building the DOM at runtime, Flask
renders the equivalent HTML from a Jinja template and returns it directly.
The observable output — the rendered page, its text content, document title,
favicon, and active styling — is identical to the original React application.

Conventions relied upon (Flask defaults, intentionally not overridden):
    * Templates are served from the ``templates/`` directory, so
      ``render_template("index.html")`` resolves to ``templates/index.html``.
    * Static assets (the stylesheet and favicon) are served from the
      ``static/`` directory and referenced in the template via ``url_for``.

Run locally (development parity with the previous ``npm run dev`` workflow):
    * ``python app.py``            -> starts the built-in dev server (port 5000)
    * ``flask --app app run``      -> Flask auto-detects the module-level ``app``
"""

from flask import Flask, render_template

# The WSGI application instance. Naming it ``app`` at module scope lets the
# Flask CLI auto-detect it (``flask --app app run``). Flask's defaults serve
# templates from ``templates/`` and static files from ``static/``; these are
# left unchanged because the migration layout follows those conventions.
app = Flask(__name__)


@app.route("/")
def index():
    """Render the single portfolio page.

    Server-side counterpart of the React ``App`` component tree. Returns the
    fully rendered ``templates/index.html`` (which includes the header partial
    and links the ported stylesheet and favicon) with a ``text/html`` content
    type, mirroring the DOM the React SPA previously produced in the browser.
    """
    return render_template("index.html")


if __name__ == "__main__":
    # Launch Flask's built-in development server for local development, mirroring
    # the convenience of the former Vite dev server (``npm run dev``). Per the
    # AAP (§0.4.1, §0.5.1), the entry point uses a plain ``app.run()`` with debug
    # disabled (Flask's default). Running with debug off keeps the Werkzeug
    # interactive debugger/evaluator from being exposed on the ``python app.py``
    # path, so this command behaves identically to ``flask run`` (also debug off).
    # For any non-local deployment, front the app with a production WSGI server
    # (e.g. gunicorn or waitress), as the AAP notes optionally.
    app.run()
