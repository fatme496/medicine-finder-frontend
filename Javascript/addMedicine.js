function toggleUploadFields() {
    const choice = document.getElementById("uploadChoice").value;
    document.getElementById("imageUrlField").style.display = choice === "url" ? "block" : "none";
    document.getElementById("imageUploadField").style.display = choice === "file" ? "block" : "none";

    // Clear preview and fields when switching
    document.getElementById("previewImage").style.display = "none";
    document.getElementById("image").value = "";
    document.getElementById("upload").value = "";
    document.getElementById("uploadedImageUrl").value = "";
}

function updatePreview() {
    const imageUrl = document.getElementById('image').value.trim();
    const previewImg = document.getElementById('previewImage');
    const isValidImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(imageUrl);
    previewImg.src = isValidImage ? imageUrl : '';
    previewImg.style.display = isValidImage ? 'block' : 'none';
}

async function uploadToImgbb(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const apiKey = "881015a881febe3549ed179f67fa91f1"; // Your ImgBB API key

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            const url = data.data.url;
            document.getElementById("previewImage").src = url;
            document.getElementById("previewImage").style.display = "block";
            document.getElementById("uploadedImageUrl").value = url;
        } else {
            alert("Upload failed. Please try again.");
        }
    } catch (err) {
        alert("An error occurred while uploading the image.");
        console.error(err);
    }
}

document.getElementById("medicineForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const uploadChoice = document.getElementById("uploadChoice").value;
    let imageUrl = "";

    if (uploadChoice === "url") {
        imageUrl = document.getElementById("image").value.trim();
        if (!imageUrl) {
            alert("Please enter a valid image URL.");
            return;
        }
    } else {
        const file = document.getElementById("upload").files[0];
        if (!file) {
            alert("Please select an image to upload.");
            return;
        }

        // Upload to imgbb now
        const formData = new FormData();
        formData.append("image", file);
        const apiKey = "881015a881febe3549ed179f67fa91f1";

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                imageUrl = data.data.url;
                document.getElementById("previewImage").src = imageUrl;
                document.getElementById("previewImage").style.display = "block";
            } else {
                alert("Image upload failed.");
                return;
            }
        } catch (err) {
            alert("Error uploading image.");
            console.error(err);
            return;
        }
    }

    // Now you can collect all form data and send it where you want
    const medicineData = {
        name: document.getElementById("medicineName").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        dosage: document.getElementById("dosage").value,
        price: document.getElementById("price").value,
        availability: document.getElementById("availability").value,
        expiry: document.getElementById("expiry").value,
        imageUrl: imageUrl,
    };

    console.log("Medicine data to send:", medicineData);

    // Optional: replace this with AJAX request to backend
    alert("Medicine saved (simulated). Check console for data.");
});