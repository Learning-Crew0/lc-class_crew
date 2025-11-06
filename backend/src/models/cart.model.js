const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
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

// Virtual for total items
cartSchema.virtual("totalItems").get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for subtotal
cartSchema.virtual("subtotal").get(function () {
    return this.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
});

// Indexes
// Note: user already has unique index from schema definition

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
