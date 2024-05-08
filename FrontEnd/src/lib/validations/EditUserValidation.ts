import * as yup from 'yup';
import {UserRole} from "@lib/enum/UserRole";

const EditUserValidation = yup.object({
    phoneNumber: yup.string().required(" Số điện thoại không được để trống!")
        .matches(/(^0\d{9}$)|(^[1-9][0-9]{8}$)/, 'Số điện thoại  không hợp lệ!'),

});

export default EditUserValidation;