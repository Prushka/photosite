'use client'

import {atom, RecoilRoot, RecoilState, useRecoilState} from "recoil";
import {useEffect} from "react";
import axios from "axios";
import {Album} from "@/app/photos/route";

export const albumsState: RecoilState<{ [key: string]: Album }> =
    atom({
        key: 'albums',
        default: {},
    });

export default function Loader () {
    const [, setAlbums] = useRecoilState(albumsState);
    useEffect(() => {
        axios.get('/photos').then((response) => {
            setAlbums(response.data)
        })
    }, [setAlbums]);
    return <></>
}
