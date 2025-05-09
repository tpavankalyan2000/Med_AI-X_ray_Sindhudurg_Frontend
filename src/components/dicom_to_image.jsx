import * as daikon from "daikon";

export async function  dicom_to_image(file){
    const arrayBuffer = await File.arrayBuffer();
    const data = new DataView(arrayBuffer);

    const image = daikon.Series.parseImage(data);
    if(!image) throw new Error("Invalid DICOM file");

    const pixelData = image.getInterpretedData(false, true);
    const width = image.getCols();
    const height = image.getRows();

    const canvas = document.createElement("canvas");
    canvas.width = height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);
    
    for(let i = 0; i < pixelData.length; i++){
        const val = pixelData[i];
        imageData.data[i * 4 + 0] = val;
        imageData.data[i * 4 + 1] = val;
        imageData.data[i * 4 + 2] = val;
        imageData.data[i * 4 + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/jpeg");
}