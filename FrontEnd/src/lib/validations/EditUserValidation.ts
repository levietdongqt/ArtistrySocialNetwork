import * as yup from 'yup';
import {UserRole} from "@lib/enum/UserRole";
const today = new Date();

// Đối tượng Date đại diện cho ngày 16 năm trước đây
const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

const EditUserValidation = yup.object({
    phoneNumber: yup.string().required(" Số điện thoại không được để trống!")
        .matches(/(^0\d{9}$)|(^[1-9][0-9]{8}$)/, 'Số điện thoại  không hợp lệ!'),

    fullName: yup.string()
        .matches(/^[\p{L} ,.'-]+$/u, "Họ và tên không hợp lệ!")
        .min(2, "Họ và tên quá ngắn!")
        .max(50, "Họ và tên quá dài!"),
    email: yup.string()
        .email("Địa chỉ email không hợp lệ!"),
    dateOfBirth: yup.date()
        .max(sixteenYearsAgo, 'Tuổi phải lớn hơn 16!')
});

export default EditUserValidation;