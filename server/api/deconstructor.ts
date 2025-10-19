import fetch from "node-fetch";

const LALAL_API = "https://www.lalal.ai/api";
const LICENSE_KEY = process.env.LALAL_LICENSE_KEY || "你的LalalLicenseKey";

function makeContentDisposition(filename: string): string {
  try {
    // for ASCII filenames
    const asciiFilename = Buffer.from(filename, "ascii").toString("ascii");
    if (asciiFilename !== filename) {
      throw new Error("Contains non-ASCII characters");
    }
    return `attachment; filename="${filename}"`;
  } catch (error) {
    // for non-ASCII filenames
    const quoted = encodeURIComponent(filename);
    return `attachment; filename*=utf-8''${quoted}`;
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { file, filename } = body;

    if (!file || !filename) {
      return { error: "Missing file or filename" };
    }

    // 1. convert base64 to buffer
    const buffer = Buffer.from(file);

    // 2. upload request
    const uploadRes = await fetch(`${LALAL_API}/upload/`, {
      method: "POST",
      headers: {
        Authorization: `license ${LICENSE_KEY}`,
        "Content-Disposition": makeContentDisposition(filename),
      },
      body: buffer,
    });

    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadJson.error || "Upload failed");

    const fileId = uploadJson.id;
    console.log("LALAL upload response:", uploadJson);
    if (!fileId) throw new Error("No file ID returned from LALAL");

    // split request
    const splitRes = await fetch(`${LALAL_API}/split/`, {
      method: "POST",
      headers: {
        Authorization: `license ${LICENSE_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        id: fileId,
        stem: "vocals,drum,bass,piano,electric_guitar,acoustic_guitar",
        splitter: "phoenix",
      }),
    });

    const splitJson = await splitRes.json();
    console.log("LALAL split response:", splitJson);
    if (!splitRes.ok) throw new Error(splitJson.error || "Split failed");
    if (splitJson.error) throw new Error(splitJson.error);

    return {
      fileId,
      message: "File uploaded and split initiated successfully",
      task: splitJson.result?.[fileId]?.task || splitJson,
    };
  } catch (err: any) {
    console.error("Error in deconstructor API:", err);
    return { error: err.message || "Internal server error" };
  }
});
