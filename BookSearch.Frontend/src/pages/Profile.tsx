import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useAuth } from '../components/AuthContext';
import './styles/Profile.css';

interface UserProfile {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    gender: string | null;
    dateOfBirth?: string | null; // Replaces age
    image?: string;
    id?: string;
}

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [savedProfileData, setSavedProfileData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);

    // “Change Password” placeholder
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const { logout } = useAuth();

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('User is not authenticated.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('https://localhost:7049/auth/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data: UserProfile = await response.json();
                    setProfileData(data);
                    setSavedProfileData({ ...data }); // store a copy for reverting
                } else if (response.status === 401) {
                    setError('Unauthorized access. Please log in again.');
                    logout();
                } else {
                    setError('Failed to fetch profile data.');
                }
            } catch (err) {
                setError('An error occurred while fetching profile data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [logout]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!profileData) return;

        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = useCallback(async () => {
        if (!profileData) return;

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('No auth token found.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7049/auth/profileEdit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                setIsEditing(false);
                setSavedProfileData({ ...profileData });
            } else {
                alert('Failed to update profile.');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('An error occurred while updating your profile.');
        }
    }, [profileData]);

    const handleCancel = useCallback(() => {
        // revert to the previous saved data
        setProfileData(savedProfileData);
        setIsEditing(false);
    }, [savedProfileData]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleChangePassword = useCallback(() => {
        setIsChangePasswordOpen(true);
    }, []);

    const copyToClipboard = (text?: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
    };

    if (isLoading) {
        return <div className="profile-loading">Loading...</div>;
    }

    if (error) {
        return <div className="profile-error">Error: {error}</div>;
    }

    return (
        <div className="profile-container">
            <div className="outer-box">

                {/* Toolbar area */}
                <div className="profile-toolbar">
                    <div className="toolbar-title">User Profile</div>
                    <div className="toolbar-actions">
                        {!isEditing ? (
                            <button onClick={handleEdit} className="edit-button">
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button onClick={handleCancel} className="cancel-button">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="save-button">
                                    Save
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Cards area */}
                <div className="cards-area">
                    {/* Basic Info Card */}
                    <div className="profile-card basic-info-card">
                        <div className="profile-card-header">
                            <img
                                className="profile-avatar"
                                src={profileData?.image || 'https://via.placeholder.com/150'}
                                alt="User Avatar"
                            />
                            <div className="profile-header-info">
                                <div className="profile-full-name">
                                    {(profileData?.firstName || '') + ' ' + (profileData?.lastName || '')}
                                </div>

                                {profileData?.id && (
                                    <div className="profile-id-row">
                                        <span className="profile-id-label">ID: {profileData.id}</span>
                                        <button
                                            className="clipboard-copy-button"
                                            onClick={() => copyToClipboard(profileData.id)}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                )}

                                <button
                                    className="change-password-button"
                                    onClick={handleChangePassword}
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>

                        <div className="profile-card-body">
                            {/* Email (read-only) */}
                            <div className="profile-field">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData?.email || ''}
                                    disabled
                                />
                            </div>

                            {/* First Name */}
                            <div className="profile-field">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profileData?.firstName || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Last Name */}
                            <div className="profile-field">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profileData?.lastName || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="profile-field">
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={profileData?.phoneNumber || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Gender (dropdown) */}
                            <div className="profile-field">
                                <label>Gender:</label>
                                <select
                                    name="gender"
                                    value={profileData?.gender || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Date of Birth (replaces Age) */}
                            <div className="profile-field">
                                <label>Date of Birth:</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={profileData?.dateOfBirth || ''}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Card (empty) */}
                    <div className="profile-card contacts-card">
                        <p>Contact info goes here (currently empty).</p>
                    </div>

                    {/* Address Card (empty) */}
                    <div className="profile-card address-card">
                        <p>Address info goes here (currently empty).</p>
                    </div>
                </div>
            </div>

            {/* Change Password Overlay (Placeholder) */}
            {isChangePasswordOpen && (
                <div className="change-password-overlay">
                    <div className="change-password-modal">
                        <h2>Change Password</h2>
                        <p>This is a placeholder for the “Change Password” form.</p>
                        <button onClick={() => setIsChangePasswordOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
