import { useEffect, useState } from "react";


export default function useLoader(
    elelmentRef,
    {
        threshold = 0,
        root= null,
        rootMargin = '0%',
        freezeOnceVisible = false,
    },
){
    const [entry, setEntry] = useState();
    const froze = entry?.isIntersecting && freezeOnceVisible;
    const updateEntry = ([entry]) => {
        setEntry(entry);
    }
    useEffect(()=> {
        const dom = elelmentRef?.current;
        const ioSupport = !!window.IntersectionObserver;
        if(!ioSupport || froze || !dom) return;
        const params = {threshold, root, rootMargin};
        const observer = new IntersectionObserver(updateEntry, params);
        observer.observe(dom);
        return () => observer.disconnect();
    },[elelmentRef?.current, JSON.stringify(threshold), root, rootMargin, froze]);
}