import * as yup from 'yup';
import {UserRole} from "@lib/enum/UserRole";

const RegisterProviderValidation = yup.object({

    phoneNumber: yup.string().required(" Số điện thoại không được để trống!")
        .matches(/(^0\d{9}$)|(^[1-9][0-9]{8}$)/, 'Số điện thoại  không hợp lệ!'),

    roles: yup.array()
        .of(
            yup.string().oneOf(
                [UserRole.ROLE_USER, UserRole.ROLE_PROVIDER, UserRole.ROLE_STUDIO, UserRole.ROLE_PHOTO, UserRole.ROLE_MAKEUP, UserRole.ROLE_MODEL],
                'Vai trò không hợp lệ'
            )
        )
        .required('Ít nhất một vai trò là bắt buộc')
        .min(2, 'Phải chọn ít nhất một vai trò'),


    address: yup.string()
        .required('Địa chỉ không được để trống') // Không được để trống
});

export default RegisterProviderValidation;