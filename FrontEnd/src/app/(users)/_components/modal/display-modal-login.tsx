import { InputThemeRadio } from '../input/input-theme-radio';
import { Button } from '@components/ui/button';
import { InputAccentRadio } from '../input/input-accent-radio';
import type { Theme, Accent } from '../../../../models/theme';
import { CustomIcon } from '@components/ui/custom-icon';
import { HeroIcon } from '@components/ui/hero-icon';
import { useAuth } from 'context/auth-context';
type DisplayModalProps = {
  closeModal: () => void;
};



export function DisplayModalLogin({ closeModal }: DisplayModalProps): JSX.Element {
  const {signInWithGoogle,signInWithFacebook} = useAuth();
  const signInHande = () => {
    console.log("Voo login goole")
    signInWithGoogle();
  }
  return (
      <div className="flex flex-col items-center gap-6">
          <CustomIcon
              className='mt-4 h-6 w-6 text-accent-blue lg:h-12 lg:w-12 dark:lg:text-twitter-icon'
              iconName='GameIcon'
          />
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-2xl font-semibold text-white text-center">Social network</h2>
              <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                  <form className="space-y-6" action="#" method="POST">
                      <div>
                          <label htmlFor="email" className="block text-1xl font-medium text-white">
                              Email
                          </label>
                          <div className="mt-1">
                              <input id="email" name="email" type="email" autoComplete="email" required
                                     className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                     placeholder="Enter your email address"/>
                          </div>
                      </div>

                      <div>
                          <label htmlFor="password" className="block text-1xl font-medium text-white">
                              Mật khẩu
                          </label>
                          <div className="mt-1">
                              <input id="password" name="password" type="password" autoComplete="current-password" required
                                     className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                     placeholder="Enter your password"/>
                          </div>
                      </div>

                      <div className="flex items-center justify-between">
                          <div className="flex items-center">
                              <input id="remember_me" name="remember_me" type="checkbox"
                                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                  <label htmlFor="remember_me" className="ml-2 block text-1xl text-white">
                                      Nhớ tôi
                                  </label>
                          </div>

                          <div className="text-sm">
                              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                  Quên mật khẩu?
                              </a>
                          </div>
                      </div>

                      <div>
                          <button type="submit"
                                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Đăng nhập
                          </button>
                      </div>
                  </form>
                  <div className="mt-6">

                      <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-black text-white">
                            Or
                        </span>
                          </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                          <div>
                              <a onClick={signInWithFacebook} className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                  <CustomIcon iconName={'FaceBookIcon'}/>
                              </a>
                          </div>
                          <div>
                              <a onClick={signInWithGoogle} className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                  <CustomIcon iconName={'GoogleIcon'} />
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
