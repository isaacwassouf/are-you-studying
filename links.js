
const videosTable = document.querySelector('#videos');

const createRow = ({videoId, title, thumbnails, description, time}) => {
    const row = document.createElement('tr');
    const videoIdCell = document.createElement('th');
    const thumbnail = document.createElement('img');
    const titleCell = document.createElement('td');
    const videoLink = document.createElement('a');
    const descriptionCell = document.createElement('td');
    const timeCell = document.createElement('td');

    videoIdCell.innerText = videoId;
    videoLink.innerText = title;
    descriptionCell.innerText = description;
    timeCell.innerText = new Date(time).toLocaleString();
    

    videoIdCell.setAttribute('scope','row');
    videoLink.setAttribute('href',`https://www.youtube.com/watch?v=${videoId}`);
    thumbnail.setAttribute('src',thumbnails.default.url);
    thumbnail.setAttribute('width',thumbnails.default.width);
    thumbnail.setAttribute('height',thumbnails.default.height);

    titleCell.append(videoLink);

    row.appendChild(videoIdCell);
    row.appendChild(thumbnail);
    row.appendChild(titleCell);
    row.appendChild(descriptionCell);
    row.appendChild(timeCell);

    videosTable.appendChild(row);
};


chrome.storage.local.get(null,({videos}) =>{
    for (video of videos){
        createRow(video);
    }
});