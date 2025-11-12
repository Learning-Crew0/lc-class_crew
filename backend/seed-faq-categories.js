/**
 * Seed FAQ Categories
 * Run this script to populate default FAQ categories
 * 
 * Usage: node seed-faq-categories.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const FAQCategory = require('./src/models/faqCategory.model');

const categories = [
  {
    key: 'signup/login',
    label: '회원가입/로그인',
    description: '회원가입, 로그인, 계정 관리 관련 FAQ',
    order: 1,
    isActive: true,
  },
  {
    key: 'program',
    label: '프로그램',
    description: '교육 프로그램 및 과정 관련 FAQ',
    order: 2,
    isActive: true,
  },
  {
    key: 'payment',
    label: '결제',
    description: '결제, 환불, 영수증 관련 FAQ',
    order: 3,
    isActive: true,
  },
  {
    key: 'coalition',
    label: '제휴',
    description: '제휴 및 파트너십 관련 FAQ',
    order: 4,
    isActive: true,
  },
  {
    key: 'other',
    label: '기타',
    description: '기타 문의사항',
    order: 5,
    isActive: true,
  },
];

async function seedCategories() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Clearing existing FAQ categories...');
    await FAQCategory.deleteMany({});
    console.log('✅ Cleared\n');

    console.log('🌱 Seeding FAQ categories...');
    
    for (const category of categories) {
      const created = await FAQCategory.create(category);
      console.log(`  ✅ Created: ${created.key} (${created.label})`);
    }

    console.log('\n✨ Successfully seeded', categories.length, 'FAQ categories!');
    console.log('\n📋 Available categories:');
    console.log('━'.repeat(50));
    
    const allCategories = await FAQCategory.find().sort({ order: 1 });
    allCategories.forEach(cat => {
      console.log(`  ${cat.order}. ${cat.key.padEnd(20)} → ${cat.label}`);
    });
    console.log('━'.repeat(50));
    
    console.log('\n✅ You can now create FAQs with these categories!');
    console.log('\nExample:');
    console.log(`{
  "question": "How do I register?",
  "answer": "Visit the courses page...",
  "category": "signup/login"  ← Use this key
}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();

