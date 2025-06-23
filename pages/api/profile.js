import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Missing username' });

    try {
        const { data } = await axios.get(`https://www.instagram.com/${username}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const $ = cheerio.load(data);
        const script = $('script[type="application/ld+json"]').html();
        const json = JSON.parse(script);
        const pic = json.image;
        if (!pic) return res.status(404).json({ error: 'Profile picture not found' });

        res.status(200).json({ profilePic: pic });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
}