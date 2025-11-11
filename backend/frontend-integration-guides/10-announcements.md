# 📢 Announcements - Frontend Integration Guide

Display and manage announcements and notices.

---

## 🔑 API Endpoints

### Get All Announcements (Public)
```http
GET /announcements?page=1&limit=10&status=published&category=notice
```

### Get Announcement by ID
```http
GET /announcements/{announcementId}
```

---

## 💻 Service Implementation

```javascript
// src/services/announcement.service.js

import apiClient from './api.client';

class AnnouncementService {
    async getAnnouncements(filters = {}) {
        return await apiClient.get('/announcements', filters);
    }

    async getAnnouncementById(id) {
        return await apiClient.get(`/announcements/${id}`);
    }
}

export default new AnnouncementService();
```

---

## 🎨 Component Example

```javascript
// src/pages/Announcements.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import announcementService from '../services/announcement.service';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        const data = await announcementService.getAnnouncements({
            status: 'published',
            page: 1,
            limit: 20,
        });
        setAnnouncements(data.announcements);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">공지사항</h1>
            <div className="space-y-3">
                {announcements.map((announcement) => (
                    <Link
                        key={announcement._id}
                        to={`/announcements/${announcement._id}`}
                        className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-3">
                            {announcement.isImportant && (
                                <span className="text-red-500 font-bold">[중요]</span>
                            )}
                            <h3 className="font-bold">{announcement.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {new Date(announcement.publishedAt).toLocaleDateString()}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
```

