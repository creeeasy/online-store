// ===== TYPESCRIPT CONTROLLERS (controllers/botDetectionController.ts) =====
import { Request, Response } from 'express';
import { BotDetection, IBotDetection } from '../models/BotDetection';

// DTO for request validation
interface BotDetectionUpdateDTO {
  activeBotScore: boolean;
  botScore: number;
}

export class BotDetectionController {
  /**
   * Get bot detection settings
   * GET /api/bot-detection
   */
  static async getBotDetectionSettings(req: Request, res: Response): Promise<void> {
    try {
      let botDetection = await BotDetection.findOne();

      // If no settings exist, create default ones
      if (!botDetection) {
        botDetection = new BotDetection({
          activeBotScore: false,
          botScore: 0,
        });
        await botDetection.save();
      }

      res.status(200).json({
        success: true,
        data: {
          activeBotScore: botDetection.activeBotScore,
          botScore: botDetection.botScore,
          updatedAt: botDetection.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error fetching bot detection settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bot detection settings',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update bot detection settings
   * PUT /api/bot-detection
   */
  static async updateBotDetectionSettings(req: Request, res: Response): Promise<void> {
    try {
      const { activeBotScore, botScore }: BotDetectionUpdateDTO = req.body;

      // Validate input
      if (typeof activeBotScore !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'activeBotScore must be a boolean value',
        });
        return;
      }

      if (typeof botScore !== 'number' || botScore < 0 || botScore > 100) {
        res.status(400).json({
          success: false,
          message: 'botScore must be a number between 0 and 100',
        });
        return;
      }

      // Update or create bot detection settings
      let botDetection = await BotDetection.findOne();

      if (botDetection) {
        // Update existing settings
        botDetection.activeBotScore = activeBotScore;
        botDetection.botScore = botScore;
        await botDetection.save();
      } else {
        // Create new settings
        botDetection = new BotDetection({
          activeBotScore,
          botScore,
        });
        await botDetection.save();
      }

      res.status(200).json({
        success: true,
        message: 'Bot detection settings updated successfully',
        data: {
          activeBotScore: botDetection.activeBotScore,
          botScore: botDetection.botScore,
          updatedAt: botDetection.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error updating bot detection settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update bot detection settings',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Delete bot detection settings (reset to defaults)
   * DELETE /api/bot-detection
   */
  static async resetBotDetectionSettings(req: Request, res: Response): Promise<void> {
    try {
      await BotDetection.deleteMany({});

      // Create default settings
      const defaultSettings = new BotDetection({
        activeBotScore: false,
        botScore: 0,
      });
      await defaultSettings.save();

      res.status(200).json({
        success: true,
        message: 'Bot detection settings reset to defaults',
        data: {
          activeBotScore: defaultSettings.activeBotScore,
          botScore: defaultSettings.botScore,
          updatedAt: defaultSettings.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error resetting bot detection settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset bot detection settings',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}