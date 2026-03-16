const operationSelect = document.getElementById("operation");
const singleInputGroup = document.getElementById("single-input-group");
const arrayInputGroup = document.getElementById("array-input-group");
const textInputGroup = document.getElementById("text-input-group");
const singleInput = document.getElementById("single-input");
const arrayInput = document.getElementById("array-input");
const textInput = document.getElementById("text-input");
const helperText = document.getElementById("helper-text");
const payloadPreview = document.getElementById("payload-preview");
const responsePreview = document.getElementById("response-preview");
const statusBadge = document.getElementById("status-badge");
const form = document.getElementById("bfhl-form");
const fillSampleButton = document.getElementById("fill-sample-btn");
const submitButton = document.getElementById("submit-btn");

const configByOperation = {
    fibonacci: {
        helper: "Fibonacci expects one positive integer.",
        sample: () => {
            singleInput.value = "8";
        }
    },
    prime: {
        helper: "Prime takes a comma-separated list of integers and returns only the prime values.",
        sample: () => {
            arrayInput.value = "2, 4, 5, 8, 11, 15, 17";
        }
    },
    hcf: {
        helper: "HCF expects a non-empty list of positive integers.",
        sample: () => {
            arrayInput.value = "12, 18, 24";
        }
    },
    lcm: {
        helper: "LCM expects a non-empty list of positive integers.",
        sample: () => {
            arrayInput.value = "4, 6, 8";
        }
    },
    AI: {
        helper: "AI accepts a short question and the backend returns exactly one word.",
        sample: () => {
            textInput.value = "What color are bananas?";
        }
    }
};

function formatJson(value) {
    return JSON.stringify(value, null, 2);
}

function parseIntegerList(value) {
    return value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => Number(entry));
}

function getPayload() {
    const operation = operationSelect.value;

    if (operation === "fibonacci") {
        return { fibonacci: Number(singleInput.value) };
    }

    if (operation === "AI") {
        return { AI: textInput.value.trim() };
    }

    return { [operation]: parseIntegerList(arrayInput.value) };
}

function renderMode() {
    const operation = operationSelect.value;
    const isSingle = operation === "fibonacci";
    const isText = operation === "AI";

    singleInputGroup.classList.toggle("hidden", !isSingle);
    arrayInputGroup.classList.toggle("hidden", isSingle || isText);
    textInputGroup.classList.toggle("hidden", !isText);

    helperText.textContent = configByOperation[operation].helper;
    payloadPreview.textContent = formatJson(getPayload());
}

function setStatus(text) {
    statusBadge.textContent = text;
}

operationSelect.addEventListener("change", renderMode);
singleInput.addEventListener("input", renderMode);
arrayInput.addEventListener("input", renderMode);
textInput.addEventListener("input", renderMode);

fillSampleButton.addEventListener("click", () => {
    configByOperation[operationSelect.value].sample();
    renderMode();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = getPayload();
    payloadPreview.textContent = formatJson(payload);
    responsePreview.textContent = "Loading...";
    setStatus("Working");
    submitButton.disabled = true;

    try {
        const response = await fetch("/bfhl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        responsePreview.textContent = formatJson(result);
        setStatus(`${response.status} ${response.ok ? "OK" : "Error"}`);
    } catch (error) {
        responsePreview.textContent = error instanceof Error ? error.message : "Unexpected error";
        setStatus("Network Error");
    } finally {
        submitButton.disabled = false;
    }
});

renderMode();
