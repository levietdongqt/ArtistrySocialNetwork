import {SearchLayout} from "../_components/layout/common-layout";
import { MainContainer } from '../_components/home/main-container';
import ContainerSearch from "../_components/container/ContainerSearch";
interface SearchProps {
    query?: string;
}
const Page = ({ query }: SearchProps) => {
    const params = query || '';
    return (
        <SearchLayout>
            <MainContainer>
                <ContainerSearch />
            </MainContainer>
        </SearchLayout>
    );
};

export default Page;