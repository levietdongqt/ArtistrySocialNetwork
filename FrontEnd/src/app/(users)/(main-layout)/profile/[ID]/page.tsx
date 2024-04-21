import {UserLayout} from "../../../_components/layout/common-layout";
import {UserDataLayout} from "../../../_components/layout/user-data-layout";
import {UserHomeLayout} from "../../../_components/layout/user-home-layout";
import ContainerUser from "../../../_components/container/ContainerUser";


export default function UserPost() {
  return (
          <UserLayout>
            <UserDataLayout>
              <UserHomeLayout>
                <ContainerUser/>
              </UserHomeLayout>
            </UserDataLayout>
          </UserLayout>
  );
}

