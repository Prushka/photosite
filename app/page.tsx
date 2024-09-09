'use client'

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useRecoilState} from "recoil";
import {albumsState} from "@/app/loader";

export default function Home() {
    const [photos] = useRecoilState(albumsState);
    const router = useRouter();
    useEffect(() => {
        if (photos && Object.keys(photos).length > 0) {
            router.push(`/${Object.keys(photos)[0]}`)
        }
    }, [photos, router]);
    return (
        <></>
    );
}
