#!/usr/bin/env python3

import os
import sys
import argparse
import getpass

import requests
import pandas as pd
import openpyxl


# ============================================================
# CONFIGURACIÓN
# ============================================================

API_URL_DEFAULT = "https://intranet.axioma.cl/api"


# ============================================================
# COLUMNAS EXCEL -> CAMPOS API
# ============================================================

COLUMNAS_MAP = {
    "nombre": "name",
    "apellido": "apellido",
    "rut": "rut",
    "email": "email",
    "password": "password",
    "telefono": "telefono",
    "direccion": "direccion",
    "fecha_nacimiento": "fecha_nacimiento",
    "departamento": "departamento",
    "cargo": "cargo",
    "fecha_ingreso": "fecha_ingreso",
    "contrato": "contrato",
    "supervision_general": "supervision_general",
    "role": "role",
    "estado_cuenta": "estado_cuenta",
}


# ============================================================
# DATOS DE EJEMPLO
# ============================================================

EJEMPLO_DATOS = [
    {
        "nombre": "Juan",
        "apellido": "Pérez",
        "rut": "12.345.678-9",
        "email": "juan.perez@axioma.cl",
        "password": "password123",
        "telefono": "+56912345678",
        "direccion": "Av. Providencia 1234, Santiago",
        "fecha_nacimiento": "1990-05-15",
        "departamento": "Tecnología",
        "cargo": "Desarrollador Fullstack",
        "fecha_ingreso": "2026-03-01",
        "contrato": "Indefinido",
        "supervision_general": "Gerente de TI",
        "role": "user",
        "estado_cuenta": "activo",
    },
    {
        "nombre": "María",
        "apellido": "González",
        "rut": "9.876.543-2",
        "email": "maria.gonzalez@axioma.cl",
        "password": "adminsecure",
        "telefono": "+56987654321",
        "direccion": "Calle Larga 567, Las Condes",
        "fecha_nacimiento": "1988-10-22",
        "departamento": "Recursos Humanos",
        "cargo": "Jefa de RRHH y Contabilidad",
        "fecha_ingreso": "2024-01-15",
        "contrato": "Plazo Fijo",
        "supervision_general": "Gerente General",
        "role": "admin",
        "estado_cuenta": "activo",
    },
]


# ============================================================
# CREAR PLANTILLA
# ============================================================

def crear_plantilla(filename):

    df = pd.DataFrame(EJEMPLO_DATOS)

    try:
        df.to_excel(
            filename,
            index=False,
            engine="openpyxl"
        )

        print()
        print("✅ Plantilla creada correctamente.")
        print(f"📄 Archivo: {filename}")
        print()
        print("Completa la planilla y guárdala como:")
        print("usuarios.xlsx")

    except Exception as e:
        print(f"❌ Error al crear la plantilla: {e}")


# ============================================================
# LOGIN
# ============================================================

def login(base_url, email, password):

    login_url = f"{base_url.rstrip('/')}/login"

    print()
    print("🔐 Autenticando administrador...")

    try:

        response = requests.post(
            login_url,
            json={
                "email": email,
                "password": password,
            },
            headers={
                "Accept": "application/json",
            },
            timeout=30,
        )

    except requests.exceptions.RequestException as e:

        print(f"❌ Error de conexión: {e}")
        return None

    if response.status_code == 200:

        try:
            data = response.json()
        except ValueError:
            print("❌ La API no devolvió JSON válido.")
            print(response.text)
            return None

        token = data.get("token")

        if token:
            print("✅ Autenticación exitosa.")
            return token

        print("❌ La API no devolvió un token.")
        return None

    try:
        data = response.json()
        message = data.get(
            "message",
            "Credenciales incorrectas"
        )
    except ValueError:
        message = response.text

    print(
        f"❌ Error de autenticación "
        f"({response.status_code}): {message}"
    )

    return None


# ============================================================
# CONVERTIR VALORES DEL EXCEL
# ============================================================

def limpiar_valor(valor, nombre_columna):

    if pd.isna(valor):
        return ""

    # Fechas
    if isinstance(valor, pd.Timestamp):

        return valor.strftime("%Y-%m-%d")

    valor = str(valor).strip()

    # Si Excel entrega fecha como texto
    if (
        "fecha" in nombre_columna
        and valor
    ):
        try:

            fecha = pd.to_datetime(valor)

            return fecha.strftime("%Y-%m-%d")

        except Exception:
            pass

    return valor


# ============================================================
# IMPORTAR USUARIOS
# ============================================================

