<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli('mysql', 'root', 'root', 'asistencia_db');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de conexión']));
}

$method = $_SERVER['REQUEST_METHOD'];

// POST - Registrar
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $data['nombre'] ?? '';
    $metodo = $data['metodo'] ?? '';
    
    // Determinar la tabla según el método
    $tabla = '';
    switch ($metodo) {
        case 'barcode':
            $tabla = 'barcode_scans';
            break;
        case 'qr':
            $tabla = 'qr_scans';
            break;
        case 'voice':
            $tabla = 'voice_scans';
            break;
        case 'face':
            $tabla = 'face_scans';
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Método no válido']);
            exit;
    }
    
    $stmt = $conn->prepare("INSERT INTO $tabla (nombre, presente) VALUES (?, 1)");
    $stmt->bind_param("s", $nombre);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    
    $stmt->close();
}

// GET - Obtener todos de todas las tablas
else if ($method === 'GET') {
    $registros = [];
    
    // Obtener de barcode_scans
    $result = $conn->query("SELECT id, nombre, fecha, presente, 'barcode' as metodo FROM barcode_scans ORDER BY fecha DESC");
    while ($row = $result->fetch_assoc()) {
        $registros[] = $row;
    }
    
    // Obtener de qr_scans
    $result = $conn->query("SELECT id, nombre, fecha, presente, 'qr' as metodo FROM qr_scans ORDER BY fecha DESC");
    while ($row = $result->fetch_assoc()) {
        $registros[] = $row;
    }
    
    // Obtener de voice_scans
    $result = $conn->query("SELECT id, nombre, fecha, presente, 'voice' as metodo FROM voice_scans ORDER BY fecha DESC");
    while ($row = $result->fetch_assoc()) {
        $registros[] = $row;
    }
    
    // Obtener de face_scans
    $result = $conn->query("SELECT id, nombre, fecha, presente, 'face' as metodo FROM face_scans ORDER BY fecha DESC");
    while ($row = $result->fetch_assoc()) {
        $registros[] = $row;
    }
    
    // Ordenar todos los registros por fecha descendente
    usort($registros, function($a, $b) {
        return strtotime($b['fecha']) - strtotime($a['fecha']);
    });
    
    echo json_encode(['success' => true, 'data' => $registros]);
}

$conn->close();
?>
