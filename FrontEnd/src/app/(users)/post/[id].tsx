import { MainContainer } from '../_components/home/main-container';
import { HomeLayout } from '../_components/layout/common-layout';
import ContainerPostId from "../_components/container/ContainerPostId";

export default function TweetId(): JSX.Element {

  return (
      <HomeLayout>
          <MainContainer className='!pb-[1280px]'>
            <ContainerPostId/>
        </MainContainer>
      </HomeLayout>
  );
}

