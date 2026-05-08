import tkinter as tk
from tkinter import ttk, messagebox
import os


# ==========================================================
# CONFIGURACION BASE
# ==========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_DIR, "template.html")
SALIDA_DIR = os.path.join(BASE_DIR, "salida")


# ==========================================================
# REEMPLAZAR SOLO UNA OCURRENCIA
# ==========================================================
def reemplazar_una_vez(texto, buscar, reemplazo, ocurrencia=1):

    partes = texto.split(buscar)

    if len(partes) <= ocurrencia:
        return texto

    resultado = partes[0]

    for i in range(1, len(partes)):

        if i == ocurrencia:
            resultado += reemplazo
        else:
            resultado += buscar

        resultado += partes[i]

    return resultado


# ==========================================================
# FUNCION GENERAR HTML
# ==========================================================
def generar():

    try:

        # verificar template
        if not os.path.exists(TEMPLATE_PATH):

            messagebox.showerror(
                "Error",
                f"No se encontró:\n{TEMPLATE_PATH}"
            )

            return

        # leer template
        with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
            html = f.read()

        # ==================================================
        # REEMPLAZOS GENERALES
        # ==================================================
        reemplazos = {

            "#----> Aqui Nombres Y Apellidos#": nombre.get(),
            "#----> Aqui Gottlieb Daimler#": nombre.get(),

            "#----> Aqui 04 de Enero 1994 (32 Años)#": nacimiento.get(),
            "#----> Aqui Sura#": eps.get(),
            "#----> Aqui 2026 KTM 890 SMT#": vehiculo.get(),
            "#----> Aqui AAA - 00A#": placa.get(),

            "#----> Aqui A#": grupo.get(),
            "#----> Aqui +#": rh.get(),

            "#----> Aqui /static/img/client/Gottlieb_Daimler/Gottlieb_Daimler.png#": foto.get(),

            "#----> Aqui Penicilina#": alergia1.get(),
            "#----> Aqui — Reacción anafiláctica#": alergia1_desc.get(),

            "#----> Aqui Latex#": alergia2.get(),
            "#----> Aqui — Urticaria severa#": alergia2_desc.get(),

            "#----> Aqui Contraste yodado#": alergia3.get(),
            "#----> Aqui — Riesgo moderado#": alergia3_desc.get(),

            "#----> Aqui Diabetes Mellitus Tipo 2 (2018)#": enf1.get(),
            "#----> Aqui Hipertensión arterial crónica#": enf2.get(),
            "#----> Aqui Insuficiencia renal leve — Estadio 2#": enf3.get(),

            "#----> Aqui Metformina 850 mg — c/12h#": med1.get(),
            "#----> Aqui Losartán 50 mg — c/24h#": med2.get(),
            "#----> Aqui Ácido acetilsalicílico 100 mg — c/24h#": med3.get(),

            "#----> Aqui No administrar ibuprofeno ni AINEs#": rest1.get(),
            "#----> Aqui No administrar penicilina ni derivados#": rest2.get(),
            "#----> Aqui No usar materiales de latex en procedimientos#": rest3.get(),
            "#----> Aqui Restricción de sodio en soluciones IV#": rest4.get(),

            "#----> Aqui Marcapaso cardíaco — Medtronic Advisa — Implantado octubre 2021#": obs1.get(),
            "#----> Aqui No realizar resonancia magnética sin evaluación cardiológica previa#": obs2.get(),
            "#----> Aqui Glucemia basal habitual: 110-140 mg/dL#": obs3.get(),
            "#----> Aqui Anxiety preexistente — Mantener entorno calmado#": obs4.get(),
        }

        for viejo, nuevo in reemplazos.items():
            html = html.replace(viejo, nuevo)

        # ==================================================
        # ICE 1 y ICE 2
        # SIN MODIFICAR EL HTML
        # ==================================================

        # -------------------------
        # NOMBRES
        # -------------------------
        html = reemplazar_una_vez(
            html,
            "#----> Aqui Nombres y Apellidos#",
            ice1_nombre.get(),
            1
        )

        html = reemplazar_una_vez(
            html,
            "#----> Aqui Nombres y Apellidos#",
            ice2_nombre.get(),
            2
        )

        # -------------------------
        # PARENTESCOS
        # -------------------------
        html = reemplazar_una_vez(
            html,
            "#----> Aqui Parentesco#",
            ice1_parentesco.get(),
            1
        )

        html = reemplazar_una_vez(
            html,
            "#----> Aqui Parentesco#",
            ice2_parentesco.get(),
            2
        )

        # -------------------------
        # TELEFONOS VISIBLES
        # -------------------------
        html = reemplazar_una_vez(
            html,
            "#----> Aqui +57 111 222 3333#",
            ice1_tel_visible.get(),
            1
        )

        html = reemplazar_una_vez(
            html,
            "#----> Aqui +57 111 222 3333#",
            ice2_tel_visible.get(),
            2
        )

        # -------------------------
        # TELEFONOS BOTONES
        # -------------------------
        html = reemplazar_una_vez(
            html,
            "#----> Aqui 571112223333#",
            ice1_tel_btn.get(),
            1
        )

        html = reemplazar_una_vez(
            html,
            "#----> Aqui 571112223333#",
            ice1_tel_btn.get(),
            2
        )

        html = reemplazar_una_vez(
            html,
            "#----> Aqui 571112223333#",
            ice2_tel_btn.get(),
            3
        )

        html = reemplazar_una_vez(
            html,
            "#----> Aqui 571112223333#",
            ice2_tel_btn.get(),
            4
        )

        # ==================================================
        # CREAR CARPETA SALIDA
        # ==================================================
        os.makedirs(SALIDA_DIR, exist_ok=True)

        nombre_archivo = nombre.get().replace(" ", "_")

        ruta_salida = os.path.join(
            SALIDA_DIR,
            f"{nombre_archivo}.html"
        )

        with open(ruta_salida, "w", encoding="utf-8") as f:
            f.write(html)

        messagebox.showinfo(
            "Éxito",
            f"Archivo generado:\n{ruta_salida}"
        )

    except Exception as e:
        messagebox.showerror(
            "Error",
            str(e)
        )


