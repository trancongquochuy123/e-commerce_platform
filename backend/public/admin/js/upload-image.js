const uploadImage = document.querySelectorAll("[upload-image]");
if(uploadImage.length > 0) {
    uploadImage.forEach(item => {
        const uploadImageInput = item.querySelector("[upload-image-input]");
        const uploadImagePreview = item.querySelector("[upload-image-preview]");
        const closeButton = item.querySelector("[upload-image-remove]");

        uploadImageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadImagePreview.src = URL.createObjectURL(file);
                if(closeButton) {
                    closeButton.classList.remove("d-none");
                }
            }
        });

        if(closeButton) {
            closeButton.addEventListener("click", () => {
                uploadImageInput.value = "";
                uploadImagePreview.src = "";
                closeButton.classList.add("d-none");
            });
        }
    });
}
