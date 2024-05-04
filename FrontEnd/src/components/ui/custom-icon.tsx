import cn from 'clsx';

export type IconName = keyof typeof Icons;

type IconProps = {
    className?: string;
};

type CustomIconProps = IconProps & {
    iconName: IconName;
};

 const Icons = {
    PinIcon,
    AppleIcon,
    PinOffIcon,
    GoogleIcon,
    MinusIcon,
    FlagVietNam,
    GameIcon,
    FeatherIcon,
    SpinnerIcon,
    TriangleIcon,
    ArrowUpIcon,
    FaceBookIcon,
    CloseIcon,
    MessageIcon,
    CloseMessage,
    ArrowLeft,
    CloseOIcon,
    IconUserGroupAdd,
    IconBxsUserCircle,
    IconTrash3Fill,
    IconBxsPencil,
     IconSendCheck,
     IconGoogleCirclesGroup,
    IconFacebookMessengerAlt
};

export function CustomIcon({
                               iconName,
                               className
                           }: CustomIconProps) {
    const Icon = Icons[iconName];

    return <Icon className={className ?? 'h-6 w-6'}/>;
}


function MinusIcon({className}: IconProps): JSX.Element {
    return (
        <svg
            viewBox="0 0 1024 1024"
            fill="#6ea9d7"
            className={"w-6 h-12 "}
        >
            <path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"/>
        </svg>
    );
}

function IconFacebookMessengerAlt  ({className}: IconProps): JSX.Element {
    return (
        <svg
            data-name="Layer 1"
            viewBox="0 0 24 24"
            fill="#6ea9d7"
            className={"w-5 h-6 "}
        >
            <path
                d="M11.991 1a10.614 10.614 0 00-11 10.7 10.461 10.461 0 003.414 7.866l.052 1.69A1.8 1.8 0 006.256 23a1.82 1.82 0 00.726-.152L8.903 22a11.895 11.895 0 003.088.4 10.615 10.615 0 0011.001-10.7 10.615 10.615 0 00-11-10.7zm0 19.4a9.862 9.862 0 01-2.635-.35 1.799 1.799 0 00-1.196.092l-1.714.756-.045-1.493A1.81 1.81 0 005.8 18.13 8.488 8.488 0 012.99 11.7a8.66 8.66 0 019-8.7 8.705 8.705 0 110 17.4zm3.735-11.815l-2.313 2.755-3.347-2.056a.998.998 0 00-1.289.21L5.726 13.13a1 1 0 101.53 1.285l2.499-2.975 3.347 2.056a.998.998 0 001.289-.21l2.866-3.415a1 1 0 10-1.531-1.286z"/>
        </svg>
    );
}

function IconGoogleCirclesGroup  ({className}: IconProps): JSX.Element {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="#6ea9d7"
            className={"w-9 h-10 "}
        >
            <path
                d="M5 10a2 2 0 00-2 2 2 2 0 002 2c1.11 0 2-.89 2-2a2 2 0 00-2-2m0 6a4 4 0 01-4-4 4 4 0 014-4 4 4 0 014 4 4 4 0 01-4 4m5.5-5H14V8l4 4-4 4v-3h-3.5v-2M5 6c-.45 0-.89.05-1.31.14C5.63 3.05 9.08 1 13 1c6.08 0 11 4.92 11 11s-4.92 11-11 11c-3.92 0-7.37-2.05-9.31-5.14.42.09.86.14 1.31.14.8 0 1.56-.16 2.25-.44A7.956 7.956 0 0013 20a8 8 0 008-8 8 8 0 00-8-8c-2.26 0-4.29.93-5.75 2.44C6.56 6.16 5.8 6 5 6z"/>
        </svg>
    );
}

function IconSendCheck({className}: IconProps): JSX.Element {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="#6ea9d7"
            className={className? className: "w-5 h-6"}
        >
            <path
                d="M15.964.686a.5.5 0 00-.65-.65L.767 5.855a.75.75 0 00-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 00.844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 10.928.372l2.8-7zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733z"/>
            <path
                d="M16 12.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm-1.993-1.679a.5.5 0 00-.686.172l-1.17 1.95-.547-.547a.5.5 0 00-.708.708l.774.773a.75.75 0 001.174-.144l1.335-2.226a.5.5 0 00-.172-.686z"/>
        </svg>
    );
}

function IconBxsPencil({className}: IconProps): JSX.Element {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="#6ea9d7"
            className={"w-5 h-6 "}
        >
            <path
                d="M8.707 19.707L18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 00-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 000-2.828L19.414 3a2 2 0 00-2.828 0L15 4.586 19.414 9 21 7.414z"/>
        </svg>
    );
}

