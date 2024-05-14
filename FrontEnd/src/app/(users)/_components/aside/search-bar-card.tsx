import { HeroIcon } from "@components/ui/hero-icon";
import { Avatar } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ServiceDetail from "../main-service/servicer-detail";
import useSWR from "swr";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { GetMainServiceById } from "services/main/clientRequest/service";
import { MainService } from "@models/main-service";
import HtmlRenderer from "../user/html-render";

interface SearchBarCardProps {
  id: string | number;
  avatar?: string;
  roles?: string[];
  fullName?: string;
  content?: string;
  description?: string;
  nameService?: string;
  type: string;
  handleFunction: Function;
}

export function SearchBarCard({
  id,
  avatar,
  roles,
  content,
  description,
  nameService,
  fullName,
  type,
  handleFunction,
}: SearchBarCardProps): JSX.Element {
  const [openModalServiceDetail, setOpenModalServiceDetail] = useState(false);
  const [serviceData,setServiceData] = useState<MainService>();
  var nameCard =
    type === "service" ? "Dịch vụ" : type === "post" ? "Bài đăng" : "";
    const {
      data: data,
      isLoading: isLoading,
      error: error2,
    } = useSWR(
      openModalServiceDetail ?
      GetMainServiceById(id as number) : null, fetcherWithToken);
  useEffect(() => {
    if (data) {
      setServiceData(data.data);
    }
  }, [data]);
  const handleOpenServiceDetail = () => {
      setOpenModalServiceDetail(true);
  }

  return (
    <>
    <Link
      href={type === "user"
      ? `/profile/${id}`
      : type === "post"
      ? `/post/${id}`
      : ``}
      className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
      onClick={() => {
        handleFunction();
        if (type === "service"){
          handleOpenServiceDetail();
        }
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button>
            <HeroIcon
              className="h-5 w-5 text-light-secondary transition-colors 
                                                    group-focus-within:text-main-accent dark:text-dark-secondary"
              iconName={
                type === "user"
                  ? "ArrowTrendingUpIcon"
                  : type === "service"
                  ? "ArrowDownOnSquareStackIcon"
                  : "MagnifyingGlassIcon"
              }
            />
          </button>
          {type === "user" && <Avatar src={avatar} shape="square"></Avatar>}
          <div className="flex flex-col justify-center ml-3">
            {(type === "user" || type === "post") && (
              <h3 className="text-lg font-bold">{fullName}</h3>
            )}
           <h3 className="text-lg font-bold">{nameService}</h3>
            {type == "user" &&
              roles &&
              roles.map((role: string, index: number) => (
                <React.Fragment key={index}>
                  <h5>{role}</h5>
                </React.Fragment>
              ))}
            <HtmlRenderer htmlString={description as string || content as string} />
            <h5>{nameCard}</h5>
          </div>
        </div>
      </div>
    </Link>
    { serviceData && <ServiceDetail data={serviceData as MainService} isModalVisible={openModalServiceDetail} setIsModalVisible={setOpenModalServiceDetail} />}
    </>
  );
}
