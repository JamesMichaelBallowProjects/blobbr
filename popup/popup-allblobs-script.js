const blob_list = document.querySelector("#all_blobs_list")
const copy_blobs_button = document.querySelector('#copy_all_blobs_button')
const clear_blobs_button = document.querySelector("#clear_blobs_button")
const clear_selected_button = document.querySelector("#clear_selected_button")

// init page first time it is open
function init() {
    update_blob_list();
}

// transitions
function animate_copy_blobs_completion() {
    copy_blobs_button.style.transition = "1s";
    copy_blobs_button.style.background = "#630A10";
    setTimeout(() => {
        copy_blobs_button.innerText = "📋 Copy to Clipboard";
    }, 400);
};

// blob list updates
function update_blob_list() {
    chrome.runtime.sendMessage({
        message: "get_all_blobs"
    })
        .then((res) => {
            generate_blob_list(res.payload);
        })
        .catch((err) => {
            console.error(`${err}`);
        });
    return true;
};

function generate_blob_list(blobsObj) {
    blob_list.innerHTML = "";
    for (let key in blobsObj) {
        if (blobsObj.hasOwnProperty(key)) {
            append_blob_to_list(key, blobsObj[key]);
        };
    };
};

function append_blob_to_list(idx, blob_text) {
    const blob_item = document.createElement("li");
    const blob_with_checbox = `
        <input type="checkbox" id="${idx}" name="${idx}">
        <label for="${idx}"> ${blob_text}</label>
        `;

    blob_item.id = "li" + idx;
    blob_item.name = "li" + idx;
    blob_item.innerHTML = blob_with_checbox;
    blob_list.appendChild(blob_item);
};

// listeners
// --- runtime
chrome.runtime.onMessage.addListener((req, _, sendRes) => {
    if (req.message == "update_blob_list") {
        update_blob_list();
        sendRes({
            message: "success"
        });
    };
});

// --- user events
copy_blobs_button.addEventListener("click", () => {
    let blobs = blob_list.innerText.split("\n");
    var blobsAndNums = "";

    for (let idx = 0; idx < blobs.length; idx++) {
        const element = blobs[idx];
        blobsAndNums += `${idx + 1}. ${element}\n`;
    };

    navigator.clipboard.writeText(blobsAndNums)
        .then(() => {
            copy_blobs_button.style.transition = "0s";
            copy_blobs_button.style.background = "#4E6C50";
            copy_blobs_button.innerText = "Copied!";
            setTimeout(() => {
                animate_copy_blobs_completion();
            }, 100);
        })
        .catch(err => {
            console.log(err);
        });
});

clear_blobs_button.addEventListener("click", () => {
    let msg = "Are you sure you want to clear all blobs?";
    if (confirm(msg) === true) {
        chrome.runtime.sendMessage({
            message: "clear_all_blobs"
        })
            .then((res) => {
                if (res.message === "success") {
                    // successfully cleared blobs
                    update_blob_list();
                };
            })
            .catch((err) => {
                console.error(`${err}`);
            });
        return true;
    };
});

clear_selected_button.addEventListener("click", () => {
    let msg = "Are you sure you want to clear the selected blobs?";
    if (confirm(msg) === true) {
        let nBlobs = blob_list.innerText.split("\n").length;
        var idxOfBlobsToClear = [];

        if (nBlobs !== null) {
            for (let idx = 1; idx <= nBlobs; idx++) {
                const elementHTML = document.getElementById(`${idx}`);

                if ((elementHTML !== null) && (elementHTML.checked === true)) {
                    idxOfBlobsToClear.push(`${idx}`);
                };
            };

            if (idxOfBlobsToClear.length !== 0) {
                chrome.runtime.sendMessage({
                    message: "clear_selected_blobs",
                    payload: idxOfBlobsToClear
                })
                    .then((res) => {
                        if (res.message === "success") {
                            // successfully cleared blobs
                            update_blob_list();
                        };
                    })
                    .catch((err) => {
                        console.error(`${err}`);
                    });
                return true;
            };
        };
    };
});

// function execution
init();
