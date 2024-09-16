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
                readers: ["ean_reader", "upc_reader"] // Ensure UPC and EAN barcodes are supported
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
            console.log("Detected Barcode:", barcode);

            // Only process barcodes that start with "9" (for Malaysia)
            if (barcode.startsWith("9")) {
                fetchItemDetails(barcode);
            } else {
                itemNameElement.textContent = "Non-Malaysian product";
                itemPriceElement.textContent = "---";
            }
        });
    }

    function fetchItemDetails(barcode) {
        // Local database of Malaysian items and prices (barcodes starting with "9")
        const database = {
            "955378203280": { name: "Malaysian Pika", price: "RM 0.30" },
            "955126668200": { name: "Vaseline Malaysia", price: "RM 34.00" },
            // Add more Malaysian barcodes and item details here...
        };

        // Normalize the barcode (trim leading zeros for comparison)
        const normalizedBarcode = barcode.replace(/^0+/, ''); // Remove leading zeros

        // Check if the barcode is in the database
        const item = database[barcode] || database[normalizedBarcode];
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
