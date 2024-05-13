import { DayOfWeek } from '@lib/enum/WorkingDay';
import { formatDate, getDatesBetween } from '@lib/helper/convertTime';
import dayjs from 'dayjs';
import * as yup from 'yup';

const WorkingTimeValidation = yup.object({
    startDate: yup.date()
        .required("Ngày bắt đầu không được để trống!")
        .test('is-not-greater', 'Ngày bắt đầu không được lớn hơn hoặc bằng ngày kết thúc', function(value) {
            const endDate = this.parent.endDate as Date;
            if (endDate) {
                return formatDate(value) < formatDate(endDate);
            }
            return true;
        })
        .test('is-less-than-now', 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại', function(value) {
            const startDate = this.parent.startDate as Date;       
            const currentDate = new Date();
            if (startDate) {
                return formatDate(value) >= formatDate(currentDate)
            }
            return true;
        }),
    endDate: yup.date()
        .required("Ngày kết thúc không được để trống!")
        .test('is-less-than', 'Ngày kết thúc không được nhỏ hơn hoặc bằng ngày bắt đầu', function(value) {
            const startDate = this.parent.startDate as Date;
            if (startDate) {
                return formatDate(value) > formatDate(startDate)
            }
            return true;
        })
        .test('is-less-than-now', 'Ngày kết thúc không được nhỏ hơn ngày hiện tại', function(value) {
            const endDate = this.parent.endDate as Date;
            const currentDate = new Date();
            if (endDate) {
                return formatDate(value) >= formatDate(currentDate)
            }
            return true;
        }),
    startTime: yup.date()
        .test('is-time-greater-than','Giờ bắt đầu không được lớn hơn giờ kết thúc',
        function(value) {
            const endTime = this.parent.endTime as Date;
            if (endTime) {
                return value! <= endTime
            }
            return true;
        }
        ),
    endTime: yup.date()
    .test('is-time-less-than','Giờ kết thúc không được nhỏ hơn giờ bắt đầu', function(value) {
        const startTime = this.parent.startTime as Date;
        if (startTime) {
            return value! >= startTime
        }
        return true;
    })


});

export default WorkingTimeValidation;