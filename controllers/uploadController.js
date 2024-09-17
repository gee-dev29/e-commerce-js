import { cloudinary } from "../middleware/uploadMiddleware.js";
import {entity} from "../utils/entity.js";

export const uploadDocument = async (file, documentType) => {
  if (!file) {
    return;
  }
  const result = await cloudinary.uploader.upload(file, {
    upload_preset: "charis",
    resource_type: "auto",
  });

  const uploadFile = {
    documentLink: result.secure_url,
    fileSize: result.bytes,
    documentType: documentType ?? "",
    fileType: result.format,
  };

  return uploadFile;
};

export const getProfilePic = async (id) => {
  try {
    const filter = {
      creatorId: id,
    };
    const profilePic = await entity.getAllFilteredData(documentModel, filter);
    return profilePic;
  } catch (error) {}
};
