import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { where } from 'firebase/firestore';
import { useAuth } from '@lib/context/auth-context';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import {
    PeopleLayout,
    ProtectedLayout
} from '../_components/layout/common-layout';
import { MainLayout } from '../_components/layout/main-layout';
import { SEO } from '../_components/common/seo';
import { MainHeader } from '../_components/home/main-header';
import { MainContainer } from '../_components/home/main-container';
import { UserCard } from '../_components/user/user-card';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { variants } from '../_components/aside/aside-trends';
import {UseUser} from "@lib/hooks/useUser";

export default function Studio() {
    /*const user = UseUser([]);*/
    /*const { data, loading, LoadMore } = useInfiniteScroll(
            user,
        { allowNull: true, preserve: true },
        { marginBottom: 500 }
    );*/
    const loading = false;
    const { back } = useRouter();

    return (
        <PeopleLayout>
             <MainContainer>
                <SEO title='Studio' />
                <MainHeader useActionButton title='Studio' action={back} />
                <section>
                    {loading ? (
                        <Loading className='mt-5' />
                    ) : /*!data ? (
                        <Error message='Something went wrong' />
                    ) : */(
                        <>
                            <motion.div className='mt-0.5' {...variants}>
                               {/* {data?.map((userData:any) => (*/}
                                    {/*<UserCard {...userData} key={userData.id} follow />*/}
                                    <UserCard  follow />
                               {/* ))}*/}
                            </motion.div>
                            {/*<LoadMore />*/}
                        </>
                    )}
                </section>
            </MainContainer>
        </PeopleLayout>
    );
}
