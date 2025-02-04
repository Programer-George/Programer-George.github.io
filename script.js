// Variables globales para almacenar datos del CSV
let headers = [];
let csvData = [];
let fabricanteIndex, lineaProductoIndex, modeloIndex;

// Cargar el archivo CSV al iniciar
document.addEventListener('DOMContentLoaded', () => {
    fetchCSVData('assets/DispositivosCompatibles.csv');
});

// Función para cargar y procesar el archivo CSV
function fetchCSVData(filename) {
    fetch(filename)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.trim()).filter(row => row !== "");

            // Extraer los encabezados
            headers = rows[0].split(',').map(h => h.trim());
            fabricanteIndex = headers.indexOf("Fabricante");
            lineaProductoIndex = headers.indexOf("Linea_de_producto");
            modeloIndex = headers.indexOf("Modelo_del_dispositivo");

            // Extraer datos, omitiendo la primera fila (encabezados)
            csvData = rows.slice(1).map(row => row.split(',').map(col => col.trim()));

            // Llenar el select de fabricantes
            populateManufacturerSelect();
        })
        .catch(error => console.error('Error al cargar el archivo CSV:', error));
}

// Poblar el selector de fabricantes con opciones únicas
function populateManufacturerSelect() {
    const manufacturerSelect = document.getElementById('manufacturerSelect');
    const uniqueManufacturers = new Set(csvData.map(row => row[fabricanteIndex]));

    uniqueManufacturers.forEach(manufacturer => {
        const option = document.createElement('option');
        option.value = manufacturer;
        option.textContent = manufacturer;
        manufacturerSelect.appendChild(option);
    });

    manufacturerSelect.addEventListener('change', () => {
        const selectedManufacturer = manufacturerSelect.value;
        populateProductLineSelect(selectedManufacturer);
    });
}

// Poblar el selector de línea de producto basado en el fabricante seleccionado
function populateProductLineSelect(manufacturer) {
    const productLineSelect = document.getElementById('productLineSelect');
    productLineSelect.innerHTML = '<option value="" selected>-- Seleccione una línea de producto --</option>';
    productLineSelect.disabled = false;

    const filteredLines = new Set(
        csvData.filter(row => row[fabricanteIndex] === manufacturer).map(row => row[lineaProductoIndex])
    );

    filteredLines.forEach(line => {
        const option = document.createElement('option');
        option.value = line;
        option.textContent = line;
        productLineSelect.appendChild(option);
    });

    productLineSelect.addEventListener('change', () => {
        const selectedLine = productLineSelect.value;
        populateDeviceModelSelect(manufacturer, selectedLine);
    });
}

// Poblar el selector de modelo basado en la línea de producto seleccionada
function populateDeviceModelSelect(manufacturer, productLine) {
    const deviceModelSelect = document.getElementById('deviceModelSelect');
    deviceModelSelect.innerHTML = '<option value="" selected>-- Seleccione un modelo --</option>';
    deviceModelSelect.disabled = false;

    const filteredModels = csvData.filter(row => 
        row[fabricanteIndex] === manufacturer && row[lineaProductoIndex] === productLine
    );

    filteredModels.forEach(row => {
        const option = document.createElement('option');
        option.value = row[modeloIndex];
        option.textContent = row[modeloIndex];
        deviceModelSelect.appendChild(option);
    });

    deviceModelSelect.addEventListener('change', () => {
        showDeviceList(manufacturer, productLine, deviceModelSelect.value);
    });
}

// Mostrar el modelo seleccionado en una lista
function showDeviceList(manufacturer, productLine, model) {
    const deviceList = document.getElementById('deviceList');
    deviceList.innerHTML = '';

    const filteredDevices = csvData.filter(row => 
        row[fabricanteIndex] === manufacturer && row[lineaProductoIndex] === productLine && row[modeloIndex] === model
    );

    filteredDevices.forEach(row => {
        const li = document.createElement('li');
        li.textContent = `${row[fabricanteIndex]} - ${row[lineaProductoIndex]} - ${row[modeloIndex]}`;
        deviceList.appendChild(li);
    });
}