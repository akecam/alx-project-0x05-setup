import { HEIGHT, WIDTH } from "@/constants";
import { RequestProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const gptApiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  const gptUrl = process.env.API_URL;

  if (!gptApiKey || !gptUrl) {
    return response
      .status(500)
      .json({ error: "API key or URL is missing in environment variables" });
  }

  try {
    const { prompt }: RequestProps = request.body;

    const res = await fetch(gptUrl, {
      method: "POST",
      body: JSON.stringify({ text: prompt, width: WIDTH, height: HEIGHT }),
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOT,
        "x-rapidapi-key": gptApiKey,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from DALLE");
    }

    const data = await res.json();

    return response.status(200).json({
      message:
        data?.generated_image ||
        "https://via.placeholder.com/600x400?text=Generated+Image",
    });
  } catch (error) {
    console.error("Error in APi route:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
