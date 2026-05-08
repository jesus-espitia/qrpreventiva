# ============================================
# Generador de QR con texto debajo
# ============================================

import qrcode
import os
from PIL import Image, ImageDraw, ImageFont

# Pedir URL
url = input("Ingrese la URL para generar el QR: ")

# Pedir nombre de la imagen
nombre_imagen = input("Ingrese el nombre de la imagen: ")

# Pedir texto para debajo del QR
texto_qr = input("Ingrese el texto que irá debajo del QR: ")

# Obtener carpeta actual
base_dir = os.path.dirname(os.path.abspath(__file__))

# Ruta de guardado
ruta_guardado = os.path.join(
    base_dir,
    "..",
    "static",
    "img",
    "users"
)

# Crear carpeta si no existe
os.makedirs(ruta_guardado, exist_ok=True)

# Ruta final
ruta_final = os.path.join(ruta_guardado, f"{nombre_imagen}.png")

# ============================================
# CREAR QR
# ============================================

qr = qrcode.QRCode(
    version=1,
    box_size=10,
    border=4
)

qr.add_data(url)
qr.make(fit=True)

img_qr = qr.make_image(fill_color="black", back_color="white").convert("RGB")

# ============================================
# CONFIGURAR TEXTO
# ============================================

draw = ImageDraw.Draw(img_qr)

try:
    # Fuente Arial
    font = ImageFont.truetype("arial.ttf", 25)
except:
    # Fuente por defecto
    font = ImageFont.load_default()

# Obtener tamaño del texto
bbox = draw.textbbox((0, 0), texto_qr, font=font)

texto_ancho = bbox[2] - bbox[0]
texto_alto = bbox[3] - bbox[1]

# Tamaño original QR
qr_ancho, qr_alto = img_qr.size

# Espacio extra para texto
margen = 30

# Crear nueva imagen más alta
nueva_imagen = Image.new(
    "RGB",
    (qr_ancho, qr_alto + texto_alto + margen),
    "white"
)

# Pegar QR
nueva_imagen.paste(img_qr, (0, 0))

# Dibujar texto centrado
draw_final = ImageDraw.Draw(nueva_imagen)

x_texto = (qr_ancho - texto_ancho) // 2
y_texto = qr_alto + 10

draw_final.text(
    (x_texto, y_texto),
    texto_qr,
    fill="black",
    font=font
)

# Guardar imagen
nueva_imagen.save(ruta_final)

print("\n✅ QR generado correctamente")
print(f"📁 Guardado en:\n{ruta_final}")