import { ExtraService, fieldExtraService } from "@models/extra-service";
import { MainService, fieldMainService } from "@models/main-service";
import { Promotion, fieldPromotion } from "@models/promotion";
import { Table } from "antd";

type DataTable = {
   type: string;
   data : any[];
}

export default function ServiceTable({type,data} : DataTable){
    const columns = type ==="main-service" ? fieldMainService : type === "extra-service" ? fieldExtraService : fieldPromotion
    return (
        <Table columns={columns} dataSource={data} />
    )
}