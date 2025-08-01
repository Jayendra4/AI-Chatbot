const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const themeToggle = document.querySelector("#theme-toggle-btn");

// api setup
const API_KEY="AIzaSyBvL8fSikoWHIZfZobGKeBt2s57jQqAOfY"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = [];

// function to create message elements
const createMsgElement = (content, ...classes) =>{
    const div = document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML = content;
    return div;
}

// scroll to bottom to the container
const scrollToBottom = () => container.scrollTo({top: container.scrollHeight, behavior: "smooth" });

// simulate typing effect for bot responses
const typingEffect = (text, textElement, botMsgDiv) =>{
    textElement.textContent = "";
    const words = text.split(" ");
    let wordIndex = 0;

    // set an interval to type each word
    const typingInterval = setInterval(()=>{
        if(wordIndex < words.length){
            textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
            scrollToBottom();
        } else{
            clearInterval(typingInterval);
            botMsgDiv.classList.remove("loading");
            document.body.classList.remove("bot-responding");
            
        }
    }, 40);
}
// make the api call and generate the bot's response
const generateResponse = async(botMsgDiv) => {
    const textElement = botMsgDiv.querySelector(".message-text");

    //add user message to the chat history
    chatHistory.push({
        role: "user",
        parts: [{text: userMessage}]
    });

    try{
        // send the chat history to the api to get a response
        const response = await fetch(API_URL,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: chatHistory })
        });

        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        // process the response text and display with typing effect
        const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
        typingEffect(responseText,textElement, botMsgDiv);
        chatHistory.push({role:"model", parts:[{text:responseText}]});
        
    } catch(error){
        textElement.style.color = "#d62939";
        textElement.textContent = error.name === "AbortError" ? "Response generation stopped." : error.message;
        botMsgDiv.classList.remove("loading");
        document.body.classList.remove("bot-responding");
        scrollToBottom();
}
}
//Handle the form submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if(!userMessage || document.body.classList.contains("bot-responding")) return;

    promptInput.value = "";
    document.body.classList.add("bot-responding", "chats-active");

    // generate user message HTML and add in the chats container
    const userMsgHTML = `<p class= "message-text"></p>`;
    const userMsgDiv = createMsgElement(userMsgHTML, "user-message");
    userMsgDiv.querySelector(".message-text").textContent = userMessage;
    chatsContainer.appendChild(userMsgDiv);
    scrollToBottom();

    setTimeout(()=>{
        // generate bot message HTML and add in the chats container after 600ms
    const botMsgHTML = `<img src="AIIMAGE.jpG" class="avatar"><p class= "message-text">Just a sec...</p>`;
    const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();
    generateResponse(botMsgDiv);
    }, 600);
}

//handle suggestions click
document.querySelectorAll(".suggestions-item").forEach(item=>{
    item.addEventListener("click", ()=>{
        promptInput.value = item.querySelector(".text").textContent;
        promptForm.dispatchEvent(new Event("submit"));
    });
});

// show/hide controls for mobile on prompt input focus
document.addEventListener("click",({ target }) =>{
    const wrapper = document.querySelector(".prompt-wrapper");
    const shouldHide = target.classList.contains("prompt-input") || (wrapper.classList.contains("hide-controls") && (target.id === "add-file-btn" || target.id === "stop-response-btn"));
    wrapper.classList.toggle("hide-controls", shouldHide);
});

//toggle dark/light theme
themeToggle.addEventListener("click", () => {
    const isLightTheme = document.body.classList.toggle("light-theme");
    localStorage.setItem("themeColor", isLightTheme ? "light_mode" : "dark_mode");
    themeToggle.textContent = isLightTheme ? "dark_mode" : "light_mode";
});

// set initial theme from localStorage
const isLightTheme = localStorage.getItem("themeColor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
themeToggle.textContent = isLightTheme ? "dark_mode" : "light_mode";

promptForm.addEventListener("submit", handleFormSubmit);

//delete all chats
document.querySelector("#delete-chats-btn").addEventListener("click",()=>{
    chatHistory.length = 0;
    chatsContainer.innerHTML = "";
    document.body.classList.add("bot-responding","chats-active");
})