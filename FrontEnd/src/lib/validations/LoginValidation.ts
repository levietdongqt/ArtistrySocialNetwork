import * as yup from 'yup';


const LoginValidations = yup.object().shape({
    email: yup.string().required("Email không được để trống!").email("Email không hợp lệ! "),
    password: yup.string().required("Mật khẩu không được để trống").min(6,"Mật khẩu tối thiểu 6 kí tự").max(20,"Mật khẩu tối đa 20 kí tự"),
});
export default LoginValidations;