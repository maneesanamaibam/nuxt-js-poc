// Function to convert base64 to blob
export default function base64ToFile(
  base64Data: string,
  fileName: string = "FILE_NAME",
  fileType: string = "image/png"
): File {
  const byteString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: fileType });

  return new File([blob], fileName, { type: fileType });
}
