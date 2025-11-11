# ❓ FAQs - Frontend Integration Guide

Display frequently asked questions with search and categories.

---

## 🔑 API Endpoints

### Get All FAQs (Public)
```http
GET /faqs?page=1&limit=20&category=signup-login&search=password
```

### Get FAQ Categories
```http
GET /faqs/categories?isActive=true
```

### Mark as Helpful
```http
POST /faqs/{faqId}/helpful
Content-Type: application/json

{
  "helpful": true
}
```

---

## 💻 Service Implementation

```javascript
// src/services/faq.service.js

import apiClient from './api.client';

class FAQService {
    async getFAQs(filters = {}) {
        return await apiClient.get('/faqs', filters);
    }

    async getCategories() {
        return await apiClient.get('/faqs/categories', { isActive: true });
    }

    async markHelpful(faqId, helpful) {
        return await apiClient.post(`/faqs/${faqId}/helpful`, { helpful });
    }
}

export default new FAQService();
```

---

## 🎨 Component Example

```javascript
// src/pages/FAQs.jsx

import React, { useState, useEffect } from 'react';
import faqService from '../services/faq.service';

const FAQsPage = () => {
    const [faqs, setFAQs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchFAQs();
    }, [selectedCategory, searchTerm]);

    const fetchCategories = async () => {
        const data = await faqService.getCategories();
        setCategories(data);
    };

    const fetchFAQs = async () => {
        const data = await faqService.getFAQs({
            category: selectedCategory,
            search: searchTerm,
        });
        setFAQs(data.faqs);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">자주 묻는 질문</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    전체
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`px-4 py-2 rounded ${selectedCategory === cat.key ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {faqs.map((faq) => (
                    <details key={faq._id} className="bg-white p-4 rounded-lg shadow">
                        <summary className="font-bold cursor-pointer">
                            Q. {faq.question}
                        </summary>
                        <p className="mt-3 text-gray-700">{faq.answer}</p>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default FAQsPage;
```

