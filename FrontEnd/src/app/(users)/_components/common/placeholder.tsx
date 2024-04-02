import { CustomIcon } from '@components/ui/custom-icon';
import { SEO } from './seo';

export function Placeholder(): JSX.Element {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <SEO
        title='Social Media'
        description='From breaking news and entertainment to sports and politics, get the full story with all the live commentary.'
        image='/home.png'
      />
      <i>
          <div id="page">
              <div id="container">
                  <div id="h3">loading</div>
                  <div id="ring"></div>
                  <div id="ring"></div>
                  <div id="ring"></div>
                  <div id="ring"></div>
              </div>
          </div>
      </i>
    </main>
  );
}
