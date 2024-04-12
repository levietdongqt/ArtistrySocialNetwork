"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import cn from "clsx";
import { HeroIcon } from "@components/ui/hero-icon";
import { Button } from "@components/ui/button";
import { Avatar, Popover } from "antd";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { suggestKeyword } from "services/main/clientRequest/searchClient";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import useSWR from "swr";
import { Loading } from "@components/ui/loading";
import { Error } from "@components/ui/error";
import debounce from 'lodash.debounce';
import _ from "lodash";

export function SearchBar(): JSX.Element {
  const [inputValue, setInputValue] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: data,
    isLoading: isLoading,
    error: error,
  } = useSWR(shouldFetch ? suggestKeyword(inputValue): null, fetcherWithToken);

  console.log(data?.data);
 
  // useEffect(()=>{
  //   if(shouldFetch){
  //     setShouldFetch(false);
  //   }
  // },[shouldFetch])


  const debouceSearch = debounce((term)=> {
    setShouldFetch(true); 
  },3000)

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>): void => {
    console.log("shouldFetch",shouldFetch);
    setInputValue(value);
    debouceSearch(value);
    
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue) void push(`/search?q=${inputValue}`);
  };

  const clearInputValue = (focus?: boolean) => (): void => {
    if (focus) inputRef.current?.focus();
    else inputRef.current?.blur();

    setInputValue("");
  };

  const handleEscape = ({ key }: KeyboardEvent<HTMLInputElement>): void => {
    if (key === "Escape") clearInputValue()();
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isLoading ? (
        <Loading className="mt-5" />
      ) : !data?.data ? (
        <Error message="Something went wrong" />
      ) : (
        data?.data.map((value: any) =>
          value.type == "user" ? 
        (
            <Link
              href={`/search?q=${value.id}`}
              className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                <Avatar></Avatar>
                  <div className="flex flex-col justify-center ml-3">
                    <h3 className="text-lg font-bold">{value.full_name}</h3>
                  </div>
                  
                </div>
              </div>
            </Link>
          ) 
          : 
          (
            value.type === "service" ? (
              <Link
              href={`/search?q=${value.id}`}
              className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <HeroIcon
                    className="h-5 w-5 text-light-secondary transition-colors 
                       group-focus-within:text-main-accent dark:text-dark-secondary"
                    iconName="MagnifyingGlassIcon"
                  />
                  <div className="flex flex-col justify-center ml-3">
                    <h3 className="text-lg font-bold">{value.description}</h3>
                  </div>
                </div>
              </div>
            </Link>
            ):(
              <Link
              href={`/search?q=${value.id}`}
              className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <HeroIcon
                    className="h-5 w-5 text-light-secondary transition-colors 
                       group-focus-within:text-main-accent dark:text-dark-secondary"
                    iconName="MagnifyingGlassIcon"
                  />
                  <div className="flex flex-col justify-center ml-3">
                    <h2>{value.full_name}</h2>
                    <h3 className="text-lg font-bold">{value.content}</h3>
                  </div>
                </div>
              </div>
            </Link>
            )
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
      <Popover content={content} trigger="click">
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
            placeholder="Tìm kiếm vff ...."
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
