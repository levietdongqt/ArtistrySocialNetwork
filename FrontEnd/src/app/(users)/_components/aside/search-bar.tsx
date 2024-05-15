"use client";
import React, { useState, useRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";
import cn from "clsx";
import { HeroIcon } from "@components/ui/hero-icon";
import { Button } from "@components/ui/button";
import { Avatar, Divider, Popover, Skeleton } from "antd";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import {
  deleteAllHistorySearch,
  deleteHistorySearch,
  getHistorySearch,
  suggestKeyword,
  updatedHistorySearch,
} from "services/main/clientRequest/searchClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import useSWR from "swr";
import { Loading } from "@components/ui/loading";
import { Error } from "@components/ui/error";
import debounce from "lodash.debounce";
import _ from "lodash";
import { useUser } from "context/user-context";
import { parseStringToJson } from "@lib/helper/convertTime";
import { useSearch } from "context/search-context";
import { preventBubbling } from "@lib/utils";
import { SearchBarCard } from "./search-bar-card";
import { HistoryBarCard } from "./history-bar-card";

interface SearchBarProps {
  width: string;
}
export function SearchBar({ width }: SearchBarProps): JSX.Element {
  const {
    searchText,
    setSearchText,
    setSearchArrayUserIds,
    setSearchArrayPostIds,
    setSearchArrayServiceIds,
    setTopSearch,
  } = useSearch();
  const [searchData, setSearchData] = useState<any>([]);
  const [objectArray, setObjectArray] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState(searchText || "");
  const [shouldFetch, setShouldFetch] = useState(searchText ? true : false);
  const [shouldGetFetch, setShouldGetFetch] = useState(false);
  const [shouldDeleteFetch, setShouldDeleteFetch] = useState(false);
  const [shouldDeleteAllFetch, setShouldDeleteAllFetch] = useState(false);
  const [valueDelete, setValueDelete] = useState("");
  const [clickLink, setClickLink] = useState(false);
  const [link, setLink] = useState("");
  const [shouldUpdatedFetch, setShouldUpdatedFetch] = useState(false);
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentUser, setCurrentUser } = useUser();

  const { data: dataHistory, isLoading: isLoadingHistory } = useSWR(
    shouldGetFetch
      ? getHistorySearch(currentUser ? (currentUser?.id as string) : "")
      : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
    }
  );

  // var objectArray = dataHistory && parseStringToJson(dataHistory.data);

  useEffect(() => {
    if (dataHistory) {
      setObjectArray(dataHistory && parseStringToJson(dataHistory.data));
    }
  }, [dataHistory]);

  const {
    data: data,
    isLoading: isLoading,
    error: error,
  } = useSWR(
    shouldFetch ? suggestKeyword(inputValue) : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
    }
  );

  const {} = useSWR(
    shouldUpdatedFetch
      ? updatedHistorySearch(
          currentUser?.id as string,
          clickLink ? link : { keyword: inputValue }
        )
      : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
    }
  );

  const {} = useSWR(
    shouldDeleteFetch
      ? deleteHistorySearch(currentUser?.id as string, valueDelete)
      : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
    }
  );

  const {} = useSWR(
    shouldDeleteAllFetch
      ? deleteAllHistorySearch(currentUser?.id as string)
      : null,
    fetcherWithToken,
    {
      revalidateOnFocus: false,
    }
  );

  const debouceSearch = debounce((term) => {
    setShouldFetch(true);
  }, 1000);

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>): void => {
    setShouldFetch(false);
    setInputValue(value);
    debouceSearch(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue) {
      setSearchText(inputValue);
      setShouldUpdatedFetch(true);
      push(`/search?q=${inputValue}`);
    }
  };

  const handleRemoveAllHistory = () => {
    setShouldDeleteAllFetch(true);
  };

  const handleWhenClickLink = (value: any) => {
    setLink(value);
    setClickLink(true);
    setShouldUpdatedFetch(true);
  };

  const handleFunctionDelete = (value: any) => {
      setValueDelete(value);
      setShouldDeleteFetch(true);
      var array = objectArray.filter((ob) => {
        if (ob.id) {
          return ob.id !== value.id;
        }
        return ob.keyword !== value.keyword;
      });
      setObjectArray(array);
  };

  const handleFunctionLink = (value: any) => {
    setLink(value);
    setClickLink(true);
    setShouldUpdatedFetch(true);
    if (value.keyword) {
      setSearchText(value.keyword);
    }
  };

  //Quan lý useEffect
  useEffect(() => {
    if (shouldUpdatedFetch) {
      setShouldUpdatedFetch(false);
    }
  }, [shouldUpdatedFetch]);

  useEffect(() => {
    if (clickLink) {
      setClickLink(false);
    }
  }, [clickLink]);
  useEffect(() => {
    if (shouldGetFetch) {
      setClickLink(false);
    }
  }, [shouldGetFetch]);

  useEffect(() => {
    if (shouldDeleteFetch) {
      setShouldDeleteFetch(false);
    }
  }, [shouldDeleteFetch]);

  useEffect(() => {
    if (shouldDeleteAllFetch) {
      setShouldDeleteAllFetch(false);
    }
  }, [shouldDeleteAllFetch]);

  useEffect(() => {
    if (data) {
      setSearchData(data.data);
      if (data.data.length > 0) {
        setTopSearch((prev: any) => data.data[0].type);
      }
      setSearchArrayUserIds(
        data &&
          data.data
            .filter((user: any) => user.type === "user")
            .map((user: any) => user.id)
      );
      setSearchArrayPostIds(
        data &&
          data.data
            .filter((post: any) => post.type === "post")
            .map((post: any) => post.id)
      );
      setSearchArrayServiceIds(
        data &&
          data.data
            .filter((service: any) => service.type === "service")
            .map((service: any) => service.id)
      );
    }
  }, [data]);

  const clearInputValue = (focus?: boolean) => (): void => {
    if (focus) inputRef.current?.focus();
    else inputRef.current?.blur();

    setInputValue("");
    setSearchText("");
  };

  const handleEscape = ({ key }: KeyboardEvent<HTMLInputElement>): void => {
    if (key === "Escape") clearInputValue()();
  };

  const handleChangeAfter = () => {
    setShouldGetFetch(true);
  };

  const content = (
    <div
      style={{
        maxHeight: "520px",
        overflowY: "auto",
      }}
    >
      {inputValue == "" && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button className="font-bold">Gần đây</Button>
          <Button
            className="hover:bg-light-primary/5 font-bold"
            onClick={preventBubbling(() => {
              handleRemoveAllHistory();
              setShouldGetFetch(true);
              setObjectArray([]);
            })}
          >
            Xoá toàn bộ lịch sử
          </Button>
        </div>
      )}
      {(inputValue == "" &&
        objectArray &&
        objectArray.toReversed().map((value: any,index:number) => (
          <HistoryBarCard
              key={index}
            data={value}
            handleFunctionLink={() => handleFunctionLink(value)}
            handleFunctionDelete={() => handleFunctionDelete(value)}
          />
        ))) || (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {isLoading ? (
            <Loading className="mt-5" />
          ) : data?.data.length === 0 ? (
            <Error message="Không tìm thấy kết quả nào" />
          ) : (
            searchData.map((value: any) =>
              value.type === "user" ? (
                <SearchBarCard
                    key={value.id}
                  id={value.id}
                  type={value.type}
                  avatar={value.avatar}
                  fullName={value.fullName}
                  roles={value.roles}
                  handleFunction={() => handleWhenClickLink(value)}
                />
              ) : value.type === "service" ? (
                <SearchBarCard
                    key={value.id}
                  id={value.id}
                  type={value.type}
                  nameService={value.name}
                  description={value.description}
                  handleFunction={() => handleWhenClickLink(value)}
                />
              ) : (
                <SearchBarCard
                    key={value.id}
                  id={value.id}
                  type={value.type}
                  fullName={value.fullName}
                  content={value.content}
                  handleFunction={() => handleWhenClickLink(value)}
                />
              )
            )
          )}
        </div>
      )}
    </div>
  );

  return (
    <form
      className="hover-animation sticky top-0 z-10 -my-2 bg-main-background py-2 w-full"
      onSubmit={handleSubmit}
    >
      <Popover
        content={content}
        trigger="click"
        afterOpenChange={handleChangeAfter}
        overlayStyle={{ width: width }}
        autoAdjustOverflow={true}
      >
        <label
          className="group flex items-center justify-between gap-4 rounded-full
                     bg-main-search-background px-4 py-2 transition focus-within:bg-main-background
                     focus-within:ring-2 focus-within:ring-main-accent"
        >
          <i>
            <HeroIcon
              className="h-5 w-5 text-light-secondary transition-colors 
                         group-focus-within:text-main-accent dark:text-dark-secondary"
              iconName="MagnifyingGlassIcon"
            />
          </i>
          <input
            className="peer flex-1 bg-transparent outline-none 
                       placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            type="text"
            placeholder="Tìm kiếm ...."
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            onKeyUp={handleEscape}
          />
          <Button
            className={cn(
              "accent-tab scale-50 bg-main-accent p-1 opacity-0 transition hover:brightness-90 disabled:opacity-0",
              inputValue &&
                "focus:scale-100 focus:opacity-100 peer-focus:scale-100 peer-focus:opacity-100"
            )}
            onClick={clearInputValue(true)}
            disabled={!inputValue}
          >
            <HeroIcon className="h-3 w-3 stroke-white" iconName="XMarkIcon" />
          </Button>
        </label>
      </Popover>
    </form>
  );
}
