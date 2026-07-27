// WanderBot Chat Widget Logic
document.addEventListener("DOMContentLoaded", () => {
    const chatBtn = document.getElementById("chat-widget-button");
    const chatContainer = document.getElementById("chat-widget-container");
    const closeBtn = document.getElementById("chat-close-btn");
    const chatForm = document.getElementById("chat-widget-form");
    const chatInput = document.getElementById("chat-widget-input");
    const messagesContainer = document.getElementById("chat-widget-messages");
    const suggestionChips = document.querySelectorAll(".suggestion-chip");
    const micBtn = document.getElementById("chat-mic-btn");

    let history = [];

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isRecording = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            isRecording = true;
            micBtn.classList.add("recording");
            chatInput.placeholder = "Listening...";
        };

        recognition.onend = () => {
            isRecording = false;
            micBtn.classList.remove("recording");
            chatInput.placeholder = "Ask WanderBot anything...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            // Submit the form
            chatForm.dispatchEvent(new Event("submit"));
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            isRecording = false;
            micBtn.classList.remove("recording");
            chatInput.placeholder = "Ask WanderBot anything...";
        };

        micBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isRecording) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else {
        if (micBtn) {
            micBtn.style.display = "none";
        }
    }

    // Toggle Chat Panel
    chatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        chatContainer.classList.toggle("open");
        chatBtn.classList.toggle("active");
        if (chatContainer.classList.contains("open")) {
            chatInput.focus();
            // Scroll to bottom
            scrollToBottom();
        }
    });

    // Close Chat Panel
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        chatContainer.classList.remove("open");
        chatBtn.classList.remove("active");
    });

    // Close chat if clicked outside (optional, but convenient)
    document.addEventListener("click", (e) => {
        if (!chatContainer.contains(e.target) && !chatBtn.contains(e.target) && chatContainer.classList.contains("open")) {
            chatContainer.classList.remove("open");
            chatBtn.classList.remove("active");
        }
    });

    // Handle Quick Suggestions
    suggestionChips.forEach(chip => {
        chip.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const query = chip.getAttribute("data-query");
            if (query) {
                sendMessage(query);
            }
        });
    });

    // Handle Message Submit
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = "";
        sendMessage(text);
    });

    // Send Message function
    async function sendMessage(text) {
        // Render User Message
        appendMessage("user", text);
        scrollToBottom();

        // Render Typing Indicator
        const typingIndicator = appendTypingIndicator();
        scrollToBottom();

        try {
            // Call Backend API
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text,
                    history: history,
                    currentListing: window.currentListing || null
                })
            });

            const data = await response.json();
            
            // Remove Typing Indicator
            typingIndicator.remove();

            if (data.reply) {
                appendMessage("assistant", data.reply, data.listings);
                // Keep history updated (max 10 messages for memory efficiency)
                history.push({ role: "user", content: text });
                history.push({ role: "assistant", content: data.reply });
                if (history.length > 20) {
                    history.shift();
                    history.shift();
                }
            } else {
                appendMessage("assistant", "Sorry, I couldn't process that. Please try again.");
            }

        } catch (err) {
            console.error("Chat error:", err);
            typingIndicator.remove();
            appendMessage("assistant", "Something went wrong. Please check your internet connection.");
        }

        scrollToBottom();
    }

    // Helper to format text with basic markdown
    function formatMessageText(text) {
        // Strip out metadata tags so they don't display as raw text in chat bubble
        let cleaned = text
            .replace(/\[RECOMMENDED_LISTING_ID:\s*[a-f\d]{24}\]/gi, "")
            .replace(/\[PROMO_CODE:\s*\w+\]/gi, "");

        // Escape HTML
        let formatted = cleaned
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Format bold (**text**)
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Format bullet points (* item)
        formatted = formatted.replace(/^\*\s(.*)$/gm, "<li>$1</li>");
        // Wrap bullet lists
        if (formatted.includes("<li>")) {
            // Find blocks of list items and wrap in <ul>
            formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
        }

        // Format newlines to paragraphs/breaks
        formatted = formatted.replace(/\n/g, "<br>");

        return formatted.trim();
    }

    // Append Message to UI
    function appendMessage(sender, text, listings = []) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);

        let itineraryData = null;
        let promoCode = null;
        if (sender === 'assistant') {
            // Parse itinerary JSON script
            const scriptRegex = /<script\s+type="application\/json"\s+class="itinerary-data">([\s\S]*?)<\/script>/i;
            const match = text.match(scriptRegex);
            if (match) {
                try {
                    itineraryData = JSON.parse(match[1].trim());
                } catch (err) {
                    console.error("Failed to parse itinerary JSON:", err);
                }
                text = text.replace(scriptRegex, "");
            }

            // Parse promo code
            const promoRegex = /\[PROMO_CODE:\s*(\w+)\]/i;
            const promoMatch = text.match(promoRegex);
            if (promoMatch) {
                promoCode = promoMatch[1];
            }
        }

        messageDiv.innerHTML = `
            <div class="message-content">
                ${sender === 'assistant' ? formatMessageText(text) : text}
            </div>
            <div class="message-footer">
                <span class="message-time">${time}</span>
                ${sender === 'assistant' ? `<button type="button" class="chat-speak-btn" title="Listen to response"><i class="fa-solid fa-volume-high"></i></button>` : ''}
            </div>
        `;

        // Render recommended listings if present
        if (sender === 'assistant' && listings && listings.length > 0) {
            const listingsContainer = document.createElement("div");
            listingsContainer.classList.add("chat-listings-container");

            listings.forEach(listing => {
                const card = document.createElement("a");
                card.href = `/listings/${listing._id}`;
                card.target = "_blank";
                card.classList.add("chat-listing-card");

                const imageUrl = listing.image && listing.image.url ? listing.image.url : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3";

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${listing.title}" class="chat-listing-img">
                    <div class="chat-listing-info">
                        <div class="chat-listing-title">${listing.title}</div>
                        <div class="chat-listing-loc">${listing.location}, ${listing.country}</div>
                        <div class="chat-listing-price">₹${listing.price.toLocaleString("en-IN")} <span class="price-light">/ night</span></div>
                    </div>
                `;
                listingsContainer.appendChild(card);
            });
            messageDiv.appendChild(listingsContainer);
        }

        // Render recommended itinerary if present
        if (sender === 'assistant' && itineraryData) {
            const itineraryContainer = document.createElement("div");
            itineraryContainer.classList.add("chat-itinerary-container");

            // Build Day Tabs
            let tabsHtml = `<div class="itinerary-tabs">`;
            itineraryData.days.forEach((day, idx) => {
                tabsHtml += `<button class="itinerary-tab ${idx === 0 ? 'active' : ''}" data-day="${day.day}">Day ${day.day}</button>`;
            });
            tabsHtml += `</div>`;

            // Build Day Content Pages
            let contentHtml = `<div class="itinerary-contents">`;
            itineraryData.days.forEach((day, idx) => {
                contentHtml += `
                    <div class="itinerary-day-content ${idx === 0 ? 'active' : ''}" id="itinerary-day-${day.day}">
                        <div class="itinerary-day-theme">🎯 ${day.theme}</div>
                        <div class="itinerary-timeline">
                `;
                day.activities.forEach(activity => {
                    let icon = "🌤️";
                    if (activity.time.toLowerCase().includes("morning")) icon = "🌅";
                    else if (activity.time.toLowerCase().includes("afternoon")) icon = "☀️";
                    else if (activity.time.toLowerCase().includes("evening") || activity.time.toLowerCase().includes("night")) icon = "🌙";

                    contentHtml += `
                        <div class="itinerary-activity">
                            <div class="activity-time">${icon} ${activity.time}</div>
                            <div class="activity-desc">${activity.desc}</div>
                        </div>
                    `;
                });
                contentHtml += `
                        </div>
                    </div>
                `;
            });
            contentHtml += `</div>`;

            itineraryContainer.innerHTML = `
                <div class="itinerary-header">
                    <i class="fa-solid fa-map-location-dot"></i> Itinerary: ${itineraryData.destination}
                </div>
                ${tabsHtml}
                ${contentHtml}
            `;

            // Setup click events on the tabs
            const tabs = itineraryContainer.querySelectorAll(".itinerary-tab");
            tabs.forEach(tab => {
                tab.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const dayNum = tab.getAttribute("data-day");

                    // remove active from all tabs
                    tabs.forEach(t => t.classList.remove("active"));
                    tab.classList.add("active");

                    // toggle active day contents
                    itineraryContainer.querySelectorAll(".itinerary-day-content").forEach(content => {
                        content.classList.remove("active");
                    });
                    const targetContent = itineraryContainer.querySelector(`#itinerary-day-${dayNum}`);
                    if (targetContent) {
                        targetContent.classList.add("active");
                    }
                });
            });

            messageDiv.appendChild(itineraryContainer);
        }

        // Render recommended promo code if present
        if (sender === 'assistant' && promoCode) {
            const promoContainer = document.createElement("div");
            promoContainer.classList.add("chat-promo-container");
            promoContainer.innerHTML = `
                <div class="promo-title">🎉 Host Discount Unlocked!</div>
                <div class="promo-box">
                    <span class="promo-code-text">${promoCode}</span>
                    <button type="button" class="promo-copy-btn" data-code="${promoCode}">
                        <i class="fa-solid fa-copy"></i> Copy
                    </button>
                </div>
            `;

            const copyBtn = promoContainer.querySelector(".promo-copy-btn");
            copyBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(promoCode).then(() => {
                    copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
                    copyBtn.classList.add("copied");
                    setTimeout(() => {
                        copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy`;
                        copyBtn.classList.remove("copied");
                    }, 2000);
                });
            });

            messageDiv.appendChild(promoContainer);
        }

        // Set up Text-to-Speech event handler if assistant message
        if (sender === 'assistant') {
            const speakBtn = messageDiv.querySelector(".chat-speak-btn");
            if (speakBtn) {
                speakBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle speak logic
                    if (window.speechSynthesis.speaking) {
                        window.speechSynthesis.cancel();
                        document.querySelectorAll(".chat-speak-btn i").forEach(icon => {
                            icon.className = "fa-solid fa-volume-high";
                        });
                        return;
                    }

                    // Extract content text and strip html / listings metadata tags
                    const contentText = messageDiv.querySelector(".message-content").innerText
                        .replace(/\[RECOMMENDED_LISTING_ID:\s*[a-f\d]{24}\]/gi, "")
                        .trim();

                    if (contentText) {
                        const utterance = new SpeechSynthesisUtterance(contentText);
                        
                        utterance.onstart = () => {
                            speakBtn.querySelector("i").className = "fa-solid fa-circle-stop";
                        };

                        utterance.onend = () => {
                            speakBtn.querySelector("i").className = "fa-solid fa-volume-high";
                        };

                        utterance.onerror = () => {
                            speakBtn.querySelector("i").className = "fa-solid fa-volume-high";
                        };

                        window.speechSynthesis.speak(utterance);
                    }
                });
            }
        }

        messagesContainer.appendChild(messageDiv);
    }

    // Append Typing Indicator
    function appendTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "assistant", "typing-container");
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        return typingDiv;
    }

    // Scroll chat messages to bottom
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Global Weather Protection Bot trigger
    window.triggerWanderBotMessage = function(text, onAction) {
        // Open the container
        if (chatContainer) {
            chatContainer.classList.add("open");
        }
        if (chatBtn) {
            chatBtn.classList.add("active");
        }
        
        // Remove typing indicators if any
        document.querySelectorAll(".typing-container").forEach(el => el.remove());
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "assistant");
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${text}
            </div>
            <div class="message-footer">
                <span class="message-time">${time}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        
        // Wire up action buttons inside text if any
        const actionBtn = messageDiv.querySelector(".activate-protection-btn");
        if (actionBtn) {
            actionBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onAction) onAction();
                actionBtn.disabled = true;
                actionBtn.innerHTML = "<i class='fa-solid fa-shield-halved'></i> Protection Activated!";
                actionBtn.style.backgroundColor = "#28a745";
                actionBtn.style.borderColor = "#28a745";
            });
        }
    };
});
