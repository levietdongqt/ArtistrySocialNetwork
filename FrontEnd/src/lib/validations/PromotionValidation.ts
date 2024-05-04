import * as yup from 'yup';

const PromotionValidation = yup.object({
    name: yup.string()
        .required("Tên tả dịch vụ không được để trống")
        .max(50, "tên quá dài!"),
    discountPercent: yup.number()
        .required("Phần trăm giảm giá không được để trống!")
        .positive("Phần trăm giảm giá không được nhỏ hơn 0")
        .max(100, "Phần trăm giảm giá không được lớn hơn 100%"),
    startDate: yup.date()
        .required("Ngày bắt đầu không được để trống!")
        .test('is-not-greater', 'Ngày bắt đầu không được lớn hơn ngày kết thúc', function(value) {
            const endDate = this.parent.endDate;
            if (endDate) {
                return value <= endDate;
            }
            return true;
        }),
    endDate: yup.date()
        .required("Ngày kết thúc không được để trống!")
        .test('is-less-than', 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu', function(value) {
            const startDate = this.parent.startDate;
            if (startDate) {
                return value >= startDate;
            }
            return true;
        }),
    description: yup.string()
        .required("Mô tả khuyến mãi không được để trống")
        .max(500, "Mô tả quá dài!")
});

export default PromotionValidation;