import os
import secrets
import traceback
from flask import Flask, render_template, request, jsonify
from jinja2 import Environment, FileSystemLoader

app = Flask(__name__)

# Rutas relativas basadas en la estructura del proyecto
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_CLIENT_DIR = os.path.join(BASE_DIR, 'static', 'img', 'client')
TEMPLATES_CLIENT_DIR = os.path.join(BASE_DIR, 'template', 'client')
TEMPLATE_GENERATOR_DIR = os.path.join(BASE_DIR, 'generator')

# Configuramos Jinja2 para que busque directamente en la carpeta 'generator'
env = Environment(loader=FileSystemLoader(TEMPLATE_GENERATOR_DIR))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generar', methods=['POST'])
def generar():
    try:
        # Obtener datos del formulario
        data = request.form.to_dict()
        foto = request.files.get('foto')
        nombre = data.get('nombre')

        if not nombre:
            return jsonify({'success': False, 'error': 'El nombre es obligatorio'}), 400

        # 1. Guardar Imagen
        foto_path = ''
        if foto:
            safe_nombre = nombre.replace(' ', '_')
            person_img_dir = os.path.join(IMG_CLIENT_DIR, safe_nombre)
            os.makedirs(person_img_dir, exist_ok=True)
            
            foto_filename = foto.filename
            foto.save(os.path.join(person_img_dir, foto_filename))
            foto_path = f'/static/img/client/{safe_nombre}/{foto_filename}'
            
        data['foto_path'] = foto_path

        # 2. Generar ID cifrado de 12 dígitos únicos (hexadecimal seguro)
        uid = secrets.token_hex(6)  # Genera 12 caracteres

        # 3. Crear carpeta para el HTML en templates/client/{uid}/
        uid_dir = os.path.join(TEMPLATES_CLIENT_DIR, uid)
        os.makedirs(uid_dir, exist_ok=True)

        # 4. Cargar y renderizar template con Jinja2 directamente desde 'generator/'
        template = env.get_template('template.html')
        html_content = template.render(**data)

        # 5. Guardar el archivo HTML con el nombre cifrado
        html_filename = f'{uid}.html'
        with open(os.path.join(uid_dir, html_filename), 'w', encoding='utf-8') as f:
            f.write(html_content)

        # URL relativa para acceder desde el navegador
        url_generada = f'/client/{uid}/{html_filename}'

        return jsonify({'success': True, 'url': url_generada})

    except Exception as e:
        # Imprimir el error detallado en la consola para depuración
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

# Ruta para servir las tarjetas generadas como HTML plano
@app.route('/client/<uid>/<filename>')
def servir_tarjeta(uid, filename):
    file_path = os.path.join(TEMPLATES_CLIENT_DIR, uid, filename)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # Devolver el HTML tal cual, sin procesarlo de nuevo con Flask
        return content, 200, {'Content-Type': 'text/html'}
    return "Tarjeta no encontrada", 404

if __name__ == '__main__':
    # Asegurarnos de que las carpetas base existan al arrancar
    os.makedirs(IMG_CLIENT_DIR, exist_ok=True)
    os.makedirs(TEMPLATES_CLIENT_DIR, exist_ok=True)
    app.run(debug=True)