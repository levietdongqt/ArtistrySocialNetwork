import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useUser } from "context/user-context";
import { useEffect, useState } from "react";
import { GetAllMainService } from "services/main/clientRequest/service";
import useSWR from "swr";
import ServiceTable from "./service-table";



export default function ServiceMain() {
    const {currentUser} =useUser();
    const [mainData,setMainData] = useState();
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
            setMainData(data.data);
        } 
    },[data])
    return (
        <ServiceTable data={mainData as any} type="main-service"></ServiceTable>
    )
}
    