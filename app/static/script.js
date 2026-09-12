"use strict";


/* ========================================
   ELEMENTS
======================================== */

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const cleanBtn = document.getElementById("cleanBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const downloadBtn = document.getElementById("downloadBtn");
const fileInput = document.getElementById("fileInput");

const inputCount = document.getElementById("inputCount");
const outputCount = document.getElementById("outputCount");

const message = document.getElementById("message");
const toast = document.getElementById("toast");
const themeBtn = document.getElementById("themeBtn");


/* ========================================
   CHECK REQUIRED ELEMENTS
======================================== */

if (
    !inputText ||
    !outputText ||
    !cleanBtn ||
    !copyBtn ||
    !clearBtn ||
    !downloadBtn ||
    !fileInput ||
    !inputCount ||
    !outputCount ||
    !message ||
    !toast ||
    !themeBtn
) {
    console.error(
        "Markdown Cleaner: Required HTML element is missing."
    );
}


/* ========================================
   WORD COUNT
======================================== */

function getWordCount(text) {

    const trimmedText = text.trim();

    if (!trimmedText) {
        return 0;
    }

    return trimmedText.split(/\s+/).length;
}


/* ========================================
   INPUT STATISTICS
======================================== */

function updateInputStats() {

    if (!inputText || !inputCount) {
        return;
    }

    const text = inputText.value;

    const words = getWordCount(text);

    const characters = text.length;

    inputCount.textContent =
        `${words} words • ${characters} characters`;
}


/* ========================================
   OUTPUT STATISTICS
======================================== */

function updateOutputStats() {

    if (!outputText || !outputCount) {
        return;
    }

    const text = outputText.value;

    const words = getWordCount(text);

    const characters = text.length;

    outputCount.textContent =
        `${words} words • ${characters} characters`;
}


/* ========================================
   TOAST MESSAGE
======================================== */

let toastTimer = null;


function showToast(text) {

    if (!toast) {
        return;
    }

    toast.textContent = text;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);
}


/* ========================================
   STATUS MESSAGE
======================================== */

function showMessage(text) {

    if (!message) {
        return;
    }

    message.textContent = text;
}


/* ========================================
   INPUT EVENT
======================================== */

if (inputText) {

    inputText.addEventListener(
        "input",
        updateInputStats
    );

}


/* ========================================
   CLEAN MARKDOWN
======================================== */

if (cleanBtn) {

    cleanBtn.addEventListener(
        "click",
        async () => {

            if (!inputText || !outputText) {
                return;
            }

            const text =
                inputText.value.trim();


            /* Empty input */

            if (!text) {

                showToast(
                    "Please enter some Markdown text."
                );

                return;
            }


            /* Loading */

            cleanBtn.disabled = true;

            cleanBtn.textContent =
                "Cleaning...";

            showMessage("");


            try {

                const response =
                    await fetch(
                        "/clean",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                text: text
                            })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Server error: ${response.status}`
                    );

                }


                const data =
                    await response.json();


                outputText.value =
                    data.cleaned_text || "";


                updateOutputStats();


                showMessage(
                    "✓ Markdown cleaned successfully."
                );


                showToast(
                    "✓ Markdown cleaned successfully!"
                );

            }

            catch (error) {

                console.error(
                    "Clean error:",
                    error
                );


                showMessage(
                    "Unable to clean Markdown."
                );


                showToast(
                    "❌ Something went wrong. Please try again."
                );

            }

            finally {

                cleanBtn.disabled = false;

                cleanBtn.textContent =
                    "✨ Clean Markdown";

            }

        }
    );

}


/* ========================================
   COPY
======================================== */

if (copyBtn) {

    copyBtn.addEventListener(
        "click",
        async () => {

            if (!outputText) {
                return;
            }

            const text =
                outputText.value.trim();


            if (!text) {

                showToast(
                    "Nothing to copy."
                );

                return;
            }


            try {

                if (
                    navigator.clipboard &&
                    window.isSecureContext
                ) {

                    await navigator.clipboard.writeText(
                        text
                    );

                }

                else {

                    outputText.focus();

                    outputText.select();

                    document.execCommand(
                        "copy"
                    );

                    outputText.setSelectionRange(
                        0,
                        0
                    );

                }


                showToast(
                    "✓ Clean text copied!"
                );

            }

            catch (error) {

                console.error(
                    "Copy error:",
                    error
                );

                showToast(
                    "❌ Unable to copy text."
                );

            }

        }
    );

}


/* ========================================
   CLEAR
======================================== */

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        () => {

            if (inputText) {
                inputText.value = "";
            }

            if (outputText) {
                outputText.value = "";
            }


            updateInputStats();

            updateOutputStats();


            showMessage("");


            /* Reset file input */

            if (fileInput) {
                fileInput.value = "";
            }


            showToast(
                "✓ Everything cleared."
            );

        }
    );

}


/* ========================================
   DOWNLOAD
======================================== */

if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        () => {

            if (!outputText) {
                return;
            }

            const text =
                outputText.value.trim();


            if (!text) {

                showToast(
                    "Nothing to download."
                );

                return;
            }


            const blob =
                new Blob(
                    [text],
                    {
                        type:
                            "text/plain;charset=utf-8"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "cleaned-markdown.txt";


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);


            setTimeout(() => {

                URL.revokeObjectURL(url);

            }, 100);


            showToast(
                "✓ File downloaded!"
            );

        }
    );

}


/* ========================================
   FILE UPLOAD
======================================== */

if (fileInput) {

    fileInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            const allowedExtensions = [
                ".md",
                ".markdown",
                ".txt"
            ];


            const fileName =
                file.name.toLowerCase();


            const isValid =
                allowedExtensions.some(
                    (extension) =>
                        fileName.endsWith(extension)
                );


            if (!isValid) {

                showToast(
                    "❌ Please upload a .md, .markdown or .txt file."
                );

                fileInput.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                (event) => {

                    if (!inputText) {
                        return;
                    }


                    inputText.value =
                        event.target.result;


                    updateInputStats();


                    showToast(
                        `✓ ${file.name} loaded`
                    );

                };


            reader.onerror =
                () => {

                    showToast(
                        "❌ Unable to read this file."
                    );

                };


            reader.readAsText(file);

        }
    );

}


/* ========================================
   DARK MODE
======================================== */

function setTheme(theme) {

    if (!themeBtn) {
        return;
    }


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeBtn.textContent =
            "☀️";

        themeBtn.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    }

    else {

        document.body.classList.remove(
            "dark"
        );

        themeBtn.textContent =
            "🌙";

        themeBtn.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    }


    localStorage.setItem(
        "markdown-theme",
        theme
    );

}


/* ========================================
   THEME BUTTON
======================================== */

if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            setTheme(
                isDark
                    ? "light"
                    : "dark"
            );

        }
    );

}


/* ========================================
   LOAD SAVED THEME
======================================== */

const savedTheme =
    localStorage.getItem(
        "markdown-theme"
    );


if (savedTheme === "dark") {

    setTheme("dark");

}

else {

    setTheme("light");

}


/* ========================================
   INITIAL STATISTICS
======================================== */

updateInputStats();

updateOutputStats();


/* ========================================
   CONSOLE
======================================== */

console.log(
    "✓ Markdown Cleaner JavaScript loaded successfully."
);