const recordButton = document.getElementById('recordButton');
const status = document.getElementById('status');

recordButton.addEventListener('click', async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            let audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('audio', audioBlob, 'audio.wav');

                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    status.textContent = 'Audio recorded and uploaded successfully!';
                } else {
                    status.textContent = 'Failed to upload audio.';
                }
            };

            mediaRecorder.start();
            status.textContent = 'Recording...';
            setTimeout(() => {
                mediaRecorder.stop();
                status.textContent = 'Recording stopped.';
            }, 6000); // Record for 6 seconds
        } catch (error) {
            console.error('Error accessing microphone:', error);
            status.textContent = 'Error accessing microphone.';
        }
    } else {
        status.textContent = 'getUserMedia not supported in this browser.';
    }
});
