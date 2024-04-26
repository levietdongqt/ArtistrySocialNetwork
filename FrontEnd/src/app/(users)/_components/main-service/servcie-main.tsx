import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { GetAllMainService } from "services/main/clientRequest/service";
import useSWR from "swr";
import ServiceTable from "./service-table";
import { addRowNumber } from "@lib/helper/addRowSerivce";
import { MainService } from "@models/main-service";



export default function ServiceMain() {
    const {currentUser} =useUser();
    const [mainData,setMainData] = useState<MainService[]>([]);
    const {
        data: data,
        isLoading: isLoading,
        error: error2,
      } = useSWR(
        GetAllMainService(currentUser?.id as string),
        fetcherWithToken
      );

    useEffect(()=>{
        if(data){
            setMainData(addRowNumber(data.data.sort((a:any,b:any) => new Date(b.createDate).getTime() - new Date (a.createDate).getTime())));
        } 
    },[data])
    return (
        <ServiceTable data={mainData as any}></ServiceTable>
    )
}
    