function IconTrash3Fill({className}: IconProps): JSX.Element {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="#6ea9d7"
            className={"w-5 h-6 "}
        >
            <path
                d="M11 1.5v1h3.5a.5.5 0 010 1h-.538l-.853 10.66A2 2 0 0111.115 16h-6.23a2 2 0 01-1.994-1.84L2.038 3.5H1.5a.5.5 0 010-1H5v-1A1.5 1.5 0 016.5 0h3A1.5 1.5 0 0111 1.5zm-5 0v1h4v-1a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5zM4.5 5.029l.5 8.5a.5.5 0 10.998-.06l-.5-8.5a.5.5 0 10-.998.06zm6.53-.528a.5.5 0 00-.528.47l-.5 8.5a.5.5 0 00.998.058l.5-8.5a.5.5 0 00-.47-.528zM8 4.5a.5.5 0 00-.5.5v8.5a.5.5 0 001 0V5a.5.5 0 00-.5-.5z"/>
        </svg>
    );
}

function IconUserGroupAdd({className}: IconProps): JSX.Element {
    return (
        <svg
            viewBox="0 0 1024 1024"
            fill="#6ea9d7"
            className={"w-5 h-6 "}
        >
            <path
                d="M892 772h-80v-80c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v80h-80c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h80v80c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-80h80c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM373.5 498.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.8-1.7-203.2 89.2-203.2 200 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.8-1.1 6.4-4.8 5.9-8.8zM824 472c0-109.4-87.9-198.3-196.9-200C516.3 270.3 424 361.2 424 472c0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C357 742.6 326 814.8 324 891.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5C505.8 695.7 563 672 624 672c110.4 0 200-89.5 200-200zm-109.5 90.5C690.3 586.7 658.2 600 624 600s-66.3-13.3-90.5-37.5a127.26 127.26 0 01-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4-.1 34.2-13.4 66.3-37.6 90.5z"/>
        </svg>
    );
}

function IconBxsUserCircle  ({className}: IconProps): JSX.Element {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="#6ea9d7"
            className={"w-5 h-6 "}
        >
            <path
                d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z"/>
        </svg>
    );
}


function CloseOIcon({className}: IconProps): JSX.Element {
    return (
        <svg fill="none" viewBox="0 0 24 24" height="1em" className={"w-5 h-10 "}>
            <path
                fill="currentColor"
                d="M16.34 9.322a1 1 0 10-1.364-1.463l-2.926 2.728L9.322 7.66A1 1 0 007.86 9.024l2.728 2.926-2.927 2.728a1 1 0 101.364 1.462l2.926-2.727 2.728 2.926a1 1 0 101.462-1.363l-2.727-2.926 2.926-2.728z"
            />
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm11 9a9 9 0 110-18 9 9 0 010 18z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function CloseMessage({className}: IconProps): JSX.Element {
    return (
        <svg
            viewBox="0 0 512 512"
            fill="#6ea9d7"
            className={"w-6 h-12 "}
        >
            <path
                d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"/>
        </svg>
    );
}

function MessageIcon({className}: IconProps): JSX.Element {
    return (

        <svg className="w-10 h-10 text-gray-800 dark:text-white" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"/>
        </svg>


    );
}

function FlagVietNam({className}: IconProps): JSX.Element {
    return (

        <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" id="vietnam">
            <defs>
                <clipPath id="a">
                    <path fillOpacity=".67" d="M-85.334 0h682.67v512h-682.67z"></path>
                </clipPath>
            </defs>
            <g fillRule="evenodd" clipPath="url(#a)" transform="translate(80.001) scale(.9375)">
                <path fill="#ec0015" d="M-128 0h768v512h-768z"></path>
                <path fill="#ff0"
                      d="m349.59 381.05-89.576-66.893-89.137 67.55 33.152-109.77-88.973-67.784 110.08-.945 34.142-109.44 34.873 109.19 110.08.144-88.517 68.423 33.884 109.53z"></path>
            </g>
        </svg>


    );
}

export function ArrowLeft({className}: IconProps): JSX.Element {
    return (

        <svg
            viewBox="0 0 24 24"
            fill="#6ea9d7"
            className={"w-6 h-12 "}
        >
            <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"/>
        </svg>


    );
}

function GameIcon({className}: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 128 128" id="design"
             className={cn('fill-current', className)}>
            <path fill="#e84c88"
                  d="M6.84 42.55v42.9a20 20 0 0 0 10 17.32L54 124.23a20 20 0 0 0 20 0l37.16-21.45a20 20 0 0 0 10-17.32V42.55a20 20 0 0 0-10-17.32L74 3.77a20 20 0 0 0-20 0L16.84 25.23a20 20 0 0 0-10 17.32Z"></path>
            <path fill="#fff"
                  d="M64 101a37 37 0 1 1 37-37 37.08 37.08 0 0 1-37 37Zm31.24-31.95a47.24 47.24 0 0 0-19.71-1.31 139.44 139.44 0 0 1 6.07 22.54 32.32 32.32 0 0 0 13.64-21.23ZM76.33 93.11a133.41 133.41 0 0 0-6.77-24.06h-.2C51.67 75.32 45.2 87.66 44.59 88.77A32.06 32.06 0 0 0 64 95.54a30.86 30.86 0 0 0 12.33-2.43Zm-35.78-7.88c.61-1.11 9.4-15.57 25.68-20.83a3.11 3.11 0 0 1 1.31-.3c-.81-1.82-1.62-3.64-2.63-5.46a111.47 111.47 0 0 1-32.55 4.45v1a31.66 31.66 0 0 0 8.19 21.13Zm-7.48-27.6a125.93 125.93 0 0 0 29.22-3.74 194.56 194.56 0 0 0-11.63-18.2 30.64 30.64 0 0 0-17.59 21.94Zm23.55-24.16a193.12 193.12 0 0 1 11.83 18.4c11.12-4.25 16-10.51 16.58-11.32a31.31 31.31 0 0 0-20.83-7.89 20.37 20.37 0 0 0-7.58.81Zm31.84 10.61c-.71.81-5.86 7.68-17.59 12.54.71 1.52 1.52 2.93 2.12 4.55.2.51.51 1.11.71 1.62a75.1 75.1 0 0 1 22 1 32.3 32.3 0 0 0-7.24-19.71Z">
            </path>
        </svg>
    );
}

function FaceBookIcon({className}: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="facebook"
             className={cn('fill-current', className)}>
            <path fill="#1976D2" fillRule="evenodd"
                  d="M12 5.5H9v-2a1 1 0 0 1 1-1h1V0H9a3 3 0 0 0-3 3v2.5H4V8h2v8h3V8h2l1-2.5z" clipRule="evenodd">
            </path>
        </svg>
    );
}

