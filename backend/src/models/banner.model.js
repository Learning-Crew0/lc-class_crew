const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            // required: [true, "Title is required"],
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            required: [true, "Image is required"],
        },
        mobileImage: {
            type: String,
        },
        link: {
            url: String,
            text: String,
            openInNewTab: {
                type: Boolean,
                default: false,
            },
        },
        position: {
            type: String,
            enum: [
                "home-hero",
                "home-secondary",
                "courses",
                "products",
                "sidebar",
            ],
            default: "home-hero",
        },
        order: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        backgroundColor: {
            type: String,
            default: "#ffffff",
        },
        textColor: {
            type: String,
            default: "#000000",
        },
        clicks: {
            type: Number,
            default: 0,
        },
        impressions: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for click-through rate
bannerSchema.virtual("ctr").get(function () {
    if (this.impressions === 0) return 0;
    return ((this.clicks / this.impressions) * 100).toFixed(2);
});

// Indexes
bannerSchema.index({ position: 1, order: 1 });
bannerSchema.index({ isActive: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
