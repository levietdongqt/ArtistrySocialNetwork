"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import cn from "clsx";
import { HeroIcon } from "@components/ui/hero-icon";
import { Button } from "@components/ui/button";
import { Avatar, Popover } from "antd";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import {
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

interface SearchBarProps {
  width: string;
}
export function SearchBar({ width }: SearchBarProps): JSX.Element {
  const { searchText, setSearchText } = useSearch();

  const [inputValue, setInputValue] = useState(searchText || "");
  const [shouldFetch, setShouldFetch] = useState(searchText ? true : false);
  const [shouldGetFetch, setShouldGetFetch] = useState(false);
  const [clickLink, setClickLink] = useState(false);
  const [link, setLink] = useState("");
  const [shouldupdatedFetch, setShouldUpdatedFetch] = useState(false);
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

  var objectArray = dataHistory && parseStringToJson(dataHistory.data);
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
    shouldupdatedFetch
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
  //Quan lý useEffect
  useEffect(() => {
    if (shouldupdatedFetch) {
      setShouldUpdatedFetch(false);
    }
  }, [shouldupdatedFetch]);

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

  const content = (inputValue == "" &&
    objectArray &&
    objectArray.toReversed().map((value: any) => (
      <Link
        href={
          value.keyword
            ? `/search?q=${value.keyword}`
            : value.type === "user"
            ? `/user/${value.id}`
            : value.type === "post"
            ? `/post/${value.id}`
            : value.type === "service"
            ? `/service/${value.id}`
            : ``
        }
        className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
        onClick={() => {
          setLink(value);
          setClickLink(true);
          setShouldUpdatedFetch(true);
          if (value.keyword) {
            setSearchText(value.keyword);
          }
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {
               value.keyword
               ?  <HeroIcon
               className="h-5 w-5 text-light-secondary transition-colors 
                        group-focus-within:text-main-accent dark:text-dark-secondary"
               iconName="MagnifyingGlassIcon"
             />
               : value.type === "user"
               ?  <HeroIcon
               className="h-5 w-5 text-light-secondary transition-colors 
                        group-focus-within:text-main-accent dark:text-dark-secondary"
               iconName="ArrowTrendingUpIcon"
             />
               : value.type === "post"
               ?  <HeroIcon
               className="h-5 w-5 text-light-secondary transition-colors 
                        group-focus-within:text-main-accent dark:text-dark-secondary"
               iconName="ArrowDownOnSquareStackIcon"
             />
               : value.type === "service"
               ?  <HeroIcon
               className="h-5 w-5 text-light-secondary transition-colors 
                        group-focus-within:text-main-accent dark:text-dark-secondary"
               iconName="MagnifyingGlassIcon"
             />
               : ``
            }
           
            <div className="flex flex-col justify-center ml-3">
              <h5 className="text">
                {value.keyword ||
                  value.fullName ||
                  value.content ||
                  value.description}
              </h5>
            </div>
            {!value.keyword && value.type === "user" && (
              <Avatar
                src={value.avatar}
                shape="square"
                className="absolute right-10"
              ></Avatar>
            )}
          </div>
        </div>
      </Link>
    ))) || (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isLoading ? (
        <Loading className="mt-5" />
      ) : !data?.data ? (
        <Error message="Something went wrong" />
      ) : (
        data?.data.map((value: any) =>
          value.type == "user" ? (
            <Link
              href={`/user/${value.id}`}
              className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
              onClick={() => {
                setLink(value);
                setClickLink(true);
                setShouldUpdatedFetch(true);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <button>
                    <HeroIcon
                      className="h-5 w-5 text-light-secondary transition-colors 
                       group-focus-within:text-main-accent dark:text-dark-secondary"
                      iconName="ArrowTrendingUpIcon"
                    />
                  </button>
                  <div className="flex flex-col justify-center ml-3">
                    <h3 className="text-lg font-bold">{value.fullName}</h3>
                    {value.roles.map((role: string, index: number) => (
                      <React.Fragment key={index}>
                        <h5>{role}</h5>
                      </React.Fragment>
                    ))}
                  </div>

                  <Avatar
                    src={value.avatar}
                    shape="square"
                    className="absolute right-10"
                  ></Avatar>
                </div>
              </div>
            </Link>
          ) : value.type === "service" ? (
            <Link
              href={`/service/${value.id}`}
              className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
              onClick={() => {
                setLink(value);
                setClickLink(true);
                setShouldUpdatedFetch(true);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <HeroIcon
                    className="h-5 w-5 text-light-secondary transition-colors 
                       group-focus-within:text-main-accent dark:text-dark-secondary"
                    iconName="ArrowDownOnSquareStackIcon"
                  />
                  <div className="flex flex-col justify-center ml-3">
                    <h4 className="text-lg font-bold">{value.name}</h4>
                    <h3>{value.description}</h3>
                    <h5>Dịch vụ</h5>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href={`/posts/${value.id}`}
              className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
              onClick={() => {
                setLink(value);
                setClickLink(true);
                setShouldUpdatedFetch(true);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <HeroIcon
                    className="h-5 w-5 text-light-secondary transition-colors 
                       group-focus-within:text-main-accent dark:text-dark-secondary"
                    iconName="MagnifyingGlassIcon"
                  />
                  <div className="flex flex-col justify-center ml-3">
                    <h2>{value.fullName}</h2>
                    <h3>{value.content}</h3>
                    <h5>Bài đăng</h5>
                  </div>
                </div>
              </div>
            </Link>
          )
        )
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
