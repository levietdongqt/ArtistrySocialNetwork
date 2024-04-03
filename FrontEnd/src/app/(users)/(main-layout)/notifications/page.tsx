import { NotificationLayout } from "../../_components/layout/common-layout";
import { MainContainer } from "../../_components/home/main-container";
import { SEO } from "../../_components/common/seo";
import ContainerNotification from "../../_components/container/ContainerNotications";
import { UserDataLayout } from "../../_components/layout/user-data-layout";
import { AuthContextProvider } from "../../../../context/auth-context";

export default function UserPost() {
  return (
      <NotificationLayout>
        <MainContainer>
          <ContainerNotification />
        </MainContainer>
      </NotificationLayout>
  );
}
