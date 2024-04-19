import * as yup from 'yup';


const LoginValidations = yup.object().shape({
    phoneNumber: yup.string().required(" Số điện thoại không được để trống!")
        .matches(/(^0\d{9}$)|(^[1-9][0-9]{8}$)/, 'Số điện thoại  không hợp lệ!'),
    password: yup.string().required("Mật khẩu không được để trống").min(6,"Mật khẩu tối thiểu 6 kí tự").max(20,"Mật khẩu tối đa 20 kí tự"),
});
export default LoginValidations;