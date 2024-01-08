import { Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener"
import { Media } from "@capacitor-community/media"
import { dataURItoBlob } from "./downloader.js";

export async function openBlob(blob, filename = "rywl-file") {
    const { saveAs } = await import('file-saver')
    const writeBlob = await import('capacitor-blob-writer')

    if (window.isNative) {
        const blo = await writeBlob({
            path: filename,
            directory: Directory.Cache,
            blob: blob
        })

        await FileOpener.open({
            filePath: blo
        })
    } else {
        saveAs(blob, filename);
    }
}

export async function openMedia(imgURL) {
    const { saveAs } = await import('file-saver')

    if (window.isNative) {
        const albums = await Media.getAlbums()
        const targetAlbum = albums.albums.find((e) => e.name == "Download").identifier

        const res = await Media.savePhoto({
            path: imgURL,
            albumIdentifier: targetAlbum
        })

        FileOpener.open({
            filePath: res.filePath
        })

    } else {
        saveAs(dataURItoBlob(imgURL), "rywl-out.jpg");
    }
}

export function rawToBlob(data, contentType) {
    return new Blob([data], {
        type: contentType
    })
}