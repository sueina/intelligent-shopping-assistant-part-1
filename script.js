document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera-stream');
    const itemNameElement = document.getElementById('item-name');
    const itemPriceElement = document.getElementById('item-price');

    // Function to start the camera and handle permission
    function startScanner() {
        // Request access to the camera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                video.srcObject = stream; // Set the video stream to the video element
                video.play();
                startBarcodeScanner();
            })
            .catch(function(err) {
                console.error("Error accessing camera: ", err);
                alert("Camera access is required for scanning. Please allow camera access.");
            });
    }

    function startBarcodeScanner() {
        Quagga.init({
            inputStream: {
                type: "LiveStream",
                target: video,
                constraints: {
                    facingMode: "environment" // Use the back camera
                }
            },
            decoder: {
                readers: ["ean_reader", "code_128_reader", "upc_reader"] // Support multiple barcode types
            }
        }, function(err) {
            if (err) {
                console.error("QuaggaJS initialization error:", err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(function(result) {
            const barcode = result.codeResult.code;
            console.log("Detected Barcode: ", barcode);
            fetchItemDetails(barcode);
        });
    }

    function fetchItemDetails(barcode) {
        const database = {
            "556378203280": { name: "Pika", price: "RM 0.30" },
            "556126668200": { name: "Vaseline expert care", price: "RM 34.00" },
        };

        const item = database[barcode];
        if (item) {
            itemNameElement.textContent = `Item: ${item.name}`;
            itemPriceElement.textContent = `Price: ${item.price}`;
        } else {
            itemNameElement.textContent = "Item not found";
            itemPriceElement.textContent = "---";
        }
    }

    // Start camera and barcode scanner
    startScanner();
});
