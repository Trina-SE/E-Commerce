import express from 'express';
import UserProfile from '../models/UserProfile.js';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) {
      // Create default profile if doesn't exist
      const newProfile = new UserProfile({
        userId: req.params.userId,
      });
      await newProfile.save();
      return res.json(newProfile);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, dateOfBirth, gender, avatar, preferences } = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.params.userId },
      {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        avatar: avatar || undefined,
        preferences: preferences || undefined,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Add address
router.post('/:userId/addresses', async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country, phone, isDefault } = req.body;

    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const address = {
      type: type || 'home',
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault: isDefault || false,
    };

    profile.addresses.push(address);
    await profile.save();

    res.status(201).json({ message: 'Address added', address, profile });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
});

// Update address
router.put('/:userId/addresses/:addressIndex', async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country, phone, isDefault } = req.body;
    const profile = await UserProfile.findOne({ userId: req.params.userId });

    if (!profile || !profile.addresses[req.params.addressIndex]) {
      return res.status(404).json({ message: 'Address not found' });
    }

    profile.addresses[req.params.addressIndex] = {
      ...profile.addresses[req.params.addressIndex],
      type: type || profile.addresses[req.params.addressIndex].type,
      street: street || profile.addresses[req.params.addressIndex].street,
      city: city || profile.addresses[req.params.addressIndex].city,
      state: state || profile.addresses[req.params.addressIndex].state,
      zipCode: zipCode || profile.addresses[req.params.addressIndex].zipCode,
      country: country || profile.addresses[req.params.addressIndex].country,
      phone: phone || profile.addresses[req.params.addressIndex].phone,
      isDefault: isDefault !== undefined ? isDefault : profile.addresses[req.params.addressIndex].isDefault,
    };

    await profile.save();
    res.json({ message: 'Address updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
});

// Delete address
router.delete('/:userId/addresses/:addressIndex', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });

    if (!profile || !profile.addresses[req.params.addressIndex]) {
      return res.status(404).json({ message: 'Address not found' });
    }

    profile.addresses.splice(req.params.addressIndex, 1);
    await profile.save();

    res.json({ message: 'Address deleted', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
});

// Add to wishlist
router.post('/:userId/wishlist/:productId', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    if (!profile.wishlist.includes(req.params.productId)) {
      profile.wishlist.push(req.params.productId);
      await profile.save();
    }

    res.json({ message: 'Product added to wishlist', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
});

// Remove from wishlist
router.delete('/:userId/wishlist/:productId', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    profile.wishlist = profile.wishlist.filter((id) => id !== req.params.productId);
    await profile.save();

    res.json({ message: 'Product removed from wishlist', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
});

export default router;
