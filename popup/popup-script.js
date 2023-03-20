const see_all_blobs_button = document.querySelector("#see_all_blobs_button")
const blob_text_area = document.querySelector("#input_text_blob")
const add_blob_button = document.querySelector("#add_blob_button")
const clear_blobs_button = document.querySelector("#clear_blobs_button")

see_all_blobs_button.addEventListener("click", function() {
    chrome.tabs.create({url: './popup/popup-allblobs.html'});
})


add_blob_button.addEventListener("click", function() {
    chrome.runtime.sendMessage({
        message: "add_blob",
        payload: blob_text_area.value
    }, function (res) {
        if (res.message === "success") {
            console.log("successfully added blob")
        } else {
            console.error("You did not add that last blob!")
        }
    }
    );
})


clear_blobs_button.addEventListener("click", function() {
    chrome.runtime.sendMessage({
        message: "clear_all_blobs"
    }, function (res) {
        if (res.message === "success") {
            console.log("successfully cleared blobs")
        }
    });
})