function CloseIcon({className}: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" id="close"
             className={cn('fill-current', className)}>
            <path fill="#000"
                  d="M7.05 7.05a1 1 0 0 0 0 1.414L10.586 12 7.05 15.536a1 1 0 1 0 1.414 1.414L12 13.414l3.536 3.536a1 1 0 0 0 1.414-1.414L13.414 12l3.536-3.536a1 1 0 0 0-1.414-1.414L12 10.586 8.464 7.05a1 1 0 0 0-1.414 0Z">
            </path>
        </svg>
    );
}

function ArrowUpIcon({className}: IconProps): JSX.Element {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" id="dropup-arrow"
             className={cn(className)}>
            <path
                d="M8.998 20h13.966c.286 0 .54-.138.72-.352l.004.004c.39-.434.39-1.138 0-1.572l-6.998-7.754a.926.926 0 0 0-1.41 0c-.01.012-.014.028-.024.04L8.272 18.08a1.202 1.202 0 0 0 0 1.572l.012.01a.945.945 0 0 0 .714.338z">
            </path>
        </svg>
    );
}

function FeatherIcon({className}: IconProps): JSX.Element {
    return (
        <svg
            className={cn('fill-current', className)}
            viewBox='0 0 24 24'
            aria-hidden='true'
        >
            <g>
                <path
                    d='M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z'/>
            </g>
        </svg>
    );
}

function SpinnerIcon({className}: IconProps): JSX.Element {
    return (
        <svg
            className={cn('animate-spin', className)}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
        >
            <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
            />
            <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
        </svg>
    );
}

function GoogleIcon({className}: IconProps): JSX.Element {
    return (
        <svg
            className={className}
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 48 48'
        >
            <g>
                <path
                    fill='#EA4335'
                    d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                />
                <path
                    fill='#4285F4'
                    d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                />
                <path
                    fill='#FBBC05'
                    d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                />
                <path
                    fill='#34A853'
                    d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                />
                <path fill='none' d='M0 0h48v48H0z'/>
            </g>
        </svg>
    );
}

function AppleIcon({className}: IconProps): JSX.Element {
    return (
        <svg className={className} viewBox='0 0 24 24'>
            <g>
                <path
                    d='M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z'/>
            </g>
        </svg>
    );
}

function TriangleIcon({className}: IconProps): JSX.Element {
    return (
        <svg className={className} viewBox='0 0 24 24' aria-hidden='true'>
            <g>
                <path
                    d='M12.538 6.478c-.14-.146-.335-.228-.538-.228s-.396.082-.538.228l-9.252 9.53c-.21.217-.27.538-.152.815.117.277.39.458.69.458h18.5c.302 0 .573-.18.69-.457.118-.277.058-.598-.152-.814l-9.248-9.532z'/>
            </g>
        </svg>
    );
}

function PinIcon({className}: IconProps): JSX.Element {
    return (
        <svg
            className={className}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <path stroke='none' d='M0 0h24v24H0z' fill='none'/>
            <path d='M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4'/>
            <line x1='9' y1='15' x2='4.5' y2='19.5'/>
            <line x1='14.5' y1='4' x2='20' y2='9.5'/>
        </svg>
    );
}

function PinOffIcon({className}: IconProps): JSX.Element {
    return (
        <svg
            className={className}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <path stroke='none' d='M0 0h24v24H0z' fill='none'/>
            <line x1='3' y1='3' x2='21' y2='21'/>
            <path
                d='M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251'/>
            <line x1='9' y1='15' x2='4.5' y2='19.5'/>
            <line x1='14.5' y1='4' x2='20' y2='9.5'/>
        </svg>
    );
}
