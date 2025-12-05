# 🚀 Guía de Instalación - Sistema de Asistencia Biométrica

Esta guía cubre **3 formas de instalar** el sistema:

1. ✅ **Con Docker** (Recomendado - más fácil)
2. ✅ **Con XAMPP/MAMP** (Sin Docker - Windows/Mac)
3. ✅ **Con Apache/MySQL manual** (Sin Docker - Linux/Mac)

---

## 📦 OPCIÓN 1: Instalación con Docker (Recomendado)

### Pre-requisitos:
- ✅ Docker Desktop instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop))

### Pasos:

```bash
# 1. Clonar el repositorio
git clone https://github.com/2831028040/biometric-attendance-system.git
cd biometric-attendance-system

# 2. Iniciar los contenedores
docker-compose up -d

# 3. Esperar 10 segundos para que MySQL inicie completamente
sleep 10

# 4. Acceder al sistema
# Frontend: http://localhost:8000
# phpMyAdmin: http://localhost:8081
```

### Credenciales:
- **phpMyAdmin:**
  - Usuario: `root`
  - Contraseña: `rootpassword`
  - Base de datos: `asistencia_db`

### Detener el sistema:
```bash
docker-compose down
```

---

## 📦 OPCIÓN 2: Instalación con XAMPP/MAMP (Sin Docker)

