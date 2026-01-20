import imagekit from "../configs/imagekit.js";

const uploadToImageKit = async (file) => {
  const res = await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder: "/cars",
  });

  return res.url;
};

export default uploadToImageKit;
