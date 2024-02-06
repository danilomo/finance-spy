import { createContext, useContext, useEffect, useState } from "react";
import { get } from "../commons/http";

type UserInformation = {
    accounts: string[],
    dashboards: string[]
}

const emptyUserInformation: UserInformation = { accounts: [], dashboards: [] };

const UserInformationCtx = createContext<UserInformation>(emptyUserInformation);

function useUserInformation() {
    return useContext(UserInformationCtx);
}

function UserInformationProvider({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) {
    const [userInfo, setUserInfo] = useState<UserInformation>(emptyUserInformation);

    useEffect(() => {
        async function loadUserInfo() {
            const accounts = await get<string[]>("api/accounts");
            const dashboards = await get<string[]>("api/dashboards");
            setUserInfo({
                accounts,
                dashboards
            });
        }
        loadUserInfo();
    }, []);


    return (<UserInformationCtx.Provider value={userInfo}>
        {children}
    </UserInformationCtx.Provider>);
}

export {
    useUserInformation,
    UserInformationProvider
}