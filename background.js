
import {YOUTUBE_API_KEY} from './config.json';

const extensionId = 'inbhgojgfeadgeobbmolmkgdfciphipa';

const ALLOWED_CATEGORIES = [
    'Science & Technology',
    'Education'
];

const STUDY_STATUS = {
    OFF: 'off',
    ON: 'on'
};

let currentStudyStatus = STUDY_STATUS.ON;

const fetchData = (path,fields) => async (id) => {
    const url = `https://www.googleapis.com/youtube/v3/${path}?part=snippet&id=${id}&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return fields.reduce((accum, field) => {
        accum[field] = data.items[0].snippet[field]; 
        return accum;
    }, {});
}

const handeUpddate = async(tabId, changeInfo, tab) => {
    if(changeInfo.url){
        if (tab.url.match(/youtube/)){
            const result = changeInfo.url.match(/http(?:s)?:\/\/(?:www|m)\.youtube\.com\/watch\?v=([a-zA-Z0-9_\-]+)/);

            if(result){
                const videoId = result[1];
                
                const videoData = await fetchData('videos',['title','categoryId','description','thumbnails'])(videoId);
                const categoryData = await fetchData('videoCategories',['title'])(videoData.categoryId);

                if (ALLOWED_CATEGORIES.indexOf(categoryData.title) === -1){
                    chrome.tts.speak('Hey! You are supposed to be studying you idiot!',{pitch: 1.6, rate: 0.8});


                    chrome.storage.local.get('videos', ({videos}) => {
                        console.log(videos)
                        chrome.storage.local.set({videos: [
                            ...videos,
                            {
                                videoId: videoId,
                                title: videoData.title,
                                description: videoData.description,
                                thumbnails: videoData.thumbnails,
                                time: Date.now()
                            }
                        ]});
                    })

                    chrome.tabs.remove(tabId,() =>{
                        console.log(`Closed tab ${videoData.title} with category ${categoryData.title}`)
                    });
                }
            }
        }
    }
}

chrome.runtime.onMessage.addListener(async function(req,sender,sendResponse) {
    console.log('Hello')
    if (req.status === null){
        await sendResponse({status: currentStudyStatus});
        return;
    }

    if (req.status === STUDY_STATUS.ON){
        chrome.storage.local.set({videos: []});
        chrome.tabs.onUpdated.addListener(handeUpddate);
        currentStudyStatus = STUDY_STATUS.ON;
        return;
    }
    if (req.status === STUDY_STATUS.OFF){
        chrome.tabs.onUpdated.removeListener(handeUpddate);
        currentStudyStatus = STUDY_STATUS.OFF;
        chrome.tabs.create({
            url: chrome.runtime.getURL('links.html')
        });
    }
});

chrome.runtime.onInstalled.addListener((data) => {
    chrome.storage.local.set({videos: []});
    chrome.tabs.onUpdated.addListener(handeUpddate);
});

// chrome.management.onEnabled.addListener( ({id}) => {
//     // check if this extension is the one that was enabled
//     if (id === extensionId){
//         console.log('onEnable')
//     }
// });