import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/store';
import { userService } from '../services/api';

export default function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile(user.id);
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        phone: response.data.phone || '',
        bio: response.data.bio || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await userService.updateProfile(user.id, formData);
      setEditMode(false);
      fetchProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAddAddress = async () => {
    const address = {
      type: 'home',
      street: 'Enter your street',
      city: 'Enter your city',
      state: 'Enter your state',
      zipCode: 'Enter your zip code',
      country: 'Enter your country',
      phone: formData.phone,
      isDefault: false,
    };

    try {
      await userService.addAddress(user.id, address);
      fetchProfile();
      alert('Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please log in to view your profile</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Profile Header */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>My Profile</h1>
          <p style={{ color: '#6b7280' }}>{user.email}</p>
        </div>

        {/* Personal Information */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Personal Information</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.6rem' }}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="3"
              />
              <button
                onClick={handleUpdateProfile}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.7rem' }}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <div>
                <p style={{ color: '#6b7280' }}>Name</p>
                <p style={{ fontWeight: 700 }}>{formData.firstName || 'Not set'} {formData.lastName || ''}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280' }}>Phone</p>
                <p style={{ fontWeight: 700 }}>{formData.phone || 'Not set'}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280' }}>Bio</p>
                <p style={{ fontWeight: 700 }}>{formData.bio || 'Not set'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Addresses</h2>
            <button
              onClick={handleAddAddress}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.6rem' }}
            >
              Add Address
            </button>
          </div>

          {profile?.addresses && profile.addresses.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {profile.addresses.map((address, idx) => (
                <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <p style={{ fontWeight: 700 }}>{address.type.toUpperCase()}</p>
                    {address.isDefault && (
                      <span style={{ background: '#eff6ff', color: '#1e3a8a', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: 6 }}>Default</span>
                    )}
                  </div>
                  <p style={{ color: '#374151' }}>{address.street}</p>
                  <p style={{ color: '#374151' }}>{address.city}, {address.state} {address.zipCode}</p>
                  <p style={{ color: '#374151' }}>{address.country}</p>
                  {address.phone && <p style={{ color: '#374151' }}>{address.phone}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No addresses added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
