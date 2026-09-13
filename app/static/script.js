"use strict";

/* =========================================================
   CKMHTO.AI — ELEMENTS
========================================================= */

/* Markdown */

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


/* Image Converter */

const jpegFileInput =
    document.getElementById("jpegFileInput");

const imageDropZone =
    document.getElementById("imageDropZone");

const imagePreviewArea =
    document.getElementById("imagePreviewArea");

const imagePreview =
    document.getElementById("imagePreview");

const imageFileName =
    document.getElementById("imageFileName");

const imageFileSize =
    document.getElementById("imageFileSize");

const convertJpgBtn =
    document.getElementById("convertJpgBtn");

const removeImageBtn =
    document.getElementById("removeImageBtn");

const imageResultArea =
    document.getElementById("imageResultArea");

const convertedImageInfo =
    document.getElementById("convertedImageInfo");

const downloadJpgBtn =
    document.getElementById("downloadJpgBtn");

const convertAnotherBtn =
    document.getElementById("convertAnotherBtn");


/* =========================================================
   STATE
========================================================= */

let selectedImageFile = null;

let convertedImageUrl = null;

let toastTimer = null;


/* =========================================================
   HELPERS
========================================================= */

function getWordCount(text) {

    const trimmedText = text.trim();

    if (!trimmedText) {
        return 0;
    }

    return trimmedText.split(/\s+/).length;
}


function formatFileSize(bytes) {

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}


/* =========================================================
   MARKDOWN STATISTICS
========================================================= */

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


/* =========================================================
   TOAST
========================================================= */

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


/* =========================================================
   STATUS MESSAGE
========================================================= */

function showMessage(text) {

    if (!message) {
        return;
    }

    message.textContent = text;
}


/* =========================================================
   MARKDOWN INPUT
========================================================= */

if (inputText) {

    inputText.addEventListener(
        "input",
        updateInputStats
    );

}


/* =========================================================
   CLEAN MARKDOWN
========================================================= */

if (cleanBtn) {

    cleanBtn.addEventListener(
        "click",
        async () => {

            if (!inputText || !outputText) {
                return;
            }

            const text =
                inputText.value.trim();


            if (!text) {

                showToast(
                    "Please enter some Markdown text."
                );

                return;
            }


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

                            body:
                                JSON.stringify({
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


/* =========================================================
   COPY
========================================================= */

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

                    document.execCommand("copy");

                    outputText.setSelectionRange(0, 0);

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


/* =========================================================
   CLEAR MARKDOWN
========================================================= */

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


            if (fileInput) {
                fileInput.value = "";
            }


            showToast(
                "✓ Everything cleared."
            );

        }
    );

}


/* =========================================================
   DOWNLOAD CLEAN TEXT
========================================================= */

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


/* =========================================================
   MARKDOWN FILE UPLOAD
========================================================= */

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


/* =========================================================
   IMAGE VALIDATION
========================================================= */

function isValidImage(file) {

    if (!file) {
        return false;
    }

    const validTypes = [
        "image/jpeg"
    ];

    const validExtensions = [
        ".jpeg",
        ".jpg"
    ];

    const fileName =
        file.name.toLowerCase();

    const hasValidExtension =
        validExtensions.some(
            extension =>
                fileName.endsWith(extension)
        );

    return (
        validTypes.includes(file.type) ||
        hasValidExtension
    );
}


/* =========================================================
   RESET IMAGE CONVERTER
========================================================= */

function resetImageConverter() {

    selectedImageFile = null;


    if (convertedImageUrl) {

        URL.revokeObjectURL(
            convertedImageUrl
        );

        convertedImageUrl = null;
    }


    if (jpegFileInput) {
        jpegFileInput.value = "";
    }


    if (imagePreview) {
        imagePreview.removeAttribute("src");
    }


    if (imageFileName) {
        imageFileName.textContent =
            "Image";
    }


    if (imageFileSize) {
        imageFileSize.textContent =
            "0 KB";
    }


    if (imagePreviewArea) {
        imagePreviewArea.hidden = true;
    }


    if (imageResultArea) {
        imageResultArea.hidden = true;
    }


    if (imageDropZone) {
        imageDropZone.hidden = false;
    }


    if (downloadJpgBtn) {
        downloadJpgBtn.removeAttribute("href");
    }


    if (convertedImageInfo) {
        convertedImageInfo.textContent =
            "Your JPG image is ready.";
    }

}


/* =========================================================
   SELECT IMAGE
========================================================= */

function selectImage(file) {

    if (!file) {
        return;
    }


    if (!isValidImage(file)) {

        showToast(
            "❌ Please select a JPEG or JPG image."
        );

        return;
    }


    /*
     * Limit browser-side input size.
     * This keeps very large files from
     * consuming excessive memory.
     */

    const maxSize =
        20 * 1024 * 1024;


    if (file.size > maxSize) {

        showToast(
            "❌ Image must be smaller than 20 MB."
        );

        return;
    }


    selectedImageFile = file;


    if (convertedImageUrl) {

        URL.revokeObjectURL(
            convertedImageUrl
        );

        convertedImageUrl = null;
    }


    const previewUrl =
        URL.createObjectURL(file);


    if (imagePreview) {

        imagePreview.src =
            previewUrl;

    }


    if (imageFileName) {

        imageFileName.textContent =
            file.name;

    }


    if (imageFileSize) {

        imageFileSize.textContent =
            formatFileSize(file.size);

    }


    if (imageDropZone) {
        imageDropZone.hidden = true;
    }


    if (imageResultArea) {
        imageResultArea.hidden = true;
    }


    if (imagePreviewArea) {
        imagePreviewArea.hidden = false;
    }


    showToast(
        `✓ ${file.name} selected`
    );

}


/* =========================================================
   JPEG FILE INPUT
========================================================= */

if (jpegFileInput) {

    jpegFileInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            selectImage(file);

        }
    );

}


