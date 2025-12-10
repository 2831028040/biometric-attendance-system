// Estado
let currentScanner = null;
let currentMethod = '';
const API_URL = '/api/asistencia.php';
let useLocalStorage = false; // Se detecta automáticamente

// Detectar si hay backend disponible
async function checkBackend() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        useLocalStorage = !data.success;
        console.log('🔍 Backend detectado:', data.success ? 'MySQL ✅' : 'localStorage ⚠️');
    } catch (error) {
        useLocalStorage = true; // Sin backend, usar localStorage
        console.log('⚠️ Sin backend - Usando localStorage');
    }
}

// Inicializar
checkBackend().then(() => loadRecords());

// ========== BARCODE ==========
function startBarcode() {
    currentMethod = 'barcode';
    document.getElementById('scanner').classList.add('active');
    document.getElementById('scanner-content').innerHTML = '<div id="barcode-reader"></div>';
    
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#barcode-reader'),
            constraints: {
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"]
        }
    }, (err) => {
        if (err) {
            showToast('Error: ' + err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        saveRecord('Escaneo de Barras', 'barcode');
        Quagga.stop();
        closeScanner();
    });
}

// ========== QR ==========
function startQR() {
    currentMethod = 'qr';
    document.getElementById('scanner').classList.add('active');
    document.getElementById('scanner-content').innerHTML = '<div id="qr-reader" style="width:100%"></div>';
    
    const html5QrCode = new Html5Qrcode("qr-reader");
    currentScanner = html5QrCode;
    
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            saveRecord('Escaneo QR', 'qr');
            html5QrCode.stop();
            closeScanner();
        }
    ).catch(err => showToast('Error QR: ' + err));
}

// ========== VOZ ==========
async function startVoice() {
    // Verificar si el navegador soporta reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        showToast('❌ Tu navegador no soporta reconocimiento de voz. Usa Chrome.');
        return;
    }
    
    currentMethod = 'voice';
    document.getElementById('scanner').classList.add('active');
    document.getElementById('scanner-content').innerHTML = `
        <div style="text-align:center; padding:50px 20px; background: #ecf0f1; border-radius: 3px;">
            <h3 style="margin-bottom:15px; color: #2c3e50; font-weight: 300; font-size: 20px;">IDENTIFICACIÓN POR VOZ</h3>
            <p style="color:#7f8c8d; margin-bottom: 10px;">Pronuncie cualquier cosa para registrar</p>
            <p style="color:#95a5a6; font-size: 13px;">Ejemplo: "Hola" o "12345"</p>
            <p id="voice-status" style="color:#3498db; font-size: 14px; margin-top: 15px; font-weight: 500;">🎤 Preparando micrófono...</p>
        </div>
    `;
    
    // Detectar si es Chrome en Android
    const isChromeMobile = /Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent) && !/Edge/i.test(navigator.userAgent);
    
    // Solo en Chrome Android, pedir permiso explícito primero
    if (isChromeMobile) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                showToast('❌ Permiso de micrófono denegado. Por favor permite el acceso.');
            } else if (error.name === 'NotFoundError') {
                showToast('❌ No se encontró micrófono en el dispositivo.');
            } else {
                showToast('❌ Error al acceder al micrófono: ' + error.message);
            }
            closeScanner();
            return;
        }
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
        document.getElementById('voice-status').innerHTML = '🎤 Escuchando... Habla ahora';
        document.getElementById('voice-status').style.color = '#27ae60';
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('voice-status').innerHTML = `✅ Detectado: "${transcript}"`;
        document.getElementById('voice-status').style.color = '#27ae60';
        
        setTimeout(() => {
            saveRecord('Reconocimiento de Voz', 'voice');
            closeScanner();
        }, 1000);
    };
    
    recognition.onerror = (event) => {
        let mensaje = 'Error de voz. ';
        switch(event.error) {
            case 'no-speech':
                mensaje = '⚠️ No se detectó voz. Intenta de nuevo.';
                break;
            case 'audio-capture':
                mensaje = '❌ No se puede acceder al micrófono. Verifica permisos.';
                break;
            case 'not-allowed':
                mensaje = '❌ Permiso denegado. Permite acceso al micrófono.';
                break;
            case 'network':
                mensaje = '❌ Error de red. Verifica tu conexión.';
                break;
            default:
                mensaje = `❌ Error: ${event.error}`;
        }
        document.getElementById('voice-status').innerHTML = mensaje;
        document.getElementById('voice-status').style.color = '#e74c3c';
        showToast(mensaje);
    };
    
    recognition.onend = () => {
        if (currentMethod === 'voice' && currentScanner) {
            // Solo mostrar mensaje si no se detectó nada
            const status = document.getElementById('voice-status');
            if (status && status.style.color !== '#27ae60') {
                status.innerHTML = '⚠️ Presiona "Cerrar" e intenta de nuevo';
            }
        }
    };
    
    try {
        recognition.start();
        currentScanner = recognition;
    } catch(e) {
        showToast('❌ Error al iniciar reconocimiento: ' + e.message);
        closeScanner();
    }
}

// ========== GUARDAR ==========
function saveRecord(scanName, method) {
    if (useLocalStorage) {
        // Modo GitHub Pages - usar localStorage
        const records = JSON.parse(localStorage.getItem('asistencia') || '[]');
        records.push({
            id: Date.now(),
            nombre: scanName,
            metodo: method,
            fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
            presente: 1
        });
        localStorage.setItem('asistencia', JSON.stringify(records));
        loadRecords();
        showToast(`✅ Registrado (local): ${scanName}`);
    } else {
        // Modo Docker - usar MySQL
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: scanName,
                metodo: method
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                loadRecords();
                showToast(`✅ Registrado: ${scanName}`);
            } else {
                showToast('❌ Error al registrar');
            }
        })
        .catch(() => showToast('❌ Error de conexión'));
    }
}

// ========== MOSTRAR REGISTROS ==========
function loadRecords() {
    if (useLocalStorage) {
        // Modo GitHub Pages - leer de localStorage
        const records = JSON.parse(localStorage.getItem('asistencia') || '[]');
        displayRecords(records);
    } else {
        // Modo Docker - leer de MySQL
        fetch(API_URL)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    displayRecords(data.data);
                } else {
                    document.getElementById('list').innerHTML = '<p style="color:#e74c3c;">Error al cargar registros</p>';
                }
            })
            .catch(() => {
                document.getElementById('list').innerHTML = '<p style="color:#e74c3c;">Error al cargar registros</p>';
            });
    }
}

function displayRecords(records) {
    document.getElementById('total').textContent = records.length;
    
    const html = records.map(r => `
        <div class="record">
            <div>
                <strong>${r.nombre}</strong><br>
                <small>${r.fecha}</small>
            </div>
            <span class="badge">${r.metodo}</span>
        </div>
    `).join('');
    
    document.getElementById('list').innerHTML = html || '<p style="color:#999; text-align:center;">Sin registros</p>';
}

// ========== CERRAR ==========
function closeScanner() {
    document.getElementById('scanner').classList.remove('active');
    
    if (currentScanner) {
        if (typeof currentScanner.stop === 'function') {
            currentScanner.stop();
        } else if (typeof currentScanner.abort === 'function') {
            currentScanner.abort();
        }
        currentScanner = null;
    }
    
    if (currentMethod === 'barcode' && typeof Quagga !== 'undefined') {
        Quagga.stop();
    }
    
    document.getElementById('scanner-content').innerHTML = '';
}

// ========== TOAST ==========
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
