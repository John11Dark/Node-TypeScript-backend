import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const MAX_ALLOWED_IMAGES = 5;
const OUT_FOLDER = "public/assets";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, OUT_FOLDER);
  },
  filename: (req, file, cb) => {
    const name = req.body.flag === "user" ? req.body.name : req.body.site;
    const fileName = `${name.split(" ").join("")}_${Date.now()}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: {
    files: MAX_ALLOWED_IMAGES,
  },
});

const handleImageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await upload.array("images");
    next();
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).send({ message: "Error uploading images.", error });
  }
};

const processImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[];
  if (files) {
    const images: string[] = [];

    try {
      await Promise.all(
        files.map(async (file, index) => {
          const fileName = path.basename(`${file.path}_${index}`);

          await Promise.all([
            sharp(file.path)
              .resize(2000)
              .jpeg({ quality: 50 })
              .toFile(path.resolve(OUT_FOLDER, `${fileName}_full.jpg`)),
            sharp(file.path)
              .resize(100)
              .jpeg({ quality: 30 })
              .toFile(path.resolve(OUT_FOLDER, `${fileName}_thumb.jpg`)),
          ]);

          fs.unlinkSync(file.path);
          images.push(fileName);
        })
      );

      if (req.body.flag === "user") {
        await handleAvatarGeneration(req, req.body.name, images);
      } else {
        req.body.images = images;
      }
    } catch (error) {
      console.error("Image processing error:", error);
      res.status(500).send({ message: "Error processing images.", error });
    }
  }
  console.log("first", req.body);
  req.body.image = "Avatar_undefined_1626957300000_full.jpg";
  next();
};

const handleAvatarGeneration = async (
  req: Request,
  name: string,
  images: string[]
) => {
  if (images.length > 1) {
    req.body.image = images[0];
  } else {
    const { createAvatar } = await import("@dicebear/core");
    const { lorelei } = await import("@dicebear/collection");
    const sanitizedName = name.split(" ").join("");
    const avatar = createAvatar(lorelei, {
      seed: sanitizedName,
      size: 300,
    });
    const fileName = `Avatar_${sanitizedName}_${Date.now()}.svg`;
    avatar.toFile(`${OUT_FOLDER}/${fileName}.svg`);
    await Promise.all([
      sharp(`${OUT_FOLDER}/${fileName}.svg`)
        .resize(2000)
        .jpeg({ quality: 50 })
        .toFile(`${OUT_FOLDER}/${fileName}_full.jpg`),
      sharp(`${OUT_FOLDER}/${fileName}.svg`)
        .resize(100)
        .jpeg({ quality: 30 })
        .toFile(`${OUT_FOLDER}/${fileName}_thumb.jpg`),
    ]);
    fs.unlinkSync(`${OUT_FOLDER}/${fileName}.svg`);
    req.body.image = fileName;
  }
};

export default { handleImageUpload, processImages };
