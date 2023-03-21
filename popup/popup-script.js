const see_all_blobs_button = document.querySelector("#see_all_blobs_button")
const blob_text_area = document.querySelector("#input_text_blob")
const add_blob_button = document.querySelector("#add_blob_button")
const logo_img = document.querySelector("logo")

// init page first time it is open
// none.

// transitions
function animate_add_blob_completion() {
    blob_text_area.style.transition = "0.2s";
    blob_text_area.style.background = "white";
    blob_text_area.value = "";
    blob_text_area.style.transition = "0s";
};

// listeners
// --- runtime
// none.

// --- user events
add_blob_button.addEventListener("click", () => {
    if (blob_text_area.value !== "") {
        add_blob_button.style.pointerEvents = "none";
        chrome.runtime.sendMessage({
            message: "add_blob",
            payload: blob_text_area.value
        })
            .then((res) => {
                if (res.message === "success") {
                    // successfully added blob
                    blob_text_area.style.transition = "0.2s";
                    blob_text_area.style.background = "#4E6C50";
                    blob_text_area.value = "Added!";
                    setTimeout(() => {
                        animate_add_blob_completion();
                    }, 600);
                    setTimeout(() => {
                        window.close();
                    }, 201);
                } else {
                    console.error("You did not add that last blob!");

                    blob_text_area.style.transition = "0.2s";
                    blob_text_area.style.background = "#911F27";
                    blob_text_area.value = "[ERR:] Could not add your blob!";
                    setTimeout(() => {
                        animate_add_blob_completion();
                    }, 1000);
                };
            })
            .catch((err) => {
                console.error(`${err}`);
            });
        };
    return true;
});

see_all_blobs_button.addEventListener("click", () => {
    chrome.tabs.create({
        url: './popup/popup-allblobs.html'
    })
        .catch((err) => {
            console.error(err);
        });
});