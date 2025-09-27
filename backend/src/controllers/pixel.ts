import { Request, Response } from 'express';
import Pixel from '../models/pixel'; // Adjust the path based on your project structure

// Interface for request body validation
interface PixelRequestBody {
    facebookPixel?: boolean;
    apiConversion?: boolean;
    pixelId?: string;
    accessToken?: string;
    eventTypes?: {
        PageView?: boolean;
        Purchase?: boolean;
        Lead?: boolean;
    };
}

// Interface for API response
interface ApiResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        facebookPixel: boolean;
        apiConversion: boolean;
        pixelId: string;
        accessToken: string;
        eventTypes: {
            PageView: boolean;
            Purchase: boolean;
            Lead: boolean;
        };
        createdAt: Date;
        updatedAt: Date;
    };
}

export const savePixelParameters = async (req: Request<{}, ApiResponse, PixelRequestBody>, res: Response<ApiResponse>): Promise<Response<ApiResponse>> => {
    const { facebookPixel, apiConversion, pixelId, accessToken, eventTypes } = req.body;
    
    try {
        // Validate that at least one service is selected
        if (!facebookPixel && !apiConversion) {
            return res.status(400).json({
                success: false,
                message: "At least one service (Facebook Pixel or API Conversion) must be selected"
            });
        }

        // Validate required fields based on selected services
        if (facebookPixel && !pixelId) {
            return res.status(400).json({
                success: false,
                message: "Pixel ID is required when Facebook Pixel is enabled"
            });
        }

        if (apiConversion && !accessToken) {
            return res.status(400).json({
                success: false,
                message: "Access Token is required when API Conversion is enabled"
            });
        }

        // Check if user already has pixel parameters
        // Note: You might want to add user identification here (e.g., userId from JWT token)
        const existingParams = await Pixel.findOne({
            // Add user identification criteria here if needed
            // userId: req.user?.id
        });

        if (existingParams) {
            return res.status(400).json({
                success: false,
                message: "Pixel parameters already exist for this user. Use update instead."
            });
        }

        // Create new pixel parameter document
        const newPixelParameter = new Pixel({
            facebookPixel: facebookPixel || false,
            apiConversion: apiConversion || false,
            pixelId: facebookPixel ? (pixelId || '') : '',
            accessToken: apiConversion ? (accessToken || '') : '',
            eventTypes: {
                PageView: eventTypes?.PageView ?? true,
                Purchase: eventTypes?.Purchase ?? false,
                Lead: eventTypes?.Lead ?? false
            }
            // createdAt and updatedAt will be handled automatically by timestamps: true
        });

        // Save the document to database
        const savedPixelParameter = await newPixelParameter.save();

        return res.status(201).json({ 
            success: true, 
            message: "Pixel parameters saved successfully",
            data: {
                id: savedPixelParameter._id.toString(),
                facebookPixel: savedPixelParameter.facebookPixel,
                apiConversion: savedPixelParameter.apiConversion,
                pixelId: savedPixelParameter.pixelId || '', // Fix: Provide fallback for undefined
                accessToken: savedPixelParameter.accessToken || '', // Fix: Provide fallback for undefined
                eventTypes: savedPixelParameter.eventTypes,
                createdAt: savedPixelParameter.createdAt,
                updatedAt: savedPixelParameter.updatedAt
            }
        });

    } catch (err) {
        console.error("Error saving pixel parameters:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};


export const getPixelParameters = async (req: Request, res: Response<ApiResponse>): Promise<Response<ApiResponse>> => {
    try {
        // Find pixel parameters - you might want to add user identification here
        const pixelData = await Pixel.findOne({
            // Add user identification criteria here if needed
            // userId: req.user?.id
        });

        if (pixelData) {
            return res.status(200).json({ 
                success: true, 
                message: "Pixel parameters retrieved successfully",
                data: {
                    id: pixelData._id.toString(),
                    facebookPixel: pixelData.facebookPixel,
                    apiConversion: pixelData.apiConversion,
                    pixelId: pixelData.pixelId || '',
                    accessToken: pixelData.accessToken || '',
                    eventTypes: pixelData.eventTypes,
                    createdAt: pixelData.createdAt,
                    updatedAt: pixelData.updatedAt
                }
            });
        } else {
            return res.status(404).json({ 
                success: false, 
                message: "Pixel parameters not found" 
            });
        }
    } catch (err) {
        console.error("Error fetching pixel parameters:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

export const updatePixelParameters = async (req: Request<{}, ApiResponse, PixelRequestBody>, res: Response<ApiResponse>): Promise<Response<ApiResponse>> => {
    const { facebookPixel, apiConversion, pixelId, accessToken, eventTypes } = req.body;
    
    try {
        // Validate that at least one service is selected
        if (!facebookPixel && !apiConversion) {
            return res.status(400).json({
                success: false,
                message: "At least one service (Facebook Pixel or API Conversion) must be selected"
            });
        }

        // Validate required fields based on selected services
        if (facebookPixel && !pixelId) {
            return res.status(400).json({
                success: false,
                message: "Pixel ID is required when Facebook Pixel is enabled"
            });
        }

        if (apiConversion && !accessToken) {
            return res.status(400).json({
                success: false,
                message: "Access Token is required when API Conversion is enabled"
            });
        }

        // Check if user has existing parameters to update
        const existingParams = await Pixel.findOne({
            // Add user identification criteria here if needed
            // userId: req.user?.id
        });

        if (!existingParams) {
            return res.status(404).json({
                success: false,
                message: "No pixel parameters found for this user. Use create instead."
            });
        }

        // Update the pixel parameters
        const updatedPixelParameter = await Pixel.findOneAndUpdate(
            {
                // Add user identification criteria here if needed
                // userId: req.user?.id
            },
            {
                facebookPixel: facebookPixel || false,
                apiConversion: apiConversion || false,
                pixelId: facebookPixel ? (pixelId || '') : '',
                accessToken: apiConversion ? (accessToken || '') : '',
                eventTypes: {
                    PageView: eventTypes?.PageView ?? existingParams.eventTypes.PageView,
                    Purchase: eventTypes?.Purchase ?? existingParams.eventTypes.Purchase,
                    Lead: eventTypes?.Lead ?? existingParams.eventTypes.Lead
                },
                updatedAt: new Date()
            },
            { new: true } // Return the updated document
        );

        if (updatedPixelParameter) {
            return res.status(200).json({ 
                success: true, 
                message: "Pixel parameters updated successfully",
                data: {
                    id: updatedPixelParameter._id.toString(),
                    facebookPixel: updatedPixelParameter.facebookPixel,
                    apiConversion: updatedPixelParameter.apiConversion,
                    pixelId: updatedPixelParameter.pixelId || '',
                    accessToken: updatedPixelParameter.accessToken || '',
                    eventTypes: updatedPixelParameter.eventTypes,
                    createdAt: updatedPixelParameter.createdAt,
                    updatedAt: updatedPixelParameter.updatedAt
                }
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: "Failed to update pixel parameters" 
            });
        }
    } catch (err) {
        console.error("Error updating pixel parameters:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};
