# 🚀 Guía de Publicación en GitHub Pages

Esta guía te ayudará a publicar el Sistema de Asistencia Biométrica en GitHub Pages para completar el **10% de la calificación**.

---

## 📋 Pre-requisitos

- ✅ Cuenta de GitHub ([Crear cuenta](https://github.com/signup))
- ✅ Git instalado en tu computadora
- ✅ Proyecto completo descargado

---

## 🛠️ Paso 1: Preparar Git

### Abrir Terminal en la carpeta del proyecto:

```bash
cd /Users/misaelvillar/Documents/proyect/biometric-attendance-system
```

### Inicializar repositorio Git:

```bash
# Inicializar Git (si no existe)
git init

# Configurar tu información (usa tu nombre y email de GitHub)
git config user.name "Tu Nombre"
git config user.email "tuemail@ejemplo.com"

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "Initial commit: Sistema de asistencia biométrica"

# Renombrar la rama a 'main'
git branch -M main
```

---

## 🌐 Paso 2: Crear Repositorio en GitHub

### 2.1 Ir a GitHub

1. Abre tu navegador y ve a: https://github.com
2. Inicia sesión con tu cuenta
3. Click en el botón **+** (arriba a la derecha) → **New repository**

### 2.2 Configurar el repositorio

- **Repository name:** `biometric-attendance-system`
- **Description:** "Sistema de Asistencia Biométrica - Practica 5 Santillán"
- **Visibility:** Public ✅ (obligatorio para GitHub Pages gratis)
- **NO marcar** "Add a README file"
- **NO marcar** "Add .gitignore"
- **NO marcar** "Choose a license"
- Click en **Create repository**

### 2.3 Copiar la URL del repositorio

Deberías ver una URL como:
```
https://github.com/TU-USUARIO/biometric-attendance-system.git
```

**Copia esta URL**, la necesitarás en el siguiente paso.

---

## 📤 Paso 3: Subir el Código a GitHub

### En la terminal, ejecuta (reemplaza TU-USUARIO con tu nombre de usuario de GitHub):

```bash
# Conectar tu proyecto local con GitHub
git remote add origin https://github.com/TU-USUARIO/biometric-attendance-system.git

# Subir el código
git push -u origin main
```

**Si te pide usuario y contraseña:**
- **Usuario:** Tu nombre de usuario de GitHub
- **Contraseña:** Usa un **Personal Access Token** (NO tu contraseña de GitHub)

### ¿Cómo obtener un Personal Access Token?

1. Ve a: https://github.com/settings/tokens
2. Click en **Generate new token** → **Generate new token (classic)**
3. Nombre: "Biometric Attendance System"
4. Expiration: 90 días
5. Marca el checkbox: ✅ **repo** (Full control of private repositories)
6. Click en **Generate token**
7. **COPIA EL TOKEN** (solo se muestra una vez)
8. Usa este token como contraseña cuando Git te lo pida

---

## 🌍 Paso 4: Activar GitHub Pages

### 4.1 Ir a la configuración del repositorio

1. En GitHub, ve a tu repositorio: `https://github.com/TU-USUARIO/biometric-attendance-system`
2. Click en **Settings** (⚙️ arriba a la derecha)

### 4.2 Configurar Pages

1. En el menú lateral izquierdo, busca **Pages** (sección "Code and automation")
2. En **Source**, selecciona:
   - Branch: **main**
   - Folder: **/docs**
3. Click en **Save**

### 4.3 Esperar el despliegue

- GitHub mostrará un mensaje: "Your site is ready to be published at..."
- Espera **1-2 minutos** para que se complete el despliegue
- Refresca la página hasta que veas: ✅ **"Your site is live at..."**

---

## ✅ Paso 5: Verificar la Publicación

### 5.1 Acceder a tu sitio

Tu sitio estará disponible en:
```
https://TU-USUARIO.github.io/biometric-attendance-system/
```

### 5.2 Probar las funcionalidades

1. **Código de Barras:**
   - Click en "Código de Barras"
   - Permitir acceso a la cámara
   - Escanear un código de barras
   - Verificar que se registre en la tabla

2. **Código QR:**
   - Click en "Código QR"
   - Escanear un código QR
   - Verificar que se registre

3. **Reconocimiento de Voz:**
   - Click en "Reconocimiento de Voz"
   - Permitir acceso al micrófono
   - Decir tu código (ej: "uno dos tres cuatro cinco")
   - Verificar que se transcriba correctamente

### 5.3 Notas importantes

⚠️ **En GitHub Pages, los registros NO se guardan en base de datos**
- Los datos solo se almacenan temporalmente en la memoria del navegador
- Al recargar la página, los registros se perderán
- Esto es normal porque GitHub Pages solo sirve archivos estáticos (no puede ejecutar PHP)

✅ **Para base de datos funcional:**
- Usa la versión Docker local: `http://localhost:8000`
- O despliega en un servidor con soporte PHP+MySQL

---

## 📸 Paso 6: Documentar para la Entrega

### 6.1 Actualizar el README

Edita el archivo `README.md` y reemplaza `[TU-USUARIO]` con tu usuario real de GitHub:

```bash
# En tu editor de código, busca y reemplaza:
[TU-USUARIO] → tu_usuario_real
```

Ejemplo:
```
Antes: https://[TU-USUARIO].github.io/biometric-attendance-system/
Después: https://juanperez.github.io/biometric-attendance-system/
```

### 6.2 Actualizar y subir cambios

```bash
git add README.md
git commit -m "Update README with GitHub Pages URL"
git push
```

### 6.3 Tomar capturas de pantalla

Para tu entrega, toma capturas de:

1. ✅ **GitHub Pages funcionando** (URL en el navegador)
2. ✅ **Escaneo de Código de Barras** (modal abierto con cámara)
3. ✅ **Escaneo de Código QR** (escaneando un QR)
4. ✅ **Reconocimiento de Voz** (transcripción en pantalla)
5. ✅ **Tabla de Registros** (con al menos 3 registros diferentes)
6. ✅ **Repositorio de GitHub** (mostrando archivos)
7. ✅ **Configuración de GitHub Pages** (Settings → Pages)

---

## 🎯 Checklist Final

Antes de entregar, verifica que:

- [ ] El sitio carga en: `https://TU-USUARIO.github.io/biometric-attendance-system/`
- [ ] Los 3 métodos de escaneo funcionan correctamente
- [ ] La interfaz se ve profesional (diseño formal, sin iconos)
- [ ] Los registros aparecen en la tabla
- [ ] El README tiene tu URL real (sin `[TU-USUARIO]`)
- [ ] Tienes capturas de pantalla de todo funcionando
- [ ] El repositorio es **público** (visible para todos)

---

## 🆘 Solución de Problemas

### "Error 404: Page not found"

**Causa:** GitHub Pages aún no ha terminado de desplegar.

**Solución:**
1. Ve a: `https://github.com/TU-USUARIO/biometric-attendance-system/deployments`
2. Espera hasta que veas ✅ **"Active"** o **"Success"**
3. Puede tardar hasta 10 minutos la primera vez

### "Camera not accessible"

**Causa:** GitHub Pages requiere HTTPS para acceder a cámara/micrófono.

**Solución:**
- Asegúrate de acceder con `https://` (NO `http://`)
- GitHub Pages siempre usa HTTPS automáticamente
- Si tu navegador bloquea el acceso, dale click en "Permitir"

### "Nothing happens when I scan"

**Causa:** La API PHP no funciona en GitHub Pages (solo HTML/CSS/JS).

**Solución:**
- Esto es **NORMAL** en GitHub Pages
- Los datos se guardan en memoria del navegador
- Para base de datos real, usa Docker: `http://localhost:8000`

### "The remote rejected your push"

**Causa:** Credenciales incorrectas o token expirado.

**Solución:**
1. Genera un nuevo Personal Access Token
2. Actualiza las credenciales:
   ```bash
   git config credential.helper store
   git push
   ```
3. Ingresa tu usuario y el nuevo token

---

## 📞 Recursos Adicionales

- **Documentación GitHub Pages:** https://docs.github.com/pages
- **Generador de QR Codes:** https://www.qr-code-generator.com/
- **Imágenes de Códigos de Barras:** https://barcode.tec-it.com/
- **Probar Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

## 🔧 Cambiar entre localStorage y phpMyAdmin

### ¿Cómo funciona la detección automática?

El archivo `docs/app.js` tiene una variable `useLocalStorage` que se configura automáticamente:

```javascript
let useLocalStorage = false; // Se detecta automáticamente

async function checkBackend() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        useLocalStorage = !data.success;
    } catch {
        useLocalStorage = true; // Sin backend, usar localStorage
    }
}
```

### Forzar el uso de localStorage (modo GitHub Pages)

Si quieres probar el modo localStorage localmente:

1. Abre `docs/app.js`
2. Busca la línea: `let useLocalStorage = false;`
3. Cámbiala a: `let useLocalStorage = true;`
4. Recarga el navegador

```javascript
// ANTES (modo automático - usa MySQL si está disponible)
let useLocalStorage = false; // Se detecta automáticamente

// DESPUÉS (forzar modo localStorage)
let useLocalStorage = true; // Forzar localStorage
```

### Forzar el uso de phpMyAdmin/MySQL (modo Docker)

Si quieres asegurar que siempre use MySQL:

1. Abre `docs/app.js`
2. Comenta la función `checkBackend()`:

```javascript
// Comentar esta línea para no detectar automáticamente
// checkBackend().then(() => loadRecords());

// Y agregar esta línea para forzar MySQL
useLocalStorage = false;
loadRecords();
```

### Ver qué modo está usando

Abre la **Consola del Navegador** (F12) y escribe:

```javascript
console.log(useLocalStorage ? "Usando localStorage" : "Usando MySQL");
```

### Limpiar datos de localStorage

Si necesitas borrar los registros guardados en memoria:

```javascript
// En la consola del navegador (F12)
localStorage.removeItem('asistencia');
location.reload(); // Recargar página
```

O directamente:

1. F12 → Application/Almacenamiento
2. Local Storage → http://localhost:8000 o tu URL
3. Buscar `asistencia`
4. Click derecho → Delete

---

## ✅ Confirmación Final

Una vez completados todos los pasos, tu **calificación será 100/100**:

| Requisito | % | Estado |
|-----------|---|--------|
| Código de Barras → BD | 20% | ✅ |
| Código QR → BD | 30% | ✅ |
| Biométrico (Voz) → BD | 40% | ✅ |
| Publicación en Internet | 10% | ✅ |

**¡Felicidades! Has completado la Practica 5 - Santillán** 🎉

---

**Fecha de creación:** Diciembre 2024  
**Autor:** Santillán
