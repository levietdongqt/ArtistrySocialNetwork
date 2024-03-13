'use client'
import {useWindow} from "../../../../context/window-context";
import {Input} from "./input";


function InputMobile() {
    const { isMobile } = useWindow();
    return (
        <div>
            {!isMobile && <Input />}
        </div>
    );
}

export default InputMobile;