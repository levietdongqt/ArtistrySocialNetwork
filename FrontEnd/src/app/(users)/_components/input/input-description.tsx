import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface DescriptionInputProps {
    value: string;
    onChange: (value: string) => void;

}

const DescriptionInput: React.FC<DescriptionInputProps> = ({value, onChange}) => {

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // Các nút định dạng chữ đơn giản
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }], // Định dạng tiêu đề
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }], // Định dạng subscripts/superscripts
            [{ 'indent': '-1'}, { 'indent': '+1' }], // Thụt lề
            [{ 'direction': 'rtl' }], // Text hướng phải

            [{ 'size': ['small', false, 'large', 'huge'] }], // Thay đổi kích thước chữ
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }],// Dropdown nút để chọn màu cho chữ và màu nền
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean'], // Nút xóa định dạng

            ['link', 'image', 'video'] // Liên kết và hình ảnh, video
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'color', 'code-block'
    ];

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder="Nhập mô tả..."
        />
    );
};

export default DescriptionInput;