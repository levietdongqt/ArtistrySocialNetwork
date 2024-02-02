import LeftSideBar from "@/app/(users)/_components/LeftSideBar";
import Main from "@/app/(users)/_components/Main";
import {BsSearch} from "react-icons/bs";
import RightSideBar from "@/app/(users)/_components/RightSideBar";


export default function Home() {
    return (
        <div className={'w-full h-full flex justify-center items-center relative bg-black'}>
            <div className={'max-w-[70vw] w-full h-full flex relative '}>
                {/*Left sidebar for navigation/header*/}
                <LeftSideBar/>
                {/*Main sidebar for navigation/header*/}
                <Main />
                {/*Right sidebar for navigation/header*/}
                <RightSideBar/>

            </div>
        </div>
    )
}
