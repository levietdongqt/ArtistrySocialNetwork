import * as yup from 'yup';


const RegisterValidation = yup.object().shape({
    phoneNumber: yup.string().required(" Số điện thoại không được để trống!")
        .matches(/(^0\d{9}$)|(^[1-9][0-9]{8}$)/, 'Số điện thoại  không hợp lệ!'),
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

});
export default RegisterValidation;