import axios from 'axios';

export const wpToolSchema = {
  type: "object",
  properties: {
    siteUrl: { type: "string" },
    postId: { type: "number" },
    title: { type: "string" },
    metaDescription: { type: "string" }
  },
  required: ["siteUrl", "postId"],
};

export async function updateWordPressPost(args: any) {
  const { siteUrl, postId, title, metaDescription } = args;
  const username = process.env.WP_USERNAME;
  const password = process.env.WP_APPLICATION_PASSWORD;

  if (!username || !password) {
    throw new Error("WordPress credentials not configured in environment.");
  }

  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  
  // Note: Meta descriptions require a specific SEO plugin's REST API endpoints (e.g., Yoast/RankMath)
  // This updates core WordPress fields.
  const payload: any = {};
  if (title) payload.title = title;

  try {
    const res = await axios.post(`${siteUrl}/wp-json/wp/v2/posts/${postId}`, payload, {
      headers: { Authorization: `Basic ${auth}` }
    });
    
    return {
      status: "success",
      message: `Post ${postId} updated successfully.`,
      url: res.data.link
    };
  } catch (error: any) {
    throw new Error(`WordPress API Error: ${error.response?.data?.message || error.message}`);
  }
}