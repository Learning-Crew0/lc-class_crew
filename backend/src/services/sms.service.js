/**
 * SMS Service for sending verification codes
 * Using Twilio for SMS delivery
 */

const config = require("../config/env");
const twilio = require("twilio");

class SmsService {
    /**
     * Send verification code via SMS
     * @param {string} phoneNumber - Phone number in format 01012345678
     * @param {string} code - 6-digit verification code
     * @returns {Promise<{success: boolean, messageId: string}>}
     */
    async sendVerificationCode(phoneNumber, code) {
        try {
            // Format phone number for display
            const formattedPhone = this.formatPhoneNumber(phoneNumber);

            // Check if Twilio is configured
            if (
                !config.sms.twilioAccountSid ||
                !config.sms.twilioAuthToken ||
                !config.sms.twilioPhoneNumber
            ) {
                // Fallback to console logging if Twilio not configured
                console.log("========================================");
                console.log("📱 SMS Verification Code (Mock Mode)");
                console.log("========================================");
                console.log(`To: ${formattedPhone}`);
                console.log(`Code: ${code}`);
                console.log(`Message: [ClassCrew] 인증번호: ${code}`);
                console.log(`         15분 내에 입력해주세요.`);
                console.log("========================================");
                console.log("⚠️  Twilio not configured - using mock mode");
                console.log("========================================");

                return {
                    success: true,
                    messageId: `mock-${Date.now()}`,
                };
            }

            const client = twilio(
                config.sms.twilioAccountSid,
                config.sms.twilioAuthToken
            );

            // Smart phone number formatting - detect country code
            const internationalNumber =
                this.formatInternationalNumber(phoneNumber);

            console.log("📱 Sending SMS via Twilio...");
            console.log(`To: ${formattedPhone} (${internationalNumber})`);

            const message = await client.messages.create({
                body: `[ClassCrew] 인증번호: ${code}\n15분 내에 입력해주세요.`,
                from: config.sms.twilioPhoneNumber,
                to: internationalNumber,
            });

            console.log("✅ SMS sent successfully!");
            console.log(`Message SID: ${message.sid}`);

            return {
                success: true,
                messageId: message.sid,
            };
        } catch (error) {
            console.error("❌ SMS sending error:", error);
            throw new Error("SMS 전송에 실패했습니다");
        }
    }

    /**
     * Format phone number to international format with country code
     * Supports Korean (82) and Indian (91) numbers
     * @param {string} phoneNumber - Phone number (01012345678 or 9876543210)
     * @returns {string} International format (+821012345678 or +919876543210)
     */
    formatInternationalNumber(phoneNumber) {
        // Remove any spaces, dashes, or special characters
        const cleanNumber = phoneNumber.replace(/[\s-]/g, "");

        // Already has + prefix (international format)
        if (cleanNumber.startsWith("+")) {
            return cleanNumber;
        }

        // Korean number (starts with 010, 011, 016, 017, 018, 019)
        if (cleanNumber.startsWith("01")) {
            return `+82${cleanNumber.substring(1)}`;
        }

        // Indian number (10 digits starting with 6-9)
        if (cleanNumber.length === 10 && /^[6-9]/.test(cleanNumber)) {
            return `+91${cleanNumber}`;
        }

        // Default: assume Korean format
        return `+82${cleanNumber}`;
    }

    /**
     * Format phone number for display
     * @param {string} phoneNumber - Phone number (01012345678)
     * @returns {string} Formatted phone number (010-1234-5678)
     */
    formatPhoneNumber(phoneNumber) {
        if (phoneNumber.length === 11) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
                3,
                7
            )}-${phoneNumber.slice(7)}`;
        }
        return phoneNumber;
    }
}

module.exports = new SmsService();
