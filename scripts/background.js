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
        // chrome.storage.local.get(["blobSet"])
        //     .then((r_blobSet) => {
        //         sendRes({
        //             message: "Sending you all blobs",
        //             payload: r_blobSet.blobSet
        //     })
        // });


        // chrome.storage.local.set({ "blobSet" : {}})
        // .then(() => {
        //     chrome.storage.local.set({ "nBlobs" : 0})
        //         .then(() => {
        //             sendRes({
        //                 message: "success"
        //             });
        //         });
        // })
        // .catch((err) => {
        //     console.error(`Could NOT init storage. ERROR: ${err}`);
        // });
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

