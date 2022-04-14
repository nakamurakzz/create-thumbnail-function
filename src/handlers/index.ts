import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  BUCKET,
  s3Client,
  THUMBNAIL_FILE_SUFFIX,
  THUMBNAIL_FOLDER,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_WIDTH,
} from "src/config";
import { Stream } from "stream";
import { S3Event } from "aws-lambda";
import sharp from "sharp";

export const main = async (
  event: S3Event,
  _constext,
  callback
): Promise<void> => {
  try {
    console.log(
      `targetFile: ${event.Records[0].s3.bucket.name}/${event.Records[0].s3.object.key}`
    );
    const fileName = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );
    const streamImageData = sharp();

    // Get Object From S3.
    const command = new GetObjectCommand({
      Bucket: event.Records[0].s3.bucket.name,
      Key: fileName,
    });
    console.log("get object");
    const res = await s3Client.send(command);

    // Parse Object
    // const stream = new PassThrough();
    Stream.Readable.from(res.Body).pipe(streamImageData);

    console.log("start resize");
    const imgBuffer = await streamImageData
      .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: "contain" })
      .jpeg({ quality: 95 })
      .toBuffer();

    console.log("upload to S3");
    const thumbnailFileName =
      fileName
        .split("/")
        [fileName.split("/").length - 1].split(".")
        .slice(0, -1)
        .join() + THUMBNAIL_FILE_SUFFIX;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${THUMBNAIL_FOLDER}/${thumbnailFileName}`,
        Body: imgBuffer,
        ContentType: "image",
      })
    );
  } catch (err) {
    console.error(err);
    callback(err);
  }
  callback(null);
};
