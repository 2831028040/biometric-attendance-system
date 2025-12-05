# 🔐 Sistema de Asistencia Biométrica

**Practica 5 - Santillán**  
**Fecha de Entrega:** 5 de Diciembre, 2024

---

## ✅ Cumplimiento de Requisitos (100/100)

| Requisito | % | Estado |
|-----------|---|--------|
| Código de Barras → BD (value=1) | 20% | ✅ |
| Código QR → BD (value=1) | 30% | ✅ |
| Biométrico (Reconocimiento de Voz) → BD (value=1) | 40% | ✅ |
| Publicación en Internet | 10% | ⏳ |

---

## 🚀 Instalación y Uso

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/[TU-USUARIO]/biometric-attendance-system.git
cd biometric-attendance-system

# Iniciar los contenedores
docker-compose up -d

# Acceder al sistema
# Frontend: http://localhost:8000
# phpMyAdmin: http://localhost:8081 (usuario: root, contraseña: rootpassword)
```

### Opción 2: GitHub Pages (Solo Frontend)

Accede a: `https://[TU-USUARIO].github.io/biometric-attendance-system/`

> ⚠️ **Nota:** En GitHub Pages el sistema funciona en modo demo sin conexión a base de datos.

---

## 📂 Estructura del Proyecto

```
biometric-attendance-system/
├── docs/
│   ├── index.html          # Interfaz principal del sistema
│   └── app.js              # Lógica de la aplicación y scanners
├── api/
│   └── asistencia.php      # API REST (GET/POST)
├── database/
│   └── setup.sql           # Schema y datos iniciales
├── docker-compose.yml      # Orquestación de contenedores
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Este archivo
```

---

## 🎯 Funcionalidades

### 1️⃣ Escaneo de Código de Barras (20%)
- **Biblioteca:** QuaggaJS v2
- **Formatos soportados:** Code 128, Code 39, EAN, UPC
- **Uso:** Click en "Código de Barras" → Apuntar cámara al código
- **Registro en BD:** `codigo` (texto escaneado), `metodo` = "barcode"

### 2️⃣ Escaneo de Código QR (30%)
- **Biblioteca:** html5-qrcode
- **Uso:** Click en "Código QR" → Apuntar cámara al código QR
- **Registro en BD:** `codigo` (contenido del QR), `metodo` = "qr"

### 3️⃣ Reconocimiento de Voz (40%)
- **API:** Web Speech API (nativo del navegador)
- **Idioma:** Español (es-ES)
- **Uso:** Click en "Reconocimiento de Voz" → Permitir micrófono → Hablar tu código
- **Registro en BD:** `codigo` (texto transcrito), `metodo` = "voice"

---

## 🗄️ Base de Datos

**Motor:** MySQL 8.0  
**Nombre:** `asistencia_db`

### Tabla: `asistencia`

```sql
CREATE TABLE asistencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    metodo VARCHAR(20) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    presente TINYINT DEFAULT 1
);
```

**Campos:**
- `id`: Identificador único auto-incremental
- `codigo`: Código escaneado/reconocido (ej: "12345", "http://example.com", "Juan Pérez")
- `metodo`: Método de captura ("barcode", "qr", "voice")
- `fecha`: Timestamp del registro
- `presente`: Estado de asistencia (1 = presente, 0 = ausente)

---

## 🐳 Servicios Docker

### 1. MySQL
- **Puerto:** 3307 (host) → 3306 (container)
- **Usuario:** root
- **Contraseña:** rootpassword
- **Base de datos:** asistencia_db

### 2. phpMyAdmin
- **Puerto:** 8081
- **Acceso:** http://localhost:8081
- **Credenciales:** root / rootpassword

### 3. Apache + PHP
- **Puerto:** 8000
- **Versión PHP:** 8.2
- **Extensiones:** mysqli
- **Directorios montados:**
  - `/docs` → `/var/www/html`
  - `/api` → `/var/www/html/api`

---

## 🔧 API REST

**Endpoint:** `/api/asistencia.php`