### Pre-requisitos:
- ✅ XAMPP ([Windows/Linux](https://www.apachefriends.org/)) o MAMP ([Mac](https://www.mamp.info/))
- ✅ Git instalado

### Pasos:

#### 1. Instalar XAMPP/MAMP
- Descargar e instalar XAMPP o MAMP
- Iniciar Apache y MySQL desde el panel de control

#### 2. Clonar el proyecto
```bash
# Windows (XAMPP)
cd C:\xampp\htdocs
git clone https://github.com/2831028040/biometric-attendance-system.git

# Mac (MAMP)
cd /Applications/MAMP/htdocs
git clone https://github.com/2831028040/biometric-attendance-system.git
```

#### 3. Crear la base de datos

**Opción A - Con phpMyAdmin:**
1. Abrir: http://localhost/phpmyadmin
2. Crear base de datos: `asistencia_db`
3. Seleccionar `asistencia_db`
4. Click en "SQL"
5. Copiar y pegar el contenido de `database/setup.sql`
6. Click en "Continuar"

**Opción B - Desde terminal:**
```bash
# Windows
cd C:\xampp\mysql\bin
mysql -u root -p < C:\xampp\htdocs\biometric-attendance-system\database\setup.sql

# Mac
/Applications/MAMP/Library/bin/mysql -u root -p < /Applications/MAMP/htdocs/biometric-attendance-system/database/setup.sql
```

#### 4. Configurar la conexión a la base de datos

Editar `api/asistencia.php` y modificar la línea 5:

```php
// CAMBIAR ESTA LÍNEA (línea 5):
$conn = new mysqli('mysql', 'root', 'rootpassword', 'asistencia_db');

// POR ESTA (ajusta la contraseña si es diferente):
$conn = new mysqli('localhost', 'root', '', 'asistencia_db');
// XAMPP por defecto no tiene contraseña, por eso ''
// Si configuraste contraseña en MySQL, ponla ahí
```

#### 5. Configurar rutas

**Windows - Crear archivo `htdocs/biometric-attendance-system/index.php`:**
```php
<?php
header('Location: docs/index.html');
exit;
?>
```

**Mac - Igual:**
```php
<?php
header('Location: docs/index.html');
exit;
?>
```

#### 6. Acceder al sistema

- **Frontend:** http://localhost/biometric-attendance-system/docs/
- **phpMyAdmin:** http://localhost/phpmyadmin

---

## 📦 OPCIÓN 3: Instalación Manual (Apache + MySQL)

### Pre-requisitos:
- ✅ Apache 2.4+
- ✅ PHP 8.0+ con extensión `mysqli`
- ✅ MySQL 8.0+

### Pasos:

#### 1. Instalar dependencias

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install apache2 php php-mysqli mysql-server git
sudo systemctl start apache2
sudo systemctl start mysql
```

**macOS (con Homebrew):**
```bash
brew install php mysql apache2
brew services start mysql
brew services start apache2
```

#### 2. Clonar el proyecto
```bash
cd /var/www/html  # Linux
# o
cd /usr/local/var/www  # macOS

sudo git clone https://github.com/2831028040/biometric-attendance-system.git
sudo chown -R $USER:$USER biometric-attendance-system
cd biometric-attendance-system
```

#### 3. Crear base de datos
```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE asistencia_db;"

# Importar schema
mysql -u root -p asistencia_db < database/setup.sql

# Crear usuario (opcional pero recomendado)
mysql -u root -p -e "CREATE USER 'asistencia_user'@'localhost' IDENTIFIED BY 'password123';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON asistencia_db.* TO 'asistencia_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

#### 4. Configurar conexión en `api/asistencia.php`

Editar línea 5:

```php
// OPCIÓN 1: Usuario root (menos seguro)
$conn = new mysqli('localhost', 'root', 'TU_CONTRASEÑA_MYSQL', 'asistencia_db');

// OPCIÓN 2: Usuario dedicado (más seguro)
$conn = new mysqli('localhost', 'asistencia_user', 'password123', 'asistencia_db');
```

#### 5. Configurar Apache

Crear archivo `/etc/apache2/sites-available/asistencia.conf`:

```apache
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /var/www/html/biometric-attendance-system/docs
    
    Alias /api /var/www/html/biometric-attendance-system/api
    
    <Directory /var/www/html/biometric-attendance-system/docs>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    <Directory /var/www/html/biometric-attendance-system/api>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Activar el sitio:
```bash
sudo a2ensite asistencia
sudo systemctl reload apache2
```

#### 6. Acceder al sistema

- **Frontend:** http://localhost

---

## 🧪 Verificar Instalación

### 1. Probar la base de datos
```bash
# Conectar a MySQL
mysql -u root -p asistencia_db

# Verificar tabla
SHOW TABLES;
SELECT * FROM asistencia;
exit
```

### 2. Probar la API

**Desde navegador:**
```
http://localhost:8000/api/asistencia.php
```

Deberías ver:
```json
{"success":true,"data":[...]}
```

**Desde terminal:**
```bash
curl http://localhost:8000/api/asistencia.php
```

### 3. Probar el frontend

1. Abrir: http://localhost:8000 (Docker) o http://localhost/biometric-attendance-system/docs/
2. Abrir consola del navegador (F12)
3. Deberías ver: `🔍 Backend detectado: MySQL ✅`
4. Hacer un registro de prueba
5. Verificar en phpMyAdmin que aparezca en la tabla `asistencia`

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la base de datos"

**Docker:**
```bash
# Verificar contenedores
docker ps

# Ver logs de MySQL
docker-compose logs mysql

# Reiniciar
docker-compose restart
```

**XAMPP/MAMP:**
- Verificar que MySQL esté corriendo en el panel de control
- Revisar usuario/contraseña en `api/asistencia.php`
- Verificar que la base de datos `asistencia_db` exista en phpMyAdmin

**Manual:**
```bash
# Verificar MySQL
sudo systemctl status mysql

# Reiniciar MySQL
sudo systemctl restart mysql

# Verificar conexión
mysql -u root -p -e "USE asistencia_db; SHOW TABLES;"
```

### Error: "Call to undefined function mysqli_connect"

**Solución:**
```bash
# Ubuntu/Debian
sudo apt install php-mysqli
sudo systemctl restart apache2

# macOS
brew install php
brew services restart php
```

### Error: "Access denied for user 'root'@'localhost'"

Editar `api/asistencia.php` con las credenciales correctas:
```php
// Verificar usuario, contraseña y host
$conn = new mysqli('localhost', 'TU_USUARIO', 'TU_CONTRASEÑA', 'asistencia_db');
```

### Error: "Table 'asistencia_db.asistencia' doesn't exist"

Ejecutar el script SQL:
```bash
mysql -u root -p asistencia_db < database/setup.sql
```

---

## 📊 Puertos Usados

| Servicio | Docker | XAMPP/MAMP | Manual |
|----------|--------|------------|--------|
| Frontend | 8000 | 80 | 80 |
| MySQL | 3307→3306 | 3306 | 3306 |
| phpMyAdmin | 8081 | 80/phpmyadmin | (instalar aparte) |

---

## ✅ Checklist de Instalación

- [ ] MySQL corriendo
- [ ] Base de datos `asistencia_db` creada
- [ ] Tabla `asistencia` creada
- [ ] PHP con extensión mysqli instalado
- [ ] Apache/Servidor web corriendo
- [ ] `api/asistencia.php` con credenciales correctas
- [ ] Frontend accesible en navegador
- [ ] Consola muestra "Backend detectado: MySQL ✅"
- [ ] Registros se guardan en base de datos

---

## 🎓 Información Adicional

- **Guía de publicación:** Ver `DEPLOYMENT.md`
- **Documentación completa:** Ver `README.md`
- **Resumen del proyecto:** Ver `PROJECT_SUMMARY.md`

---

**Autor:** Suhey  
**Email:** arsuhey@gmail.com  
**Fecha:** Diciembre 2024
