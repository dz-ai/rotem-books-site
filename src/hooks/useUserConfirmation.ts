import {useState} from "react";

interface IUseUserConfirmation {
    isVisible: boolean;
    requestConfirmation: () => Promise<boolean>;
    handleUserResponse: (response: boolean) => void;
}

export function useUserConfirmation(): IUseUserConfirmation {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [resolveFn, setResolveFn] = useState<((val: boolean) => void) | null>(null);

    function requestConfirmation(): Promise<boolean> {
        setIsVisible(true);
        return new Promise((resolve) => {
            setResolveFn(() => resolve); // save resolve in CB fun to call it later in the handleUserResponse fn.
        });
    }

    function handleUserResponse(response: boolean): void {
        setIsVisible(false);
        resolveFn && resolveFn(response); // resolve the promise
    }

    return {isVisible, requestConfirmation, handleUserResponse};
}
