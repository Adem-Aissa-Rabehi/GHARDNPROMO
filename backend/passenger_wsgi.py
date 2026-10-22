import sys
import os
import glob

# 1. Détection des dossiers de travail
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.exists(os.path.join(CURRENT_DIR, 'backend_core')):
    BACKEND_DIR = CURRENT_DIR
elif os.path.exists(os.path.join(CURRENT_DIR, 'backend', 'backend_core')):
    BACKEND_DIR = os.path.join(CURRENT_DIR, 'backend')
else:
    BACKEND_DIR = CURRENT_DIR

# 2. Ajout au sys.path (dossier backend et dossier racine)
for p in [BACKEND_DIR, CURRENT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

# 3. Isolation stricte du virtualenv pour ch.ghardnprom.com UNIQUEMENT
# Purge immédiate de tout virtualenv d'autres sites (ex: saldaesystems.dz) pour éviter les conflits de librairies
sys.path = [p for p in sys.path if not ('virtualenv' in p and 'ghardnprom' not in p)]

# Détection du virtualenv actif de l'application
if sys.executable and 'virtualenv' in sys.executable and 'ghardnprom' in sys.executable:
    venv_root = os.path.dirname(os.path.dirname(sys.executable))
    for sp in glob.glob(os.path.join(venv_root, 'lib', 'python*', 'site-packages')):
        if sp not in sys.path:
            sys.path.insert(0, sp)

# Recherche stricte dans le virtualenv du domaine ghardnprom uniquement
home_dir = os.path.expanduser('~')
target_pattern = os.path.join(home_dir, 'virtualenv', '*ghardnprom*', '**', 'site-packages')
for sp in glob.glob(target_pattern, recursive=True):
    if sp not in sys.path:
        sys.path.insert(0, sp)

# 4. Démarrage de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')

try:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
except Exception:
    import traceback
    error_msg = traceback.format_exc()

    def application(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/html; charset=utf-8')])
        html = (
            "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Erreur Django cPanel</title>"
            "<style>body{font-family:sans-serif;background:#111;color:#fff;padding:40px;line-height:1.6}"
            "pre{background:#222;padding:15px;border-radius:8px;color:#ff8080;overflow:auto}</style></head>"
            "<body><h2>Erreur de demarrage Django sur cPanel</h2>"
            "<p>Details techniques :</p><pre>" + error_msg + "</pre></body></html>"
        )
        return [html.encode('utf-8')]
