import ContainerBookmarks from "../../_components/container/ContainerBookmarks";
import {MainContainer} from "../../_components/home/main-container";
import {HomeLayout} from "../../_components/layout/common-layout";

export default function Page(): JSX.Element {

  return (
      <HomeLayout>
          <MainContainer>
              <ContainerBookmarks/>
          </MainContainer>
      </HomeLayout>
  );
}

