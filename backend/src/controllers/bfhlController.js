const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getFibonacci, isPrime, getHCF, getLCM } = require('../utils/mathUtils');

const email = "veer2320.be23@chitkara.edu.in";

exports.handleBfhl = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                is_success: false,
                official_email: email,
                message: "Invalid request body"
            });
        }

        const keys = Object.keys(req.body);
        const validKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];

        if (keys.length !== 1 || !validKeys.includes(keys[0])) {
            return res.status(400).json({
                is_success: false,
                official_email: email,
                message: "Request must contain exactly one valid key"
            });
        }

        const key = keys[0];
        let data;

        switch (key) {
            case 'fibonacci': {
                const n = req.body.fibonacci;
                if (!Number.isInteger(n) || n <= 0) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: email,
                        message: "Fibonacci input must be a positive integer"
                    });
                }
                data = getFibonacci(n);
                break;
            }

            case 'prime': {
                const arr = req.body.prime;
                if (
                    !Array.isArray(arr) ||
                    !arr.every(n => Number.isInteger(n))
                ) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: email,
                        message: "Prime input must be an integer array"
                    });
                }
                data = arr.filter(isPrime);
                break;
            }

            case 'lcm': {
                const arr = req.body.lcm;
                if (
                    !Array.isArray(arr) ||
                    arr.length === 0 ||
                    !arr.every(n => Number.isInteger(n) && n > 0)
                ) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: email,
                        message: "LCM input must be a non-empty array of positive integers"
                    });
                }
                data = getLCM(arr);
                break;
            }

            case 'hcf': {
                const arr = req.body.hcf;
                if (
                    !Array.isArray(arr) ||
                    arr.length === 0 ||
                    !arr.every(n => Number.isInteger(n) && n > 0)
                ) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: email,
                        message: "HCF input must be a non-empty array of positive integers"
                    });
                }
                data = getHCF(arr);
                break;
            }

            case 'AI': {
                const question = req.body.AI;
                if (typeof question !== 'string' || question.trim().length === 0 || question.length > 200) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: email,
                        message: "AI input must be a valid short string"
                    });
                }

                try {
                    if (!process.env.GOOGLE_API_KEY) {
                        return res.status(500).json({
                            is_success: false,
                            official_email: email,
                            message: "GOOGLE_API_KEY is missing in environment"
                        });
                    }

                    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                    const prompt = `Answer with exactly one word only. No punctuation. Question: ${question}`;
                    const result = await model.generateContent(prompt);

                    data = result.response
                        .text()
                        .trim()
                        .split(/\s+/)[0]
                        .replace(/[^\w]/g, '');

                } catch (aiErr) {
                    console.error("AI Service Error:", aiErr);
                    return res.status(500).json({
                        is_success: false,
                        official_email: email,
                        message: "AI service failure. Check whether GOOGLE_API_KEY is valid and enabled for Gemini API."
                    });
                }
                break;
            }
        }

        return res.status(200).json({
            is_success: true,
            official_email: email,
            data: data
        });

    } catch (err) {
        console.error("Controller Error:", err);
        return res.status(500).json({
            is_success: false,
            official_email: email,
            message: "Internal server error"
        });
    }
};
