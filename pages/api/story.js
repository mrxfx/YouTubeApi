import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Missing username' });

    try {
        const igUrl = `https://www.instagram.com/stories/${username}/`;
        const { data } = await axios.get(igUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
        });

        // Check for story JSON
        const storyMedia = [];
        const storyRegex = /"story":{"items":(\[.*?\])}/;
        const match = data.match(storyRegex);

        if (match && match[1]) {
            const items = JSON.parse(match[1]);
            items.forEach(item => {
                if (item.video_resources) {
                    storyMedia.push(item.video_resources.pop().src);
                } else if (item.display_url) {
                    storyMedia.push(item.display_url);
                }
            });
        }

        if (!storyMedia.length) {
            return res.status(404).json({ error: 'No active stories found or user is private.' });
        }

        res.status(200).json({ username, media: storyMedia });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stories or user is private.' });
    }
}