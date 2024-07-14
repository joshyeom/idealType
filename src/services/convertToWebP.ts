export const convertToWebP = async (url: string): Promise<Blob | undefined> => {
  try {
      url = url.replace(
          "https://oaidalleapiprodscus.blob.core.windows.net",
          "",
      );

      const response = await fetch(url);
      const blob = await response.blob();
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
          img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');

              if (!ctx) {
                  throw new Error("이미지 생성 중 오류 발생")
              }

              ctx.drawImage(img, 0, 0);
              canvas.toBlob((webpBlob) => {
                  if (!webpBlob) {
                    reject(new Error("WebP Blob 생성 중 오류 발생"));
                    return;
                  }
                  resolve(webpBlob);
              }, 'image/webp');
          };
      });
  } catch (error) {
      console.error('Error converting to WebP:', error);
      throw error;
  }
};