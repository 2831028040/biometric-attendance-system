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
    
    $codigo = $data['codigo'] ?? '';
    $metodo = $data['metodo'] ?? '';
    
    $stmt = $conn->prepare("INSERT INTO asistencia (codigo, metodo, presente) VALUES (?, ?, 1)");
    $stmt->bind_param("ss", $codigo, $metodo);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    
    $stmt->close();
}

// GET - Obtener todos
else if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM asistencia ORDER BY fecha DESC");
    $registros = [];
    
    while ($row = $result->fetch_assoc()) {
        $registros[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $registros]);
}

$conn->close();
?>
