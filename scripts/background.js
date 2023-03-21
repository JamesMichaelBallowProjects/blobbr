
// installation listeners
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ "blobSet": {} })
        .then(() => {
            chrome.storage.local.set({ "nBlobs": 0 })
        })
        .catch((err) => {
            console.error(`${err}`)
        });
});

// messaging listeners
chrome.runtime.onMessage.addListener((req, _, sendRes) => {
    if (req.message === "clear_all_blobs") {
        chrome.storage.local.set({ "blobSet": {} })
            .then(() => {
                chrome.storage.local.set({ "nBlobs": 0 })
                    .then(() => {
                        sendRes({
                            message: "success"
                        });
                    })
                    .catch((err) => {
                        console.error(`${err}`);
                        sendRes({
                            message: "fail"
                        });
                    });
            })
            .catch((err) => {
                console.error(`${err}`);
            });

    } else if (req.message === "clear_selected_blobs") {
        chrome.storage.local.get(["blobSet"])
            .then((blobSetObj) => {
                // new/old storage values
                var newNBlobs = 0;
                var newBlobSet = {};
                const curBlobSet = blobSetObj.blobSet;
                const idxOfBlobsToClear = req.payload;

                // create new storage with those not to be cleared
                for (let key in curBlobSet) {
                    if (idxOfBlobsToClear.includes(key) === false) {
                        newNBlobs += 1;
                        newBlobSet[newNBlobs] = curBlobSet[key];
                    };
                };

                // send new storage structure to storage
                chrome.storage.local.set({ "blobSet": newBlobSet })
                    .then(() => {
                        chrome.storage.local.set({ "nBlobs": newNBlobs })
                            .then(() => {
                                sendRes({
                                    message: "success"
                                });
                            })
                            .catch((err) => {
                                console.error(`${err}`);
                                sendRes({
                                    message: "fail"
                                });
                            });
                    })
                    .catch((err) => {
                        console.error(`${err}`);
                    });
            });

    } else if (req.message === "get_all_blobs") {
        chrome.storage.local.get(["blobSet"])
            .then((blobSetObj) => {
                sendRes({
                    message: "success",
                    payload: blobSetObj.blobSet
                });
            })
            .catch((err) => {
                console.error(`${err}`);
                sendRes({
                    message: "fail",
                    payload: null
                });
            });

    } else if (req.message === "add_blob") {
        chrome.storage.local.get(["blobSet"])
            .then((blobSetObj) => {
                chrome.storage.local.get(["nBlobs"])
                    .then((r_nBlobs) => {
                        const currNBlob = r_nBlobs.nBlobs + 1;
                        const blobSet = blobSetObj.blobSet;
                        blobSet[currNBlob] = req.payload;

                        chrome.storage.local.set({ "blobSet": blobSet })
                            .then(() => {
                                chrome.storage.local.set({ "nBlobs": currNBlob })
                                    .then(() => {
                                        sendRes({
                                            message: "success"
                                        });
                                    })
                                    .then(() => {
                                        chrome.runtime.sendMessage({
                                            message: "update_blob_list"
                                        })
                                            .catch((err) => {
                                                console.log(`Attempted to update blob list: no blob list page exists. ${err}`);
                                            });
                                        return true;
                                    })
                                    .catch((err) => {
                                        console.error(`${err}`);
                                        sendRes({
                                            message: "fail"
                                        });
                                    });
                            })
                            .catch((err) => {
                                console.error(`${err}`);
                            });
                    })
                    .catch((err) => {
                        console.error(`${err}`);
                    });
            })
            .catch((err) => {
                console.error(`${err}`);
            });
    };
    return true;
});
