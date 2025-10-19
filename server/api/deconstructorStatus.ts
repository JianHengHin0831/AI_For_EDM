import fetch from "node-fetch";

const LALAL_API = "https://www.lalal.ai/api";
const LICENSE_KEY = process.env.LALAL_LICENSE_KEY || "你的LalalLicenseKey";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const fileId = query.fileId as string;

  if (!fileId) {
    return { error: "Missing fileId" };
  }

  try {
    const res = await fetch(`${LALAL_API}/check/`, {
      method: "POST",
      headers: {
        Authorization: `license ${LICENSE_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ id: fileId }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to check status");

    return json;
  } catch (err: any) {
    return { error: err.message || "Internal server error" };
  }
});
