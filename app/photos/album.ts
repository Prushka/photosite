import exif, {Exif} from "exif-reader";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export let albums : {[key: string]: Album} | null = null;
export let albumsString = '';

export async function Albums() {
    if(!albums) {
        albums = await getAlbums();
    }
    if(albumsString === '') {
        albumsString = JSON.stringify(albums);
    }
    return albums
}

export interface Photo {
    exif: Exif
    path: string
    fullPath: string
    width: number
    height: number
    size: number
    idx: number
}

export interface Album {
    photos: Photo[]
    name: string
}

// preview: jpg: 1500px, 80% quality, avif: 1000px, 90% quality
// raw: jpg: 5000px, 80% quality, avif: 6000px, 90% quality
// avif & webp: user can't save and share on discord

const acceptable = ['jpg', 'jpeg', 'avif', 'webp', 'png', 'gif']

const getAlbums = async () => {
    const albums: { [key: string]: Album } = {}
    const root = process.env.RAW!
    const previewRoot = process.env.PREVIEW!
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
                        albums[albumName] = {photos: [], name: sections[sections.length - 2]};
                    }
                    albums[albumName].photos.push({exif: exifData, path: fPath,
                        fullPath,
                        width: metadata.width, height: metadata.height,
                        size: fileSize, idx: -1
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
    for (const album in albums) {
        for (let i = 0; i < albums[album].photos.length; i++) {
            albums[album].photos[i].idx = i
        }
    }
    return albums
}

