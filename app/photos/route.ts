import {NextResponse} from "next/server";

import {cache} from 'react'
import * as fs from "node:fs";

import sharp from 'sharp';
import exif, {Exif} from "exif-reader";
import path from "node:path";

export async function GET() {
    return new NextResponse(JSON.stringify(await getPhotos()));
}

export interface Photo {
    exif: Exif
    path: string
    fullPath: string
    width: number
    height: number
    size: number
    src: string
}

export interface Album {
    photos: Photo[]
    name: string
}

// preview: jpg: 1000px, 80% quality, avif: 1000px, 90% quality
// raw: jpg: 5000px, 80% quality, avif: 6000px, 90% quality
// avif & webp: user can't save and share on discord

const acceptable = ['jpg', 'jpeg', 'avif', 'webp', 'png', 'gif']
export const getPhotos = cache(async () => {
    const albums: { [key: string]: Album } = {}
    const root = process.env.NEXT_PUBLIC_RAW!
    const previewRoot = process.env.NEXT_PUBLIC_PREVIEW!
    const results = fs.readdirSync(root, {recursive: true});
    const previewResults = fs.readdirSync(previewRoot, {recursive: true});
    const existingPreviews: {[key:string]: boolean} = {}
    previewResults.forEach((fPath) => {
        existingPreviews[fPath.toString()] = true
    })
    for (const fPath of results as string[]) {
        if (acceptable.includes(fPath.split('.').pop()!)) {
            const fullPath = path.join(root, fPath)
            const metadata = await sharp(fullPath).metadata();
            const fileSize = fs.statSync(fullPath).size;
            if (metadata.exif) {
                const exifData = exif(metadata.exif);
                if (exifData && metadata.width && metadata.height) {
                    const sections = fPath.split('/');
                    const albumName = sections[sections.length - 2].toLowerCase();
                    if (!albums[albumName]) {
                        albums[albumName] = {photos: [], name: albumName};
                    }
                    albums[albumName].photos.push({exif: exifData, path: fPath,
                        fullPath,
                        src: `http://localhost:3005/raw/${fPath}`,
                        width: metadata.width, height: metadata.height,
                        size: fileSize
                    });
                    if (!existingPreviews[`${fPath}`]) {
                        console.warn(`${fPath} preview missing`)
                        // const previewPath = path.join(previewRoot, fPath)
                        // fs.mkdirSync(path.dirname(previewPath), {recursive: true})
                        // await sharp(fullPath).resize({
                        //     width: 1000,
                        //     kernel: sharp.kernel.lanczos3,
                        // }).keepMetadata().jpeg({
                        //     quality: 100
                        // }).toFile(previewPath)
                    }
                }
            }
        }
    }
    for (const album in albums) {
        albums[album].photos.sort((a, b) => {
            if (a.exif.Photo?.DateTimeOriginal && b.exif.Photo?.DateTimeOriginal) {
                return a.exif.Photo?.DateTimeOriginal.getTime() - b.exif.Photo?.DateTimeOriginal.getTime()
            }
            return 0
        })
    }
    return albums
})

