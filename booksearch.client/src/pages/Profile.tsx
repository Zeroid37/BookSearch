import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useAuth } from '../components/AuthContext';
import './styles/Profile.css';

interface UserProfile {
    email: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    gender: string | null;
    age: number | null;
    image?: string; // If you have a user photo URL
    id?: string;    // If you want to store/show an ID
}

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [savedProfileData, setSavedProfileData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isDataChanged, setIsDataChanged] = useState(false);

    // For the “Change Password” placeholder
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const { logout } = useAuth();

    // ------------
    // Fetch profile data on mount
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
                    setSavedProfileData({ ...data }); // Keep a copy for revert
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

    // ------------
    // Handle input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!profileData) return;
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
        setIsDataChanged(true);
    };

    // ------------
    // Save changes
    const handleSave = useCallback(async () => {
        if (!profileData) return;
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('No auth token found.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7049/auth/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                setIsDataChanged(false);
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

    // ------------
    // Cancel changes (revert to saved data)
    const handleCancel = useCallback(() => {
        setProfileData(savedProfileData);
        setIsDataChanged(false);
        setIsEditing(false);
    }, [savedProfileData]);

    // ------------
    // Edit mode
    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    // ------------
    // Change Password (placeholder)
    const handleChangePassword = useCallback(() => {
        // For now, just open a placeholder
        setIsChangePasswordOpen(true);
    }, []);

    // ------------
    // Copy to clipboard (for user ID, email, phone, etc.)
    const copyToClipboard = (text?: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
    };

    // ------------
    // Render
    if (isLoading) {
        return <div className="profile-loading">Loading...</div>;
    }

    if (error) {
        return <div className="profile-error">Error: {error}</div>;
    }

    return (
        <div className="profile-container">

            {/* Top toolbar-like section */}
            <div className="profile-toolbar">
                <div className="toolbar-title">User Profile</div>
                <div className="toolbar-actions">
                    {!isEditing ? (
                        <button className="edit-button" onClick={handleEdit}>
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                className="cancel-button"
                                onClick={handleCancel}
                                disabled={!isDataChanged}
                            >
                                Cancel
                            </button>
                            <button
                                className="save-button"
                                onClick={handleSave}
                                disabled={!isDataChanged}
                            >
                                Save
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content (scrollable if needed) */}
            <div className="profile-scrollable-content">

                {/* BASIC INFO CARD */}
                <div className="profile-card basic-info-card">
                    <div className="profile-card-header">
                        <img
                            className="profile-avatar"
                            src={profileData?.image || 'https://via.placeholder.com/80'}
                            alt="User Avatar"
                        />
                        <div className="profile-header-info">
                            <div className="profile-full-name">
                                {/* Fallback if firstName/lastName is null */}
                                {(profileData?.firstName || '') + ' ' + (profileData?.lastName || '')}
                            </div>

                            {/* If you have an ID to show + copy */}
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

                        {/* Gender */}
                        <div className="profile-field">
                            <label>Gender:</label>
                            <input
                                type="text"
                                name="gender"
                                value={profileData?.gender || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Age */}
                        <div className="profile-field">
                            <label>Age:</label>
                            <input
                                type="number"
                                name="age"
                                value={profileData?.age ?? ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>

                {/* CONTACT CARD (Empty for now) */}
                <div className="profile-card contacts-card">
                    {/* Intentionally empty */}
                </div>

                {/* ADDRESS CARD (Empty for now) */}
                <div className="profile-card address-card">
                    {/* Intentionally empty */}
                </div>

            </div>

            {/* CHANGE PASSWORD POPUP (Placeholder) */}
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