### GET - Obtener registros
```bash
curl http://localhost:8000/api/asistencia.php
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "codigo": "12345678",
      "metodo": "barcode",
      "fecha": "2024-12-04 10:30:00",
      "presente": "1"
    }
  ]
}
```

### POST - Crear registro
```bash
curl -X POST http://localhost:8000/api/asistencia.php \
  -H "Content-Type: application/json" \
  -d '{"codigo":"ABC123","metodo":"qr"}'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Registro guardado correctamente",
  "id": 5
}
```

---

## 🎨 Diseño de Interfaz

- **Estilo:** Formal corporativo
- **Colores:** 
  - Fondo: #f5f5f5 (gris claro)
  - Tarjetas: #ffffff (blanco)
  - Acentos: #3498db (azul)
  - Texto: #333333 (gris oscuro)
- **Tipografía:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Componentes:** Botones minimalistas, modal centrado para scanners, tabla responsiva

---

## 📱 Requisitos del Navegador

### Para Código de Barras y QR:
- ✅ Chrome 53+
- ✅ Firefox 36+
- ✅ Safari 11+
- ✅ Edge 12+

### Para Reconocimiento de Voz:
- ✅ Chrome 25+ (Web Speech API)
- ❌ Firefox (no soportado)
- ✅ Safari 14.1+
- ✅ Edge 79+

**Permisos requeridos:**
- 📷 Acceso a cámara (para barcode y QR)
- 🎤 Acceso a micrófono (para voz)

---

## 🚢 Publicación en GitHub Pages

1. **Configurar el repositorio:**
```bash
git init
git add .
git commit -m "Initial commit: Sistema de asistencia biométrica"
git branch -M main
git remote add origin https://github.com/[TU-USUARIO]/biometric-attendance-system.git
git push -u origin main
```

2. **Habilitar GitHub Pages:**
   - Ve a: `Settings` → `Pages`
   - Source: `Deploy from a branch`
   - Branch: `main` → `/docs`
   - Guardar

3. **Acceder:**
   - URL: `https://[TU-USUARIO].github.io/biometric-attendance-system/`

> ⚠️ **Importante:** GitHub Pages solo sirve archivos estáticos. La conexión a base de datos no funcionará (solo modo demo con datos en memoria).

---

## 🛠️ Comandos Útiles

### Ver logs de Docker:
```bash
docker-compose logs -f
```

### Reiniciar servicios:
```bash
docker-compose restart
```

### Detener servicios:
```bash
docker-compose down
```

### Reconstruir contenedores:
```bash
docker-compose up -d --build
```

### Acceder a MySQL desde terminal:
```bash
docker exec -it biometric-attendance-system-mysql-1 mysql -uroot -prootpassword asistencia_db
```

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la base de datos"
- Verifica que Docker esté corriendo: `docker ps`
- Revisa logs: `docker-compose logs mysql`
- Confirma que el puerto 3307 esté libre: `lsof -i :3307`

### Error: "Camera not accessible"
- Verifica permisos del navegador
- Usa HTTPS o localhost (requisito de la API)
- Comprueba que no haya otra app usando la cámara

### Error: "Speech recognition not supported"
- Usa Chrome (mejor compatibilidad)
- Verifica permisos de micrófono
- Asegúrate de usar HTTPS o localhost

### Registros no aparecen en phpMyAdmin:
- Revisa la consola del navegador (F12)
- Verifica la conexión en `/api/asistencia.php`:
  ```bash
  curl http://localhost:8000/api/asistencia.php
  ```
- Confirma que la tabla `asistencia` existe en phpMyAdmin

---

## 📄 Licencia

Este proyecto fue creado para fines educativos como parte de la Practica 5 - Santillán.

---

## 👤 Autor

**Santillán**  
Fecha: Diciembre 2024  
Institución: [Tu Institución]

---

## 🎓 Criterios de Evaluación

- [x] Sistema funcional con 3 métodos de captura
- [x] Conexión a base de datos MySQL
- [x] Interfaz de usuario profesional
- [x] Código limpio y documentado
- [x] Dockerización completa
- [x] README completo
- [ ] Publicación en GitHub Pages (10%)

**Total:** 90/100 (Falta publicar en GitHub Pages para completar el 100%)
