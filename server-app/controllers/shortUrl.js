import { urlModel } from "../model/shortUrl.js";

const withShortLink = (req, urlDoc) => {
    const data = urlDoc.toObject();
    return {
        ...data,
        shortLink: `${req.protocol}://${req.get("host")}/${data.shortUrl}`,
    };
};

export const createUrl = async (req, res) => {
    try {
        console.log("The fullUrl is ", req.body.fullUrl);
        const urlFound = await urlModel.find({ fullUrl: req.body.fullUrl });
        if (urlFound.length > 0) {
            return res.status(200).json(withShortLink(req, urlFound[0]));
        }
        else {
            const shortUrl = await urlModel.create({ fullUrl: req.body.fullUrl });
            return res.status(201).json(withShortLink(req, shortUrl));
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllUrl = async (req, res) => {
    try {
        const shortUrls = await urlModel.find();
        if (shortUrls.length > 0) {
            return res.status(200).json(shortUrls.map((item) => withShortLink(req, item)));
        } else {
            return res.status(404).json({ error: "No URLs found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUrl = async (req, res) => {
    try {
        const shortUrl = await urlModel.findById(req.params.id);
        if (shortUrl) {
            return res.status(200).json(withShortLink(req, shortUrl));
        } else {
            return res.status(404).json({ error: "URL not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteUrl = async (req, res) => {
    try {
        const shortUrl = await urlModel.findByIdAndDelete(req.params.id);
        if (shortUrl) {
            return res.status(200).json({ message: "URL deleted successfully" });
        } else {
            return res.status(404).json({ error: "URL not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateUrlPut = async (req, res) => {
    try {
        const { fullUrl } = req.body;

        if (!fullUrl) {
            return res.status(400).json({ error: "fullUrl is required" });
        }

        const updatedUrl = await urlModel.findByIdAndUpdate(
            req.params.id,
            { fullUrl },
            { new: true, runValidators: true }
        );

        if (!updatedUrl) {
            return res.status(404).json({ error: "URL not found" });
        }

        return res.status(200).json(withShortLink(req, updatedUrl));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateUrlPatch = async (req, res) => {
    try {
        const updates = {};

        if (req.body.fullUrl !== undefined) {
            updates.fullUrl = req.body.fullUrl;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }

        const updatedUrl = await urlModel.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedUrl) {
            return res.status(404).json({ error: "URL not found" });
        }

        return res.status(200).json(withShortLink(req, updatedUrl));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const redirectShortUrl = async (req, res) => {
    try {
        const shortUrlDoc = await urlModel.findOneAndUpdate(
            { shortUrl: req.params.shortUrl },
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!shortUrlDoc) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.redirect(shortUrlDoc.fullUrl);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};