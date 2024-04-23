'use client'
import {CustomIcon} from "@components/ui/custom-icon";
import React, {FunctionComponent} from "react";
import {Tooltip} from "@nextui-org/react";

export function MyTooltip({
                              children,
                              content,
                          }: {
    children: React.ReactNode;
    content: string;
}) {
    return (
        <Tooltip color={"default"} content={content} closeDelay={80}
                 className="bg-[#c6e3fa] px-2.5 pt-1.5 pb-1 text-black text-sm rounded-xl relative overflow-hidden">
            {children}
        </Tooltip>
    )
}