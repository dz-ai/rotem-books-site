import React, {useEffect, useState} from "react";

type UseIntersectionObserver = (ref: React.RefObject<HTMLDivElement>) => boolean;

export const useInterSectionObserver: UseIntersectionObserver = (ref) => {
    const [isInViewPort, setIsInViewPort] = useState<boolean>(true);

    useEffect(() => {
        const observer = new IntersectionObserver((entry) => {
                setIsInViewPort(entry[0].isIntersecting);
            },
            {
                rootMargin: '60px', // the entry (the observed el)
                // will be observed as soon as it is out-of-view port 60 px.
            });

        ref.current !== null && observer.observe(ref.current);

        return () => {
            ref.current !== null && observer.unobserve(ref.current);
        }
    }, [ref.current]);


    return isInViewPort;
}
