import * as yup from 'yup';


const ChangePassValidation = yup.object().shape({
    oldPassword:yup.string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu tối thiểu 6 kí tự")
        .max(20, "Mật khẩu tối đa 20 kí tự"),
    password: yup.string()
        .notOneOf([yup.ref('oldPassword')], 'Mật khẩu mới trùng với mật khẩu cũ! ')
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu tối thiểu 6 kí tự")
        .max(20, "Mật khẩu tối đa 20 kí tự"),
    rePassword: yup.string()
        .oneOf([yup.ref('password')], 'Mật khẩu không trùng khớp! ')
        .required('Vui lòng xác nhận lại mật khẩu.'),
});
export default ChangePassValidation;