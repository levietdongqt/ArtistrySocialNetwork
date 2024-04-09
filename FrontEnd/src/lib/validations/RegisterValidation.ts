import * as yup from 'yup';


const RegisterValidation = yup.object().shape({
    email: yup.string().required("Email không được để trống!")
        .max(50, "Email quá dài!")
        .matches(/(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)|(^\d{10,11}$)/, 'Email hoặc số điện thoại không hợp lệ!'),
    password: yup.string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu tối thiểu 6 kí tự")
        .max(20, "Mật khẩu tối đa 20 kí tự"),
    fullName: yup.string()
        .required("Tên không được để trống")
        .max(50, "Tên quá dài!")
        .min(5, "Họ và tên quá ngắn "),
    rePassword: yup.string()
        .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp! ')
        .required('Vui lòng xác nhận lại mật khẩu.'),
    isGetGeolocation: yup.boolean().isTrue("Vui lòng cho phép chúng tôi xác định vị trí của bạn!")

});
export default RegisterValidation;