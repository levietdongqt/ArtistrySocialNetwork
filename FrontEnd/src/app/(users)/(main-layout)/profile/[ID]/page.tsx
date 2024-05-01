import ContainerUser from "../../../_components/container/ContainerUser";
import React, { ReactNode } from 'react';
import {UserHomeLayout} from "../../../_components/layout/user-home-layout";

interface UserPostProps {
    children: ReactNode;
}

const UserPostComponent = ({children}: UserPostProps) => {
    return (
        <ContainerUser/>
    );
}

export default UserPostComponent;