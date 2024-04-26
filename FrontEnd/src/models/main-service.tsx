import { formatNumber } from "@lib/date";
import { dateParse } from "@lib/helper/dateParse";
import {User} from "@models/user";
import { Button } from '@components/ui/button';
import { Popover, Tag } from "antd";
import { DashOutlined } from "@ant-design/icons";
import { useState } from "react";

export type MainService = {
id: number|null;
provider : User|null;
name: string;
price : number;
priceType: string;
duration: number;
restTime: number;
imageUrls: string[];
description: string;
createDate: Date;
updateDate: Date;
promotionDTO: any|null ;
status: boolean;
rowNumber?: number;
};

