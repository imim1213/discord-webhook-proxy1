const express = require('express');
const app = express();

// السماح بقراءة البيانات بصيغة JSON
app.use(express.json());

app.post('/', async (req, res) => {
    try {
        const discordUrl = req.body.discordWebhookUrl;
        
        if (!discordUrl) {
            return res.status(400).send('Missing Discord URL');
        }

        // نسخ البيانات مع حذف الرابط حتى لا يُرسل إلى ديسكورد
        const payloadToSend = { ...req.body };
        delete payloadToSend.discordWebhookUrl;

        // استخدام الـ fetch المدمج في بيئة Node الحديثة لتجنب أخطاء البروتوكول
        const response = await fetch(discordUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Roblox-Webhook-Proxy'
            },
            body: JSON.stringify(payloadToSend)
        });

        if (response.ok) {
            return res.status(200).send('Success');
        } else {
            const errorText = await response.text();
            return res.status(response.status).send(errorText);
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));