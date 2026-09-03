/**
 * GEL AI Assistant - Logic & Gemini Integration
 * High-end style expert for clothing and eyewear.
 */

const GEMINI_API_KEY = "AIzaSyApnROYmXuV-suS08WDsqG_buzmObMDqYA"; // Insert your Gemini API Key here
// استبدل السطر القديم بهذا السطر بالضبط
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
// GEL Knowledge Base - Optimized for the Brand
const GEL_INFO = `
You are the GEL Brand Assistant, an expert in high-end fashion, luxury streetwear, and premium eyewear. 
Your goal is to provide a sophisticated yet helpful experience for GEL customers.

Brand Identity:
- Name: GEL
- Core Values: Luxury, modern comfort, exclusive designs, and lifestyle elevation.

Products & Categories:
- Best-Selling Items: GEL Signature Tee (120 QAR) and GEL Oversized Hoodie (250 QAR).
- White Clothing: GEL Signature Tee is our premium white clothing option (120 QAR).
- New Collection: The Urban Jacket (450 QAR) is the centerpiece of our latest collection.
- Other Items: GEL Classic Cap (85 QAR), GEL Minimalist Shorts (110 QAR).

Contact Information:
- WhatsApp (Preferred): +974 3112 1124
- Instagram: @gelvogue.qa
- TikTok: @gelvogue
- Email: gelvoguee@gmail.com
- Location: Qatar, international shipping available.

Operational Rules:
- Language: Respond in the same language as the user (Arabic or English).
- Conciseness: Keep answers elegant and brief (3-4 sentences).
- Call to Action: Suggest contacting WhatsApp for orders or styling advice.
`;

let isTyping = false;

window.toggleAIChat = function() {
    const chatWindow = document.getElementById('ai-chat-window');
    if (chatWindow) {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            setTimeout(() => {
                const input = document.getElementById('ai-user-input');
                if (input) input.focus();
            }, 400);
        }
    }
};

function appendMessage(text, sender) {
    const chatMessages = document.getElementById('ai-chat-messages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    msgDiv.innerHTML = `<p>${formattedText}</p>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('ai-chat-messages');
    if (!chatMessages) return;
    const typingDiv = document.createElement('div');
    typingDiv.id = 'ai-typing-indicator';
    typingDiv.classList.add('message', 'ai-message', 'typing');
    typingDiv.innerHTML = '<p>...</p>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    isTyping = true;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('ai-typing-indicator');
    if (indicator) indicator.remove();
    isTyping = false;
}

window.sendMessage = async function() {
    const userInputField = document.getElementById('ai-user-input');
    const userText = userInputField.value.trim();
    if (!userText || isTyping) return;

    if (GEMINI_API_KEY.includes("AIzaSyApnROYmXuV-suS08WDsqG_buzmObMDqYA") || GEMINI_API_KEY === "") {
        console.error("GEL AI: API Key is missing!");
        appendMessage("System: Please insert your Gemini API Key in ai-chat.js.", 'ai');
        return;
    }

    appendMessage(userText, 'user');
    userInputField.value = '';
    showTypingIndicator();

    try {
        const combinedText = GEL_INFO + "\n\nUser: " + userText + "\n\nAssistant (respond in the same language):";
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: combinedText }] }],
                generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1024 }
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);

        if (data.candidates && data.candidates.length > 0) {
            removeTypingIndicator();
            appendMessage(data.candidates[0].content.parts[0].text, 'ai');
        } else {
            throw new Error("No response candidates returned.");
        }
    } catch (error) {
        console.error("GEL AI Connection Error:", error);
        removeTypingIndicator();
        const lang = document.documentElement.lang || 'en';
        appendMessage(lang === 'ar' ? "عذراً، أواجه مشكلة في الاتصال. واتساب: +97431121124" : "Connection error. WhatsApp: +97431121124", 'ai');
    }
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = document.getElementById('ai-user-input');
        if (input && document.activeElement === input) window.sendMessage();
    }
});
