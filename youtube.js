const client = require("./database.js");

async function addYouTubeVideo(channelId, videoId) {
    try {
        const checkQuery = "SELECT * FROM youtube_videos WHERE video_id = $1";
        const checkResult = await client.query(checkQuery, [videoId]);

        if (checkResult.rows.length > 0) {
            console.log("⚠️ Video already exists:", videoId);
            return false;
        }

        const insertQuery = "INSERT INTO youtube_videos (channel_id, video_id) VALUES ($1, $2)";
        await client.query(insertQuery, [channelId, videoId]);

        console.log("✅ New video added:", videoId);
        return true;
    } catch (err) {
        console.error("❌ Error inserting video:", err);
        return false;
    }
}

module.exports = { addYouTubeVideo };
