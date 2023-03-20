function set_storage(nBlobs, blobSet) {
    chrome.storage.local.set({ "blobSet" : blobSet})
        .then(() => {
            chrome.storage.local.set({ "nBlobs" : nBlobs})
                .then(() => {
                    console.log("THIS IS WHAT IS INSIDE THE STORAGE:")
                    console.log(blobSet);
                });
        })
        .catch((err) => {
            console.error("Could NOT init storage.");
        });
}


function add_blob_to_storage(blobText) {
    chrome.storage.local.get(["blobSet"])
    .then((r_blobSet) => {
        chrome.storage.local.get(["nBlobs"])
            .then((r_nBlobs) => {
                const currNBlob = r_nBlobs.nBlobs + 1;
                const blobSet = r_blobSet.blobSet;
                blobSet[currNBlob] = blobText;


                chrome.storage.local.set({ "blobSet" : blobSet})
                    .then(() => {
                        chrome.storage.local.set({ "nBlobs" : currNBlob})
                            .then(() => {
                                console.log("THIS IS WHAT IS INSIDE THE STORAGE:")
                                chrome.storage.local.get(["blobSet"])
                                .then((DDD) => {
                                    console.log(DDD)
                                });
                            });
                    })
                    .catch((err) => {
                        console.error("Could NOT init storage.");
                    });
            })
    })
    .catch((err) => {
        console.error("Cannot fetch 'nBlobs' from storage.")
    });

}



function clear_blobs_from_storage() {
    set_storage(0, { 0 : "EMPTY"});
}


chrome.runtime.onInstalled.addListener(function(details){
    set_storage(0, { 0 : "EMPTY"});
});

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
    if (req.message === "clear_all_blobs") {
        clear_blobs_from_storage()
        .then(() => {
            sendRes({
                message: "success"
            })
        });
    } else if (req.message === "get_all_blobs") {
        chrome.storage.local.get(["blobSet"])
            .then((r_blobSet) => {
            sendRes({
                message: "I got your message",
                payload: r_blobSet.blobSet
            })
        });
    } else if (req.message === "add_blob") {
        chrome.storage.local.get(["blobSet"])
            .then((r_blobSet) => {
                chrome.storage.local.get(["nBlobs"])
                    .then((r_nBlobs) => {
                        const currNBlob = r_nBlobs.nBlobs + 1;
                        const blobSet = r_blobSet.blobSet;
                        blobSet[currNBlob] = req.payload;

                        chrome.storage.local.set({ "blobSet" : blobSet})
                            .then(() => {
                                chrome.storage.local.set({ "nBlobs" : currNBlob})
                                    .then(() => {
                                        console.log("THIS IS WHAT IS INSIDE THE STORAGE:")
                                        chrome.storage.local.get(["blobSet"])
                                        .then((newBlobSet) => {
                                            console.log(newBlobSet)
                                            sendRes({
                                                message: "success"
                                            })
                                        });
                                    });
                            })
                            .catch((err) => {
                                console.error("Could NOT init storage.");
                            });
                    })
            })
            .catch((err) => {
                console.error("Cannot fetch 'nBlobs' from storage.")
            });
    };
    return true;
});

