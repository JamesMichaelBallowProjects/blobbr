const blob_list = document.querySelector("#all_blobs_list")
const copy_blobs_button = document.querySelector('#copy_all_blobs_button')
const clear_blobs_button = document.querySelector("#clear_blobs_button")

function init() {
    chrome.runtime.sendMessage({
        message: "get_all_blobs"
    }, (response) => {
        console.log(response.message);
        generate_blob_list(response.payload);
    })
}

function generate_blob_list(blobsObj) {
    blob_list.innerHTML = "";
    for (let key in blobsObj) {
        if (blobsObj.hasOwnProperty(key)) {
            append_blob_to_list(key, blobsObj[key]);
        }
     }
}

function append_blob_to_list(idx, blob_text) {
    const blob_item = document.createElement("li")
    const blob_with_checbox = `
        <input type="checkbox" id="${idx}" name="${idx}">
        <label for="${idx}"> ${blob_text}</label>
        `

    blob_item.id = idx
    blob_item.name = idx
    blob_item.innerHTML = blob_with_checbox
    blob_list.appendChild(blob_item)
}

function copy_blobs_to_clipboard() {
    // Copy the text inside the text field
    console.log(blob_list.innerText)
    navigator.clipboard.writeText(blob_list.innerText)
        .then(function() {
            console.log("grabbed the stuff")
        })
        .catch(e => {
            console.log("ERROR: " + e)
        });
};

copy_blobs_button.addEventListener("click", function() {
    copy_blobs_to_clipboard();
});


chrome.runtime.onMessage.addListener((req, sender, sendRes) => {

    if (req.message === "update_blob_list") {
        // blob_list.innerHTML = "<ol></ol>";
        // req.payload.forEach(itemNum => {
        //     append_blob_to_list(req.payload[itemNum]);
        // })
    }

});

init();

