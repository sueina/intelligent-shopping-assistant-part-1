document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('barcode-canvas');
    const context = canvas.getContext('2d');
    const itemNameElement = document.getElementById('item-name');
    const itemPriceElement = document.getElementById('item-price');

    function startScanner() {
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
                console.error(err);
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
        // Local database of items and prices
        const database = {
            "556378203280": { name: "Pika", price: "RM 0.30" },
            "556126668200": { name: "Vaseline expert care", price: "RM 34.00" },
            // Add more barcodes and item details here...
        };

        // Look up the barcode in the database
        const item = database[barcode];
        if (item) {
            itemNameElement.textContent = `Item: ${item.name}`;
            itemPriceElement.textContent = `Price: ${item.price}`;
        } else {
            itemNameElement.textContent = "Item not found";
            itemPriceElement.textContent = "---";
        }
    }

    startScanner();
});
