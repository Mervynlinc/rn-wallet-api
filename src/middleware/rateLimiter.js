import ratelimit from "../config/upstach.js";

const ratelimiter = async (req, res, next) => {
    try {
        const {success} = await ratelimit.limit(req.ip);
        
        if (!success) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }
        next();
    } catch (error) {
        console.error("Error in rate limiter middleware:", error);
        res.status(500).json({ error: "Internal server error" });
        next(error);
    }

}

export default ratelimiter;