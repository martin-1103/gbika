// [service.controller.ts]: Service HTTP request handlers
import { Request, Response } from 'express';
import { createPrayerRequest } from '../services/prayer.service';
import { createSongRequest } from '../services/songRequest.service';

// Submit prayer request
export const submitPrayerRequest = async (req: Request, res: Response) => {
  try {
    const { name, contact, content, is_anonymous } = req.body;
    
    const prayerRequest = await createPrayerRequest({
      name,
      contact,
      content,
      isAnonymous: is_anonymous || false
    });
    
    console.log('Prayer request created:', prayerRequest.id);
    
    // TODO: Send notification to prayer team
    
    res.status(201).json({ message: 'Prayer request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting prayer request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit song request
export const submitSongRequest = async (req: Request, res: Response) => {
  try {
    const { name, city, song_title, message } = req.body;
    
    const songRequest = await createSongRequest({
      name,
      city,
      songTitle: song_title,
      message
    });
    
    console.log('Song request created:', songRequest.id);
    
    res.status(201).json({ 
      message: 'Song request submitted successfully.',
      data: {
        id: songRequest.id,
        name: songRequest.name,
        city: songRequest.city,
        songTitle: songRequest.songTitle,
        message: songRequest.message,
        createdAt: songRequest.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting song request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
