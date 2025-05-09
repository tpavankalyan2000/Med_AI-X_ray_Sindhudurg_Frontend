// import dicomParser from "dicom-parser";

// /** True if filename has DICOM extension. */
// export const isDicomFile = (file) =>
//   file.name.toLowerCase().endsWith(".dcm") ||
//   file.name.toLowerCase().endsWith(".dicom");

// /**
//  * Decode the first frame of a DICOM file and return
//  *   { dataUrl, jpegBlob }  – both generated from the same canvas.
//  * Any 16‑bit data are rescaled to 0‑255.
//  */
// export async function decodeDicomToJpeg(file) {
//   const byteArray = new Uint8Array(await file.arrayBuffer());
//   const dataSet = dicomParser.parseDicom(byteArray);

//   const width  = dataSet.uint16("x00280011"); // Columns
//   const height = dataSet.uint16("x00280010"); // Rows
//   const bits   = dataSet.uint16("x00280100"); // Bits Allocated
//   const slope  = Number(dataSet.string("x00281053") || 1); // Rescale Slope
//   const icpt   = Number(dataSet.string("x00281052") || 0); // Rescale Intercept
//   const mono1  = dataSet.string("x00280004") === "MONOCHROME1";
//   const pxEl   = dataSet.elements.x7fe00010;
//   if (!pxEl) throw new Error("No Pixel Data (7FE0,0010) found");

//   // if (pxEl.dataOffset + pxEl.length > byteArray.buffer.byteLength) {
//   //   console.log("Buffer Length:", byteArray.buffer.byteLength);
//   //   console.log("Pixel Data Offset:", pxEl.dataOffset);
//   //   console.log("Pixel Data Length:", pxEl.length);
//   //   throw new Error("Pixel Data offset/length exceeds buffer size – possibly corrupted or unsupported DICOM.");
//   // }
//   if (
//     typeof pxEl.dataOffset !== "number" ||
//     typeof pxEl.length !== "number" ||
//     pxEl.dataOffset + pxEl.length > byteArray.buffer.byteLength
//   ) {
//     console.error("Invalid or corrupt pixel data in DICOM file.");
//     console.log("Buffer Length:", byteArray.buffer.byteLength);
//     console.log("Pixel Data Offset:", pxEl.dataOffset);
//     console.log("Pixel Data Length:", pxEl.length);
//     throw new Error("Pixel Data offset/length is invalid or exceeds buffer size – possibly corrupted or unsupported DICOM.");
//   }
  

//   // Read one frame --------------------------------------------------------
//   const view  = new DataView(byteArray.buffer, pxEl.dataOffset, pxEl.length);
 

//   const count = width * height;
//   const gray  = new Uint16Array(count);

//   for (let i = 0; i < count; i++) {
//     gray[i] =
//       bits === 16 ? view.getInt16(i * 2, true) : view.getUint8(i); // Little‑endian
//   }

//   // Apply Modality LUT:  value' = value * slope + intercept  ---------------­
//   let min = +Infinity,
//       max = -Infinity;
//   for (let i = 0; i < count; i++) {
//     const v = gray[i] * slope + icpt;
//     gray[i] = v;
//     if (v < min) min = v;
//     if (v > max) max = v;
//   }
//   const range = Math.max(max - min, 1);

//   // Map to 0‑255, apply MONOCHROME1 inversion if required ------------------
//   const rgba = new Uint8ClampedArray(count * 4);
//   for (let i = 0; i < count; i++) {
//     let g = ((gray[i] - min) * 255) / range;
//     g = mono1 ? 255 - g : g; // MONOCHROME1 → white = 0
//     const j = i * 4;
//     rgba[j] = rgba[j + 1] = rgba[j + 2] = g;
//     rgba[j + 3] = 255;
//   }

//   // Draw on canvas & export -----------------------------------------------
//   const canvas = document.createElement("canvas");
//   canvas.width = width;
//   canvas.height = height;
//   canvas.getContext("2d").putImageData(new ImageData(rgba, width, height), 0, 0);

//   const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
//   const jpegBlob = await new Promise((res) => canvas.toBlob(res, "image/jpeg"));

//   return { dataUrl, jpegBlob };
// }

import * as daikon from "daikon";
import { JpxImage } from "jpeg2000";   // tiny pure‑JS JPEG‑2000 decoder

// register the codec for Daikon (it looks for global JpxImage)
window.JpxImage = JpxImage;

/**
 * Convert a single‑frame DICOM file (or JPEG/PNG) to an on‑memory JPEG.
 * Returns { dataUrl, jpegBlob }   – jpegBlob is handy for upload.
 */
export async function decodeDicomToJpeg (file) {
  // --------------- open & parse -----------------------------------------
  const arrayBuffer = await file.arrayBuffer();          // ① fixed
  const image = daikon.Series.parseImage(new DataView(arrayBuffer));
  if (!image) throw new Error("Not a valid DICOM");

  // --------------- pixel data -------------------------------------------
  const pixelData = image.getInterpretedData();          // Float32Array
  const width  = image.getCols();
  const height = image.getRows();

  // 16‑bit → 8‑bit window/level (simple linear) --------------------------
  const min = image.getRescaleIntercept ? image.getRescaleIntercept() : Math.min(...pixelData);
  const max = image.getRescaleSlope     ? min + 4095                         // typical CT range
                                        : Math.max(...pixelData);

  const scale = 255 / (max - min);

  // --------------- draw to canvas & encode ------------------------------
  const canvas = document.createElement("canvas");
  canvas.width  = width;                                  // ② fixed
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imgData = ctx.createImageData(width, height);
  const dst = imgData.data;                               // Uint8Clamped

  for (let i = 0; i < pixelData.length; ++i) {
    const v = Math.min(255, Math.max(0, Math.round((pixelData[i] - min) * scale)));
    dst[i * 4 + 0] =
    dst[i * 4 + 1] =
    dst[i * 4 + 2] = v;
    dst[i * 4 + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  const dataUrl  = await new Promise(r => canvas.toBlob(b => r(URL.createObjectURL(b)), "image/jpeg", 0.92));
  const jpegBlob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.92));
  return { dataUrl, jpegBlob };
}

/**
 * Very small helper to check extension & magic number.
 */
export function isDicomFile (f) {
  const nameOK = /\.(dcm|dicom)$/i.test(f.name);
  if (nameOK) return true;
  // secondary check – DICOM files start with "DICM" at byte 128
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = e => {
      const view = new DataView(e.target.result);
      const tag = String.fromCharCode(
        view.getUint8(128), view.getUint8(129),
        view.getUint8(130), view.getUint8(131)
      );
      res(tag === "DICM");
    };
    reader.readAsArrayBuffer(f.slice(0, 132));
  });
}