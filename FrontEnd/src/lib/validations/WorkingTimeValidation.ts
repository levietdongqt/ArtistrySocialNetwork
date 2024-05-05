import * as yup from 'yup';

const WorkingTimeValidation = yup.object({
    startDate: yup.date()
        .required("Ngày bắt đầu không được để trống!")
        .test('is-not-greater', 'Ngày bắt đầu không được lớn hơn ngày kết thúc', function(value) {
            const endDate = this.parent.endDate;
            if (endDate) {
                return value <= endDate;
            }
            return true;
        })
        .test('is-less-than-now', 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại', function(value) {
            const startDate = this.parent.startDate;
            const currentDate = new Date();
            if (startDate) {
                return value >= currentDate;
            }
            return true;
        }),
    endDate: yup.date()
        .required("Ngày kết thúc không được để trống!")
        .test('is-less-than', 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu', function(value) {
            const startDate = this.parent.startDate;
            const currentDate = new Date();
            if (startDate) {
                return value >= startDate
            }
            return true;
        })
        .test('is-less-than-now', 'Ngày kết thúc không được nhỏ hơn ngày hiện tại', function(value) {
            const endDate = this.parent.endDate;
            const currentDate = new Date();
            if (endDate) {
                return value >= currentDate;
            }
            return true;
        })


});

export default WorkingTimeValidation;