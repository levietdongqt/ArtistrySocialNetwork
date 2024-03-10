import { PeopleLayout } from '../_components/layout/common-layout';
import { SEO } from '../_components/common/seo';
import { MainHeader } from '../_components/home/main-header';
import { MainContainer } from '../_components/home/main-container';
import ContainerPeople from "../_components/container/ContainerPeople";

export default function People() {

    return (
        <PeopleLayout>
             <MainContainer>
                <SEO title='Studio' />
                <ContainerPeople />
            </MainContainer>
        </PeopleLayout>
    );
}
