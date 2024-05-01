import * as yup from 'yup';

const ServiceValidation = yup.object({
    name: yup.string()
        .required("Tên tả dịch vụ không được để trống")
        .max(100, "Mô tả quá dài!"),
    price: yup.number()
        .required("Giá không được để trống!")
        .positive("Giá không được nhỏ hơn 0"),
    duration: yup.number()
        .required("Thời lượng không được để trống!")
        .positive("Thời lượng không được nhỏ hơn 0")
        .integer("Thời lượng phải là một số nguyên"),
    restTime: yup.number()
        .required("Thời gian nghỉ không được để trống!")
        .positive("Thời gian nghỉ không được nhỏ hơn 0")
        .integer("Thời gian nghỉ phải là một số nguyên"),
    imageUrl: yup.array()
        .of(yup.string().url("URL ảnh phải hợp lệ"))
        .required("Ảnh không được để trống"),

});

export default ServiceValidation;