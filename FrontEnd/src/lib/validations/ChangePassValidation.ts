import * as yup from 'yup';


const ChangePassValidation = yup.object().shape({
    oldPass: yup.string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu tối thiểu 6 kí tự")
        .max(20, "Mật khẩu tối đa 20 kí tự"),
    newPass: yup.string()
        .notOneOf([yup.ref('oldPass')], 'Mật khẩu mới trùng với mật khẩu cũ! ') // Sử dụng đúng key là 'oldPass' từ initialValues
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu tối thiểu 6 kí tự")
        .max(20, "Mật khẩu tối đa 20 kí tự")
        .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một ký tự in hoa')
        .matches(/[@$!%*?&#]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt')
        .matches(/\d/, 'Mật khẩu phải chứa ít nhất một số'),
    reNewPass: yup.string()
        .oneOf([yup.ref('newPass')], 'Mật khẩu không trùng khớp! ') // Tham chiếu đến 'newPass'
        .required('Vui lòng xác nhận lại mật khẩu.'),
});
export default ChangePassValidation;