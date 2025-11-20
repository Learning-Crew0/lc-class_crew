const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../src/models/user.model");
const Inquiry = require("../src/models/inquiry.model");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

const linkEnquiriesToUsers = async () => {
    try {
        await connectDB();

        // Find all enquiries without a user field but have an email
        const unlinkedEnquiries = await Inquiry.find({
            user: { $exists: false },
            email: { $exists: true, $ne: null },
        });

        console.log(`📋 Found ${unlinkedEnquiries.length} unlinked enquiries`);

        let linked = 0;
        let notFound = 0;

        for (const enquiry of unlinkedEnquiries) {
            // Find user with matching email
            const user = await User.findOne({ email: enquiry.email });

            if (user) {
                // Link enquiry to user (skip validation to avoid enum errors)
                await Inquiry.updateOne(
                    { _id: enquiry._id },
                    { $set: { user: user._id } }
                );
                linked++;
                console.log(
                    `✅ Linked enquiry ${enquiry.ticketNumber} to user ${user.email}`
                );
            } else {
                notFound++;
                console.log(
                    `⚠️  No user found for enquiry ${enquiry.ticketNumber} (${enquiry.email})`
                );
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`✅ Linked: ${linked} enquiries`);
        console.log(`⚠️  Not found: ${notFound} enquiries (no matching user account)`);
        console.log(
            `\n💡 Tip: Users can now see all their enquiries when they login!`
        );

        process.exit(0);
    } catch (error) {
        console.error("❌ Error linking enquiries:", error);
        process.exit(1);
    }
};

linkEnquiriesToUsers();

