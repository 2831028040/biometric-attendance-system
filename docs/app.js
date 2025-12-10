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
        saveRecord(code, 'barcode');
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
            saveRecord(decodedText, 'qr');
            html5QrCode.stop();
            closeScanner();
        }
    ).catch(err => showToast('Error QR: ' + err));
}

// ========== VOZ ==========
function startVoice() {
    // Verificar si el navegador soporta reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        showToast('❌ Tu navegador no soporta reconocimiento de voz. Usa Chrome en Android o PC.');
        return;
    }
    
    currentMethod = 'voice';
    document.getElementById('scanner').classList.add('active');
    document.getElementById('scanner-content').innerHTML = `
        <div style="text-align:center; padding:50px 20px; background: #ecf0f1; border-radius: 3px;">
            <h3 style="margin-bottom:15px; color: #2c3e50; font-weight: 300; font-size: 20px;">IDENTIFICACIÓN POR VOZ</h3>
            <p style="color:#7f8c8d; margin-bottom: 10px;">Pronuncie su número de identificación</p>
            <p style="color:#95a5a6; font-size: 13px;">Ejemplo: "Mi ID es 12345"</p>
            <p style="color:#e74c3c; font-size: 12px; margin-top: 15px;">📱 En móviles, usar Chrome Android</p>
        </div>
    `;
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        // Extraer números del texto
        const match = transcript.match(/\d+/);
        if (match) {
            const userId = match[0];
            saveRecord(userId, 'voice');
            closeScanner();
        } else {
            showToast('No se detectó ningún ID. Intenta de nuevo.');
        }
    };
    
    recognition.onerror = () => showToast('Error de voz. Intenta de nuevo.');
    recognition.start();
    currentScanner = recognition;
}

// ========== GUARDAR ==========
function saveRecord(userId, method) {
    if (useLocalStorage) {
        // Modo GitHub Pages - usar localStorage
        const records = JSON.parse(localStorage.getItem('asistencia') || '[]');
        records.push({
            id: Date.now(),
            nombre: userId,
            metodo: method,
            fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
            presente: 1
        });
        localStorage.setItem('asistencia', JSON.stringify(records));
        loadRecords();
        showToast(`✅ Registrado (local): ${userId}`);
    } else {
        // Modo Docker - usar MySQL
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: userId,
                metodo: method
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                loadRecords();
                showToast(`✅ Registrado: ${userId}`);
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
