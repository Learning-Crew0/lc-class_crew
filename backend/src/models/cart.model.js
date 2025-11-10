const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    // Item type: course or product
    itemType: {
        type: String,
        enum: ["course", "product"],
        required: [true, "Item type is required"],
    },
    
    // For COURSES
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: function() {
            return this.itemType === "course";
        },
    },
    courseSchedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrainingSchedule",
        required: function() {
            return this.itemType === "course";
        },
    },
    
    // For PRODUCTS
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: function() {
            return this.itemType === "product";
        },
    },
    
    // Common fields
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    priceAtTime: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Update lastUpdated on any change
cartSchema.pre("save", function (next) {
    this.lastUpdated = Date.now();
    next();
});

// Virtual for item count
cartSchema.virtual("itemCount").get(function () {
    return this.items.length;
});

// Virtual for total amount
cartSchema.virtual("totalAmount").get(function () {
    return this.items.reduce(
        (total, item) => total + (item.subtotal || 0),
        0
    );
});

// Indexes
// Note: user already has unique index from schema definition

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
