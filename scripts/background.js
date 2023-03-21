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


// function add_blob_to_storage(blobText) {
//     chrome.storage.local.get(["blobSet"])
//     .then((r_blobSet) => {
//         chrome.storage.local.get(["nBlobs"])
//             .then((r_nBlobs) => {
//                 const currNBlob = r_nBlobs.nBlobs + 1;
//                 const blobSet = r_blobSet.blobSet;
//                 blobSet[currNBlob] = blobText;


//                 chrome.storage.local.set({ "blobSet" : blobSet})
//                     .then(() => {
//                         chrome.storage.local.set({ "nBlobs" : currNBlob})
//                             .then(() => {
//                                 console.log("THIS IS WHAT IS INSIDE THE STORAGE:")
//                                 chrome.storage.local.get(["blobSet"])
//                                 .then((DDD) => {
//                                     console.log(DDD)
//                                 });
//                             });
//                     })
//                     .catch((err) => {
//                         console.error("Could NOT init storage.");
//                     });
//             })
//     })
//     .catch((err) => {
//         console.error("Cannot fetch 'nBlobs' from storage.")
//     });

// }



chrome.runtime.onInstalled.addListener(() => {
    set_storage(0, {});
});


chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
    if (req.message === "clear_all_blobs") {
        chrome.storage.local.set({ "blobSet" : {}})
        .then(() => {
            chrome.storage.local.set({ "nBlobs" : 0})
                .then(() => {
                    sendRes({
                        message: "success"
                    });
                });
        })
        .catch((err) => {
            console.error(`Could NOT init storage. ERROR: ${err}`);
        });
    } else if (req.message === "clear_selected_blobs") {
        console.log(`I GOT THE MESSAGE FROM ${sender} to clear: ${req.paylaod}`)
        chrome.storage.local.get(["blobSet"])
            .then((r_blobSet) => {
                const curBlobSet = r_blobSet.blobSet
                const blobsToClear_Idx = req.payload
                var curNBlobs = 0
                var newBlobSet = {}

                console.log(`CONFIRMING I SHOULD ERASE: ${blobsToClear_Idx}`)
                for (let key in curBlobSet) {
                    console.log(`key inside curBlobSet: ${key}`)
                    console.log(key)
                    console.log(`blobsToClear_Idx.includes(key) === false ?= ${blobsToClear_Idx.includes(key) === false}`)
                    console.log(blobsToClear_Idx)
                    if (blobsToClear_Idx.includes(key) === false) {
                        newBlobSet[key] = curBlobSet[key]
                        curNBlobs += 1
                    }
                 }
                console.log("OLD SET")
                console.log(curBlobSet)
                console.log("NEW SET")
                console.log(newBlobSet)

                chrome.storage.local.set({ "blobSet" : newBlobSet})
                .then(() => {
                    chrome.storage.local.set({ "nBlobs" : curNBlobs})
                        .then(() => {
                            sendRes({
                                message: "success"
                            })
                        });
                })
                .catch((err) => {
                    console.error("Could NOT init storage.");
                });
            });
    } else if (req.message === "get_all_blobs") {
        chrome.storage.local.get(["blobSet"])
            .then((r_blobSet) => {
                sendRes({
                    message: "Sending you all blobs",
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
                                        sendRes({
                                            message: "success"
                                        })
                                    })
                                    .then(() => {
                                        chrome.runtime.sendMessage({
                                            message: "update_blob_list"
                                        })
                                        .catch(() => {
                                            console.log("Attempted to update blob list: no blob list page exists.")
                                        })
                                        return true;
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

