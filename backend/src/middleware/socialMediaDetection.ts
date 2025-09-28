import { Request, Response, NextFunction } from 'express';
declare module 'express-serve-static-core' {
    interface Request {
      isSocialMediaTraffic?: boolean;
    }
  }
const socialMediaDetection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(
      "------------------------------------------------------------------------------------------"
    );
    console.log("Starting socialMediaDetection middleware");
    
    // Log headers for debugging
    console.log("Headers:", {
      referrer: req.get("Referer"),
      userAgent: req.get("User-Agent"),
      requestedWith: req.get("x-requested-with"),
      fbClient: req.get("x-fb-client"),
    });

    const referrer: string = req.get("Referer")?.toLowerCase() || "";
    const userAgent: string = req.get("User-Agent")?.toLowerCase() || "";
    const requestedWith: string = req.get("x-requested-with")?.toLowerCase() || "";

    const socialReferrers: string[] = [
      "m.facebook.com",
      "l.facebook.com",
      "www.facebook.com",
      "l.instagram.com",
      "www.instagram.com",
      "www.tiktok.com",
      "vm.tiktok.com",
      "t.co",
      "twitter.com",
      "mobile.twitter.com",
      "youtube.com",
      "m.youtube.com",
      "youtu.be",
      "snapchat.com",
      "linkedin.com",
      "reddit.com",
      "old.reddit.com",
      "pinterest.com",
      "pin.it",
      "m.me",
      "facebook.com/messages",
      "wa.me",
      "web.whatsapp.com",
      "t.me",
      "discord.com",
      "discordapp.com",
      "threads.net",
      "quora.com",
      "tumblr.com",
    ];

    // Check for social media traffic
    const matchedReferrer: boolean = socialReferrers.some((domain: string) =>
      referrer.includes(domain)
    );

    const matchedUserAgent: boolean = 
      userAgent.includes("instagram") || 
      userAgent.includes("facebook") || 
      userAgent.includes("tiktok");

    const isFacebookApp: boolean = 
      userAgent.includes("fb_iab") || 
      userAgent.includes("fbav");

    if (isFacebookApp) {
      console.log("User is browsing from Facebook In-App Browser");
    }

    const matchedRequestedWith: boolean = 
      requestedWith.includes("com.instagram.android") || 
      requestedWith.includes("com.facebook.katana");

    // Set social media detection result in request object
    req.isSocialMediaTraffic = matchedReferrer || matchedUserAgent || matchedRequestedWith;

    console.log("Social media traffic detected:", req.isSocialMediaTraffic);

    return next();

  } catch (error: any) {
    console.error("Error in socialMediaDetection middleware:", {
      message: error.message,
      stack: error.stack,
      request: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
      },
    });

    return next(error);
  }
};

export default socialMediaDetection;