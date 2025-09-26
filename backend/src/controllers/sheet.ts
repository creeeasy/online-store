// controllers/sheetController.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import Sheet from "../models/sheet";

export const handleAddSheet = async (req: Request, res: Response) => {
    try {
      const { sheetId } = req.body;
  
      const updatedSheet = await Sheet.findOneAndUpdate(
        {},
        { sheetID: sheetId },
        { new: true, upsert: true } // update if exists, insert if not
      );
  
      if (!updatedSheet) {
        return res.status(404).json({ success: false, message: "sheet Not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Google Sheet integrated successfully",
        user: updatedSheet,
      });
    } catch (err) {
      console.error("Error updating sheetID:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  




  export const handleGetSheet = async (req: Request, res: Response) => {
    try {
      const sheet = await Sheet.findOne({});
  
      if (!sheet) {
        return res.status(404).json({
          success: false,
          message: "No Google Sheet found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Google Sheet retrieved successfully",
        sheetID: sheet.sheetID,
      });
    } catch (err) {
      console.error("Error fetching sheetID:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  


