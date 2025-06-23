import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing reel URL' });

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
        });
        const $ = cheerio.load(data);
        const jsonText = $('script[type="application/ld+json"]').html();
        const jsonData = JSON.parse(jsonText);
        const videoUrl = jsonData.video && jsonData.video.contentUrl;
        if (!videoUrl) return res.status(404).json({ error: 'Video not found' });

        res.status(200).json({ videoUrl });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reel' });
    }
}