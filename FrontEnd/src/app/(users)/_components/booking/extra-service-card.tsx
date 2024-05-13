import {UserTooltip} from "../user/user-tooltip";
import {UserAvatar} from "../user/user-avatar";
import {Dropdown, Tooltip} from "antd";
import {EllipsisOutlined, PlusCircleFilled, PlusOutlined} from "@ant-design/icons";
import React from "react";
import DOMPurify from "dompurify";
import {ExtraService} from "@models/extra-service";

interface props {
    data: ExtraService;
    callback: (extraService: ExtraService) => void;
}

export default function ExtraServiceCard({data, callback}: props) {
    const cleanFullBioContent = DOMPurify.sanitize(data.description);

    return (
        <div
            className="flex">
            {/* Cột thứ nhất: Tên dịch vụ, Giá và Mô tả */}
            <div className={'flex ml-4 mr-2 w-[40%]  '}>
                <div className={' pt-2 '}>
                    <span className={"pr-3 text-black text-[15px] "}>{data.name}</span>
                    <Tooltip title={"Thêm"}>
                        <PlusCircleFilled className={''} onClick={() => callback(data)}/>
                    </Tooltip>
                </div>
            </div>

            <div className="flex pt-2 flex-col h-[100px] w-[60%]">

                <div className="text-sm text-light-secondary dark:text-dark-secondary">
                </div>
                <div className="text-sm text-light-secondary dark:text-dark-secondary">
                    Giá: {data?.price}đ/{data.priceType}
                </div>
                <div
                    dangerouslySetInnerHTML={{__html: cleanFullBioContent.substring(0, 70) + (cleanFullBioContent.length > 70 ? '...' : '')}}>
                </div>
            </div>

        </div>
    )
}