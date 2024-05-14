import { HeroIcon } from "@components/ui/hero-icon";
import { preventBubbling } from "@lib/utils";
import { Avatar } from "antd";
import Link from "next/link";
import ServiceDetail from "../main-service/servicer-detail";
import { useEffect, useState } from "react";
import { MainService } from "@models/main-service";
import { GetMainServiceById } from "services/main/clientRequest/service";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import useSWR from "swr";
import HtmlRenderer from "../user/html-render";

interface HistoryBarCardProps {
  data: History;
  handleFunctionLink: Function;
  handleFunctionDelete: Function;
}

type History = {
  keyword?: string;
  id?: string | number;
  avatar?: string;
  roles?: string[];
  fullName?: string;
  content?: string;
  description?: string;
  nameService?: string;
  type?: string;
};

export function HistoryBarCard({
  data,
  handleFunctionLink,
  handleFunctionDelete,
}: HistoryBarCardProps): JSX.Element {
  const [openModalServiceDetail, setOpenModalServiceDetail] = useState(false);
  const [serviceData, setServiceData] = useState<MainService>();
  const {
    data: data2,
    isLoading: isLoading,
    error: error2,
  } = useSWR(
    openModalServiceDetail ? GetMainServiceById(data.id as number) : null,
    fetcherWithToken
  );
  useEffect(() => {
    if (data2) {
      setServiceData(data2.data);
    }
  }, [data2]);
  const handleOpenServiceDetail = () => {
    setOpenModalServiceDetail(true);
  };
  return (
    <>
      <Link
        href={
          data.keyword
            ? `/search?q=${data.keyword}`
            : data?.type === "user"
            ? `/profile/${data.id}`
            : data?.type === "post"
            ? `/post/${data.id}`
            : ``
        }
        className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
        onClick={() => {
          handleFunctionLink();
          if (data.type === "service") {
            handleOpenServiceDetail();
          }
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {data?.keyword ? (
              <HeroIcon
                className="h-5 w-5 text-light-secondary transition-colors 
                                        group-focus-within:text-main-accent dark:text-dark-secondary"
                iconName="MagnifyingGlassIcon"
              />
            ) : data?.type === "user" ? (
              <HeroIcon
                className="h-5 w-5 text-light-secondary transition-colors 
                                        group-focus-within:text-main-accent dark:text-dark-secondary"
                iconName="ArrowTrendingUpIcon"
              />
            ) : data?.type === "post" ? (
              <HeroIcon
                className="h-5 w-5 text-light-secondary transition-colors 
                                        group-focus-within:text-main-accent dark:text-dark-secondary"
                iconName="ArrowDownOnSquareStackIcon"
              />
            ) : data?.type === "service" ? (
              <HeroIcon
                className="h-5 w-5 text-light-secondary transition-colors 
                                        group-focus-within:text-main-accent dark:text-dark-secondary"
                iconName="MagnifyingGlassIcon"
              />
            ) : (
              ``
            )}
            <div className="flex flex-col justify-center ml-3">
              <h5 className="text">
                {data?.keyword ||
                  data?.fullName ||
                  <HtmlRenderer htmlString={data?.description as string || data?.content as string} />}
              </h5>
            </div>
            {!data?.keyword && data?.type === "user" && (
              <Avatar
                src={data?.avatar}
                shape="square"
                className="absolute right-12"
              ></Avatar>
            )}
          </div>
        </div>
        <div className="absolute right-6">
          <button
            className="hover:bg-light-primary/5 rounded-full"
            onClick={preventBubbling(() => {
              handleFunctionDelete();
            })}
          >
            <HeroIcon
              className="h-5 w-5 text-light-secondary transition-colors 
                                        group-focus-within:text-main-accent dark:text-dark-secondary"
              iconName="XMarkIcon"
            />
          </button>
        </div>
      </Link>
      {serviceData && (
        <ServiceDetail
          data={serviceData as MainService}
          isModalVisible={openModalServiceDetail}
          setIsModalVisible={setOpenModalServiceDetail}
        />
      )}
    </>
  );
}
