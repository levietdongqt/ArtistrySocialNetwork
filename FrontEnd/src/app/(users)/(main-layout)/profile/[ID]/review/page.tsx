'use client'

import { AnimatePresence } from 'framer-motion';
import ReviewComponent from "./review";
import {SEO} from "../../../../_components/common/seo";
import {Loading} from "@components/ui/loading";
import {useParams} from "next/navigation";
import {UserHomeLayout} from "../../../../_components/layout/user-home-layout";

const UserReview= (): JSX.Element => {  // Đây là một functional component
    const { ID } = useParams();
    const loading = false;

    return (
        <section>
            <SEO
                title={`Media Tweets by ${'name'} (@${
                    'username'
                }) / Twitter`}
            />
            {loading ? (
                    <Loading className='mt-5' />
                )
                : (
                    <AnimatePresence mode='popLayout'>
                        <ReviewComponent id={String(ID)} />
                    </AnimatePresence>
                )}
        </section>

    );
}

export default UserReview;