const API_BASE_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const audioFileInput = document.getElementById('audioFile');
    const textInput = document.getElementById('textInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const resultsSection = document.getElementById('resultsSection');
    const errorMsg = document.getElementById('errorMsg');

    // Display selected file name
    audioFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
            fileNameDisplay.classList.add('text-indigo-600', 'font-medium');
            textInput.value = ''; // clear text if file is chosen
        }
    });
    
    textInput.addEventListener('input', () => {
        if (textInput.value.trim() !== '') {
            audioFileInput.value = ''; // clear file if text is typed
            fileNameDisplay.textContent = 'MP3, WAV, M4A up to 10MB';
            fileNameDisplay.classList.remove('text-indigo-600', 'font-medium');
        }
    });

    analyzeBtn.addEventListener('click', async () => {
        errorMsg.classList.add('hidden');
        
        const hasFile = audioFileInput.files.length > 0;
        const hasText = textInput.value.trim() !== '';

        if (!hasFile && !hasText) {
            errorMsg.textContent = 'Please provide an audio file or paste a transcript.';
            errorMsg.classList.remove('hidden');
            return;
        }

        // Show loading
        loadingOverlay.classList.remove('hidden');
        loadingOverlay.classList.add('flex');
        resultsSection.classList.remove('opacity-100', 'pointer-events-auto');
        resultsSection.classList.add('opacity-50', 'pointer-events-none');
        
        try {
            const syllabusInput = document.getElementById('syllabusInput');
            const syllabusText = syllabusInput ? syllabusInput.value.trim() : "";

            let response;
            if (hasFile) {
                const formData = new FormData();
                formData.append('file', audioFileInput.files[0]);
                formData.append('syllabus', syllabusText);
                response = await fetch(`${API_BASE_URL}/analyze/video`, {
                    method: 'POST',
                    body: formData
                });
            } else {
                response = await fetch(`${API_BASE_URL}/analyze/text`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: textInput.value.trim(),
                        duration_seconds: 60, // Mock duration
                        syllabus: syllabusText
                    })
                });
            }

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            updateDashboard(data);

        } catch (err) {
            console.error(err);
            errorMsg.textContent = 'Failed to process request. Please ensure the backend is running locally on port 8000.';
            errorMsg.classList.remove('hidden');
        } finally {
            loadingOverlay.classList.add('hidden');
            loadingOverlay.classList.remove('flex');
        }
    });

    function updateDashboard(data) {
        // Unhide results
        resultsSection.classList.add('opacity-100', 'pointer-events-auto', 'fade-in');
        resultsSection.classList.remove('opacity-50', 'pointer-events-none');

        // Populate values
        document.getElementById('finalScoreText').textContent = data.scores.final_score;
        document.getElementById('clarityScoreText').textContent = data.scores.clarity_score;
        document.getElementById('contentScoreText').textContent = data.scores.content_score;
        document.getElementById('wpmText').textContent = `${data.scores.wpm} wpm`;
        document.getElementById('feedbackText').textContent = `"${data.feedback}"`;
        
        // New Vision Metrics
        document.getElementById('physicalScoreText').textContent = data.scores.physical_score || "--";
        document.getElementById('expressionScoreText').textContent = data.scores.expression_score || "--";
        document.getElementById('blackboardScoreText').textContent = data.scores.blackboard_score || "--";

        // Update radial progress bar
        const finalScore = data.scores.final_score;
        const circle = document.getElementById('finalScoreCircle');
        // stroke-dasharray = "value, 100" where value is percentage
        circle.style.strokeDasharray = `${finalScore}, 100`;
        
        // Color coding
        circle.classList.remove('text-indigo-600', 'text-yellow-500', 'text-red-500', 'text-green-500');
        if (finalScore >= 80) circle.classList.add('text-green-500');
        else if (finalScore >= 50) circle.classList.add('text-yellow-500');
        else circle.classList.add('text-red-500');
    }
});
