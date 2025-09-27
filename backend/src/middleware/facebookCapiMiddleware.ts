import { ObjectId } from "mongodb";
import { Request, Response, NextFunction } from "express";
const bizSdk = require("facebook-nodejs-business-sdk");
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;
const ServerEvent = bizSdk.ServerEvent;
import Pixel from "../models/pixel";

interface CustomerData {
  fullName?: string;
  phoneNumber?: string;
  wilaya?: string;
  'بلدية'?: string;
  name?: string;
  phone?: string;
  reference?: string;
}

interface SelectedVariants {
  fullName?: string;
  phoneNumber?: string;
  wilaya?: string;
  'بلدية'?: string;
}

interface CustomRequestBody {
  productId?: string;
  typeOfOrder?: string;
  offerId?: string;
  customerData?: CustomerData;
  selectedVariants?: SelectedVariants;
  totalPrice?: number;
  botScore?: number;
  eventId?: string;
}

interface CustomRequest extends Request {
  body: CustomRequestBody;
}

function facebookCapiMiddleware() {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log(`[FB CAPI] Middleware triggered for path: ${req.path}`);
    
    try {
    
      const pixelData = await Pixel.findOne({
      });

      if (!pixelData) {
        console.log('[FB CAPI] Skipping - no pixel data found for user');
        return next();
      }

      console.log('[FB CAPI] Pixel data found:', {
        hasApiConversion: !!pixelData.apiConversion,
        hasPixelId: !!pixelData.pixelId,
        hasAccessToken: !!(pixelData as any).accessToken
      });

      if (!pixelData.apiConversion) {
        console.log('[FB CAPI] Skipping - API conversion not enabled');
        return next();
      }

      if (!pixelData.pixelId || !(pixelData as any).accessToken) {
        console.log('[FB CAPI] Skipping - missing pixelId or accessToken');
        return next();
      }

      const accessToken: string = (pixelData as any).accessToken;

      const pixelId: string = pixelData.pixelId;

      console.log(`[FB CAPI] Using pixel ID: ${pixelId}`);

      // Extract email and phone from customerData or selectedVariants
      const fullName = req.body.customerData?.fullName || req.body.selectedVariants?.fullName;
      const phone = req.body.customerData?.phoneNumber || req.body.selectedVariants?.phoneNumber;

      // Prepare user data
      const userData = new UserData()
        .setClientIpAddress(req.ip)
        .setClientUserAgent(req.headers["user-agent"]);

      if (fullName) {
        // Check if fullName contains @ symbol to determine if it's an email
        if (fullName.includes('@')) {
          userData.setEmails([fullName]);
          console.log('[FB CAPI] Email found in request');
        }
      }
      if (phone) {
        userData.setPhones([phone]);
        console.log('[FB CAPI] Phone found in request');
      }

      // Build custom data
      const customData = new CustomData().setCurrency("DZD");

      if (req.body.totalPrice) {
        customData.setValue(req.body.totalPrice);
        console.log(`[FB CAPI] Set value: ${req.body.totalPrice}`);
      }

      // Use productId or offerId as content ID
      const contentId = req.body.productId || req.body.offerId;
      if (contentId) {
        customData.setContentIds([contentId]);
        console.log(`[FB CAPI] Content ID: ${contentId}`);
      }

      // Set content type based on typeOfOrder
      if (req.body.typeOfOrder) {
        customData.setContentType(req.body.typeOfOrder);
        console.log(`[FB CAPI] Content Type: ${req.body.typeOfOrder}`);
      } else {
        customData.setContentType("product");
        console.log(`[FB CAPI] Content Type: product (default)`);
      }

      // Set custom properties
      const customProperties: Record<string, any> = {};
      
      if (req.body.productId) {
        customProperties.productId = req.body.productId;
      }
      if (req.body.offerId) {
        customProperties.offerId = req.body.offerId;
      }
      if (req.body.typeOfOrder) {
        customProperties.typeOfOrder = req.body.typeOfOrder;
      }
      if (req.body.botScore) {
        customProperties.botScore = req.body.botScore;
      }
      
      // Add location data from customerData or selectedVariants
      const wilaya = req.body.customerData?.wilaya || req.body.selectedVariants?.wilaya;
      const reference = req.body.customerData?.reference;
      
      if (wilaya) {
        customProperties.wilaya = wilaya;
      }
      if (reference) {
        customProperties.reference = reference;
      }

      // Add customer data as custom properties
      if (req.body.customerData) {
        customProperties.customerData = req.body.customerData;
      }
      if (req.body.selectedVariants) {
        customProperties.selectedVariants = req.body.selectedVariants;
      }

      if (Object.keys(customProperties).length > 0) {
        customData.setCustomProperties(customProperties);
        console.log('[FB CAPI] Custom properties set:', customProperties);
      }

      // Check if we have any enabled events
      if (!pixelData.eventTypes || typeof pixelData.eventTypes !== 'object') {
        console.log('[FB CAPI] Skipping - no event types configured');
        return next();
      }

      const enabledEvents: [string, boolean][] = Object.entries(pixelData.eventTypes)
        .filter(([eventName, enabled]: [string, boolean]) => enabled && eventName !== "PageView");

      console.log(`[FB CAPI] Found ${enabledEvents.length} enabled events to process`);

      if (enabledEvents.length === 0) {
        console.log('[FB CAPI] No enabled events to send');
        return next();
      }

      // Process each enabled event
      for (const [eventName, enabled] of enabledEvents) {
        try {
          console.log(`[FB CAPI] Preparing event: ${eventName}`);
          
          const serverEvent = new ServerEvent()
            .setEventName(eventName)
            .setEventTime(Math.floor(Date.now() / 1000))
            .setUserData(userData)
            .setCustomData(customData)
            .setEventId(req.body.eventId || `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

          const eventRequest = new EventRequest(accessToken, pixelId).setEvents([serverEvent]);

          console.log(`[FB CAPI] Sending event: ${eventName}`);
          const response = await eventRequest.execute();
          console.log(`[FB CAPI] Successfully sent event: ${eventName}`, response ? 'Response received' : 'No response');

        } catch (eventError: any) {
          console.error(`[FB CAPI] Failed to send event ${eventName}:`, eventError.message);
          // Continue with other events even if one fails
        }
      }

    } catch (err: any) {
      console.error(`[FB CAPI] Critical error in middleware:`, err.message, err.stack);
      // Don't block the request flow even if middleware fails
    }

    next();
  };
}

export default facebookCapiMiddleware;