/* =========================================================
   DRAG & DROP
========================================================= */

if (imageDropZone) {

    [
        "dragenter",
        "dragover"
    ].forEach(eventName => {

        imageDropZone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                event.stopPropagation();

                imageDropZone.classList.add(
                    "dragover"
                );

            }
        );

    });


    [
        "dragleave",
        "drop"
    ].forEach(eventName => {

        imageDropZone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                event.stopPropagation();

                imageDropZone.classList.remove(
                    "dragover"
                );

            }
        );

    });


    imageDropZone.addEventListener(
        "drop",
        event => {

            const file =
                event.dataTransfer.files[0];

            selectImage(file);

        }
    );

}


/* =========================================================
   JPEG → JPG CONVERSION
========================================================= */

async function convertToJpg() {

    if (!selectedImageFile) {

        showToast(
            "❌ Please select an image first."
        );

        return;
    }


    if (!convertJpgBtn) {
        return;
    }


    convertJpgBtn.disabled = true;

    convertJpgBtn.textContent =
        "Converting...";


    try {

        /*
         * Create an image from the selected file.
         */

        const image =
            new Image();


        const imageUrl =
            URL.createObjectURL(
                selectedImageFile
            );


        await new Promise(
            (resolve, reject) => {

                image.onload = resolve;

                image.onerror = reject;

                image.src = imageUrl;

            }
        );


        /*
         * Canvas converts the image
         * into a real JPEG/JPG Blob.
         */

        const canvas =
            document.createElement("canvas");


        canvas.width =
            image.naturalWidth;

        canvas.height =
            image.naturalHeight;


        const context =
            canvas.getContext("2d");


        if (!context) {

            throw new Error(
                "Canvas is not supported."
            );

        }


        context.drawImage(
            image,
            0,
            0
        );


        const jpgBlob =
            await new Promise(
                resolve =>
                    canvas.toBlob(
                        resolve,
                        "image/jpeg",
                        0.95
                    )
            );


        URL.revokeObjectURL(imageUrl);


        if (!jpgBlob) {

            throw new Error(
                "Unable to create JPG."
            );

        }


        convertedImageUrl =
            URL.createObjectURL(
                jpgBlob
            );


        const originalSize =
            formatFileSize(
                selectedImageFile.size
            );


        const convertedSize =
            formatFileSize(
                jpgBlob.size
            );


        const originalName =
            selectedImageFile.name
                .replace(
                    /\.(jpeg|jpg)$/i,
                    ""
                );


        const outputName =
            `${originalName}.jpg`;


        if (downloadJpgBtn) {

            downloadJpgBtn.href =
                convertedImageUrl;

            downloadJpgBtn.download =
                outputName;

        }


        if (convertedImageInfo) {

            convertedImageInfo.textContent =
                `${originalSize} → ${convertedSize} • ${outputName}`;

        }


        if (imagePreviewArea) {
            imagePreviewArea.hidden = true;
        }


        if (imageResultArea) {
            imageResultArea.hidden = false;
        }


        showToast(
            "✓ JPG conversion completed!"
        );

    }

    catch (error) {

        console.error(
            "JPEG to JPG error:",
            error
        );


        showToast(
            "❌ Unable to convert this image."
        );

    }

    finally {

        convertJpgBtn.disabled = false;

        convertJpgBtn.textContent =
            "🔄 Convert to JPG";

    }

}


/* =========================================================
   CONVERT BUTTON
========================================================= */

if (convertJpgBtn) {

    convertJpgBtn.addEventListener(
        "click",
        convertToJpg
    );

}


/* =========================================================
   REMOVE IMAGE
========================================================= */

if (removeImageBtn) {

    removeImageBtn.addEventListener(
        "click",
        () => {

            resetImageConverter();

            showToast(
                "✓ Image removed."
            );

        }
    );

}


/* =========================================================
   CONVERT ANOTHER
========================================================= */

if (convertAnotherBtn) {

    convertAnotherBtn.addEventListener(
        "click",
        () => {

            resetImageConverter();

            if (jpegFileInput) {
                jpegFileInput.click();
            }

        }
    );

}


/* =========================================================
   DARK MODE
========================================================= */

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


/* =========================================================
   THEME BUTTON
========================================================= */

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


/* =========================================================
   LOAD SAVED THEME
========================================================= */

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


/* =========================================================
   INITIAL STATS
========================================================= */

updateInputStats();

updateOutputStats();


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (convertedImageUrl) {

            URL.revokeObjectURL(
                convertedImageUrl
            );

        }

    }
);


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "✓ CKMHTO.AI tools JavaScript loaded successfully."
);