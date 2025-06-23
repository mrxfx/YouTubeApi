import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing post URL' });

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
        });
        const $ = cheerio.load(data);
        const scripts = $('script[type="application/ld+json"]');
        const images = [];
        scripts.each((i, el) => {
            const jsonText = $(el).html();
            const jsonData = JSON.parse(jsonText);
            if (jsonData.image) images.push(jsonData.image);
        });

        if (!images.length) return res.status(404).json({ error: 'No media found' });

        res.status(200).json({ media: images });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
}
