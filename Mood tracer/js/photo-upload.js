// Модуль для работы с загрузкой фото
class PhotoUpload {
    constructor() {
        this.selectedPhotos = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const photoInput = document.getElementById('photoInput');
        const uploadArea = document.getElementById('photoUploadArea');

        photoInput.addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });

        /
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(66, 165, 245, 0.2)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.background = 'rgba(255,255,255,0.5)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'rgba(255,255,255,0.5)';
            photoInput.files = e.dataTransfer.files;
            const event = new Event('change');
            photoInput.dispatchEvent(event);
        });

        // Клик по области загрузки
        uploadArea.addEventListener('click', () => {
            photoInput.click();
        });
    }

    handleFileSelect(e) {
        const files = e.target.files;
        const preview = document.getElementById('photoPreview');

        for (let file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addPhotoPreview(e.target.result, file.name, preview);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    addPhotoPreview(dataUrl, fileName, preview) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${dataUrl}" alt="Preview">
            <button class="remove-photo" onclick="photoUpload.removePhoto(this)">×</button>
        `;
        preview.appendChild(photoItem);
        this.selectedPhotos.push({
            data: dataUrl,
            name: fileName
        });
    }

    removePhoto(button) {
        const photoItem = button.parentElement;
        const preview = document.getElementById('photoPreview');
        const index = Array.from(preview.children).indexOf(photoItem);
        this.selectedPhotos.splice(index, 1);
        photoItem.remove();
    }

    getSelectedPhotos() {
        return this.selectedPhotos;
    }

    clearPhotos() {
        this.selectedPhotos = [];
        document.getElementById('photoPreview').innerHTML = '';
    }
}

// Инициализация модуля загрузки фото
const photoUpload = new PhotoUpload();