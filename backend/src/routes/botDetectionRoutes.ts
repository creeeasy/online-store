// ===== EXPRESS ROUTES (routes/botDetectionRoutes.ts) =====
import { Router } from 'express';
import { BotDetectionController } from '../controllers/botDetectionController';

const router = Router();

/**
 * @route   GET /api/bot-detection
 * @desc    Get current bot detection settings
 * @access  Public (or add authentication middleware as needed)
 */
router.get('/', BotDetectionController.getBotDetectionSettings);

/**
 * @route   PUT /api/bot-detection
 * @desc    Update bot detection settings
 * @access  Public (or add authentication middleware as needed)
 */
router.put('/', BotDetectionController.updateBotDetectionSettings);

/**
 * @route   DELETE /api/bot-detection
 * @desc    Reset bot detection settings to defaults
 * @access  Public (or add authentication middleware as needed)
 */
router.delete('/', BotDetectionController.resetBotDetectionSettings);

export default router;