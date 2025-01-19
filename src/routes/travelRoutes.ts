import express, { Request, Response } from 'express';
import { Travel } from '../models/Travel';
import authenticateToken from '../middleware/authenticateToken';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const travels = await Travel.find({ userId });
    res.json(travels);
  } catch (err) {
    console.error('Error fetching travels:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { destination, description, departureDate, duration } = req.body;
  const userId = req.userId;

  if (!destination || !description || !departureDate || !duration) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const newTravel = new Travel({ destination, description, departureDate, duration, userId });
    await newTravel.save();
    res.status(201).json(newTravel);
  } catch (err) {
    console.error('Error saving travel:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { destination, description, departureDate, duration } = req.body;
  const userId = req.userId;

  if (!destination || !description || !departureDate || !duration) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const updatedTravel = await Travel.findOneAndUpdate(
      { _id: id, userId },
      { destination, description, departureDate, duration },
      { new: true }
    );

    if (!updatedTravel) {
      res.status(404).json({ error: 'Travel not found or unauthorized' });
      return;
    }

    res.json(updatedTravel);
  } catch (err) {
    console.error('Error updating travel:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const travel = await Travel.findOneAndDelete({ _id: id, userId });
    if (!travel) {
      res.status(404).json({ error: 'Travel not found or unauthorized' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting travel:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
