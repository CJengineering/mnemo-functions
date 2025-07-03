import { Request, Response } from 'express';
import { promptToCollectionItem, PromptToItemRequest } from '../ai/promptToCollectionItem';

export async function promptToItemEndpoint(req: Request, res: Response) {
  try {
    const { prompt, type, context, saveToDatabase = true } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required and must be a string'
      });
    }

    if (prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Prompt must be at least 10 characters long'
      });
    }

    console.log('📥 Received prompt request:', { 
      prompt: prompt.substring(0, 100) + '...', 
      type, 
      context: context?.substring(0, 50) + '...' || 'none',
      saveToDatabase 
    });

    const request: PromptToItemRequest = {
      prompt,
      type,
      context
    };

    const result = await promptToCollectionItem(request, saveToDatabase);

    if (result.success) {
      console.log('✅ Prompt processing successful');
      res.status(201).json(result);
    } else {
      console.log('⚠️ Prompt processing failed - missing fields:', (result as any).missing);
      res.status(400).json(result);
    }

  } catch (error) {
    console.error('❌ Prompt to item endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process prompt';
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
}

// Demo endpoint that doesn't save to database
export async function promptToItemDemoEndpoint(req: Request, res: Response) {
  try {
    const { prompt, type, context } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required and must be a string'
      });
    }

    if (prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Prompt must be at least 10 characters long'
      });
    }

    console.log('📥 Received prompt demo request:', { 
      prompt: prompt.substring(0, 100) + '...', 
      type, 
      context: context?.substring(0, 50) + '...' || 'none'
    });

    const request: PromptToItemRequest = {
      prompt,
      type,
      context
    };

    const result = await promptToCollectionItem(request, false); // Demo mode - don't save

    res.json({
      ...result,
      demo: true,
      message: result.success 
        ? 'Demo response: Data was transformed but not saved to database.'
        : (result as any).message
    });

  } catch (error) {
    console.error('❌ Prompt to item demo endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process prompt';
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
}
