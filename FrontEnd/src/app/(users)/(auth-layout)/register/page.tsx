import {FormRegister} from "../_components/form-register";

export default function Register() {
    return (
        <>
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-6/12 px-4">
                        <div
                            className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-200 border-0">
                            <FormRegister/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
