const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocation = document.querySelector('#send-location');

const $messages = document.querySelector('#messages');

const messageTemplate =document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargain = parseInt(newMessageStyle.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargain

    const visibleHeight = $messages.offsetHeight

    const contentHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (contentHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
});

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url,
        createdAt: moment(url.createdAt).format('h:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //disable sending message till its sent
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if(error) {
            return console.log(error);
        }

        console.log('message deliverd!');
    });
});


document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('GEOLOCATION IS NOT SUPPORTED BY YOUR BROWSER!!');
    }

    $sendLocation.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!');

            $sendLocation.removeAttribute('disabled');
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    }
});