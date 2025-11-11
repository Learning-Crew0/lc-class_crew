/**
 * SMS Service for sending verification codes
 *
 * NOTE: This is a mock implementation. In production, integrate with:
 * - Twilio: https://www.twilio.com/
 * - AWS SNS: https://aws.amazon.com/sns/
 * - Korean SMS providers: Aligo, Cafe24, etc.
 */

const config = require("../config/env");

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

            // Mock SMS sending - in production, replace with actual SMS service
            console.log("========================================");
            console.log("📱 SMS Verification Code");
            console.log("========================================");
            console.log(`To: ${formattedPhone}`);
            console.log(`Code: ${code}`);
            console.log(`Message: [ClassCrew] 인증번호: ${code}`);
            console.log(`         15분 내에 입력해주세요.`);
            console.log("========================================");

            // Simulate SMS sending delay
            await new Promise((resolve) => setTimeout(resolve, 100));

            // For development, return mock success
            return {
                success: true,
                messageId: `mock-${Date.now()}`,
            };

            /* 
            // PRODUCTION: Twilio Implementation
            const twilio = require('twilio');
            const client = twilio(
                config.sms.twilioAccountSid,
                config.sms.twilioAuthToken
            );

            const message = await client.messages.create({
                body: `[ClassCrew] 인증번호: ${code}\n15분 내에 입력해주세요.`,
                from: config.sms.twilioPhoneNumber,
                to: `+82${phoneNumber.substring(1)}` // Convert 010... to +8210...
            });

            return {
                success: true,
                messageId: message.sid
            };
            */

            /* 
            // PRODUCTION: AWS SNS Implementation
            const AWS = require('aws-sdk');
            const sns = new AWS.SNS({ region: 'ap-northeast-2' });

            const params = {
                Message: `[ClassCrew] 인증번호: ${code}\n15분 내에 입력해주세요.`,
                PhoneNumber: `+82${phoneNumber.substring(1)}`,
                MessageAttributes: {
                    'AWS.SNS.SMS.SMSType': {
                        DataType: 'String',
                        StringValue: 'Transactional'
                    }
                }
            };

            const result = await sns.publish(params).promise();
            return {
                success: true,
                messageId: result.MessageId
            };
            */
        } catch (error) {
            console.error("SMS sending error:", error);
            throw new Error("SMS 전송에 실패했습니다");
        }
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
