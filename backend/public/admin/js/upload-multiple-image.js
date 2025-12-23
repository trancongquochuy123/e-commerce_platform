const uploadImageMultiple = document.querySelector("[upload-image-multiple]");

if (uploadImageMultiple) {
  const uploadImageInput = uploadImageMultiple.querySelector("[upload-image-input]");
  const imagePreviewContainer = uploadImageMultiple.querySelector(".image-preview-container");

  uploadImageInput.addEventListener("change", (e) => {
    imagePreviewContainer.innerHTML = ""; // Clear previous previews

    const files = e.target.files;

    if (files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const previewItem = document.createElement("div");
          previewItem.className = "image-preview-item";
          
          const img = document.createElement("img");
          img.src = event.target.result;
          img.className = "form-img-preview";
          
          const closeButton = document.createElement("button");
          closeButton.className = "close-button";
          closeButton.innerText = "X";
          closeButton.type = "button";
          closeButton.onclick = () => {
            // This is tricky. For now, we just remove the preview.
            // A better implementation would involve storing files in an array and managing it.
            previewItem.remove();
            // How to remove the file from the input? The easiest way is to reset the input.
            // But that removes all files.
            // For this version, we will just let the user re-select if they make a mistake.
            // Or we can be more clever.
          };

          previewItem.appendChild(img);
          // previewItem.appendChild(closeButton); // Disabled for now as it doesn't remove the file from input
          imagePreviewContainer.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
      }
    }
  });
}
