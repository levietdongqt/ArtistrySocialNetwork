'use client'
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import ChangePassValidation from "@lib/validations/ChangePassValidation";
import {changePasswordUser} from "../../../../services/main/clientRequest/userClient";
import {ChangePassDTO} from "@models/user";
interface  Proptype {
    phoneNum: string;
    callback:()=> void;
}

export default function ChangePass({phoneNum,callback}: Proptype) {
    const router = useRouter()


    const {values, touched, handleSubmit, handleChange, errors, isValid, resetForm, setFieldError} = useFormik({
        initialValues: {
            oldPass:'',
            newPass:'',
            reNewPass:'',
        },
        onSubmit: values => {
            showConfirmation({oldPass:values.oldPass, newPass:values.newPass});
        },
        validationSchema: ChangePassValidation,
    });

    const showConfirmation = (data: ChangePassDTO) => {
        Swal.fire({
            title: " Mật khẩu sẽ được thay đổi? ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Huỷ bỏ"
        }).then((result) => {
            if (result.isConfirmed) {
                toast.promise(changePasswordUser(data), {
                    pending: "Đang đổi mật khẩu ...",
                    success: " Đổi mật khẩu thành công!",
                    error: "Đổi mật khẩu thất bại! "
                })
                    .then(value => callback())
                    .catch(error => {
                        if (error.response && error.response.data && error.response.data.message === "Old password is not valid") {
                            // Set lỗi cho 'oldPass'
                            setFieldError("oldPass", "Mật khẩu cũ không đúng.");
                        } else {
                            // Có thể có lỗi khác không liên quan đến mật khẩu cũ.
                            // Bạn có thể muốn hiển thị một thông báo chung cho người dùng,
                            // hoặc dựa vào thông tin lỗi để hiển thị thông báo cụ thể hơn.
                            toast.error("Có lỗi xảy ra khi đổi mật khẩu.");
                        }
                    });
            }
        });
    };
    return (
        <>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-amber-50">
                <div>
                    <h1 className="uppercase text-slate-800 text-xl font-bold pt-10 text-center ">
                        Đổi Mật Khẩu
                    </h1>
                </div>
                <form method="post" onSubmit={handleSubmit}>
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Mật khẩu cũ
                        </label>
                        <input
                            type="password" id="oldPass" name="oldPass"
                            className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Mật khẩu"
                            onChange={handleChange}
                            value={values.oldPass}/>
                        {errors.oldPass && touched.oldPass ?
                            <div className="text-red-700 text-sm">{errors.oldPass}</div> : null}
                    </div>
                    <div className="relative w-full mb-3">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Mật khẩu
                        </label>
                        <input
                            type="password" id="newPass" name="newPass"
                            className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Mật khẩu"
                            onChange={handleChange}
                            value={values.newPass}/>
                        {errors.newPass && touched.newPass ?
                            <div className="text-red-700 text-sm">{errors.newPass}</div> : null}
                    </div>

                    <div className="relative w-full mb-5">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password" id="reNewPass" name="reNewPass"
                            className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Mật khẩu"
                            onChange={handleChange}
                            value={values.reNewPass}/>
                        {errors.reNewPass && touched.reNewPass ?
                            <div className="text-red-700 text-sm">{errors.reNewPass}</div> : null}
                    </div>
                    <div className="text-center mt-6">
                        <button
                            className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            type="submit"
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}