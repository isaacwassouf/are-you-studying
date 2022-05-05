
const studying = document.getElementById('studying');

chrome.runtime.sendMessage({status: null}, (res) => {
    if (res.status === 'on')
        studying.checked = true;
    else
        studying.checked = false;
});


studying.addEventListener('change', async (event) => {
    if (event.target.checked)
        await chrome.runtime.sendMessage({status: 'on'});
    else
        await chrome.runtime.sendMessage({status: 'off'});
});