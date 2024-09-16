'use client'

import {atom, RecoilState, useRecoilState} from "recoil";
import {useEffect} from "react";
import axios from "axios";
import {Album} from "@/app/photos/album";

export const albumsState: RecoilState<{ [key: string]: Album }> =
    atom({
        key: 'albums',
        default: {},
    });

export const zoomedOutState: RecoilState<boolean> =
    atom({
        key: 'zoomedOut',
        default: false,
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
