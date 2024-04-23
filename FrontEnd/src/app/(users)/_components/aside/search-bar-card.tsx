import { HeroIcon } from "@components/ui/hero-icon";
import { Avatar } from "antd";
import Link from "next/link";
import React from "react";

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
  var nameCard =
    type === "service" ? "Dịch vụ" : type === "post" ? "Bài đăng" : "";
  return (
    <Link
      href={type === "user"
      ? `/user/${id}`
      : type === "post"
      ? `/post/${id}`
      : type === "service"
      ? `/service/${id}`
      : ``}
      className="accent-tab hover-animation grid grid-cols-[auto,1fr] gap-3 px-4 py-3 hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
      onClick={() => {
        handleFunction();
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
            <h3>{description || content}</h3>
            <h5>{nameCard}</h5>
          </div>
        </div>
      </div>
    </Link>
  );
}