def importar_usuarios(base_url, token, excel_path):

    if not os.path.exists(excel_path):

        print(
            f"❌ El archivo Excel no existe: "
            f"{excel_path}"
        )

        return

    # --------------------------------------------------------
    # Leer Excel
    # --------------------------------------------------------

    try:

        df = pd.read_excel(
            excel_path,
            engine="openpyxl"
        )

    except Exception as e:

        print(
            f"❌ Error al leer el Excel: {e}"
        )

        return

    print()
    print(
        f"📊 Usuarios encontrados: {len(df)}"
    )

    # --------------------------------------------------------
    # Validar columnas
    # --------------------------------------------------------

    columnas_faltantes = []
    for col_excel, col_api in COLUMNAS_MAP.items():
        if col_excel not in df.columns and col_api not in df.columns:
            columnas_faltantes.append(col_excel)

    if columnas_faltantes:

        print()
        print(
            "⚠️ Faltan columnas en el Excel:"
        )

        for columna in columnas_faltantes:
            print(f"   - {columna}")

        print()
        print(
            "El proceso continuará "
            "utilizando solamente las columnas disponibles."
        )

    # --------------------------------------------------------
    # URL
    # --------------------------------------------------------

    register_url = (
        f"{base_url.rstrip('/')}/register"
    )

    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {token}",
    }

    exitos = 0
    errores = 0

    print()
    print("=" * 70)
    print("🚀 INICIANDO IMPORTACIÓN")
    print("=" * 70)

    # --------------------------------------------------------
    # Procesar filas
    # --------------------------------------------------------

    for index, row in df.iterrows():

        numero_fila = index + 2

        payload = {}

        # --------------------------------------------
        # Construir payload
        # --------------------------------------------

        for col_excel, col_api in COLUMNAS_MAP.items():
            # Buscar primero la columna en español, de lo contrario intentar en inglés (API)
            columna_usar = None
            if col_excel in df.columns:
                columna_usar = col_excel
            elif col_api in df.columns:
                columna_usar = col_api

            if not columna_usar:
                continue

            valor = limpiar_valor(
                row[columna_usar],
                columna_usar
            )

            payload[col_api] = valor

        # --------------------------------------------
        # Validaciones
        # --------------------------------------------

        campos_obligatorios = [
            "name",
            "apellido",
            "rut",
            "email",
            "password",
        ]

        campos_faltantes = [
            campo
            for campo in campos_obligatorios
            if not payload.get(campo)
        ]

        if campos_faltantes:

            print()
            print(
                f"❌ Fila {numero_fila}: "
                "faltan campos obligatorios."
            )

            print(
                f"   Campos: "
                f"{', '.join(campos_faltantes)}"
            )

            errores += 1

            continue

        usuario = (
            f"{payload['name']} "
            f"{payload['apellido']}"
        )

        # --------------------------------------------
        # Enviar usuario
        # --------------------------------------------

        try:

            response = requests.post(
                register_url,
                data=payload,
                headers=headers,
                timeout=60,
            )

            # ----------------------------------------
            # Éxito
            # ----------------------------------------

            if response.status_code in (200, 201):

                print()
                print(
                    f"✅ Fila {numero_fila}: "
                    f"{usuario} creado correctamente."
                )

                exitos += 1

                continue

            # ----------------------------------------
            # Error
            # ----------------------------------------

            print()
            print(
                f"❌ Fila {numero_fila}: "
                f"Error creando {usuario}"
            )

            print(
                f"   HTTP: {response.status_code}"
            )

            try:

                data = response.json()

                print(
                    f"   Mensaje: "
                    f"{data.get('message', 'Sin mensaje')}"
                )

                errors = data.get(
                    "errors",
                    {}
                )

                for campo, mensajes in errors.items():

                    for mensaje in mensajes:

                        print(
                            f"   - {campo}: "
                            f"{mensaje}"
                        )

            except ValueError:

                print(
                    "   Respuesta del servidor:"
                )

                print(
                    response.text[:1000]
                )

            errores += 1

        except requests.exceptions.RequestException as e:

            print()
            print(
                f"❌ Fila {numero_fila}: "
                f"Error de conexión."
            )

            print(
                f"   {e}"
            )

            errores += 1

    # --------------------------------------------------------
    # Resumen
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("📊 RESUMEN")
    print("=" * 70)

    print(
        f"✅ Usuarios creados: {exitos}"
    )

    print(
        f"❌ Usuarios con errores: {errores}"
    )

    print(
        f"📄 Total procesados: "
        f"{exitos + errores}"
    )

    print("=" * 70)


# ============================================================
# MAIN
# ============================================================

def main():

    script_dir = os.path.dirname(
        os.path.abspath(__file__)
    )

    default_excel = os.path.join(
        script_dir,
        "usuarios.xlsx"
    )

    default_template = os.path.join(
        script_dir,
        "plantilla_usuarios.xlsx"
    )

    parser = argparse.ArgumentParser(
        description=(
            "Importador de usuarios "
            "para Intranet Axioma"
        )
    )

    parser.add_argument(
        "--template",
        action="store_true",
        help="Crear plantilla Excel"
    )

    parser.add_argument(
        "--url",
        default=API_URL_DEFAULT,
        help=(
            "URL de la API "
            f"(default: {API_URL_DEFAULT})"
        )
    )

    parser.add_argument(
        "--excel",
        default=default_excel,
        help=(
            "Archivo Excel con usuarios "
            f"(default: {default_excel})"
        )
    )

    args = parser.parse_args()

    # --------------------------------------------------------
    # Crear plantilla
    # --------------------------------------------------------

    if args.template:

        crear_plantilla(
            default_template
        )

        sys.exit(0)

    # --------------------------------------------------------
    # Información
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("     IMPORTADOR DE USUARIOS")
    print("     INTRANET AXIOMA")
    print("=" * 70)

    print(
        f"🌐 API: {args.url}"
    )

    print(
        f"📄 Excel: {args.excel}"
    )

    print("=" * 70)

    # --------------------------------------------------------
    # Credenciales
    # --------------------------------------------------------

    admin_email = input(
        "Email del administrador: "
    ).strip()

    admin_password = getpass.getpass(
        "Contraseña del administrador: "
    )

    # --------------------------------------------------------
    # Login
    # --------------------------------------------------------

    token = login(
        args.url,
        admin_email,
        admin_password
    )

    if not token:

        print()
        print(
            "❌ No fue posible autenticarse."
        )

        sys.exit(1)

    # --------------------------------------------------------
    # Importación
    # --------------------------------------------------------

    importar_usuarios(
        args.url,
        token,
        args.excel
    )


if __name__ == "__main__":
    main()