# ==========================================================
# FUNCION PARA CREAR CAMPOS
# ==========================================================
def crear_campo(texto):

    ttk.Label(
        form_frame,
        text=texto
    ).pack(pady=(8, 2))

    var = tk.StringVar()

    ttk.Entry(
        form_frame,
        textvariable=var,
        width=60
    ).pack()

    return var


# ==========================================================
# VENTANA
# ==========================================================
root = tk.Tk()

root.title("Generador Tarjeta Médica")
root.geometry("700x900")


# ==========================================================
# SCROLL
# ==========================================================
canvas = tk.Canvas(root)

scrollbar = ttk.Scrollbar(
    root,
    orient="vertical",
    command=canvas.yview
)

canvas.configure(
    yscrollcommand=scrollbar.set
)

scrollbar.pack(side="right", fill="y")
canvas.pack(side="left", fill="both", expand=True)

form_frame = ttk.Frame(canvas)

canvas.create_window(
    (0, 0),
    window=form_frame,
    anchor="nw"
)


def actualizar_scroll(event):

    canvas.configure(
        scrollregion=canvas.bbox("all")
    )


form_frame.bind(
    "<Configure>",
    actualizar_scroll
)


# ==========================================================
# RUEDA DEL MOUSE
# ==========================================================
def wheel(event):

    canvas.yview_scroll(
        int(-1 * (event.delta / 120)),
        "units"
    )


canvas.bind_all(
    "<MouseWheel>",
    wheel
)


# ==========================================================
# CAMPOS
# ==========================================================
nombre = crear_campo("Nombre")
nacimiento = crear_campo("Nacimiento")
eps = crear_campo("EPS")
vehiculo = crear_campo("Vehículo")
placa = crear_campo("Placa")
foto = crear_campo("Ruta imagen")

grupo = crear_campo("Grupo sanguíneo")
rh = crear_campo("RH")

alergia1 = crear_campo("Alergia 1")
alergia1_desc = crear_campo("Descripción alergia 1")

alergia2 = crear_campo("Alergia 2")
alergia2_desc = crear_campo("Descripción alergia 2")

alergia3 = crear_campo("Alergia 3")
alergia3_desc = crear_campo("Descripción alergia 3")

enf1 = crear_campo("Enfermedad 1")
enf2 = crear_campo("Enfermedad 2")
enf3 = crear_campo("Enfermedad 3")

med1 = crear_campo("Medicamento 1")
med2 = crear_campo("Medicamento 2")
med3 = crear_campo("Medicamento 3")

rest1 = crear_campo("Restricción 1")
rest2 = crear_campo("Restricción 2")
rest3 = crear_campo("Restricción 3")
rest4 = crear_campo("Restricción 4")

# ==========================================================
# OBSERVACIONES
# ==========================================================
obs1 = crear_campo("Observación 1")
obs2 = crear_campo("Observación 2")
obs3 = crear_campo("Observación 3")
obs4 = crear_campo("Observación 4")

# ==========================================================
# ICE 1
# ==========================================================
ice1_nombre = crear_campo("ICE 1 - Nombre")
ice1_parentesco = crear_campo("ICE 1 - Parentesco")
ice1_tel_visible = crear_campo("ICE 1 - Teléfono visible (+57...)")
ice1_tel_btn = crear_campo("ICE 1 - Teléfono botón (571...)")

# ==========================================================
# ICE 2
# ==========================================================
ice2_nombre = crear_campo("ICE 2 - Nombre")
ice2_parentesco = crear_campo("ICE 2 - Parentesco")
ice2_tel_visible = crear_campo("ICE 2 - Teléfono visible (+57...)")
ice2_tel_btn = crear_campo("ICE 2 - Teléfono botón (571...)")

# ==========================================================
# BOTON
# ==========================================================
tk.Button(
    form_frame,
    text="GENERAR HTML",
    command=generar,
    bg="green",
    fg="white",
    width=30,
    height=2
).pack(pady=30)

root.mainloop()