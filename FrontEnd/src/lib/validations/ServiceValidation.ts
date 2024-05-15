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
    priceType: yup.string()
        .required("Loại giá không được để trống!")

    // imageUrl: yup.array()
    //     .of(yup.string().url("URL ảnh phải hợp lệ"))
    //     .required("Ảnh không được để trống"),
    // description: yup.string()
    //     .required("Mô tả dịch vụ không được để trống")
    //     .max(500, "Mô tả quá dài!")
});
export const ExtraServiceValidation = yup.object({
    name: yup.string()
        .required("Tên tả dịch vụ không được để trống")
        .max(100, "Mô tả quá dài!"),
    price: yup.number()
        .required("Giá không được để trống!")
        .positive("Giá không được nhỏ hơn 0"),
    // duration: yup.number()
    //     .required("Thời lượng không được để trống!")
    //     .positive("Thời lượng không được nhỏ hơn 0")
    //     .integer("Thời lượng phải là một số nguyên"),
    priceType: yup.string()
        .required("Loại giá không được để trống!")

    // imageUrl: yup.array()
    //     .of(yup.string().url("URL ảnh phải hợp lệ"))
    //     .required("Ảnh không được để trống"),
    // description: yup.string()
    //     .required("Mô tả dịch vụ không được để trống")
    //     .max(500, "Mô tả quá dài!")
});
export default ServiceValidation;


