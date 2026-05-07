import qrcode
import os

url = input("Ingrese la URL para generar el QR: ")
nombre_imagen = input("Ingrese el nombre de la imagen: ")
base_dir = os.path.dirname(os.path.abspath(__file__))
ruta_guardado = os.path.join(
    base_dir,
    "..",
    "static",
    "img",
    "users"
)
os.makedirs(ruta_guardado, exist_ok=True)
ruta_final = os.path.join(ruta_guardado, f"{nombre_imagen}.png")
qr = qrcode.make(url)
qr.save(ruta_final)
print("\n✅ QR generado correctamente")
print(f"📁 Guardado en:\n{ruta_final}")