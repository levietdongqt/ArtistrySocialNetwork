import React, { useState, useCallback } from 'react';

export interface ImageItem {
    id: string;
    src: string;
}

// Thêm prop `onImageListChange` để thông báo cho parent component
interface ImageServiceProps {
    onImageListChange: (images: ImageItem[]) => void;
}

const ImageService: React.FC<ImageServiceProps> = ({ onImageListChange }) => {
    const [images, setImages] = useState<ImageItem[]>([]);

    // Sử dụng useCallback để đảm bảo hàm không thay đổi qua mỗi lần render
    const updateImageList = useCallback((newImages: ImageItem[]) => {
        setImages(newImages);
        onImageListChange(newImages); // Gọi callback với danh sách mới
    }, [onImageListChange]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newImages: ImageItem[] = Array.from(event.target.files).map((file) => ({
                id: URL.createObjectURL(file), // Create a unique URL for the file
                src: URL.createObjectURL(file) // Use that URL for the src
            }));
            const allImages = [...images, ...newImages];
            updateImageList(allImages);
            event.target.value = ''; // Reset input sau khi đã tải ảnh thành công
        }
    };

    const handleRemoveImage = (imageId: string) => {
        const updatedImages = images.filter((image) => image.id !== imageId);
        updateImageList(updatedImages);
        // Giả sử chúng ta chỉ có URL, tìm URL để revoke
        const image = images.find((image) => image.id === imageId);
        if (image) {
            URL.revokeObjectURL(image.src);
        }
    };


    return (
        <div className="image-service max-w-6xl mx-auto my-8 p-6 bg-gray-100 rounded-lg shadow">
            <input
                id="image-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                hidden
            />


            <div className="images-preview-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
                {images.map((image, index) => (
                    <div key={image.id} className="relative">
                        <img src={image.src} alt={`image ${index}`}
                             className="object-cover rounded-lg shadow-lg w-full h-48"/>
                        <button
                            className="absolute top-2 right-2 bg-light-primary/75 p-1 backdrop-blur-sm
                           hover:bg-image-preview-hover/75 text-white p-2 rounded-full shadow-lg transition duration-300 ease-in-out  focus:outline-none"
                            type="button"
                            onClick={() => handleRemoveImage(image.id)}
                        >
                            &#10005;
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-2">
                <label
                    htmlFor="image-input"
                    className="cursor-pointer bg-blue-600 text-white py-2 px-6 mb-4 rounded-lg shadow-lg hover:bg-blue-700 transition ease-in-out duration-300 focus:outline-none"
                >
                    {images.length === 0 ? 'Bấm vào để tải ảnh lên' : 'Thêm ảnh'}
                </label>
            </div>

        </div>
    );
};

export default ImageService;