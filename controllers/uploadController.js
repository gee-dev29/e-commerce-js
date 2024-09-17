import { uploadEnum } from "../enums/uploadEnum.js";
import { cloudinary } from "../middleware/uploadMiddleware.js";
import { uploadModel } from "../model/uploadModel.js";
import { entity } from "../utils/entity.js";

export const uploadProfilePicture = async (req, res) => {
    try {
        const creatorId = req.id;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "No file uploaded. Please upload a file.",
            });
        }
        const result = await cloudinary.uploader.upload_stream(
            { upload_preset: "documents" },
            (error, result) => {
                if (error) {
                    return res.status(500).json({
                        message: error.message,
                    });
                }

                const uploadFile = new uploadModel({
                    creatorId: creatorId,
                    documentLink: result.secure_url,
                    fileSize: result.bytes,
                    documentType: uploadEnum.PROFILE_PICTURE,
                    fileType: result.format,
                });

                uploadFile
                    .save()
                    .then(() => {
                        return res.status(200).json({
                            message: "File uploaded successfully",
                            data: {
                                url: result.secure_url,
                                size: result.bytes,
                                type: result.format,
                            },
                        });
                    })
                    .catch((dbError) => {
                        return res
                            .status(500)
                            .json({ message: dbError.message });
                    });
            }
        );
        result.end(file.buffer);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// work in progress...
export const getProfilePic = async (req, res) => {
    try {
        const { id: creatorId } = req.user;

        const filter = {
            creatorId: creatorId,
            documentType: uploadEnum.PROFILE_PICTURE,
        };
        const profilePic = await entity.getAllFilteredData(uploadModel, filter);
        if (!profilePic || profilePic.length === 0) {
            return res.status(404).json({
                message: "No profile picture found for this user",
            });
        }
        return res.status(200).json({
            message: "Profile picture retrieved successfully",
            profilePicture: profilePic,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message,
        });
    }
};
