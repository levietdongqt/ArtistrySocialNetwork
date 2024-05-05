import Link from "next/link";

const footerLinks = [
  ['Terms of ServerAction', '/terms'],
  ['Privacy Policy', '/privacy'],
  ['Cookie Policy', '/cookie'],
  ['Accessibility', '/accessibility'],
  ['Ads Info', '/ads']
] as const;

export function AsideFooter(): JSX.Element {
  return (
    <footer
      className='sticky top-16 flex flex-col gap-3 text-center text-sm 
                 text-light-secondary dark:text-dark-secondary'
    >
      <nav className='flex flex-wrap justify-center gap-2'>
        {footerLinks.map(([linkName, href],index) => (
          <Link
            className='custom-underline'
            target='_blank'
            rel='noreferrer'
            href={href}
            key={index}
          >
            {linkName}
          </Link>
        ))}
      </nav>
      <p>© 2024 Team2, Inc.</p>
    </footer>
  );
}
