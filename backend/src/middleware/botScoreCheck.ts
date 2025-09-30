import { Request, Response, NextFunction } from 'express';
import requestIp from 'request-ip';
import axios from 'axios';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Offer from '../models/Offer';
import { OrderFake } from '../models/OrderFake';
import { ResponseHandler } from '../utils/responseHandler';
import {BotDetection}  from '../models/BotDetection';
const botScoreCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Starting botScoreCheck middleware");
    
    const botData=await BotDetection.findOne({});
    if(!botData?.activeBotScore){
     return next()
    }
    const {
      productId,
      customerData = {},
      quantity = 1,
      typeOfOrder,
      offerId,
      selectedVariants = {},
      notes,
      botScore = 0
    } = req.body;

    // Get client IP
    const ipClient: string = requestIp.getClientIp(req) || '';
    console.log("Client IP:", ipClient);

    // Get country information
    try {
      const geoRes = await axios.get(`http://ip-api.com/json/${ipClient}`);
      const country: string = geoRes.data.country;
      console.log(`IP ${ipClient} is from ${country}`);
    } catch (geoError: any) {
      console.warn("Failed to get geo location:", geoError.message);
    }

    console.log("Bot Score:", botScore);

    // Rate limiting check - 24 hours per IP + Product
    const twentyFourHoursAgo: Date = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const existingFakeOrder = await OrderFake.findOne({
      ipClient,
      productId: new mongoose.Types.ObjectId(productId),
      timeEnter: { $gte: twentyFourHoursAgo },
    });

    if (existingFakeOrder) {
      return ResponseHandler.error(
        res,
        'يمكنك تقديم طلب واحد فقط كل 24 ساعة. يُرجى المحاولة لاحقًا.',
        409
      );
    }

    // Check if traffic is from social media and user is not a bot
    const botLimit=+botData.botScore || 0
    if (botScore <= botLimit) {
      console.log("Dont detect Bot");
      return next();
    }

    // For non-social traffic or bot traffic, create fake order
    console.log("detect Bot");

    // Verify product exists for fake order
    const product = await Product.findById(productId);
    if (!product) {
      return ResponseHandler.error(res, 'المنتج غير موجود', 404);
    }

    // Calculate price for fake order
    let totalPrice: number = 0;
    let offerTitle: string = '';

    if (typeOfOrder === 'offer' && offerId) {
      const offer = await Offer.findById(offerId);
      if (offer && offer.isActive && (!offer.validUntil || new Date(offer.validUntil) >= new Date())) {
        totalPrice = offer.discountedPrice ?? offer.originalPrice ?? product.price;
        offerTitle = offer.title || '';
      } else {
        totalPrice = product.discountPrice ?? product.price;
      }
    } else if (typeOfOrder === 'quantity') {
      const validQuantity: number = Math.max(1, Math.min(quantity || 1, product.maxQuantityPerInquiry || 10));
      totalPrice = (product.discountPrice ?? product.price) * validQuantity;
    } else {
      totalPrice = product.discountPrice ?? product.price;
    }

    const timeEnter: Date = new Date();

    // Create fake order
    const fakeOrder = new OrderFake({
      productId,
      customerData: selectedVariants,
      quantity: typeOfOrder === 'quantity' ? quantity : 1,
      offerId: typeOfOrder === 'offer' ? offerId : undefined,
      selectedVariants,
      totalPrice,
      notes,
      typeOfOrder,
      ipClient,
      timeEnter,
      botScore,
      productName: product.name,
      productReference: product.reference,
      offerTitle,
      BotScore:botScore,
    });

    await fakeOrder.save();

    console.log("Fake order created successfully");
    const inquiry = {
      _id: fakeOrder._id,
      productId: fakeOrder.productId,
      totalPrice: fakeOrder.totalPrice,
      quantity: fakeOrder.quantity,
      typeOfOrder: fakeOrder.typeOfOrder,
      timeEnter: fakeOrder.timeEnter,
      order: false,
    };
    
    return ResponseHandler.success(
      res,
      { inquiry,order:false,thankYouButton:product.thankYou  },
      'تم إنشاء طلب الاستفسار بنجاح',
      201,
    );

  } catch (error: any) {
    console.error("Error in botScoreCheck middleware:", {
      message: error.message,
      stack: error.stack,
      request: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
      },
    });

    return ResponseHandler.error(
      res,
      'حدث خطأ داخلي في الخادم',
      500,
      undefined
    );
  }
};

export default botScoreCheck;