import cn from 'clsx';

type IconName = keyof typeof Icons;

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
    GameIcon,
    FeatherIcon,
    SpinnerIcon,
    TriangleIcon,
    ArrowUpIcon,
    FaceBookIcon,
    CloseIcon,
    MessageIcon,
    ArrowLeft
};

export function CustomIcon({
                               iconName,
                               className
                           }: CustomIconProps) {
    const Icon = Icons[iconName];

    return <Icon className={className ?? 'h-6 w-6'}/>;
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

function ArrowLeft({className}: IconProps): JSX.Element {
    return (

        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M5 12h14M5 12l4-4m-4 4 4 4"/>
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
