'use client'
import React, {useState, FC, useEffect} from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadFile, RcFile } from 'antd/es/upload/interface';

export interface ImageItem {
    id: string;
    src: string;
}

interface UploadImagesProps {
    onImageListChange: (images: ImageItem[]) => void;
}

const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

const UploadImages: FC<UploadImagesProps> = ({ onImageListChange }) => {
    const [previewImage, setPreviewImage] = useState('');
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

    useEffect(() => {
        let tooltips = document.querySelectorAll('.ant-tooltip-hidden');
        tooltips.forEach(tooltip => tooltip.remove());
    }, []);

    const handleCancel = () => setVisible(false);

    const handlePreview = async (file: UploadFile<any>) => {
        let previewImage = file.url || file.preview;

        if (!previewImage) {
            previewImage = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(previewImage);
        setVisible(true);
    };

    const handleChange = ({ fileList }: UploadChangeParam<UploadFile<any>>) => {
        console.log("fileList",fileList)
        setFileList(fileList);
        const imageData = fileList.map((file) => ({
            id: file.uid,
            src: file.name || '',
        }));
        console.log("imageData",imageData)
        onImageListChange(imageData);
    };

    return (
        <div>
            <Upload
                multiple={true}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                { fileList.length >= 8 ? null : <div><PlusOutlined/> Tải ảnh </div>   }
            </Upload>
            <Modal  footer={null} onCancel={handleCancel}>
                <img className="w-full pointer-events-none" src={previewImage} alt="" />
            </Modal>
        </div>
    );
};

export default UploadImages;